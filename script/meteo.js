let lastRequestTime = 0;
const debounceTime = 5 * 60 * 1000; // 5 minutes

document.addEventListener("DOMContentLoaded", () => {
  console.log("JS Loaded");
  const windDisplay = document.querySelector(".metarWind p");
  const dewpointDisplay = document.querySelector(".rose p");
  const pressureDisplay = document.querySelector(".METAR_bottom");
  const backPiste = document.querySelector(".backPiste");
  const mancheAir = document.querySelector(".mancheAir");

  fetchData();

  function fetchData() {
    const now = Date.now();
    if (now - lastRequestTime < debounceTime) {
      console.log("Request too fast, skipping.");
      return;
    }

    lastRequestTime = now;

    fetch("./?page=5")
      .then((response) => response.text())
      .then((text) => {
        try {
          const json = JSON.parse(text);
          console.log("Données JSON valides:", json);

          if (!json?.temperature || !json?.dewpoint) {
            console.error("Invalid or missing data:", json);
            return;
          }

          dewpointDisplay.textContent = `${json.temperature}° / ${json.dewpoint}°`;
          const windString = String(json.wind_string).replace("000", "360")

          windDisplay.textContent = windString || "Pas de données vent";

          updatePressureDisplay(json.qnh, json.zd);
          updateLastUpdateDisplay(json.date_metar);
          updateRunwayWindIndicators(json);
          updateWindDirection(json);
        } catch (err) {
          console.error("Erreur de parsing JSON:", err);
        }
      })
      .catch((error) => console.error("Erreur réseau:", error));
  }
  function updatePressureDisplay(qnh, zd) {
    if (!pressureDisplay) return;

    const icon = qnh < 1013 ? "light" : "heavy";
    pressureDisplay.innerHTML = `
      <div class="QNH">
        <img class="pressureIcon" src="../../assets/small ${icon} pressure icon.svg" alt="">
        <p>Q${qnh}</p>
      </div>
      <div class="pressure">
        <p class="capitalize">Zd ${zd} <span class="lowercase">ft</span></p>
      </div>`;
  }
  function updateWindDirection(json) {
    if (!mancheAir || !backPiste) return;

    if (
      json.wind_direction === "VRB" &&
      json.wind_min_direction !== undefined &&
      json.wind_max_direction !== undefined
    ) {
      const min = parseInt(json.wind_min_direction);
      const max = parseInt(json.wind_max_direction);
      const diff = (max - min + 360) % 360;
      const center = (min + diff / 2) % 360;

      mancheAir.style.transform = `rotate(${center}deg)`;

      backPiste.style.display = "block";
      backPiste.style.transform = `rotate(${min}deg)`;
      backPiste.style.background = `conic-gradient(rgba(255,0,0,0.3) ${diff}deg, transparent 0deg)`;

      console.log(`Variable wind: min ${min}, max ${max}, center ${center}`);
    } else {
      const angle = parseInt(json.wind_direction);
      mancheAir.style.transform = `rotate(${angle}deg)`;
      backPiste.style.display = "none";
      console.log(`Fixed wind: ${angle}°`);
    }
  }

  function updateLastUpdateDisplay(dateMetarString) {
    const updateDisplay = document.querySelector(".MaJ");
    if (!updateDisplay) return;

    // Parse the date as UTC
    const [datePart, timePart] = dateMetarString.split(" ");
    const [year, month, day] = datePart.split("-").map(Number);
    const [hour, minute, second] = timePart.split(":").map(Number);
    const metarDate = new Date(
      Date.UTC(year, month - 1, day, hour, minute, second)
    );

    const now = new Date();
    const diffMs = now - metarDate;
    const diffMin = Math.floor(diffMs / 60000);
    const diffHrs = Math.floor(diffMin / 60);

    let message = "Dernière MàJ des données : ";

    if (diffMin < 1) message += "moins d'une minute";
    else if (diffMin === 1) message += "il y a une minute";
    else if (diffHrs < 1) message += `il y a ${diffMin} minutes`;
    else if (diffHrs === 1) message += "il y a une heure";
    else message += `il y a ${diffHrs} heures`;

    updateDisplay.textContent = message;
  }
  function updateRunwayWindIndicators(data) {
    const activeRunway = data.rwy;
    const runways = ["02", "20"];
    const windstring = data.wind_string;

    runways.forEach((rwy) => {
      const container = document.querySelector(`.wind${rwy}`);
      if (!container) return;

      const pCrosswind = container.querySelector("#crosswind");
      const pHeadwind = container.querySelector("#headwind");
      const img = container.querySelector("img");

      if (!pCrosswind || !pHeadwind || !img) return;

      // Reset all classes
      [pCrosswind, pHeadwind, img].forEach((el) =>
        el.classList.remove(
          "hidden",
          "up",
          "bttm",
          "left",
          "right",
          "rightNup",
          "rightNbottom",
          "leftNbottom",
          "leftNup"
        )
      );

      if (rwy !== activeRunway) {
        [pCrosswind, pHeadwind, img].forEach((el) =>
          el.classList.add("hidden")
        );
        return;
      }

      const { headwind, crosswind } = data;

      // Update values
      crossFiltered = String(crosswind).replace("-", "");
      pCrosswind.textContent = `${crossFiltered}kt`;
      pHeadwind.textContent = `${headwind}kt`;

      // Directional classes
      if (crosswind > 0) pCrosswind.classList.add("right");
      else if (crosswind < 0) pCrosswind.classList.add("left");
      else pCrosswind.classList.add("hidden");

      if (headwind > 0) pHeadwind.classList.add("up");
      else if (headwind < 0) pHeadwind.classList.add("bttm");
      else pHeadwind.classList.add("hidden");

      // Arrow direction
      if (crosswind < 0 && headwind < 0) img.classList.add("rightNup");
      else if (crosswind < 0 && headwind > 0) img.classList.add("rightNbottom");
      else if (crosswind > 0 && headwind > 0) img.classList.add("leftNbottom");
      else if (crosswind > 0 && headwind < 0) img.classList.add("leftNup");

      // Update image based on wind presence
      if (headwind === 0 || crosswind === 0) {
        img.src = "../../assets/wind arrow.svg"; // single arrow
      } else {
        img.src = "../../assets/wind arrows.svg"; // cross arrow
      }
      // const one = 0
      if (windstring === "CALM") {
        [pCrosswind, pHeadwind, img].forEach((el) =>
          el.classList.remove(
            "hidden",
            "up",
            "bttm",
            "left",
            "right",
            "rightNup",
            "rightNbottom",
            "leftNbottom",
            "leftNup"
          )
        );
        img.src = "../../assets/wind arrows.svg"; // cross arrow
        pHeadwind.classList.add("up");
        pCrosswind.classList.add("right");
      }
    });
  }
});
