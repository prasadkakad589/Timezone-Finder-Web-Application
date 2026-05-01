const API_KEY = "f178f16486db43f88e6a41cd746b216b"; 

// Step 3: Get Current Location
navigator.geolocation.getCurrentPosition(
  (pos) => {
    let lat = pos.coords.latitude;
    let lon = pos.coords.longitude;
    getTimezone(lat, lon, "current");
  },
  () => {
    document.getElementById("current").innerText = "Permission denied!";
  }
);

// Fetch timezone using lat/lon
function getTimezone(lat, lon, target) {
  fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=${API_KEY}`)
    .then(res => res.json())
    .then(data => {
      console.log(data);

      if (!data.features || data.features.length === 0) {
        document.getElementById(target).innerText = "No data found";
        return;
      }

      let tz = data.features[0].properties.timezone;

      document.getElementById(target).innerText =
        tz.name + " (UTC " + tz.offset_STD + ")";
    })
    .catch(() => {
      document.getElementById(target).innerText = "Error fetching timezone";
    });
}
// Step 4: Address → Timezone
function getTimezoneByAddress() {
  let address = document.getElementById("address").value;

  if (address === "") {
    document.getElementById("result").innerText = "Please enter an address";
    return;
  }

  // Geocoding API
  fetch(`https://api.geoapify.com/v1/geocode/search?text=${address}&apiKey=${API_KEY}`)
    .then(res => res.json())
    .then(data => {
      if (data.features.length === 0) {
        document.getElementById("result").innerText = "Address not found";
        return;
      }

      let lat = data.features[0].properties.lat;
      let lon = data.features[0].properties.lon;

      getTimezone(lat, lon, "result");
    })
    .catch(() => {
      document.getElementById("result").innerText = "Error fetching location";
    });
}