import * as AE from 'https://cdn.jsdelivr.net/npm/astronomy-engine/+esm';

const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const captureBtn = document.getElementById('captureBtn');
const downloadBtn = document.getElementById('downloadBtn');

let stars = [];
await fetch('bright-stars.json').then(r => r.json()).then(data => stars = data);

navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
  .then(stream => { video.srcObject = stream; })
  .catch(e => alert("Camera error: " + e));

captureBtn.addEventListener('click', () => {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  navigator.geolocation.getCurrentPosition(pos => {
    const { latitude, longitude } = pos.coords;
    const time = new Date();
    const observer = new AE.Observer(latitude, longitude, 0);

    stars.forEach(star => {
      const eq = AE.EquatorFromRADEC(time, star.ra, star.dec, latitude, longitude, true, true);
      const hor = AE.Horizon(time, latitude, longitude, eq.ra, eq.dec, "normal");

      if (hor.altitude > 0) {
        const x = canvas.width / 2 + hor.azimuth * (canvas.width / 180);
        const y = canvas.height / 2 - hor.altitude * (canvas.height / 90);
        ctx.fillStyle = "yellow";
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillText(star.name, x + 5, y - 5);
      }
    });

    downloadBtn.href = canvas.toDataURL();
  }, () => alert("Location access failed."));
});