document.getElementById("signinForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const fullName = document.getElementById("fullName").value.trim();
  const email = document.getElementById("email").value.trim().toLowerCase();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const message = document.getElementById("message");

  message.textContent = "";

  if (!fullName || !email || !password || !confirmPassword) {
    message.textContent = "Please fill all fields";
    message.style.color = "red";
    return;
  }

  if (password !== confirmPassword) {
    message.textContent = "Passwords do not match";
    message.style.color = "red";
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, email, password })
    });

    const data = await res.text();

    message.textContent = data;
    message.style.color = "green";

    setTimeout(() => {
      window.location.href = "login.html";
    }, 1200);

  } catch (err) {
    message.textContent = "Server not running";
    message.style.color = "red";
  }
});
