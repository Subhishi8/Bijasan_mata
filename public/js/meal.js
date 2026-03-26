// price auto calculation
const peopleInput = document.getElementById("people");
const totalAmountInput = document.getElementById("totalAmount");

peopleInput.addEventListener("input",()=>{

const pricePerMeal = 20;

const people = peopleInput.value || 0;

totalAmountInput.value = people * pricePerMeal;

});



// submit form
document.getElementById("mealForm")
.addEventListener("submit", async function(e){

e.preventDefault();

const name = document.getElementById("name").value;
const mobile = document.getElementById("mobile").value;
const email = document.getElementById("email").value;
const date = document.getElementById("date").value;
const people = document.getElementById("people").value;
const mealTime = document.getElementById("mealTime").value;
const request = document.getElementById("request").value;
const amount = document.getElementById("totalAmount").value;

try{

// create Razorpay order
const res = await fetch("/api/payment/create-order",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body: JSON.stringify({amount})

});

const order = await res.json();


// Razorpay
const options = {

key:"rzp_test_SPCbLvwK99nQrc",

amount:order.amount,

currency:"INR",

name:"Bijasan Mata Mandir",

description:"Annakshetra Meal Booking",

order_id:order.id,


handler: async function(responsePayment){

try{

// verify payment
const verify = await fetch("/api/payment/verify-payment",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body: JSON.stringify({

razorpay_order_id: responsePayment.razorpay_order_id,
razorpay_payment_id: responsePayment.razorpay_payment_id,
razorpay_signature: responsePayment.razorpay_signature

})

});

const verifyData = await verify.json();

if(verifyData.success){

// save booking
const bookingRes = await fetch("/api/book-meal",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body: JSON.stringify({

name,
mobile,
email,
date,
people,
meal_time: mealTime,
special_request: request,
amount,
payment_status:"Paid",
payment_id: responsePayment.razorpay_payment_id

})

});

const bookingData = await bookingRes.json();


// download token
window.open(`/api/meal-token/${bookingData.bookingId}`,"_blank");


// reset form
document.getElementById("mealForm").reset();

alert("Meal booking successful. Token downloaded.");

}

else{

alert("Payment verification failed");

}

}

catch(err){

console.error(err);

alert("Token generation failed");

}

},

prefill:{
name:name,
contact:mobile,
email:email
},

theme:{
color:"#b65a00"
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