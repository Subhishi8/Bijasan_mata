document.getElementById("loginForm")
.addEventListener("submit",(e)=>{

e.preventDefault()

const user=document.getElementById("username").value
const pass=document.getElementById("password").value

if(user==="admin" && pass==="bijasan123"){

localStorage.setItem("admin","true")

window.location="dashboard.html"

}
else{

alert("Invalid login")

}

})
