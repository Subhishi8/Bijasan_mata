async function loadEvents() {

try {

const res = await fetch("/api/events");

const events = await res.json();

const categories = {};

// group by category
events.forEach(e => {

if(!categories[e.category]){
categories[e.category] = [];
}

categories[e.category].push(e);

});

let html = "";

// render category-wise
Object.keys(categories).forEach(cat => {

html += `
<h3 class="category-title">${cat}</h3>
<div class="row">
`;

categories[cat].forEach(e => {

html += `
<div class="col-md-4 mb-4">

<div class="event-card">

<img src="${e.event_image}" class="event-img">

<div class="p-3">

<h5>${e.title}</h5>

<p>${e.description || ""}</p>

<p><b>Date:</b>
${new Date(e.event_date).toLocaleDateString("en-IN")}
</p>

${e.event_flyer ? `
<a href="${e.event_flyer}" target="_blank"
class="btn btn-outline-primary">
View Flyer
</a>
` : ""}

</div>

</div>

</div>
`;

});

html += '</div>';

});

document.getElementById("eventsContainer").innerHTML = html;

}

catch(err){

console.error("Error loading events:", err);

}

}

loadEvents();