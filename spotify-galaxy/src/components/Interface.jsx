import { useState } from 'react'
import './Interface.css'

export default function Interface({ yearRange, onYearChange, hoveredSong, totalSongs }) {
    const [minYear, maxYear] = yearRange

    return (
        <div className="interface">
            {/* Title */}
            <div className="title">
                <h1>SPOTIFY GALAXY</h1>
                <p>Exploring {totalSongs.toLocaleString()} songs across time and sound</p>
            </div>

            {/* Timeline Control */}
            <div className="timeline-control">
                <label>Time Range: {minYear} - {maxYear}</label>
                <div className="slider-container">
                    <input
                        type="range"
                        min="1920"
                        max="2020"
                        value={minYear}
                        onChange={(e) => onYearChange([parseInt(e.target.value), maxYear])}
                        className="slider"
                    />
                    <input
                        type="range"
                        min="1920"
                        max="2020"
                        value={maxYear}
                        onChange={(e) => onYearChange([minYear, parseInt(e.target.value)])}
                        className="slider"
                    />
                </div>
            </div>

            {/* Song Info */}
            {hoveredSong && (
                <div className="song-info">
                    <h3>{hoveredSong.name}</h3>
                    <p>{hoveredSong.artist}</p>
                    <p className="year">{hoveredSong.year}</p>
                </div>
            )}

            {/* Instructions */}
            <div className="instructions">
                <p>🖱️ Drag to rotate • Scroll to zoom • Adjust timeline to filter</p>
            </div>
        </div>
    )
}
