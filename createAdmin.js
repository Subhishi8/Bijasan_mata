require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Admin = require("./models/Admin");

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("Mongo connected"))
.catch(err=>console.log(err));

async function createAdmin(){

const hashedPassword = await bcrypt.hash("admin123",10);

const admin = new Admin({
username:"admin",
password:hashedPassword
});

await admin.save();

console.log("Admin created");

process.exit();

}

createAdmin();