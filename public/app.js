const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");

// Backend API Base URL
const BASE_URL = "http://localhost:5000/api/auth";

// Switch to sign-up mode
sign_up_btn.addEventListener("click", () => {
  container.classList.add("sign-up-mode");
});

// Switch to sign-in mode
sign_in_btn.addEventListener("click", () => {
  container.classList.remove("sign-up-mode");
});

// ------------------- SIGN-UP LOGIC -------------------
const signUpForm = document.querySelector(".sign-up-form");
signUpForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = signUpForm.querySelector('input[placeholder="Username"]').value;
  const email = signUpForm.querySelector('input[placeholder="Email"]').value;
  const password = signUpForm.querySelector('input[placeholder="Password"]').value;
  const role = document.getElementById("role-signup").value; // Get selected role

  try {
    const res = await fetch(`${BASE_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password, role }),
    });

    const data = await res.json();
    if (res.ok) {
      alert("Sign up successful! You can now sign in.");
      container.classList.remove("sign-up-mode");
    } else {
      alert(`Error: ${data.message || "Sign up failed"}`);
    }
  } catch (error) {
    console.error("Signup error:", error);
    alert("Failed to connect to the server.");
  }
});

// ------------------- SIGN-IN LOGIC -------------------
const signInForm = document.querySelector(".sign-in-form");
signInForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = signInForm.querySelector('input[placeholder="Username"]').value;
  const password = signInForm.querySelector('input[placeholder="Password"]').value;
  const role = document.getElementById("role-signin").value; // Get selected role

  try {
    const res = await fetch(`${BASE_URL}/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role }),
    });

    const data = await res.json();
    if (res.ok) {
      // Save token and role in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      alert(`Login successful! Redirecting to ${data.role} dashboard...`);

      // Redirect based on role
      if (data.role === "admin") {
        window.location.href = "admin-dashboard.html";
      } else {
        window.location.href = "user-dashboard.html";
      }
    } else {
      alert(`Error: ${data.message || "Login failed"}`);
    }
  } catch (error) {
    console.error("Login error:", error);
    alert("Failed to connect to the server.");
  }
});