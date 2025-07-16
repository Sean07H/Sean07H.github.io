let map;
let userMarker;
let pinMarker;

// Initialize the map
function initMap() {
  map = L.map('map').setView([40.7128, -74.0060], 13); // Default to NYC

  // Tile Layer (Map styling)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
  }).addTo(map);

  // Add current location marker (but don’t center)
  navigator.geolocation.getCurrentPosition((pos) => {
    const coords = [pos.coords.latitude, pos.coords.longitude];
    userMarker = L.marker(coords).addTo(map).bindPopup("You are here");
  });

  // Setup button click to center on current location
  document.getElementById('center-btn').addEventListener('click', () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const coords = [pos.coords.latitude, pos.coords.longitude];
      map.setView(coords, 16);
    });
  });

  // Double-tap to drop a pin
  let lastTap = 0;
  map.on('click', function (e) {
    const currentTime = new Date().getTime();
    const tapGap = currentTime - lastTap;

    if (tapGap < 300 && tapGap > 0) {
      if (pinMarker) map.removeLayer(pinMarker);
      const latlng = e.latlng;

      pinMarker = L.marker(latlng).addTo(map)
        .bindPopup(`<b>Pinned location</b><br><button onclick="getDirections(${latlng.lat}, ${latlng.lng})">Get Directions</button>`)
        .openPopup();
    }

    lastTap = currentTime;
  });
}

// Function to simulate getting directions
function getDirections(lat, lng) {
  alert(`Directions to: ${lat.toFixed(5)}, ${lng.toFixed(5)} (Integrate routing here)`);
}

window.onload = initMap;
