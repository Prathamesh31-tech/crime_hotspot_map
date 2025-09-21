const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  text: String,
  location: { lat: Number, lng: Number },
  label: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Post", PostSchema);
