let map;
function initMap() {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      map = L.map('map').setView([latitude, longitude], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
      }).addTo(map);
      L.marker([latitude, longitude]).addTo(map).bindPopup("You are here").openPopup();
    }, () => {
      map = L.map('map').setView([40.7128, -74.006], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
      }).addTo(map);
    });
  }
}

function centerMap() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
      const { latitude, longitude } = pos.coords;
      map.setView([latitude, longitude], 13);
    });
  }
}

function searchLocation() {
  const query = document.getElementById("searchBox").value;
  fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`)
    .then(res => res.json())
    .then(data => {
      if (data.length > 0) {
        const { lat, lon } = data[0];
        map.setView([lat, lon], 14);
        L.marker([lat, lon]).addTo(map).bindPopup(query).openPopup();
      }
    });
}

window.onload = initMap;