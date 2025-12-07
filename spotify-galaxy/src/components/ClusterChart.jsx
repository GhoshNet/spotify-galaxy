import { useMemo, useState } from 'react'
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'
import './ClusterChart.css'

const CLUSTER_COLORS = [
    '#8b5cf6', // Purple - Cluster 0
    '#ec4899', // Pink - Cluster 1
    '#f59e0b', // Amber - Cluster 2
    '#10b981', // Emerald - Cluster 3
    '#3b82f6', // Blue - Cluster 4
    '#ef4444', // Red - Cluster 5
    '#14b8a6', // Teal - Cluster 6
    '#f97316', // Orange - Cluster 7
]

const CLUSTER_LABELS = {
    0: 'Ballads & Slow',
    1: 'Spoken Word',
    2: 'Balanced Mix',
    3: 'Dance & Pop',
    4: 'Classical',
    5: 'Rock & Alt',
    6: 'Energetic',
    7: 'Folk & Trad',
}

export default function ClusterChart({ data }) {
    const [selectedClusters, setSelectedClusters] = useState([0, 1, 2, 3, 4, 5, 6, 7])

    const clusterStats = useMemo(() => {
        if (!data || data.length === 0) return []

        const clusters = {}

        // Group by cluster and calculate stats
        data.forEach(song => {
            const clusterId = song.cluster
            if (!clusters[clusterId]) {
                clusters[clusterId] = {
                    id: clusterId,
                    count: 0,
                    danceability: 0,
                    energy: 0,
                    valence: 0,
                }
            }

            clusters[clusterId].count++
            clusters[clusterId].danceability += song.features.danceability
            clusters[clusterId].energy += song.features.energy
            clusters[clusterId].valence += song.features.valence
        })

        // Calculate averages and format for chart
        return Object.values(clusters)
            .map(cluster => ({
                name: `Cluster ${cluster.id}`,
                clusterId: cluster.id,
                songs: cluster.count,
                danceability: (cluster.danceability / cluster.count * 100).toFixed(1),
                energy: (cluster.energy / cluster.count * 100).toFixed(1),
                valence: (cluster.valence / cluster.count * 100).toFixed(1),
            }))
            .sort((a, b) => a.clusterId - b.clusterId)
    }, [data])

    const radarData = useMemo(() => {
        if (!clusterStats || clusterStats.length === 0) return []

        return ['Danceability', 'Energy', 'Valence'].map(feature => {
            const dataPoint = { feature }
            clusterStats.forEach(cluster => {
                dataPoint[`Cluster ${cluster.clusterId}`] = parseFloat(cluster[feature.toLowerCase()])
            })
            return dataPoint
        })
    }, [clusterStats])

    if (!data || data.length === 0) {
        return <div className="cluster-chart">Loading...</div>
    }

    return (
        <div className="cluster-chart">
            <div className="chart-section">
                <h3>Cluster Distribution</h3>
                <ResponsiveContainer width="100%" height={240}>
                    <BarChart
                        data={clusterStats}
                        margin={{ top: 10, right: 10, left: 15, bottom: 20 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis
                            dataKey="name"
                            stroke="#888"
                            tick={{ fill: '#bbb', fontSize: 11 }}
                            label={{ value: 'Cluster Type', position: 'insideBottom', offset: -10, fill: '#888', fontSize: 12 }}
                            height={60}
                        />
                        <YAxis
                            stroke="#888"
                            tick={{ fill: '#bbb', fontSize: 11 }}
                            label={{ value: 'Number of Songs', angle: -90, position: 'insideLeft', fill: '#888', fontSize: 12, offset: 0, dy: 50 }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                                border: '1px solid #333',
                                borderRadius: '8px'
                            }}
                            formatter={(value, name, props) => {
                                const cluster = props.payload
                                return [
                                    `${value.toLocaleString()}`,
                                    `${CLUSTER_LABELS[cluster.clusterId]}`
                                ]
                            }}
                            labelStyle={{ color: '#fff', fontWeight: 'bold' }}
                            itemStyle={{ color: '#aaa' }}
                        />
                        <Bar dataKey="songs" radius={[4, 4, 0, 0]}>
                            {clusterStats.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={CLUSTER_COLORS[entry.clusterId]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="chart-section">
                <h3>Audio Features by Cluster</h3>

                <div className="cluster-selector">
                    {clusterStats.map((cluster) => (
                        <label
                            key={cluster.clusterId}
                            className="cluster-checkbox"
                            title={`Cluster ${cluster.clusterId}: ${CLUSTER_LABELS[cluster.clusterId]} (${cluster.songs} songs)`}
                        >
                            <input
                                type="checkbox"
                                checked={selectedClusters.includes(cluster.clusterId)}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setSelectedClusters([...selectedClusters, cluster.clusterId].sort((a, b) => a - b))
                                    } else {
                                        setSelectedClusters(selectedClusters.filter(id => id !== cluster.clusterId))
                                    }
                                }}
                            />
                            <span
                                className="checkbox-label"
                                style={{ color: CLUSTER_COLORS[cluster.clusterId] }}
                            >
                                {CLUSTER_LABELS[cluster.clusterId]}
                            </span>
                        </label>
                    ))}
                </div>

                <ResponsiveContainer width="100%" height={220}>
                    <RadarChart data={radarData}>
                        <PolarGrid stroke="#333" />
                        <PolarAngleAxis dataKey="feature" stroke="#888" tick={{ fill: '#888', fontSize: 11 }} />
                        <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#888" tick={{ fill: '#888', fontSize: 10 }} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                                border: '1px solid #333',
                                borderRadius: '8px'
                            }}
                        />
                        <Legend wrapperStyle={{ fontSize: '11px' }} />
                        {clusterStats
                            .filter(cluster => selectedClusters.includes(cluster.clusterId))
                            .map((cluster) => (
                                <Radar
                                    key={`radar-${cluster.clusterId}`}
                                    name={CLUSTER_LABELS[cluster.clusterId]}
                                    dataKey={`Cluster ${cluster.clusterId}`}
                                    stroke={CLUSTER_COLORS[cluster.clusterId]}
                                    fill={CLUSTER_COLORS[cluster.clusterId]}
                                    fillOpacity={0.3}
                                />
                            ))}
                    </RadarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
