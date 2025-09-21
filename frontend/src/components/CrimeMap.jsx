import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Circle, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./CrimeMap.css";

// Component to fly to the new location
const FlyTo = ({ coords }) => {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.flyTo(coords, 13); // Zoom level 13
    }
  }, [coords, map]);
  return null;
};

const CrimeMap = () => {
  const [posts, setPosts] = useState([]);
  const [mapCenter, setMapCenter] = useState([19.076, 72.8777]); // Default Mumbai
  const [locationQuery, setLocationQuery] = useState("");
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    // Show map after 5 seconds
    const timer = setTimeout(() => setLoading(false), 5000);

    // Fetch posts
    fetch("http://localhost:5000/api/heatmap")
      .then((res) => res.json())
      .then(setPosts)
      .catch((err) => console.error("🔥 Fetch error:", err));

    return () => clearTimeout(timer);
  }, []);

  const crimeCount = posts.filter((p) => p.label === 1).length;

  const handleLocationSearch = async () => {
    if (!locationQuery.trim()) return;
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          locationQuery
        )}`
      );
      const data = await res.json();
      if (data.length > 0) {
        const { lat, lon } = data[0];
        setMapCenter([parseFloat(lat), parseFloat(lon)]);
      } else {
        alert("Location not found.");
      }
    } catch (err) {
      alert("Error fetching location.");
      console.error(err);
    }
  };

  return (
    <div className="crime-map-container">
      <div className="map-heading">
        🚨 Smart Crime Heatmap 🚨
        <div className="location-search">
          <input
            type="text"
            placeholder="Search location"
            value={locationQuery}
            onChange={(e) => setLocationQuery(e.target.value)}
          />
          <button onClick={handleLocationSearch}>Search</button>
        </div>
      </div>

      <div className="map-container-wrapper">
        {loading ? (
             <div className="news">
        <span className="live" style={{height:"20px"}}>LIVE</span>
        Loading map....
         
      </div>
        ) : (
          <MapContainer center={mapCenter} zoom={12} className="crime-map">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <FlyTo coords={mapCenter} />

            {posts.map((report, idx) => {
              const color = report.label === 1 ? "red" : "green";
              const fillColor = report.label === 1 ? "#f03" : "#0f3";
              const offsetLat = report.location.lat + (Math.random() - 0.5) * 0.002;
              const offsetLng = report.location.lng + (Math.random() - 0.5) * 0.002;

              return (
                <Circle
                  key={`${report.location.lat}-${report.location.lng}-${idx}`}
                  center={[offsetLat, offsetLng]}
                  radius={150}
                  pathOptions={{ color, fillColor, fillOpacity: 0.5 }}
                >
                  <Popup>
                    <strong>{report.label === 1 ? "🚨 Crime Report" : "✅ Normal Activity"}</strong>
                    <br />
                    {report.text.split(".")[0]}
                    <br />
                    <small>
                      Lat: {report.location.lat}, Lng: {report.location.lng}
                    </small>
                  </Popup>
                </Circle>
              );
            })}
          </MapContainer>
        )}
      </div>

      <div className="summary-section">
        <div className="summary-card crime">
          <h3>Crimes</h3>
          <p>{crimeCount}</p>
        </div>
        <div className="summary-card total">
          <h3>Total</h3>
          <p>{posts.length}</p>
        </div>
      </div>
    </div>
  );
};

export default CrimeMap;
