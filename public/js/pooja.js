function openBooking(type,price){

document.getElementById("poojaTitle").innerText = type;

document.getElementById("poojaAmount").value = price;
document.getElementById("amount").value = price;
document.getElementById("bookingModal").style.display = "flex";

}
document
.getElementById("poojaForm")
.addEventListener("submit",async function(e){

e.preventDefault();

const amount = document.getElementById("amount").value;

const res = await fetch("/api/pooja/create-order",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({amount})

});

const order = await res.json();

const options = {

key:"rzp_test_SPCbLvwK99nQrc",

amount:order.amount,

currency:"INR",

name:"Bijasan Mata Mandir",

description:"Pooja Booking",

order_id:order.id,

handler: async function(response){

const bookingRes = await fetch("/api/pooja/book",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

name:document.getElementById("name").value,

mobile:document.getElementById("mobile").value,

email:document.getElementById("email").value,

pooja_type:document.getElementById("poojaTitle").innerText,

pooja_date:document.getElementById("date").value,

time_slot:document.getElementById("timeSlot").value,

pooja_mode:document.querySelector(
'input[name="mode"]:checked'
).value,

amount:amount,

payment_id:response.razorpay_payment_id

})

});

const blob = await bookingRes.blob();

const url = window.URL.createObjectURL(blob);

const a = document.createElement("a");

a.href = url;

a.download = "pooja_receipt.pdf";

document.body.appendChild(a);

a.click();

a.remove();


/* RESET FORM */

document.getElementById("poojaForm").reset();

/* CLOSE MODAL */

document.getElementById("bookingModal").style.display="none";


alert("Pooja booked successfully. Receipt downloaded.");

}

};

const rzp = new Razorpay(options);

rzp.open();

});