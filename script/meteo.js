let lastRequestTime = 0;
const debounceTime = 5 * 60 * 1000; // 5 minutes

document.addEventListener("DOMContentLoaded", () => {
  const windDisplay = document.querySelector(".metarWind p");
  const dewpointDisplay = document.querySelector(".rose p");
  const pressureDisplay = document.querySelector(".METAR_bottom");
  const mancheAir = document.querySelector(".backPiste");

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
          windDisplay.textContent = json.wind_string || "Pas de données vent";

          updatePressureDisplay(json.qnh, json.zd);
          updateWindDirection(json);
          updateLastUpdateDisplay(json.date_metar);
          updateRunwayWindIndicators(json);
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

  function updateWindDirection(data) {
    // if (!data.wind_speed || data.wind_speed < 5 || !data.wind_direction) {
    //   console.log("Calm or low wind — no indicator update.");
    //   return;
    // }

    const windCenter = document.querySelector(".windCenter");

    const one = 1;
    if (
      data.wind_string.includes("VRB") &&
      data.wind_min_direction !== undefined &&
      data.wind_max_direction !== undefined
      // one > 0
    ) {
      const min = data.wind_min_direction;
      const max = data.wind_max_direction;
      const diff = (max - min + 360) % 360;
      const wedgePercent = (diff / 360) * 100;
      const center = (min + diff / 2) % 360;

      if (mancheAir) mancheAir.style.transform = `rotate(${center}deg)`;
      if (windCenter) {
        windCenter.style.setProperty("--wedge-size", `${wedgePercent}%`);
        windCenter.style.setProperty("--wedge-rotate", `${center}deg`);
      }

      console.log(`Vent variable de ${min} à ${max} => centre ${center}°`);
    } else {
      if (mancheAir)
        mancheAir.style.transform = `rotate(${data.wind_direction}deg)`;
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
  const runways = ["02", "20"]; // Extend if needed

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

    // Update content with raw values (as you said: "content of the p should be what the JSON sent")
    pCrosswind.textContent = `${crosswind}kt`;
    pHeadwind.textContent = `${headwind}kt`;

    // Directional classes for wind
    if (crosswind < 0) pCrosswind.classList.add("right");
    else if (crosswind > 0) pCrosswind.classList.add("left");

    if (headwind > 0) pHeadwind.classList.add("up");
    else if (headwind < 0) pHeadwind.classList.add("bttm");

    // Arrow class (combined headwind/crosswind direction)
    if (crosswind > 0 && headwind < 0) img.classList.add("rightNup");
    else if (crosswind > 0 && headwind > 0) img.classList.add("rigthNbottom");
    else if (crosswind < 0 && headwind > 0) img.classList.add("leftNbottom");
    else if (crosswind < 0 && headwind < 0) img.classList.add("leftNup");
  });
}

});
