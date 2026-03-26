const token = localStorage.getItem("adminToken");

if(!token){
  window.location.href = "/admin/login.html";
}

let roomData = []

fetch("/api/rooms")

.then(res => res.json())

.then(data => {

roomData = data

renderRooms(data)

})


function renderRooms(data){

let html = ""
let total = 0

data.forEach(r => {

total += 1

html += `
<tr>
<td>${r.name}</td>
<td>${r.mobile}</td>
<td>${r.room_type}</td>
<td>${r.rooms}</td>
<td>${r.guests}</td>
<td>${new Date(r.checkin).toLocaleDateString("en-IN")}</td>
<td>${new Date(r.checkout).toLocaleDateString("en-IN")}</td>
<td>₹${r.amount}</td>
</tr>
`

})

document.getElementById("roomTable").innerHTML = html

document.getElementById("totalRooms").innerText = total

}


/* SEARCH */

document
.getElementById("searchRooms")
.addEventListener("keyup", function(){

let value = this.value.toLowerCase()

let filtered = roomData.filter(r =>
r.name.toLowerCase().includes(value) ||
r.mobile.includes(value)
)

renderRooms(filtered)

})
document
.getElementById("checkRoomBtn")
.addEventListener("click", async function(){

const checkin = document.getElementById("checkinDate").value
const checkout = document.getElementById("checkoutDate").value
const room_type = document.getElementById("roomType").value

if(!checkin || !checkout){

alert("Please select both dates")

return

}

const res = await fetch("/api/check-room",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body: JSON.stringify({
checkin,
checkout,
room_type
})

})
/* ROOM OCCUPANCY CALENDAR */

fetch("/api/room-occupancy")

.then(res => res.json())

.then(data => {

let html = ""

Object.keys(data).forEach(date => {

html += `
<tr>
<td>${new Date(date).toLocaleDateString("en-IN")}</td>
<td>${data[date]["AC"]}</td>
<td>${data[date]["Non-AC"]}</td>
</tr>
`

})

document.getElementById("roomCalendar").innerHTML = html

})
const data = await res.json()

document.getElementById("roomResult").innerText =
"Available Rooms: " + data.available

})
document.addEventListener("DOMContentLoaded", function(){

const calendarEl = document.getElementById("bookingCalendar")

const calendar = new FullCalendar.Calendar(calendarEl, {

initialView: "dayGridMonth",

height: 650,

events: "/api/room-calendar"

})

calendar.render()

})
function logout(){
  localStorage.removeItem("adminToken");
  window.location.href = "/admin/login.html";
}