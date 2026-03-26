const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const Gallery = require("../models/Gallery");

/* Storage config */

const storage = multer.diskStorage({

destination: function(req,file,cb){
cb(null,"uploads/")
},

filename: function(req,file,cb){

cb(null,Date.now()+path.extname(file.originalname))

}

});

const upload = multer({ storage });

/* GET ALL IMAGES */

router.get("/gallery", async(req,res)=>{

try{

const images = await Gallery.find().sort({createdAt:-1})

res.json(images)

}

catch(err){

console.log(err)

res.status(500).json({message:"Error fetching gallery"})

}

})

/* UPLOAD IMAGE */

router.post("/gallery", upload.single("image"), async(req,res)=>{

try{

const newImage = new Gallery({

category:req.body.category,

image_url:"/uploads/"+req.file.filename

})

await newImage.save()

res.json(newImage)

}

catch(err){

console.log(err)

res.status(500).json({message:"Upload failed"})

}

})

/* DELETE IMAGE */

router.delete("/gallery/:id", async(req,res)=>{

try{

await Gallery.findByIdAndDelete(req.params.id)

res.json({message:"Image deleted"})

}

catch(err){

console.log(err)

res.status(500).json({message:"Delete failed"})

}

})

module.exports = router;
