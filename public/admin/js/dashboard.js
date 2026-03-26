const token = localStorage.getItem("adminToken");

if(!token){
  window.location.href = "/admin/login.html";
}
fetch("/api/admin-stats")

.then(res=>res.json())

.then(data=>{

document.getElementById("donations").innerText = data.donations
document.getElementById("rooms").innerText = data.rooms
document.getElementById("meals").innerText = data.meals


/* SERVICE CHART */

new Chart(document.getElementById("serviceChart"),{

type:"pie",

data:{
labels:["Room Bookings","Annakshetra Meals"],
datasets:[{

data:[data.rooms,data.meals],

backgroundColor:[
"#e67e22",
"#27ae60"
]

}]

}

})


/* DONATION CHART */

fetch("/api/donations")

.then(res=>res.json())

.then(donations=>{

let purposes={}
    
donations.forEach(d=>{
    
if(!purposes[d.purpose]){
purposes[d.purpose]=0
}

purposes[d.purpose]+=Number(d.amount)

})

const labels = Object.keys(purposes)
const values = Object.values(purposes)

new Chart(document.getElementById("donationChart"),{

type:"bar",

data:{
labels:labels,

datasets:[{

label:"Donation Amount",

data:values,

backgroundColor:"#d97706"

}]

}

})

})

})
function logout(){
  localStorage.removeItem("adminToken");
  window.location.href = "/admin/login.html";
}