// Wait for Aladin to load (loaded with defer)
window.addEventListener("DOMContentLoaded", () => {
  // Initialize Celestial
  Celestial.display({
    container: "sky-container",
    datapath: "https://ofrohn.github.io/data/",
    stars: {
      show: true,
      limit: 6,
    },
    dsos: {
      show: true,
      names: true,
    },
    constellations: {
      names: true,
      lines: true,
      bounds: false,
    },
    mw: {
      show: true,
    },
    background: {
      fill: "#000",
      opacity: 1,
      stroke: "#000",
      width: 1.5,
    },
    borders: {
      names: true,
    },
    grid: {
      lon: {
        show: true,
        stroke: "#555",
        width: 0.5,
        pos: ["center"],
      },
      lat: {
        show: true,
        stroke: "#555",
        width: 0.5,
        pos: ["center"],
      },
    },
    interactive: true,
    form: false,
  });

  // Initialize Aladin
  const aladin = A.aladin("#aladin-lite", {
    survey: "P/DSS2/color",
    fov: 2,
    target: "Orion Nebula",
  });

  // Handle survey change
  document.getElementById("survey-select").addEventListener("change", (e) => {
    aladin.setImageSurvey(e.target.value);
  });

  // Handle magnitude slider
  const magSlider = document.getElementById("mag-slider");
  const magValue = document.getElementById("mag-value");
  magSlider.addEventListener("input", () => {
    const mag = parseFloat(magSlider.value);
    magValue.textContent = mag;
    Celestial.set({ stars: { limit: mag } });
    Celestial.redraw();
  });

  // Handle date/time change (for Celestial only)
  const timePicker = document.getElementById("time-picker");
  timePicker.addEventListener("change", () => {
    const dt = new Date(timePicker.value);
    Celestial.set({ date: dt.toISOString() });
    Celestial.redraw();
  });
});
