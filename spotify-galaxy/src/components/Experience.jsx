import { OrbitControls, Environment } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'

export default function Experience({ children }) {
    return (
        <>
            {/* Lighting */}
            <ambientLight intensity={0.2} />
            <pointLight position={[10, 10, 10]} intensity={0.5} />

            {/* Camera Controls */}
            <OrbitControls
                enableDamping
                dampingFactor={0.05}
                rotateSpeed={0.5}
                zoomSpeed={0.5}
                minDistance={10}
                maxDistance={100}
            />

            {/* Environment */}
            <Environment preset="night" />

            {/* Children (Galaxy) */}
            {children}

            {/* Post-processing Effects */}
            <EffectComposer>
                <Bloom
                    intensity={1.5}
                    luminanceThreshold={0.2}
                    luminanceSmoothing={0.9}
                />
            </EffectComposer>
        </>
    )
}
