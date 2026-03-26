document.getElementById("donationForm")
.addEventListener("submit", async function(e){

e.preventDefault();

// form values
const name = document.getElementById("donorName").value;
const mobile = document.getElementById("donorMobile").value;
const email = document.getElementById("donorEmail").value;
const purpose = document.getElementById("donationPurpose").value;
const amount = document.getElementById("donationAmount").value;

try{

// create razorpay order
const res = await fetch("/api/payment/create-order", {

method: "POST",

headers: {
"Content-Type": "application/json"
},

body: JSON.stringify({ amount })

});

const order = await res.json();


// Razorpay payment options
const options = {

key: "rzp_test_SPCbLvwK99nQrc",

amount: order.amount,

currency: "INR",

name: "Bijasan Mata Mandir",

description: "Temple Donation",

order_id: order.id,

handler: async function (responsePayment) {

try{

// verify payment
const verify = await fetch("/api/verify-donation-payment", {

method: "POST",

headers: {
"Content-Type": "application/json"
},

body: JSON.stringify({

razorpay_order_id: responsePayment.razorpay_order_id,
razorpay_payment_id: responsePayment.razorpay_payment_id,
razorpay_signature: responsePayment.razorpay_signature

})

});

const verifyData = await verify.json();

if(verifyData.success){

// save donation + generate receipt
const receiptResponse = await fetch("/api/donation", {

method:"POST",

headers:{
"Content-Type":"application/json"
},

body: JSON.stringify({

name,
mobile,
email,
purpose,
amount,
payment_id: responsePayment.razorpay_payment_id

})

});


// receive PDF receipt
const blob = await receiptResponse.blob();

const url = window.URL.createObjectURL(blob);

const a = document.createElement("a");

a.href = url;
a.download = "donation_receipt.pdf";

document.body.appendChild(a);

a.click();

a.remove();


// clear form
document.getElementById("donationForm").reset();


// show success message
document.getElementById("donationSuccess").style.display = "block";

}

else{

alert("Payment verification failed");

}

}

catch(err){

console.error(err);
alert("Error verifying payment");

}

},

prefill: {

name: name,

contact: mobile,

email: email

},

theme: {
color: "#b65a00"
},

modal: {

ondismiss: function(){
alert("Payment cancelled");
}

}

};

const rzp = new Razorpay(options);

rzp.open();

}

catch(err){

console.error(err);
alert("Payment initialization failed");

}

});