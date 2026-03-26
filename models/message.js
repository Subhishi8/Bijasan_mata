const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({

  name: String,
  mobile: String,
  email: String,
  message: String,
  status:{
    type: String,
    default:"unread"
  },
  created_at: {
    type: Date,
    default: Date.now
  }},
{
    timestamps:true
}
);

module.exports = mongoose.model("Message", messageSchema);