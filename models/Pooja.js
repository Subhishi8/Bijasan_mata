const mongoose = require("mongoose");

const poojaSchema = new mongoose.Schema({
  pooja_name: String,
  description: String,
  amount: Number
});

module.exports = mongoose.model("Pooja", poojaSchema);