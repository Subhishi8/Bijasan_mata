const token = localStorage.getItem("adminToken");

if(!token){
  window.location.href = "/admin/login.html";
}

let mealData = []

fetch("/api/meals")

.then(res => res.json())

.then(data => {

mealData = data

renderMeals(data)

})


function renderMeals(data){

let html = ""
let total = 0

data.forEach(m => {

total += 1

html += `
<tr>
<td>${m.name}</td>
<td>${m.mobile}</td>
<td>${m.email}</td>
<td>${m.date}</td>
<td>${m.people}</td>
<td>${m.meal_time}</td>
<td>₹${m.amount}</td>
</tr>
`

})

document.getElementById("mealTable").innerHTML = html

document.getElementById("totalMeals").innerText = total

}


/* SEARCH */

document
.getElementById("searchMeals")
.addEventListener("keyup", function(){

let value = this.value.toLowerCase()

let filtered = mealData.filter(m =>
m.name.toLowerCase().includes(value) ||
m.mobile.includes(value)
)

renderMeals(filtered)

})
function logout(){
  localStorage.removeItem("adminToken");
  window.location.href = "/admin/login.html";
}