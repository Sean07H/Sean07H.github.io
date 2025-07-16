let map;
let userMarker;
let watchId;
let isDark = false;
let lastCoords = null;

const tileLight = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const tileDark = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

function initMap(lat, lng) {
  map = L.map('map').setView([lat, lng], 16);

  L.tileLayer(tileLight, {
    maxZoom: 19,
  }).addTo(map);

  userMarker = L.marker([lat, lng]).addTo(map)
    .bindPopup("You are here").openPopup();
}

function centerMap(lat, lng) {
  map.setView([lat, lng], 16);
}

function speakDirections(text) {
  const msg = new SpeechSynthesisUtterance(text);
  msg.lang = 'en-US';
  speechSynthesis.speak(msg);
}

function startTracking() {
  watchId = navigator.geolocation.watchPosition(
    pos => {
      const { latitude, longitude } = pos.coords;
      lastCoords = { latitude, longitude };
      userMarker.setLatLng([latitude, longitude]);
      // No auto recenter — keeps user in control
    },
    err => alert("Tracking failed: " + err.message),
    { enableHighAccuracy: true }
  );
}

function toggleDarkMode() {
  isDark = !isDark;
  map.eachLayer(layer => map.removeLayer(layer));
  const tileLayer = L.tileLayer(isDark ? tileDark : tileLight, {
    maxZoom: 19,
  }).addTo(map);
}

function shakeToRecenter() {
  let lastShake = Date.now();
  window.addEventListener("devicemotion", event => {
    const acc = event.accelerationIncludingGravity;
    const magnitude = Math.sqrt(acc.x**2 + acc.y**2 + acc.z**2);
    if (magnitude > 20 && Date.now() - lastShake > 2000) {
      if (lastCoords) {
        centerMap(lastCoords.latitude, lastCoords.longitude);
      }
      lastShake = Date.now();
    }
  });
}

// Init
window.onload = () => {
  if (!navigator.geolocation) {
    alert("Geolocation not supported.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    pos => {
      const { latitude, longitude } = pos.coords;
      initMap(latitude, longitude);
      startTracking();
      shakeToRecenter();
    },
    err => alert("Location access denied.")
  );

  document.getElementById("center-btn").addEventListener("click", () => {
    if (lastCoords) {
      centerMap(lastCoords.latitude, lastCoords.longitude);
    }
  });

  document.getElementById("dark-mode-toggle").addEventListener("click", toggleDarkMode);
};
