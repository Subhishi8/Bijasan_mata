document.addEventListener("DOMContentLoaded", function () {

const calendarEl = document.getElementById("roomCalendar");

const calendar = new FullCalendar.Calendar(calendarEl, {

initialView: "dayGridMonth",

height: 600,

events: async function(fetchInfo, successCallback, failureCallback){

try {

const res = await fetch("/api/room-calendar");

const bookings = await res.json();

const events = bookings.map(b => {

return {
title: b.room_type + " Room Booked",
start: b.checkin,
end: b.checkout,
color: "#b65a00"
};

});

successCallback(events);

}

catch(err){

console.log(err);
failureCallback(err);

}

}

});

calendar.render();

});