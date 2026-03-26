const express = require("express");
const crypto = require("crypto");
const Razorpay = require("razorpay");
const PDFDocument = require("pdfkit");
const nodemailer = require("nodemailer");
const QRCode = require("qrcode");
const router = express.Router();

const PoojaBooking = require("../models/PoojaBooking");

const razorpay = new Razorpay({
key_id: "rzp_test_SPCbLvwK99nQrc",
key_secret: "P6TdbaqyxpGCicnoYboTzsdT"
});


// CREATE PAYMENT ORDER
router.post("/pooja/create-order", async (req,res)=>{

try{

const {amount} = req.body;

const order = await razorpay.orders.create({

amount: amount * 100,
currency:"INR",
receipt:"pooja_booking"

});

res.json(order);

}catch(err){

console.log(err);
res.status(500).send("Order creation failed");

}

});


// VERIFY PAYMENT
router.post("/pooja/verify-payment", (req,res)=>{

const {

razorpay_order_id,
razorpay_payment_id,
razorpay_signature

} = req.body;

const sign = razorpay_order_id + "|" + razorpay_payment_id;

const expectedSign = crypto
.createHmac("sha256","P6TdbaqyxpGCicnoYboTzsdT")
.update(sign.toString())
.digest("hex");

if(expectedSign === razorpay_signature){

res.json({success:true});

}else{

res.json({success:false});

}

});


// BOOK POOJA + GENERATE RECEIPT + SEND EMAIL
router.post("/pooja/book", async (req,res)=>{

try{

const booking = new PoojaBooking(req.body);

await booking.save();


// EMAIL TRANSPORTER
const transporter = nodemailer.createTransport({
    host:"smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
}

});

// SEND EMAIL
await transporter.sendMail({

from:"Bijasan Mata Mandir",

to:booking.email,

subject:"Pooja Booking Confirmation",

html:`

<h3>Pooja Booking Confirmed</h3>

<p><b>Name:</b> ${booking.name}</p>

<p><b>Pooja:</b> ${booking.pooja_type}</p>

<p><b>Date:</b> ${new Date(booking.pooja_date).toLocaleDateString("en-IN")}</p>

<p><b>Time Slot:</b> ${booking.time_slot}</p>

<p><b>Mode:</b> ${booking.pooja_mode}</p>

<p><b>Amount:</b> ₹${booking.amount}</p>

`

});

// CREATE QR DATA
const qrData = JSON.stringify({
id: booking._id,
name: booking.name,
pooja: booking.pooja_type,
date: booking.pooja_date,
slot: booking.time_slot
});

// GENERATE QR IMAGE
const qrImage = await QRCode.toDataURL(qrData);


// CREATE PDF
const doc = new PDFDocument({margin:50});

res.setHeader("Content-Type","application/pdf");

res.setHeader(
"Content-Disposition",
'attachment; filename=pooja_receipt_${booking._id}.pdf'
);

doc.pipe(res);


// TEMPLE TITLE
doc.fontSize(22)
.text("Bijasan Mata Mandir",{align:"center"});

doc.moveDown();

doc.fontSize(14)
.text("Pooja Booking Pass",{align:"center"});

doc.moveDown();


// BOOKING DETAILS
doc.text(`Booking ID: ${booking._id}`);
doc.text(`Name: ${booking.name}`);
doc.text(`Mobile: ${booking.mobile}`);
doc.text(`Pooja: ${booking.pooja_type}`);

doc.text(`Date: ${new Date(booking.pooja_date)
.toLocaleDateString("en-IN")}`);

doc.text(`Time Slot: ${booking.time_slot}`);
doc.text(`Mode: ${booking.pooja_mode}`);

doc.text(`Amount Paid: ₹${booking.amount}`);
doc.text(`Payment ID: ${booking.payment_id}`);

doc.moveDown();


// ADD QR CODE
doc.image(qrImage,{
fit:[120,120],
align:"center"
});

doc.moveDown();

doc.fontSize(10)
.text(
"Please show this QR pass at the temple counter for verification.",
{align:"center"}
);

doc.end();

}catch(err){

console.log(err);
res.status(500).send("Receipt generation error");

}

});

module.exports = router;