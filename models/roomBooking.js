const mongoose = require("mongoose");

const roomBookingSchema = new mongoose.Schema({

name:String,
mobile:String,
email:String,

checkin:Date,
checkout:Date,

room_type:String,
rooms:Number,
guests:Number,

amount:Number,

payment_status:String,
payment_id:String

},{timestamps:true});

module.exports = mongoose.model("roomBooking",roomBookingSchema);