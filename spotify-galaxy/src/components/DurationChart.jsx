import { useMemo, useState } from 'react'
import './DurationChart.css'

export default function DurationChart({ data }) {
    const [tooltip, setTooltip] = useState(null)
    const chartData = useMemo(() => {
        if (!data.length) return []

        // Group by year and calculate average duration
        const yearGroups = {}
        data.forEach(song => {
            if (!yearGroups[song.year]) {
                yearGroups[song.year] = { total: 0, count: 0 }
            }
            yearGroups[song.year].total += song.duration_ms
            yearGroups[song.year].count += 1
        })

        // Convert to array and calculate averages in minutes
        return Object.entries(yearGroups)
            .map(([year, { total, count }]) => ({
                year: parseInt(year),
                avgMinutes: (total / count) / 60000 // Convert ms to minutes
            }))
            .sort((a, b) => a.year - b.year)
    }, [data])

    if (!chartData.length) return null

    // Chart dimensions
    const width = 280
    const height = 180
    const padding = { top: 20, right: 20, bottom: 40, left: 50 }
    const chartWidth = width - padding.left - padding.right
    const chartHeight = height - padding.top - padding.bottom

    // Scales
    const minYear = Math.min(...chartData.map(d => d.year))
    const maxYear = Math.max(...chartData.map(d => d.year))
    const minDuration = Math.min(...chartData.map(d => d.avgMinutes))
    const maxDuration = Math.max(...chartData.map(d => d.avgMinutes))

    const xScale = (year) => ((year - minYear) / (maxYear - minYear)) * chartWidth
    const yScale = (duration) => chartHeight - ((duration - minDuration) / (maxDuration - minDuration)) * chartHeight

    // Generate path
    const pathData = chartData.map((d, i) => {
        const x = xScale(d.year)
        const y = yScale(d.avgMinutes)
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
    }).join(' ')

    // X-axis ticks (every 20 years)
    const xTicks = []
    for (let year = Math.ceil(minYear / 20) * 20; year <= maxYear; year += 20) {
        xTicks.push(year)
    }

    // Y-axis ticks - use 0.5 minute intervals for clarity
    const yTicks = []
    const yMin = Math.floor(minDuration * 2) / 2 // Round down to nearest 0.5
    const yMax = Math.ceil(maxDuration * 2) / 2  // Round up to nearest 0.5

    for (let tick = yMin; tick <= yMax; tick += 0.5) {
        yTicks.push(tick)
    }

    return (
        <div className="duration-chart">
            <h3>Average Song Duration</h3>
            <svg width={width} height={height}>
                <g transform={`translate(${padding.left}, ${padding.top})`}>
                    {/* Grid lines */}
                    {yTicks.map(tick => (
                        <line
                            key={tick}
                            x1={0}
                            y1={yScale(tick)}
                            x2={chartWidth}
                            y2={yScale(tick)}
                            stroke="rgba(255,255,255,0.1)"
                            strokeDasharray="2,2"
                        />
                    ))}

                    {/* Line */}
                    <path
                        d={pathData}
                        fill="none"
                        stroke="url(#lineGradient)"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    {/* Data points */}
                    {chartData.map(d => (
                        <circle
                            key={d.year}
                            cx={xScale(d.year)}
                            cy={yScale(d.avgMinutes)}
                            r="4"
                            fill="#667eea"
                            opacity="0.8"
                            style={{ cursor: 'pointer' }}
                            onMouseEnter={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect()
                                setTooltip({
                                    year: d.year,
                                    duration: d.avgMinutes,
                                    x: rect.left + rect.width / 2,
                                    y: rect.top - 10
                                })
                            }}
                            onMouseLeave={() => setTooltip(null)}
                        />
                    ))}

                    {/* X-axis */}
                    <line
                        x1={0}
                        y1={chartHeight}
                        x2={chartWidth}
                        y2={chartHeight}
                        stroke="rgba(255,255,255,0.3)"
                        strokeWidth="1"
                    />

                    {/* X-axis ticks and labels */}
                    {xTicks.map(year => (
                        <g key={year}>
                            <line
                                x1={xScale(year)}
                                y1={chartHeight}
                                x2={xScale(year)}
                                y2={chartHeight + 5}
                                stroke="rgba(255,255,255,0.3)"
                            />
                            <text
                                x={xScale(year)}
                                y={chartHeight + 20}
                                textAnchor="middle"
                                fill="rgba(255,255,255,0.7)"
                                fontSize="10"
                            >
                                {year}
                            </text>
                        </g>
                    ))}

                    {/* Y-axis */}
                    <line
                        x1={0}
                        y1={0}
                        x2={0}
                        y2={chartHeight}
                        stroke="rgba(255,255,255,0.3)"
                        strokeWidth="1"
                    />

                    {/* Y-axis ticks and labels */}
                    {yTicks.map(tick => (
                        <g key={tick}>
                            <line
                                x1={-5}
                                y1={yScale(tick)}
                                x2={0}
                                y2={yScale(tick)}
                                stroke="rgba(255,255,255,0.3)"
                            />
                            <text
                                x={-10}
                                y={yScale(tick)}
                                textAnchor="end"
                                alignmentBaseline="middle"
                                fill="rgba(255,255,255,0.7)"
                                fontSize="10"
                            >
                                {tick.toFixed(1)}
                            </text>
                        </g>
                    ))}

                    {/* Y-axis label */}
                    <text
                        x={-35}
                        y={chartHeight / 2}
                        textAnchor="middle"
                        fill="rgba(255,255,255,0.6)"
                        fontSize="11"
                        transform={`rotate(-90, -35, ${chartHeight / 2})`}
                    >
                        Minutes
                    </text>
                </g>

                {/* Gradient definition */}
                <defs>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#667eea" />
                        <stop offset="100%" stopColor="#764ba2" />
                    </linearGradient>
                </defs>
            </svg>

            {/* Tooltip */}
            {tooltip && (
                <div
                    className="duration-tooltip"
                    style={{
                        position: 'fixed',
                        left: `${tooltip.x}px`,
                        top: `${tooltip.y}px`,
                        transform: 'translate(-50%, -100%)',
                        pointerEvents: 'none'
                    }}
                >
                    <div className="tooltip-year">{tooltip.year}</div>
                    <div className="tooltip-duration">{tooltip.duration.toFixed(2)} min</div>
                </div>
            )}
        </div>
    )
}
