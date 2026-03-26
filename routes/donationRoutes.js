const express = require("express");
const crypto = require("crypto");
const PDFDocument = require("pdfkit");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

const Donation = require("../models/Donation");

const router = express.Router();


// VERIFY RAZORPAY PAYMENT
router.post("/verify-donation-payment", (req, res) => {

try {

const {
razorpay_order_id,
razorpay_payment_id,
razorpay_signature
} = req.body;

const body = razorpay_order_id + "|" + razorpay_payment_id;

const expectedSignature = crypto
.createHmac("sha256", "P6TdbaqyxpGCicnoYboTzsdT")
.update(body)
.digest("hex");

if (expectedSignature === razorpay_signature) {

return res.json({
success: true,
message: "Payment verified successfully"
});

}

return res.status(400).json({
success: false,
message: "Invalid payment signature"
});

}

catch (err) {

console.error(err);

res.status(500).json({
success: false,
message: "Verification failed"
});

}

});


// SAVE DONATION + GENERATE RECEIPT + EMAIL + DOWNLOAD
router.post("/donation", async (req, res) => {

try {

const donation = new Donation({

name: req.body.name,
mobile: req.body.mobile,
email: req.body.email,
purpose: req.body.purpose,
amount: req.body.amount,
payment_id: req.body.payment_id

});

await donation.save();


// Create receipts folder
const receiptDir = path.join(__dirname, "../receipts");

if (!fs.existsSync(receiptDir)) {
fs.mkdirSync(receiptDir);
}

const receiptPath = path.join(
receiptDir,
`donation_receipt_${donation._id}.pdf`
);


// CREATE PDF
const doc = new PDFDocument({ margin: 50 });

const stream = fs.createWriteStream(receiptPath);

doc.pipe(stream);


// Temple Logo
const logoPath = path.join(__dirname, "../public/images/logo.png");

try{
if(fs.existsSync(logoPath)){
doc.image(logoPath,250,40,{width:80});
}
}catch(e){
console.log("Logo load skipped");
}


// Temple Header
doc
.fontSize(20)
.fillColor("#8B3A1A")
.text("Bijasan Mata Mandir", 140, 50);

doc
.fontSize(10)
.fillColor("black")
.text("Sendhwa, Madhya Pradesh", 140, 75);

doc.moveDown(3);


// Title
doc
.fontSize(18)
.fillColor("#8B3A1A")
.text("DONATION RECEIPT", { align: "center" });

doc.moveDown(2);


// Border
doc.rect(50, 150, 500, 250).stroke();


// Donation Details
doc.fontSize(12);

doc.text(`Receipt ID: ${donation._id}`, 70, 180);
doc.text(`Date: ${new Date().toLocaleString()}`, 350, 180);

doc.text(`Donor Name: ${donation.name}`, 70, 210);
doc.text(`Mobile: ${donation.mobile}`, 350, 210);

doc.text(`Email: ${donation.email}`, 70, 240);
doc.text(`Purpose: ${donation.purpose}`, 350, 240);

doc
.fontSize(14)
.fillColor("#8B3A1A")
.text(`Amount Donated: ₹${donation.amount}`, 70, 280);

doc
.fontSize(12)
.fillColor("black")
.text(`Payment ID: ${donation.payment_id}`, 70, 310);


// Message
doc
.fontSize(12)
.text(
"Thank you for your generous contribution. May Maa Bijasan bless you and your family.",
70,
340,
{ width: 450 }
);


// Signature
doc.text("Authorized Signatory", 380, 420);
doc.moveTo(360, 410).lineTo(520, 410).stroke();


// Footer
doc
.fontSize(10)
.text(
"This receipt is electronically generated and does not require a physical signature.",
50,
470,
{ align: "center" }
);


// Finish PDF writing
doc.end();


// WAIT UNTIL PDF FINISHES WRITING
stream.on("finish", async () => {

try {

// SEND EMAIL
const transporter = nodemailer.createTransport({
    host:"smtp.sendgrid.net",
    port: 587,
    secure: false,
    auth: {
        user: "apikey",
        pass: process.env.SENDGRID_API_KEY
}

});


await transporter.sendMail({

from: `Bijasan Mata Mandir <subhishisingh8504@gmail.com>`,

to: donation.email,

subject: "Donation Receipt - Bijasan Mata Mandir",

html: `
<h2>Thank you for your donation</h2>

<p>Dear ${donation.name},</p>

<p>Your contribution helps maintain the temple and support Annakshetra services.</p>

<p><strong>Donation Amount:</strong> ₹${donation.amount}</p>

<p>Please find your official receipt attached.</p>

<p>May Maa Bijasan bless you and your family.</p>
`,

attachments: [
{
filename: `donation_receipt_${donation._id}.pdf`,
path: receiptPath
}
]

});

}

catch(err){

console.error("Email sending failed:", err);

}


// DOWNLOAD PDF TO BROWSER
res.setHeader("Content-Type", "application/pdf");

res.download(receiptPath);

});

}

catch (err) {

console.error(err);

res.status(500).json({
success: false,
message: "Error saving donation or generating receipt"
});

}

});

module.exports = router;
