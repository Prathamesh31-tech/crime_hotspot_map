import joblib
import pandas as pd
import numpy as np
from pymongo import MongoClient
from sklearn.cluster import KMeans

# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["crime-db"]
posts = list(db["posts"].find({"label":1}))  # Only crime reports

# Prepare DataFrame
coords = np.array([[p["location"]["lat"], p["location"]["lng"]] for p in posts])

# If no data, handle gracefully
if len(coords) == 0:
    print("No crime data available")
else:
    # Train KMeans to find hotspot
    kmeans = KMeans(n_clusters=1)
    kmeans.fit(coords)

    # Output hotspot center
    center = kmeans.cluster_centers_[0]
    print(f"{center[0]},{center[1]}")
