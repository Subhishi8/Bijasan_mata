const express = require("express");
const router = express.Router();
const multer = require("multer");
const Event = require("../models/Events");

// STORAGE
const storage = multer.diskStorage({

destination: function(req, file, cb){
cb(null, "uploads/events");
},

filename: function(req, file, cb){
cb(null, Date.now() + "-" + file.originalname);
}

});

const upload = multer({ storage });


// CREATE EVENT
router.post("/events", upload.fields([
{ name: "event_image", maxCount: 1 },
{ name: "event_flyer", maxCount: 1 }
]), async (req, res) => {

try{

const event = new Event({

title: req.body.title,
category: req.body.category,

description: req.body.description,

event_date: req.body.event_date,

event_image: req.files["event_image"]
? "/uploads/events/" + req.files["event_image"][0].filename
: "",

event_flyer: req.files["event_flyer"]
? "/uploads/events/" + req.files["event_flyer"][0].filename
: ""

});

await event.save();

res.json({
success:true,
message:"Event uploaded"
});

}

catch(err){

console.error(err);

res.status(500).json({
success:false
});

}

});


// GET EVENTS
router.get("/events", async (req,res)=>{

const events = await Event.find().sort({ event_date:-1 });

res.json(events);

});
// DELETE EVENT
router.delete("/events/:id", async (req, res) => {
  try {

    await Event.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Event deleted"
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false
    });

  }
});

module.exports = router;
