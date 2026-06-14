
const form = document.getElementById("login-form");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("email");
  const password = document.getElementById("password");

  email.classList.remove("error");
  password.classList.remove("error");

  let valid = true;

  if (!email.value.trim()) {
    email.classList.add("error");
    valid = false;
  }

  if (!password.value.trim()) {
    password.classList.add("error");
    valid = false;
  }

  if (valid) {
    window.location = "main.html";
  }
});