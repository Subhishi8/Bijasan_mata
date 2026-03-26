const token = localStorage.getItem("adminToken");

if(!token){
  window.location.href = "/admin/login.html";
}

async function loadPoojas(){

const res = await fetch("/api/poojas");

const data = await res.json();

let html = "";

data.forEach(p=>{

html += `
<tr>

<td>${p.name}</td>

<td>${p.mobile}</td>

<td>${p.pooja_type}</td>

<td>${p.pooja_date ? new Date(p.pooja_date).toLocaleDateString("en-IN") : "-"}</td>

<td>${p.time_slot || "-"}</td>

<td>${p.pooja_mode || "-"}</td>

<td>₹${p.amount}</td>

<td>${p.payment_id}</td>

</tr>
`;

});

document.getElementById("poojaTable").innerHTML = html;

}


// LOAD TOTAL BOOKINGS CARD
async function loadTotalPoojas(){

const res = await fetch("/api/poojas");

const data = await res.json();

// show total bookings in card
document.getElementById("totalPoojas").innerText = data.length;

}


// LOAD DATA
loadPoojas();
loadTotalPoojas();


// SEARCH FUNCTION

document.getElementById("search")
.addEventListener("keyup", function(){

const value = this.value.toLowerCase();

const rows = document.querySelectorAll("#poojaTable tr");

rows.forEach(row=>{

row.style.display =
row.innerText.toLowerCase().includes(value)
? ""
: "none";

});

});
function logout(){
  localStorage.removeItem("adminToken");
  window.location.href = "/admin/login.html";
}