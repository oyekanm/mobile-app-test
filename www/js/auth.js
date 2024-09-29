document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
  console.log("ready");
}

const api = "https://incident-app-server.vercel.app";

const storage = window.localStorage;
const value = storage.getItem("token");



function Login() {
  const name = document.querySelector("#username").value;
  const pass = document.querySelector("#password").value;

  const user = {
    username: name,
    password: pass,
  };

  if (user && pass) {
    fetch(`${api}/login`, {
      method: "POST",
      body: JSON.stringify(user),
      headers: {
        "Content-Type": "application/json", // Set content type to JSON
      },
    })
      .then((response) => {
        console.log(response)
        if (!response.ok) {
          return response.json().then(err => Promise.reject(err));
        }
      return  response.json()
      })
      .then((data) => {
// console.log(data)
        storage.setItem("token",JSON.stringify(data.accessToken));

        document.querySelector("#username").value = "",
        document.querySelector("#password").value = "";

        window.location = "index.html";
      })
      .catch((error) => {
        console.error("Error submitting incident:", error);
        // Show an error message to the user
        alert(error.msg)
      });
  } else {
    alert("Please fill all fields");
  }
}
function Register() {
  const name = document.querySelector("#username").value;
  const pass = document.querySelector("#password").value;

  const user = {
    username: name,
    password: pass,
  };

  if (user && pass) {
    fetch(`${api}/register`, {
      method: "POST",
      body: JSON.stringify(user),
      headers: {
        "Content-Type": "application/json", // Set content type to JSON
      },
    })
      .then((response) => {
        console.log("first", response);
        (document.querySelector("#username").value = ""),
          (document.querySelector("#password").value = "");
      })
      .catch((error) => {
        console.error("Error submitting incident:", error);
        // Show an error message to the user
      });
  } else {
    alert("Please fill all fields");
  }
}

function LoginPage() {
  window.location = "login.html";
}
function RegisterPage() {
  window.location = "register.html";
}
