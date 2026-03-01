document.getElementById("loginForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim().toLowerCase();
  const password = document.getElementById("password").value;
  const error = document.getElementById("error");

  error.textContent = "";

  try {
    const res = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.text();

    if (data === "Login success") {
      window.location.href = "home.html";
    } else {
      error.textContent = "Invalid email or password";
      error.style.color = "red";
    }

  } catch (err) {
    error.textContent = "Server not running";
    error.style.color = "red";
  }
});
