const input = document.getElementById("photo-input");
const canvas = document.getElementById("photo-canvas");
const ctx = canvas.getContext("2d");
const status = document.getElementById("status");
let img = new Image();

// Handle photo upload
input.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      status.textContent = "Image loaded. Tap 'Overlay Sky Data'";
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(file);
});

// Get GPS + orientation + overlay stars
document.getElementById("get-overlay").addEventListener("click", () => {
  if (!img.src) {
    status.textContent = "Please load an image first.";
    return;
  }

  status.textContent = "Getting location and orientation...";

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      // Optionally add device orientation (simplified here)
      drawStarOverlay(lat, lon);
    },
    (err) => {
      console.error(err);
      status.textContent = "Location access denied.";
    }
  );
});

// Overlay demo stars/constellations (faked for now)
function drawStarOverlay(lat, lon) {
  // Simulated random starfield
  for (let i = 0; i < 100; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const size = Math.random() * 1.5 + 0.5;

    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    ctx.fill();
  }

  // Draw soft constellation lines
  ctx.strokeStyle = "rgba(100, 150, 255, 0.2)";
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
    ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
  }
  ctx.stroke();

  status.textContent = `Stars overlaid (simulated) at your location (lat: ${lat.toFixed(
    2
  )}, lon: ${lon.toFixed(2)})`;
}
