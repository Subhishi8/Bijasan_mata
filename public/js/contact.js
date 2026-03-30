document.getElementById("contactForm").addEventListener("submit", async function(e){
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const mobile = document.getElementById("mobile").value;
  const message = document.getElementById("message").value;

  // ✅ MOBILE VALIDATION
  const mobileRegex = /^[6-9]\d{9}$/;

  if (!mobileRegex.test(mobile)) {
    alert("Enter valid 10-digit mobile number ❌");
    return;
  }

  const data = { name, email, mobile, message };

  try {
    const res = await fetch("/api/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const result = await res.json();

    if (result.success) {
      alert("Message Sent Successfully ✅");

      // ✅ RESET FORM
      document.getElementById("contactForm").reset();

    } else {
      alert("Failed to send message ❌");
    }

  } catch (err) {
    console.error(err);
    alert("Server error ❌");
  }
});