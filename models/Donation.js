const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema({

name:String,
mobile:String,
email:String,
purpose:String,
amount:Number,
payment_id:String,
date:{
type:Date,
default:Date.now
}},
{
    timestamps:true
}
);

module.exports = mongoose.model("Donation", donationSchema);