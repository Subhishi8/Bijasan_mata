document.getElementById("contactForm").addEventListener("submit", async function(e){
e.preventDefault();
const data = {
name: document.getElementById("name").value,
email: document.getElementById("email").value,
mobile: document.getElementById("mobile").value,
message: document.getElementById("message").value
};
await fetch("/api/contact",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify(data)
});
alert("Message Sent Successfully");
});