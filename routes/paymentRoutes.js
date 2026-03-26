const express = require("express");
const Razorpay = require("razorpay");

const router = express.Router();

const razorpay = new Razorpay({
key_id: "rzp_test_SPCbLvwK99nQrc",
key_secret: "P6TdbaqyxpGCicnoYboTzsdT"
});

router.post("/create-order", async (req, res) => {

const { amount } = req.body;

const options = {
amount: amount * 100, // paise
currency: "INR",
receipt: "meal_booking"
};

try {

const order = await razorpay.orders.create(options);

res.json(order);

} catch (error) {

res.status(500).send(error);

}

});

module.exports = router;
const crypto = require("crypto");

router.post("/verify-payment", (req, res) => {

const {
razorpay_order_id,
razorpay_payment_id,
razorpay_signature
} = req.body;

const sign = razorpay_order_id + "|" + razorpay_payment_id;

const expectedSign = crypto
.createHmac("sha256", "P6TdbaqyxpGCicnoYboTzsdT")
.update(sign.toString())
.digest("hex");

if (expectedSign === razorpay_signature) {

res.json({
success: true,
message: "Payment verified successfully"
});

} else {

res.status(400).json({
success: false,
message: "Invalid payment signature"
});

}

});