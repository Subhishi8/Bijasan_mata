const express = require("express");
const PDFDocument = require("pdfkit");
const QRCode = require("qrcode");
const path = require("path");

const MealBooking = require("../models/MealBooking");

const router = express.Router();


// BOOK MEAL
router.post("/book-meal", async (req, res) => {

try {

const booking = new MealBooking(req.body);

await booking.save();

res.json({
success: true,
bookingId: booking._id
});

}

catch(err){

console.error("Booking error:", err);

res.status(500).json({
success:false,
message:"Meal booking failed"
});

}

});



// GENERATE TOKEN PDF
router.get("/meal-token/:id", async (req,res)=>{

try{

const booking = await MealBooking.findById(req.params.id);

if(!booking){
return res.status(404).send("Booking not found");
}

const doc = new PDFDocument({margin:50});

res.setHeader("Content-Type","application/pdf");
res.attachment(`meal_token_${booking._id}.pdf`);

doc.pipe(res);


// QR CODE
const qrData = `TOKEN:${booking._id}`;
const qrImage = await QRCode.toDataURL(qrData);
const qrBuffer = Buffer.from(qrImage.split(",")[1], "base64");
doc.image(qrBuffer,370,230,{width:100});


// Temple Logo
const fs = require("fs");
const logoPath = path.join(__dirname,"../public/images/logo.png");

try{
if(fs.existsSync(logoPath)){
doc.image(logoPath,250,40,{width:80});
}
}catch(e){
console.log("Logo load skipped");
}


// Title
doc
.fontSize(20)
.fillColor("#8B3A1A")
.text("Bijasan Mata Mandir",{align:"center"});

doc
.fontSize(16)
.text("Annakshetra Meal Token",{align:"center"});

doc.moveDown(2);


// Border
doc.rect(100,180,400,220).stroke();


// Booking Details
doc.fontSize(12);

doc.text(`Token ID: ${booking._id}`,120,210);
doc.text(`Name: ${booking.name}`,120,240);
doc.text(`Mobile: ${booking.mobile}`,120,260);
doc.text(`People: ${booking.people}`,120,280);
doc.text(`Meal Time: ${booking.meal_time}`,120,300);
doc.text(`Booking Date: ${booking.date}`,120,320);

doc
.fontSize(14)
.fillColor("#8B3A1A")
.text(`Amount Paid: ₹${booking.amount}`,120,350);


// QR



// Instruction
doc
.fontSize(10)
.fillColor("black")
.text(
"Please show this token at Annakshetra counter to receive your meal.",
120,
390,
{width:360}
);

doc.end();

}

catch(err){

console.error("Token error:", err);

res.status(500).send("Token generation failed");

}

});


module.exports = router;