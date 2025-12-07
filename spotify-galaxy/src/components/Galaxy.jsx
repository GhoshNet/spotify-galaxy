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

    // Gentle rotation
    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.0005
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
