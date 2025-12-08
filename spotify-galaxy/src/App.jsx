import { Canvas } from '@react-three/fiber'
import { Suspense, useState, useEffect } from 'react'
import Galaxy from './components/Galaxy'
import Experience from './components/Experience'
import Interface from './components/Interface'
import ClusterChart from './components/ClusterChart'
import DurationChart from './components/DurationChart'
import InfoPanel from './components/InfoPanel'
import './App.css'

function App() {
    const [data, setData] = useState([])
    const [selectedYear, setSelectedYear] = useState([1920, 2020])
    const [hoveredSong, setHoveredSong] = useState(null)

    useEffect(() => {
        // Use BASE_URL to handle Github Pages deployment path
        fetch(`${import.meta.env.BASE_URL}galaxy_data.json`)
            .then(res => res.json())
            .then(setData)
            .catch(err => console.error('Failed to load data:', err))
    }, [])

    const filteredData = data.filter(
        song => song.year >= selectedYear[0] && song.year <= selectedYear[1]
    )

    return (
        <div style={{ width: '100vw', height: '100vh', background: '#000' }}>
            <Canvas camera={{ position: [0, 0, 50], fov: 75 }}>
                <Suspense fallback={null}>
                    <Experience>
                        <Galaxy
                            data={filteredData}
                            onHover={setHoveredSong}
                        />
                    </Experience>
                </Suspense>
            </Canvas>
            <ClusterChart data={filteredData} />
            <DurationChart data={filteredData} />
            <InfoPanel />
            <Interface
                yearRange={selectedYear}
                onYearChange={setSelectedYear}
                hoveredSong={hoveredSong}
                totalSongs={filteredData.length}
            />
        </div>
    )
}

export default App
