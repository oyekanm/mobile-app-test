let incidents = [];

const api = "https://incident-app-server.vercel.app";

const storage = window.localStorage;
const value = storage.getItem("token");

async function submitIncident() {

  if (!value) {
    window.location = "login.html";
    return;
  }

  const title = document.getElementById("incident-title").value;
  const category = document.getElementById("incident-category").value;
  const description = document.getElementById("incident-description").value;
  const imageFile = document.getElementById("incident-image").files[0];
  const latitude = document.getElementById("incident-latitude").value;
  const longitude = document.getElementById("incident-logitude").value;
  const location = {
    latitude,
    longitude,
  };

  // getLocation()
  // window.location = "/login.ht"
  if (title && category && description && latitude && longitude) {
    if (imageFile) {
      const imageDataUrl = await resizeAndCompressImage(
        imageFile,
        800,
        600,
        0.7
      );
      console.log(imageDataUrl);
      sendIncidentToServer(
        title,
        category,
        description,
        imageDataUrl,
        location
      );
    } else {
      sendIncidentToServer(title, category, description, null, location);
    }
    clearForm();
  } else {
    alert("Please fill all fields");
  }
}

function resizeAndCompressImage(file, maxWidth, maxHeight, quality) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const elem = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        elem.width = width;
        elem.height = height;

        const ctx = elem.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = elem.toDataURL("image/jpeg", quality);
        resolve(dataUrl);
      };
      img.onerror = (error) => reject(error);
    };
  });
}

function sendIncidentToServer(
  title,
  category,
  description,
  imageDataUrl,
  location
) {
  

  console.log(value, JSON.parse(value));

  fetch(`${api}/incidents`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: JSON.parse(value),
    },
    body: JSON.stringify({
      title: title,
      category: category,
      description: description,
      imageUrl: imageDataUrl,
      location,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((err) => Promise.reject(err));
      }
      return response.json();
    })
    .then((data) => {
      console.log("Incident submitted successfully:", data);
      // Clear the form or show a success message
      incidents.unshift(data);
      // console.log(incidents)
      updateIncidentList();
      fetchIncidents()
    })
    .catch((error) => {
      console.error("Error submitting incident:", error);
      // Show an error message to the user
    });
}
function MyIncidents(){
  if (!value) {
    window.location = "login.html";
    return;
  }
    fetch(`${api}/myincidents`,{
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: JSON.parse(value),
        },
    })
    .then((response) => response.json())
    .then((data) => {
      console.log("Incident submitted successfully:", data);
      // Clear the form or show a success message
      incidents = [...data];
      // console.log(incidents)
      updateIncidentList();
    })
    .catch((error) => {
      console.error("Error submitting incident:", error);
      // Show an error message to the user
    }); 
}
function updateIncidentList() {
  const incidentList = document.getElementById("incidents");
  incidentList.innerHTML = "";
  if (incidents.length === 0) incidentList.innerHTML = "No Incident";
  // createdAt

  incidents?.forEach((incident) => {
    incidentList.innerHTML += `
         <div class="incident-card">
            <span>
            <p class="incident-title"><span>${incident.title}</span> (${
      incident.category
    }) </p>
            <p class="incident-desc">${incident.description}</p>
            <small>Reported on: ${new Date(
              incident.createdAt
            ).toDateString()}</small>
            <div>
                <span>latitude:${incident.location.latitude} ${"  "}</span>
                <span>longitude:${incident.location.longitude}</span>
            </div>
        </span>
        <img src=${incident.imageUrl} alt=${incident.title}/>
         </div>
        `;
  });
}

function clearForm() {
  document.getElementById("incident-title").value = "";
  document.getElementById("incident-category").value = "accident";
  document.getElementById("incident-description").value = "";
  document.getElementById("incident-latitude").value = "";
  document.getElementById("incident-logitude").value = "";
  document.getElementById("incident-image").value = "";
}

// Simulating fetching incidents from a server
function fetchIncidents() {
  // In a real app, this would be an API call
  setTimeout(() => {
    // Assuming you're using fetch to send data to your server
    fetch(`${api}/incidents`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Incident submitted successfully:", data);
        // Clear the form or show a success message
        incidents = [...data];
        // console.log(incidents)
        updateIncidentList();
      })
      .catch((error) => {
        console.error("Error submitting incident:", error);
        // Show an error message to the user
      });
  }, 1000);
}

// Call this function when the page loads
fetchIncidents();

// Geolocation function
function fetchLocation() {
  navigator.geolocation.getCurrentPosition(onSuccess, onError, {
    enableHighAccuracy: true,
  });
}

function onSuccess(position) {
  document.getElementById("incident-latitude").value = position.coords.latitude;
  document.getElementById("incident-logitude").value =
    position.coords.longitude;
}

function onError(error) {
  console.log(
    "code: " + error.code + "\n" + "message: " + error.message + "\n"
  );
}

// Push notification setup
function setupPushNotifications() {
  // Use a push notification plugin
}
