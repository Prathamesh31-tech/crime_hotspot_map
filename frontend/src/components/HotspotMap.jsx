import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import L from "leaflet";
import "./HotspotMap.css";

const HotspotMap = () => {
  const [hotspot, setHotspot] = useState(null);
  const [address, setAddress] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/api/hotspot")
      .then(res => {
        const hotspotData = res.data.hotspot;
        setHotspot(hotspotData);

        if (hotspotData) {
          const { lat, lng } = hotspotData;

          // Fetch address from Nominatim reverse geocoding
          fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`)
            .then(res => res.json())
            .then(data => {
              if (data && data.display_name) {
                setAddress(data.display_name);
              } else {
                setAddress("Unknown Location");
              }
            })
            .catch(err => {
              console.error(err);
              setAddress("Error fetching location");
            });
        }
      })
      .catch(err => console.error(err));
  }, []);

  const icon = new L.DivIcon({
    html: `<div class="radar-container">
            <div class="radar-sweep"></div>
            <div class="radar-center">⚠️</div>
          </div>`,
    className: ""
  });

  return (
    <div className="hotspot-wrapper">
      <div className="news-banner">
        <span className="live">LIVE</span>
        {hotspot
          ? `🚨 Future Crime Hotspot Detected: ${address}`
          : "Loading hotspot prediction..."}
      </div>

      {hotspot && (
        <MapContainer
          center={[hotspot.lat, hotspot.lng]}
          zoom={14}
          style={{ height: "500px", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          <Marker position={[hotspot.lat, hotspot.lng]} icon={icon}>
            <Popup>
              🚨 <strong>Future Crime Hotspot</strong> <br />
              {address}
            </Popup>
          </Marker>
        </MapContainer>
      )}
    </div>
  );
};

export default HotspotMap;
