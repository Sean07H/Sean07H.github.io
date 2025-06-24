import * as AE from 'https://cdn.jsdelivr.net/npm/astronomy-engine/+esm';

const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const downloadBtn = document.getElementById('downloadBtn');
const captureBtn = document.getElementById('captureBtn');

let stars = [], planets = [];
await fetch('bright-stars.json').then(r => r.json()).then(data => stars = data);

// Start camera
navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
  .then(stream => { video.srcObject = stream; })
  .catch(e => alert("Camera error: " + e));

// Calibrate with DeviceOrientation
let orientation = { azimuth: 0, pitch: 0, roll: 0 };
window.addEventListener("deviceorientationabsolute", e => {
  orientation = { azimuth: e.alpha, pitch: e.beta, roll: e.gamma };
});

// Capture and overlay stars/planets
captureBtn.addEventListener('click', () => {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  navigator.geolocation.getCurrentPosition(pos => {
    const { latitude, longitude } = pos.coords;
    const time = new Date();
    const observer = new AE.Observer(latitude, longitude, 0);

    // Overlay bright stars
    stars.forEach(star => {
      const eq = AE.EquatorFromRADEC(time, star.ra, star.dec, latitude, longitude, true, true);
      const hor = AE.Horizon(time, latitude, longitude, eq.ra, eq.dec, "normal");

      if (hor.altitude > 0) {
        const x = canvas.width / 2 + hor.azimuth * (canvas.width / 180);
        const y = canvas.height / 2 - hor.altitude * (canvas.height / 90);
        ctx.fillStyle = "yellow";
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillText(star.name, x + 5, y - 5);
      }
    });

    // Overlay planets
    const planetList = ["Mercury", "Venus", "Mars", "Jupiter", "Saturn"];
    planetList.forEach(name => {
      const body = AE.Body[name];
      const equ = AE.Equator(body, time, observer, true, true);
      const hor = AE.Horizon(time, latitude, longitude, equ.ra, equ.dec, "normal");

      if (hor.altitude > 0) {
        const x = canvas.width / 2 + hor.azimuth * (canvas.width / 180);
        const y = canvas.height / 2 - hor.altitude * (canvas.height / 90);
        ctx.fillStyle = "cyan";
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillText(name, x + 5, y - 5);
      }
    });

    downloadBtn.href = canvas.toDataURL();
  }, () => alert("Location required."));
});