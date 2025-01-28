// login with email and password, click Login and send email and password to login.html and local storage
document.getElementById("login-submit").addEventListener("click", (event) => {
  event.preventDefault();
  // get email and password from input fields
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // check if email and password are not empty
  if (email && password) {
    localStorage.setItem("email", email);
    localStorage.setItem("password", password);
    localStorage.setItem("isLoggedIn", "true");

    // log email to console
    console.log("Logged in as:", email);

    // redirect to index.html
    window.location.href = "index.html";
  } else {
    // show error message if email or password is empty
    alert("Please enter email and password!");
  }
})
