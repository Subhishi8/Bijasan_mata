document
.getElementById("loginForm")
.addEventListener("submit",async(e)=>{

e.preventDefault();

const username = document.getElementById("username").value;
const password = document.getElementById("password").value;

const res = await fetch("/api/admin/login",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({username,password})

});

const data = await res.json();

if(data.token){

localStorage.setItem("adminToken",data.token);

window.location.href="/admin/dashboard.html";

}else{

alert("Invalid login");

}

});