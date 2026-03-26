const mongoose = require("mongoose");

const timingSchema = new mongoose.Schema({

  temple_opening: String,
  temple_closing: String,
  morning_aarti: String,
  evening_aarti: String

});

module.exports = mongoose.model("Timing", timingSchema);