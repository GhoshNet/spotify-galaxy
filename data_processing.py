import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from sklearn.cluster import KMeans
import numpy as np
import json

def process_data(input_file='data.csv', output_file='galaxy_data.json'):
    print("Loading data...")
    df = pd.read_csv(input_file)
    
    # Select relevant columns
    audio_features = ['acousticness', 'danceability', 'energy', 'instrumentalness', 
                      'liveness', 'loudness', 'speechiness', 'tempo', 'valence']
    meta_columns = ['name', 'artists', 'year', 'popularity']
    
    # Drop rows with missing values
    df = df.dropna(subset=audio_features + meta_columns)
    
    # Sample data if too large (e.g., keep 20k points stratified by year)
    if len(df) > 20000:
        print(f"Sampling data from {len(df)} rows...")
        df = df.groupby('year', group_keys=False).apply(lambda x: x.sample(min(len(x), 200)))
        df = df.sample(n=min(len(df), 20000), random_state=42)
    
    print(f"Processing {len(df)} rows...")
    
    # Normalize features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(df[audio_features])
    
    # PCA (3 Components for 3D)
    print("Running PCA (3D)...")
    pca = PCA(n_components=3)
    principal_components = pca.fit_transform(X_scaled)
    
    df['x'] = principal_components[:, 0]
    df['y'] = principal_components[:, 1]
    df['z'] = principal_components[:, 2]
    
    # K-Means Clustering for "Audio Genres"
    print("Running K-Means Clustering...")
    kmeans = KMeans(n_clusters=8, random_state=42)
    df['cluster'] = kmeans.fit_predict(X_scaled)
    
    # Clean up artist name
    df['artists'] = df['artists'].astype(str).str.replace(r"['\[\]]", "", regex=True)
    
    # Prepare JSON structure
    # We want a list of objects, or a compact structure. List of objects is easiest for React.
    print("Exporting to JSON...")
    
    # Create a list of dictionaries
    output_data = []
    for _, row in df.iterrows():
        output_data.append({
            'id': str(row.name), # Use index as ID
            'position': [float(row['x']), float(row['y']), float(row['z'])],
            'cluster': int(row['cluster']),
            'name': row['name'],
            'artist': row['artists'],
            'year': int(row['year']),
            'features': {
                'danceability': float(row['danceability']),
                'energy': float(row['energy']),
                'valence': float(row['valence'])
            }
        })
        
    with open(output_file, 'w') as f:
        json.dump(output_data, f)
        
    print(f"Saved {len(output_data)} tracks to {output_file}")
    print("Done!")

if __name__ == "__main__":
    process_data()
