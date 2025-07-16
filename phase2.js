// Phase 2: Real-time tracking, Routing, Favorites, etc.

let watchId;
function startTracking() {
  if ('geolocation' in navigator) {
    watchId = navigator.geolocation.watchPosition(pos => {
      const { latitude, longitude } = pos.coords;
      L.circle([latitude, longitude], { radius: 5, color: 'blue' }).addTo(map);
    });
  }
}

function stopTracking() {
  navigator.geolocation.clearWatch(watchId);
}

function saveFavorite(lat, lon, label) {
  const favs = JSON.parse(localStorage.getItem('favorites') || '[]');
  favs.push({ lat, lon, label });
  localStorage.setItem('favorites', JSON.stringify(favs));
}

function loadFavorites() {
  const favs = JSON.parse(localStorage.getItem('favorites') || '[]');
  favs.forEach(fav => {
    L.marker([fav.lat, fav.lon]).addTo(map).bindPopup(fav.label);
  });
}