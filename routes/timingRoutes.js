const express = require("express");
const router = express.Router();
const Timing = require("../models/Timings");


// add timings
router.post("/add-timings", async (req, res) => {

  const timing = new Timing(req.body);

  await timing.save();

  res.json({ message: "Timings saved" });

});


// get timings
router.get("/timings", async (req, res) => {

  const timings = await Timing.find();

  res.json(timings);

});

module.exports = router;