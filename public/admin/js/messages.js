const token = localStorage.getItem("adminToken");

if(!token){
  window.location.href = "/admin/login.html";
}


let currentEmail = "";

// LOAD MESSAGES
async function loadMessages(){

const res = await fetch("/api/admin/messages");
const data = await res.json();

let html = "";

data.forEach(m => {

html += `
<tr>

<td>${m.name}</td>

<td>${m.email}</td>

<td>${m.message}</td>

<td>
<span class="badge ${m.status === "read" ? "bg-success" : "bg-warning"}">
${m.status}
</span>
</td>

<td>

<button class="btn btn-sm btn-primary"
onclick="openReply('${m.email}')">
Reply
</button>

<button class="btn btn-sm btn-success"
onclick="markRead('${m._id}')">
Mark Read
</button>

<button class="btn btn-sm btn-danger"
onclick="deleteMessage('${m._id}')">
Delete
</button>

</td>

</tr>
`;

});

document.getElementById("messageTable").innerHTML = html;

}

loadMessages();


// OPEN REPLY MODAL
function openReply(email){

currentEmail = email;

new bootstrap.Modal(document.getElementById("replyModal")).show();

}


// SEND REPLY
async function sendReply(){

const reply = document.getElementById("replyText").value;

await fetch("/api/admin/reply-message", {

method: "POST",

headers: {
"Content-Type": "application/json"
},

body: JSON.stringify({
email: currentEmail,
reply
})

});

alert("Reply sent successfully");

location.reload();

}


// MARK READ
async function markRead(id){

await fetch(`/api/admin/message-read/${id}`, {
method: "PUT"
});

loadMessages();

}


// DELETE MESSAGE
async function deleteMessage(id){

if(!confirm("Delete this message?")) return;

await fetch(`/api/admin/message/${id}`, {
method: "DELETE"
});

loadMessages();

}


// SEARCH
document.getElementById("search")
.addEventListener("keyup", function(){

const value = this.value.toLowerCase();

const rows = document.querySelectorAll("#messageTable tr");

rows.forEach(row => {

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