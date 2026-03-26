const token = localStorage.getItem("adminToken");

if(!token){
  window.location.href = "/admin/login.html";
}
let donationData = [];

fetch("/api/donations")

.then(res => res.json())

.then(data => {

donationData = data;

renderTable(data);

})

.catch(err => console.error(err));



function renderTable(data){

let html = "";
let total = 0;

data.forEach(d => {

total += Number(d.amount);

html += `
<tr>
<td>${d.name || "-"}</td>
<td>${d.mobile || "-"}</td>
<td>${d.email || "-"}</td>
<td>${d.purpose || "-"}</td>
<td>₹${d.amount}</td>
<td>${d.createdAt ? new Date(d.createdAt).toLocaleDateString() : "-"}</td>
<td>${d.payment_id || "-"}</td>

</tr>
`;

});

document.getElementById("donationTable").innerHTML = html;

document.getElementById("totalDonation").innerText = "₹ " + total;

}



/* SEARCH FUNCTION */

document.getElementById("searchDonation").addEventListener("keyup", function(){

let value = this.value.toLowerCase();

let filtered = donationData.filter(d =>
(d.name && d.name.toLowerCase().includes(value)) ||
(d.mobile && d.mobile.includes(value)) ||
(d.email && d.email.toLowerCase().includes(value))
);

renderTable(filtered);

});
function logout(){
  localStorage.removeItem("adminToken");
  window.location.href = "/admin/login.html";
}