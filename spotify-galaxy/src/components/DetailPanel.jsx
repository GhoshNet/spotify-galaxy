import { useMemo } from 'react'
import './DetailPanel.css'

const CLUSTER_COLORS = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
    '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'
]

export default function DetailPanel({ data }) {
    const stats = useMemo(() => {
        if (!data.length) return null

        // Cluster distribution
        const clusterCounts = {}
        for (let i = 0; i < 8; i++) clusterCounts[i] = 0

        // Audio feature averages
        let totalDance = 0, totalEnergy = 0, totalValence = 0

        // Decade distribution
        const decadeCounts = {}

        data.forEach(song => {
            clusterCounts[song.cluster]++
            totalDance += song.features.danceability
            totalEnergy += song.features.energy
            totalValence += song.features.valence

            const decade = Math.floor(song.year / 10) * 10
            decadeCounts[decade] = (decadeCounts[decade] || 0) + 1
        })

        const avgFeatures = {
            danceability: totalDance / data.length,
            energy: totalEnergy / data.length,
            valence: totalValence / data.length
        }

        return { clusterCounts, avgFeatures, decadeCounts }
    }, [data])

    if (!stats) return null

    const maxClusterCount = Math.max(...Object.values(stats.clusterCounts))
    const maxDecadeCount = Math.max(...Object.values(stats.decadeCounts))

    return (
        <div className="detail-panel">
            <h2>Analytics Dashboard</h2>

            {/* Cluster Distribution */}
            <div className="chart-section">
                <h3>Audio Clusters</h3>
                <div className="bar-chart">
                    {Object.entries(stats.clusterCounts).map(([cluster, count]) => (
                        <div key={cluster} className="bar-item">
                            <div className="bar-label">C{cluster}</div>
                            <div className="bar-container">
                                <div
                                    className="bar-fill"
                                    style={{
                                        width: `${(count / maxClusterCount) * 100}%`,
                                        backgroundColor: CLUSTER_COLORS[cluster]
                                    }}
                                />
                            </div>
                            <div className="bar-value">{count}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Audio Features */}
            <div className="chart-section">
                <h3>Average Audio Features</h3>
                <div className="feature-bars">
                    <div className="feature-item">
                        <span>Danceability</span>
                        <div className="feature-bar">
                            <div style={{ width: `${stats.avgFeatures.danceability * 100}%` }} />
                        </div>
                        <span>{(stats.avgFeatures.danceability * 100).toFixed(0)}%</span>
                    </div>
                    <div className="feature-item">
                        <span>Energy</span>
                        <div className="feature-bar">
                            <div style={{ width: `${stats.avgFeatures.energy * 100}%` }} />
                        </div>
                        <span>{(stats.avgFeatures.energy * 100).toFixed(0)}%</span>
                    </div>
                    <div className="feature-item">
                        <span>Valence</span>
                        <div className="feature-bar">
                            <div style={{ width: `${stats.avgFeatures.valence * 100}%` }} />
                        </div>
                        <span>{(stats.avgFeatures.valence * 100).toFixed(0)}%</span>
                    </div>
                </div>
            </div>

            {/* Temporal Distribution */}
            <div className="chart-section">
                <h3>Songs by Decade</h3>
                <div className="timeline-chart">
                    {Object.entries(stats.decadeCounts)
                        .sort(([a], [b]) => parseInt(a) - parseInt(b))
                        .map(([decade, count]) => (
                            <div key={decade} className="timeline-bar">
                                <div className="timeline-label">{decade}s</div>
                                <div
                                    className="timeline-fill"
                                    style={{ height: `${(count / maxDecadeCount) * 100}%` }}
                                />
                            </div>
                        ))}
                </div>
            </div>

            <div className="stats-summary">
                <p><strong>{data.length.toLocaleString()}</strong> songs visible</p>
            </div>
        </div>
    )
}
