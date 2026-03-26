function loadGallery(){

fetch("/api/gallery")

.then(res=>res.json())

.then(data=>{

const categories = {}

data.forEach(img=>{

if(!categories[img.category]){

categories[img.category]=[]

}

categories[img.category].push(img)

})

let html=""

Object.keys(categories).forEach(cat=>{

html += `
<h3 class="category-title">${cat}</h3>

<div class="masonry">
`

categories[cat].forEach(img=>{

html += `
<img
src="${img.image_url}"
class="gallery-img"
onclick="openLightbox('${img.image_url}')"
>
`

})

html += '</div>'

})

document.getElementById("galleryContainer").innerHTML = html

})

}

loadGallery()


function openLightbox(src){

document.getElementById("lightbox-img").src = src
document.getElementById("lightbox").style.display="flex"

}

function closeLightbox(){

document.getElementById("lightbox").style.display="none"

}