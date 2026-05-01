const API_KEY = "ded72fa136634a108397ceab0b748b9e";

// Run after page loads
window.onload = function () {

  if (!navigator.geolocation) {
    document.getElementById("current").innerText = "Geolocation not supported";
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      console.log("Location fetched");

      let lat = pos.coords.latitude;
      let lon = pos.coords.longitude;

      getTimezone(lat, lon, "current");
    },
    (err) => {
      console.log("Location Error:", err);
      document.getElementById("current").innerText = "Location permission denied";
    }
  );
};

// ✅ Correct API (reverse geocode)
function getTimezone(lat, lon, target) {
  fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=${API_KEY}`)
    .then(res => res.json())
    .then(data => {
      console.log("API Response:", data);

      if (!data.features || data.features.length === 0) {
        document.getElementById(target).innerText = "No timezone found";
        return;
      }

      let tz = data.features[0].properties.timezone;

      document.getElementById(target).innerText =
        tz.name + " (UTC " + tz.offset_STD + ")";
    })
    .catch(err => {
      console.log("Fetch Error:", err);
      document.getElementById(target).innerText = "Error fetching timezone";
    });
}

// Address search
function getTimezoneByAddress() {
  let address = document.getElementById("address").value;

  if (address === "") {
    document.getElementById("result").innerText = "Please enter address";
    return;
  }

  fetch(`https://api.geoapify.com/v1/geocode/search?text=${address}&apiKey=${API_KEY}`)
    .then(res => res.json())
    .then(data => {
      if (!data.features || data.features.length === 0) {
        document.getElementById("result").innerText = "Address not found";
        return;
      }

      let lat = data.features[0].properties.lat;
      let lon = data.features[0].properties.lon;

      getTimezone(lat, lon, "result");
    })
    .catch(err => {
      console.log(err);
      document.getElementById("result").innerText = "Error fetching location";
    });
}
