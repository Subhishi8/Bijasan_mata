const express = require("express");
const PDFDocument = require("pdfkit");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

const RoomBooking = require("../models/roomBooking");

const router = express.Router();



/*
CHECK ROOM AVAILABILITY
*/
router.post("/check-room", async (req, res) => {

try {

const { checkin, checkout, room_type } = req.body;

const TOTAL_ROOMS = {
"AC": 10,
"Non-AC": 20
};

const bookings = await RoomBooking.find({
room_type,
$or: [
{ checkin: { $lte: checkout }, checkout: { $gte: checkin } }
]
});

let bookedRooms = 0;

bookings.forEach(b => bookedRooms += b.rooms);

const available = TOTAL_ROOMS[room_type] - bookedRooms;

res.json({ available });

}

catch(err){

console.error(err);
res.status(500).json({ error: "Room availability check failed" });

}

});



/*
SAVE ROOM BOOKING
*/
router.post("/book-room", async (req, res) => {

try {

const booking = new RoomBooking(req.body);

await booking.save();

res.json({
success:true,
bookingId: booking._id
});

}

catch(err){

console.error(err);

res.status(500).json({
success:false,
message:"Error saving booking"
});

}

});



/*
DOWNLOAD RECEIPT + EMAIL
*/
router.get("/room-receipt/:id", async (req, res) => {

try {

const booking = await RoomBooking.findById(req.params.id);

if(!booking){
return res.status(404).send("Booking not found");
}


// Format dates without time
const checkinDate = new Date(booking.checkin).toLocaleDateString("en-IN",{
day:"2-digit",
month:"long",
year:"numeric"
});

const checkoutDate = new Date(booking.checkout).toLocaleDateString("en-IN",{
day:"2-digit",
month:"long",
year:"numeric"
});


// Create PDF document
const doc = new PDFDocument({ margin:50 });

let buffers = [];

doc.on("data", buffers.push.bind(buffers));

doc.on("end", async () => {

const pdfData = Buffer.concat(buffers);


/*
SEND EMAIL WITH RECEIPT
*/
try {

const transporter = nodemailer.createTransport({
    host:"smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
}

});

await transporter.sendMail({

from:`Bijasan Mata Mandir <subhishisingh8504@gmail.com>`,

to: booking.email,

subject:"Room Booking Confirmation - Bijasan Mata Mandir",

html:`
<h2>Room Booking Confirmation</h2>

<p>Dear ${booking.name},</p>

<p>Your room booking at <b>Bijasan Mata Mandir</b> is confirmed.</p>

<p><b>Room Type:</b> ${booking.room_type}</p>
<p><b>Check-in Date:</b> ${checkinDate}</p>
<p><b>Check-out Date:</b> ${checkoutDate}</p>
<p><b>Amount Paid:</b> ₹${booking.amount}</p>

<p>Please find your booking receipt attached.</p>

<p>We wish you a peaceful and spiritual stay.</p>
`,

attachments:[
{
filename:`room_receipt_${booking._id}.pdf`,
content: pdfData
}
]

});

}

catch(err){
console.log("Email sending failed:", err);
}


// SEND PDF TO BROWSER
res.set({
"Content-Type":"application/pdf",
"Content-Disposition":`attachment; filename=room_receipt_${booking._id}.pdf`,
"Content-Length": pdfData.length
});

res.send(pdfData);

});



// Temple Logo
const logoPath = path.join(__dirname,"../public/images/logo.png");

try{
if(fs.existsSync(logoPath)){
doc.image(logoPath,250,40,{width:80});
}
}catch(e){
console.log("Logo load skipped");
}


// Header
doc.fontSize(22)
.fillColor("#8B3A1A")
.text("Bijasan Mata Mandir",120,50);

doc.fontSize(14)
.fillColor("black")
.text("Atithi Niwas Room Booking Receipt",120,80);


// Border box
doc.roundedRect(40,120,520,300,10).stroke();


// Booking Details
doc.fontSize(12).fillColor("black");

doc.text(`Booking ID : ${booking._id}`,70,150);
doc.text(`Name : ${booking.name}`,70,180);
doc.text(`Mobile : ${booking.mobile}`,70,210);
doc.text(`Room Type : ${booking.room_type}`,70,240);
doc.text(`Rooms : ${booking.rooms}`,70,270);
doc.text(`Guests : ${booking.guests}`,70,300);
doc.text(`Check-in Date : ${checkinDate}`,70,330);
doc.text(`Check-out Date : ${checkoutDate}`,70,360);


// Amount Highlight
doc.fontSize(16)
.fillColor("#8B3A1A")
.text(`Amount Paid : ₹${booking.amount}`,70,395);


// Payment ID
doc.fontSize(11)
.fillColor("black")
.text(`Payment ID : ${booking.payment_id}`,70,425);


// Footer
doc.fontSize(10)
.fillColor("gray")
.text(
"Thank you for choosing Atithi Niwas. May Maa Bijasan bless you and your family.",
70,
470,
{ width:450 }
);


doc.end();

}

catch(err){

console.error(err);
res.status(500).send("Error generating receipt");

}

});
// ROOM BOOKING CALENDAR DATA
router.get("/room-calendar", async (req, res) => {

try {

const bookings = await RoomBooking.find({}, "checkin checkout rooms room_type");

res.json(bookings);

}

catch(err){

console.error(err);

res.status(500).json({
error:"Failed to fetch calendar data"
});

}

});

module.exports = router;