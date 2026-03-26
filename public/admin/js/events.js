/* LOAD EVENTS */
const token = localStorage.getItem("adminToken");

if(!token){
  window.location.href = "/admin/login.html";
}
function loadEvents(){

fetch("/api/events")

.then(res=>res.json())

.then(data=>{

let html=""

data.forEach(e=>{

html += `

<tr>

<td>
<img src="${e.image_url}" width="80">
</td>

<td>${e.title}</td>

<td>${e.category}</td>

<td>${new Date(e.event_date).toLocaleDateString("en-IN")}</td>

<td>

<button
class="btn btn-danger btn-sm"
onclick="deleteEvent('${e._id}')">

Delete

</button>

</td>

</tr>

`

})

document.getElementById("eventTable").innerHTML = html

})

}

loadEvents()



/* ADD EVENT */

document.getElementById("eventForm").addEventListener("submit", async function(e){

e.preventDefault()

const formData = new FormData()

formData.append("title",
document.getElementById("title").value)

formData.append("category",
document.getElementById("category").value)

formData.append("description",
document.getElementById("description").value)

formData.append("event_date",
document.getElementById("event_date").value)

formData.append("event_image",
document.getElementById("event_image").files[0])

formData.append("event_flyer",
document.getElementById("event_flyer").files[0])


await fetch("/api/events",{

method:"POST",

body:formData

})

document.getElementById("eventForm").reset()

loadEvents()

})



/* DELETE EVENT */
async function deleteEvent(id){

if(!confirm("Are you sure you want to delete this event?")) return;

try{

await fetch(`/api/events/${id}`, {
method: "DELETE"
});

alert("Event deleted");

// reload page
location.reload();

}catch(err){

console.error(err);
alert("Error deleting event");

}

}
function logout(){
  localStorage.removeItem("adminToken");
  window.location.href = "/admin/login.html";
}