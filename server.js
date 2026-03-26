const express = require("express");
const connectDB = require("./config/db");
require("dotenv").config();

const app = express();

// connect database
connectDB();

app.use(express.json());
app.use(express.static("public"));



const PORT = 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

const donationRoutes = require("./routes/donationRoutes");
app.use("/api", donationRoutes);

const poojaRoutes = require("./routes/poojaRoutes");
app.use("/api", poojaRoutes);
app.use("/uploads", express.static("uploads"));
const eventRoutes = require("./routes/eventRoutes");
app.use("/api", eventRoutes);

const galleryRoutes = require("./routes/galleryRoutes");
app.use("/api", galleryRoutes);

const messageRoutes = require("./routes/messageRoutes");
app.use("/api", messageRoutes);

const timingRoutes = require("./routes/timingRoutes");
app.use("/api", timingRoutes);

const mealRoutes = require("./routes/mealRoutes");
app.use("/api", mealRoutes);

const adminRoutes = require("./routes/adminRoutes");
app.use("/api", adminRoutes);

const paymentRoutes = require("./routes/paymentRoutes");
app.use("/api/payment", paymentRoutes);

const roomRoutes = require("./routes/roomRoutes")
app.use("/api", roomRoutes)