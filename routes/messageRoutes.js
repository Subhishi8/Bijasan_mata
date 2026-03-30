const express = require("express");
const router = express.Router();
const Message = require("../models/message");
const nodemailer = require("nodemailer");


// ===============================
// USER: SAVE CONTACT MESSAGE
// ===============================
router.post("/messages", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const newMessage = new Message({
      name,
      email,
      message,
      status: "unread"
    });

    await newMessage.save();

    res.json({
      success: true,
      message: "Message saved successfully"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error saving message"
    });
  }
});


// ===============================
// ADMIN: GET ALL MESSAGES
// ===============================
router.get("/admin/messages", async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching messages" });
  }
});


// ===============================
// ADMIN: REPLY TO MESSAGE
// ===============================
router.post("/admin/reply-message", async (req, res) => {
  try {
    const { email, reply } = req.body;

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Response from Bijasan Mata Mandir",
      html: `
        <h3>🙏 Bijasan Mata Mandir</h3>
        <p>${reply}</p>
      `
    });

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});


// ===============================
// ADMIN: MARK AS READ
// ===============================
router.put("/admin/message-read/:id", async (req, res) => {
  await Message.findByIdAndUpdate(req.params.id, {
    status: "read"
  });

  res.json({ success: true });
});


// ===============================
// ADMIN: DELETE MESSAGE
// ===============================
router.delete("/admin/message/:id", async (req, res) => {
  await Message.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router;