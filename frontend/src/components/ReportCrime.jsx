import React, { useState } from "react";
import axios from "axios";
import "./ReportCrime.css"; // Custom CSS file

export default function ReportForm() {
  const [text, setText] = useState(""),
        [lat, setLat] = useState(""),
        [lng, setLng] = useState(""),
        [result, setResult] = useState(null); // Stores crime result

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/classify`, {
        text,
        location: { lat: parseFloat(lat), lng: parseFloat(lng) }
      });
      setResult(data.label === 1 ? "crime" : "normal");
    } catch (err) {
      console.error("Error:", err);
      setResult("error");
    }
    setText(""); setLat(""); setLng("");
  };

  return (
    <div className="report-form-container">
      <form onSubmit={onSubmit} className="report-form">
        <h2>Incident Reporting</h2>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Describe the incident..."
          required
        />
        <div className="input-group">
          <input
            value={lat}
            onChange={e => setLat(e.target.value)}
            placeholder="Latitude"
            required
          />
          <input
            value={lng}
            onChange={e => setLng(e.target.value)}
            placeholder="Longitude"
            required
          />
        </div>
        <button type="submit">Submit Report</button>
      </form>

      {result && (
        <div className={`result-box ${result}`}>
          {result === "crime" && "🚨 Crime-Related Incident Detected"}
          {result === "normal" && "✅ Normal Activity"}
          {result === "error" && "⚠️ Error submitting report"}
        </div>
      )}
    </div>
  );
}
