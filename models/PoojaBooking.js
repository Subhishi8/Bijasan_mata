const mongoose = require("mongoose");

const poojaSchema = new mongoose.Schema({

name: String,

mobile: String,

email: String,

pooja_type: String,

pooja_date: Date,
time_slot:String,
pooja_mode:String,
amount: Number,

payment_id: String,

created_at:{
type:Date,
default:Date.now
}

});

module.exports = mongoose.model("PoojaBooking", poojaSchema);