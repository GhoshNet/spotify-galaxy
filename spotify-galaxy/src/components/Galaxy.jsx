import { useRef, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const CLUSTER_COLORS = [
    '#FF6B6B', // Red
    '#4ECDC4', // Teal
    '#45B7D1', // Blue
    '#FFA07A', // Orange
    '#98D8C8', // Mint
    '#F7DC6F', // Yellow
    '#BB8FCE', // Purple
    '#85C1E2', // Sky Blue
]

export default function Galaxy({ data, onHover }) {
    const meshRef = useRef()
    const [hovered, setHovered] = useState(null)
    const paused = useRef(false)
    const timeoutRef = useRef(null)
    const hoveredRef = useRef(null) // Keep track of hover for click handler

    // Update hoveredRef whenever state changes
    if (hovered !== hoveredRef.current) {
        hoveredRef.current = hovered
        // Resume if mouse moves off the paused item (or simply moves to new item)
        // User said: "unless the mouse is moved", implying movement should resume/reset.
        // We pulse-resume if hover changes.
        if (paused.current && hovered === null) {
            paused.current = false
            if (timeoutRef.current) clearTimeout(timeoutRef.current)
        }
    }

    // Handle click to pause
    useMemo(() => {
        const handleClick = () => {
            if (hoveredRef.current !== null) {
                // Clicked on a song
                paused.current = true

                // Reset timeout
                if (timeoutRef.current) clearTimeout(timeoutRef.current)
                timeoutRef.current = setTimeout(() => {
                    paused.current = false
                }, 3000)
            } else {
                // Clicked elsewhere
                paused.current = false
                if (timeoutRef.current) clearTimeout(timeoutRef.current)
            }
        }

        window.addEventListener('click', handleClick)
        return () => window.removeEventListener('click', handleClick)
    }, [])

    const { positions, colors, scales } = useMemo(() => {
        const positions = new Float32Array(data.length * 3)
        const colors = new Float32Array(data.length * 3)
        const scales = new Float32Array(data.length)

        data.forEach((song, i) => {
            // Position
            positions[i * 3] = song.position[0] * 5
            positions[i * 3 + 1] = song.position[1] * 5
            positions[i * 3 + 2] = song.position[2] * 5

            // Color based on cluster
            const color = new THREE.Color(CLUSTER_COLORS[song.cluster % CLUSTER_COLORS.length])
            colors[i * 3] = color.r
            colors[i * 3 + 1] = color.g
            colors[i * 3 + 2] = color.b

            // Scale based on energy
            scales[i] = 0.3 + (song.features.energy * 0.7)
        })

        return { positions, colors, scales }
    }, [data])

    // Raycasting for hover
    useFrame((state) => {
        if (meshRef.current) {
            // Rotate only if not paused
            if (!paused.current) {
                meshRef.current.rotation.y += 0.0005
            }

            // Raycaster
            const raycaster = state.raycaster
            raycaster.params.Points.threshold = 0.2

            const intersects = raycaster.intersectObject(meshRef.current)
            if (intersects.length > 0) {
                const index = intersects[0].index
                const song = data[index]
                if (hovered !== index) {
                    setHovered(index)
                    if (onHover) onHover(song)
                    document.body.style.cursor = 'pointer'

                    // If mouse moves to a new song while paused, we could choose to resume or stay paused.
                    // "unless the mouse is moved" -> Let's interpret as resume if we switch targets
                    if (paused.current && hoveredRef.current !== index) {
                        // Optional: paused.current = false 
                        // But keeping it steady for 3s might be better if they are just browsing.
                        // Let's stick to "Resumes on timeout or click-elsewhere" mostly, 
                        // but earlier we handled the 'hovered === null' case to resume.
                    }
                }
            } else {
                if (hovered !== null) {
                    setHovered(null)
                    if (onHover) onHover(null)
                    document.body.style.cursor = 'default'
                    // Moved off object -> Resume
                    paused.current = false
                    if (timeoutRef.current) clearTimeout(timeoutRef.current)
                }
            }
        }
    })

    return (
        <points ref={meshRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={data.length}
                    array={positions}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-color"
                    count={data.length}
                    array={colors}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-scale"
                    count={data.length}
                    array={scales}
                    itemSize={1}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.5}
                vertexColors
                transparent
                opacity={0.8}
                sizeAttenuation
                blending={THREE.AdditiveBlending}
            />
        </points>
    )
}
