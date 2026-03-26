const express = require("express");
const router = express.Router();
const XLSX = require("xlsx")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

router.post("/admin/login", async(req,res)=>{

const {username,password} = req.body;

const admin = await Admin.findOne({username});

if(!admin){
return res.status(401).json({message:"Invalid username"});
}

const match = await bcrypt.compare(password, admin.password);

if(!match){
return res.status(401).json({message:"Invalid password"});
}

const token = jwt.sign(
{adminId:admin._id},
process.env.JWT_SECRET,
{expiresIn:"1d"}
);

res.json({token});

});
// Import Models
const Donation = require("../models/Donation");
const RoomBooking = require("../models/roomBooking");
const MealBooking = require("../models/MealBooking");


/*
-----------------------------------------
ADMIN DASHBOARD STATS
-----------------------------------------
*/

router.get("/admin-stats", async (req, res) => {

try {

const donations = await Donation.countDocuments();
const rooms = await RoomBooking.countDocuments();
const meals = await MealBooking.countDocuments();

res.json({
donations,
rooms,
meals
});

} catch (err) {

console.error(err);

res.status(500).json({
message: "Error fetching admin stats"
});

}

});


/*
-----------------------------------------
GET ALL DONATIONS
-----------------------------------------
*/

router.get("/donations", async (req, res) => {

try {

const donations = await Donation
.find()
.sort({ createdAt: -1 });

res.json(donations);

} catch (err) {

console.error(err);

res.status(500).json({
message: "Error fetching donations"
});

}

});
router.get("/export-donations", async (req,res)=>{

const donations = await Donation.find().lean();

const worksheet = XLSX.utils.json_to_sheet(donations);

const workbook = XLSX.utils.book_new();

XLSX.utils.book_append_sheet(workbook, worksheet, "Donations");

const filePath = "./donations_report.xlsx";

XLSX.writeFile(workbook,filePath);

res.download(filePath);

});

/*
-----------------------------------------
GET ALL ROOM BOOKINGS
-----------------------------------------
*/

router.get("/rooms", async (req, res) => {

try {

const rooms = await RoomBooking
.find()
.sort({ createdAt: -1 });

res.json(rooms);

} catch (err) {

console.error(err);

res.status(500).json({
message: "Error fetching room bookings"
});

}

});
router.get("/export-rooms", async (req,res)=>{

const rooms = await RoomBooking.find().lean();

const worksheet = XLSX.utils.json_to_sheet(rooms);

const workbook = XLSX.utils.book_new();

XLSX.utils.book_append_sheet(workbook, worksheet, "Rooms");

const filePath = "./rooms_report.xlsx";

XLSX.writeFile(workbook,filePath);

res.download(filePath);

});

/*
-----------------------------------------
GET ALL MEAL BOOKINGS
-----------------------------------------
*/

router.get("/meals", async (req, res) => {

try {

const meals = await MealBooking
.find()
.sort({ createdAt: -1 });

res.json(meals);

} catch (err) {

console.error(err);

res.status(500).json({
message: "Error fetching meal bookings"
});

}

});
// ROOM OCCUPANCY CALENDAR DATA

router.get("/room-occupancy", async (req, res) => {

try {

const bookings = await RoomBooking.find()

let calendar = {}

bookings.forEach(b => {

let start = new Date(b.checkin)
let end = new Date(b.checkout)

for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {

let date = d.toISOString().split("T")[0]

if (!calendar[date]) {
calendar[date] = { AC: 0, "Non-AC": 0 }
}

calendar[date][b.room_type] += b.rooms

}

})

res.json(calendar)

}

catch(err){

console.log(err)

res.status(500).json({ message:"Error generating calendar" })

}

})
// ROOM CALENDAR EVENTS

router.get("/room-calendar", async (req,res)=>{

try{

const bookings = await RoomBooking.find()

const events = bookings.map(b=>({

title: '${b.name} (${b.rooms} ${b.room_type})',

start: b.checkin,

end: b.checkout

}))

res.json(events)

}

catch(err){

console.log(err)

res.status(500).json({message:"Calendar error"})

}

})
router.get("/export-meals", async (req,res)=>{

const meals = await MealBooking.find().lean();

const worksheet = XLSX.utils.json_to_sheet(meals);

const workbook = XLSX.utils.book_new();

XLSX.utils.book_append_sheet(workbook, worksheet, "Meals");

const filePath = "./meals_report.xlsx";

XLSX.writeFile(workbook,filePath);

res.download(filePath);

});
const PoojaBooking = require("../models/PoojaBooking");

router.get("/poojas", async (req,res)=>{

try{

const data = await PoojaBooking.find().sort({created_at:-1});

res.json(data);

}catch(err){

console.log(err);

res.status(500).json({message:"Error fetching pooja bookings"});

}

});
module.exports = router;