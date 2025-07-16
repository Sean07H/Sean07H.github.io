// Phase 3: Advanced Mobile Features

function enableCompass(map) {
  if (window.DeviceOrientationEvent) {
    window.addEventListener("deviceorientation", (event) => {
      const alpha = event.alpha;
      if (alpha !== null) {
        document.getElementById("map").style.transform = `rotate(${alpha}deg)`;
      }
    });
  }
}

function shakeToRecenter() {
  let lastTime = new Date();
  let lastX = null;
  let lastY = null;
  let lastZ = null;
  window.addEventListener('devicemotion', function(event) {
    const acceleration = event.accelerationIncludingGravity;
    const currTime = new Date();
    if ((currTime - lastTime) > 100) {
      const deltaTime = currTime - lastTime;
      lastTime = currTime;
      if (lastX !== null && lastY !== null && lastZ !== null) {
        const deltaX = Math.abs(lastX - acceleration.x);
        const deltaY = Math.abs(lastY - acceleration.y);
        const deltaZ = Math.abs(lastZ - acceleration.z);
        if (deltaX + deltaY + deltaZ > 25) {
          centerMap(); // Shake detected
        }
      }
      lastX = acceleration.x;
      lastY = acceleration.y;
      lastZ = acceleration.z;
    }
  });
}