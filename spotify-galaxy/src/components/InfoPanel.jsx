import './InfoPanel.css'

export default function InfoPanel() {
    return (
        <div className="info-panel">
            <h2>Spotify Galaxy</h2>
            <div className="info-content">
                <p className="description">
                    An immersive 3D visualization of <strong>19,769 songs</strong> from 1921-2020.
                    Each star represents a track, positioned by its musical characteristics using PCA.
                </p>

                <div className="legend-section">
                    <h3>Visual Encodings</h3>
                    <ul>
                        <li><span className="dot position"></span> <strong>Position:</strong> Audio Similarity</li>
                        <li><span className="dot color"></span> <strong>Color:</strong> Audio Genre Cluster</li>
                        <li><span className="dot size"></span> <strong>Size:</strong> Energy Level</li>
                    </ul>
                </div>

                <div className="controls-section">
                    <h3>Each cluster Represents an audio genre</h3>
                    {/* <ul>
                        <li>🖱️ <strong>Left Click + Drag:</strong> Rotate View</li>
                        <li>🖱️ <strong>Scroll:</strong> Zoom In / Out</li>
                        <li>🖱️ <strong>Timeline:</strong> Filter by Year</li>
                    </ul> */}
                </div>
            </div>
        </div>
    )
}
