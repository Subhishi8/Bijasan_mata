const mongoose = require("mongoose");

const mealSchema = new mongoose.Schema({

name: String,

mobile: String,

email: String,

date: String,

people: Number,

meal_time: String,

special_request: String,

amount: Number,

payment_status:{
type:String,
default:"Pending"
},

created_at:{
type:Date,
default:Date.now
}

});

module.exports = mongoose.model("MealBooking", mealSchema);