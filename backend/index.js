require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { spawnSync } = require("child_process");
const Post = require("./models/Post");
const { runNewsJob } = require("./news/runner"); // ✅ Exported function from runner.js

const app = express();
app.use(cors());
app.use(express.json());

// 🔍 Classify + Save Endpoint
app.post("/api/classify", async (req, res) => {
  const { text, location } = req.body;

  try {
    const result = spawnSync("python", ["./ml/predict.py", text]);
    const label = parseInt(result.stdout.toString().trim());

    const isAuthenticCrime = (text) => true; // Placeholder

    if (label === 1 && isAuthenticCrime(text)) {
      const newPost = new Post({ text, location, label });
      await newPost.save();
      return res.json({ label, stored: true });
    } else {
      return res.json({ label, stored: false });
    }
  } catch (error) {
    console.error("❌ Error in /api/classify:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// 🗺 Heatmap Data
app.get("/api/heatmap", async (_, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    console.error("❌ Error in /api/heatmap:", error);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

// 🔥 Hotspot Prediction
app.get("/api/hotspot", (req, res) => {
  try {
    const result = spawnSync("python", ["./ml/hotspot_predict.py"]);
    const output = result.stdout.toString().trim();

    if (output === "No crime data available") {
      return res.json({ hotspot: null });
    }

    const [lat, lng] = output.split(",");
    res.json({
      hotspot: {
        lat: parseFloat(lat),
        lng: parseFloat(lng),
      },
    });
  } catch (error) {
    console.error("❌ Error in /api/hotspot:", error);
    res.status(500).json({ error: "Hotspot prediction failed" });
  }
});

// 🗄 Connect MongoDB and Start Cron Job
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("🗄 MongoDB connected");
    runNewsJob(); // ✅ Cron will call fetch_news.py every minute
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });

app.listen(5000, () => console.log("🚀 Backend running on port 5000"));
