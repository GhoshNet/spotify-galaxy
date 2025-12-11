# Spotify Galaxy: 3D Music Visualization 🌌

**[Live Demo](https://ghoshnet.github.io/spotify-galaxy/)** | **[Project Report](./report.pdf)**

An immersive, interactive 3D visualization of **19,769 Spotify tracks** spanning from 1921 to 2020. This project uses machine learning (PCA & K-Means) and WebGL to map the high-dimensional audio features of music into a navigable "galaxy," revealing the evolution of musical styles over a century.

![Spotify Galaxy Screenshot](./spotify-galaxy-ss.png)

## 🚀 Features

*   **3D Star Field**: Each star is a song. Its position is determined by its audio similarity to others (using Principal Component Analysis on features like Energy, Danceability, Acousticness, etc.).
*   **Genre Clusters**: Stars are colored by algorithmically determined genre groups (K-Means Clustering), allowing distinct musical styles to be visually separated.
*   **Temporal Filtering**: Interactive timeline slider to filter the galaxy by year (1921-2020) and observe the "shape" of music in different eras.
*   **Linked Analytical Views**:
    *   **Cluster Distribution**: Bar chart showing the breakdown of genres in the current view.
    *   **Audio Radar**: Radar chart allowing you to compare the sonic profile of the visible songs.
    *   **Trend Line**: Line chart tracking the average song duration over evolution.
*   **Details-on-Demand**: Hover over any star to see song metadata and highlight its location in the charts. Click to pause rotation for detailed inspection.

## 🛠️ Tech Stack

*   **Frontend**: React, Vite
*   **3D Rendering**: Three.js, @react-three/fiber, @react-three/drei
*   **Visualization**: Recharts (2D Charts), D3.js concepts
*   **Data Processing**: Python (Pandas, Scikit-learn) - *See `data_processing.py`*

## 📦 Installation & Setup

To run this project locally, you need [Node.js](https://nodejs.org/) installed.

1.  **Clone the repository**
    ```bash
    git clone https://github.com/GhoshNet/spotify-galaxy.git
    cd spotify-galaxy
    ```

2.  **Navigate to the app directory**
    *(The web application is located in the `spotify-galaxy` subfolder)*
    ```bash
    cd spotify-galaxy
    ```

3.  **Install dependencies**
    ```bash
    npm install
    ```

4.  **Run the development server**
    ```bash
    npm run dev
    ```

5.  **Open in Browser**
    Visit the URL shown in the terminal (usually `http://localhost:5173`).

---

## 📊 Data Pipeline

The raw data (`data.csv`) was processed using `data_processing.py` to:
1.  Clean and filter tracks (1921-2020, removing duplicates).
2.  Normalize audio features using `StandardScaler`.
3.  Reduce dimensions from 12 features to 3 (X, Y, Z) using **PCA**.
4.  Group songs into 8 distinct clusters using **K-Means**.
5.  Export the processed data to `galaxy_data.json` for the web app.

## 📄 License
This project was created for the CS7DS4 Data Visualization assignment at Trinity College Dublin.
