/* LOAD GALLERY */
const token = localStorage.getItem("adminToken");

if(!token){
  window.location.href = "/admin/login.html";
}
function loadGallery(){

fetch("/api/gallery")

.then(res=>res.json())

.then(data=>{

let html=""

data.forEach(img=>{

html += `
<div class="col-md-3 mb-4">

<div class="card">

<img src="${img.image_url}" class="card-img-top">

<div class="card-body text-center">

<p>${img.category}</p>

<button
class="btn btn-danger btn-sm"
onclick="deleteImage('${img._id}')">

Delete

</button>

</div>

</div>

</div>
`

})

document.getElementById("galleryContainer").innerHTML = html

})

}

loadGallery()


/* UPLOAD IMAGE */

document
.getElementById("galleryForm")
.addEventListener("submit", async function(e){

e.preventDefault()

const formData = new FormData()

formData.append("image",
document.getElementById("image").files[0])

formData.append("category",
document.getElementById("category").value)

await fetch("/api/gallery",{

method:"POST",

body:formData

})

document.getElementById("galleryForm").reset()

loadGallery()

})


/* DELETE IMAGE */

async function deleteImage(id){

await fetch("/api/gallery/"+id,{
method:"DELETE"
})

loadGallery()

}
function logout(){
  localStorage.removeItem("adminToken");
  window.location.href = "/admin/login.html";
}