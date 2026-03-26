const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: String,
  event_date: Date,
  event_image: String,
  event_flyer: String
});

module.exports = mongoose.model("Event", eventSchema);