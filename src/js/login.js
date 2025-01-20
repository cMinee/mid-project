// login with email and password, click Login and send email and password to login.html and local storage

document.getElementById("login-submit").addEventListener("click", (event) => {
  event.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (email && password) {
    localStorage.setItem("email", email);
    localStorage.setItem("password", password);
    localStorage.setItem("isLoggedIn", "true");
    console.log("Logged in as:", email);
    window.location.href = "index.html";
  } else {
    alert("Please enter email and password!");
  }
})
