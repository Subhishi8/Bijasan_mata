// CHECK-IN / CHECK-OUT CALENDAR

const checkinPicker = flatpickr("#checkin", {

minDate: "today",

dateFormat: "Y-m-d",

onChange: function(selectedDates) {

checkoutPicker.set("minDate", selectedDates[0]);

calculatePrice();

}

});

const checkoutPicker = flatpickr("#checkout", {

minDate: "today",

dateFormat: "Y-m-d",

onChange: function() {

calculatePrice();

}

});



// PRICE CALCULATION

const roomType = document.getElementById("roomType");
const rooms = document.getElementById("rooms");
const checkin = document.getElementById("checkin");
const checkout = document.getElementById("checkout");
const amount = document.getElementById("amount");

function calculatePrice(){

const roomPrice = roomType.value === "AC" ? 800 : 400;

const start = new Date(checkin.value);
const end = new Date(checkout.value);

const nights = (end - start) / (1000 * 60 * 60 * 24);

if(nights > 0){

amount.value = nights * roomPrice * rooms.value;

}

}

roomType.addEventListener("change", calculatePrice);
rooms.addEventListener("input", calculatePrice);



// FORM SUBMIT

document.getElementById("roomForm")
.addEventListener("submit", async function(e){

e.preventDefault();

const name = document.getElementById("name").value;
const mobile = document.getElementById("mobile").value;
const email = document.getElementById("email").value;

const room_type = document.getElementById("roomType").value;
const roomsCount = document.getElementById("rooms").value;
const guests = document.getElementById("guests").value;

const checkinDate = document.getElementById("checkin").value;
const checkoutDate = document.getElementById("checkout").value;

const totalAmount = document.getElementById("amount").value;



// DATE VALIDATION

const checkinObj = new Date(checkinDate);
const checkoutObj = new Date(checkoutDate);

if(checkoutObj <= checkinObj){

alert("Checkout date must be after check-in date");

return;

}



try{



const availability = await fetch("/api/check-room",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body: JSON.stringify({

checkin:checkinDate,
checkout:checkoutDate,
room_type

})

});

const availabilityData = await availability.json();

if(availabilityData.available < roomsCount){

alert("Not enough rooms available for selected dates");

return;

}



// CREATE RAZORPAY ORDER

const orderRes = await fetch("/api/payment/create-order",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body: JSON.stringify({

amount: totalAmount

})

});

const order = await orderRes.json();



// RAZORPAY OPTIONS

const options = {

key:"rzp_test_SPCbLvwK99nQrc",

amount:order.amount,

currency:"INR",

name:"Bijasan Mata Mandir",

description:"Atithi Niwas Room Booking",

order_id:order.id,


handler: async function (responsePayment){

try{


// VERIFY PAYMENT

const verify = await fetch("/api/payment/verify-payment",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body: JSON.stringify({

razorpay_order_id:responsePayment.razorpay_order_id,
razorpay_payment_id:responsePayment.razorpay_payment_id,
razorpay_signature:responsePayment.razorpay_signature

})

});

const verifyData = await verify.json();


if(verifyData.success){

// SAVE BOOKING

const bookingRes = await fetch("/api/book-room",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body: JSON.stringify({

name,
mobile,
email,
room_type,
rooms:roomsCount,
guests,
checkin:checkinDate,
checkout:checkoutDate,
amount:totalAmount,
payment_status:"Paid",
payment_id:responsePayment.razorpay_payment_id

})

});

const bookingData = await bookingRes.json();



// DOWNLOAD RECEIPT

window.open(`/api/room-receipt/${bookingData.bookingId}`,"_blank");


alert("Room booking successful. Receipt downloaded.");

document.getElementById("roomForm").reset();

}

else{

alert("Payment verification failed");

}

}

catch(err){

console.error(err);

alert("Booking failed");

}

},

prefill:{

name:name,
contact:mobile,
email:email

},

theme:{
color:"#8B3A1A"
}

};



const rzp = new Razorpay(options);

rzp.open();

}

catch(err){

console.error(err);

alert("Payment initiation failed");

}

});