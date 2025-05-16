let lastRequestTime = 0;
const debounceTime = 5 * 60 * 1000; // 5 minutes

document.addEventListener("DOMContentLoaded", () => {
  const windDisplay = document.querySelector(".metarWind p");
  const dewpointDisplay = document.querySelector(".rose p");
  const pressure = document.querySelector(".METAR_bottom");
  const mancheAir = document.querySelector(".mancheAir");

  // Initial data fetch
  fetchData();

  function fetchData() {
    const currentTime = Date.now();

    if (currentTime - lastRequestTime < debounceTime) {
      console.log("Request too fast, skipping this one.");
      return;
    }

    lastRequestTime = currentTime;

    fetch("./?page=5")
      .then((response) => response.text())
      .then((text) => {
        console.log("Réponse brute du serveur:", text);

        try {
          const json = JSON.parse(text);
          console.log("Données JSON valides:", json);

          if (!json || !json.temperature || !json.dewpoint) {
            console.error("Invalid or missing data:", json);
            return;
          }

          const {
            temperature: temp,
            dewpoint,
            qnh,
            zd,
            wind_string,
            wind_direction,
          } = json;

          // Update DOM elements
          dewpointDisplay.textContent = `${temp}° / ${dewpoint}°`;
          windDisplay.textContent = wind_string || "Pas de données vent";

          const icon = qnh < 1013 ? "light" : "heavy";
          pressure.innerHTML = `
            <div class="QNH">
              <img class="pressureIcon" src="../../assets/small ${icon} pressure icon.svg" alt="">
              <p>Q${qnh}</p>
            </div>
            <div class="pressure">
              <p class="capitalize">Zd ${zd} <span class="lowercase">ft</span></p>
            </div>`;

          if (
            json.wind_string?.toLowerCase().includes("calm") ||
            parseInt(json.wind_speed, 10) < 5
          ) {
            console.log(
              "Calm or very low wind — skipping wind indicator update."
            );
            return;
          }
          if (
            json.wind_speed >= 5 &&
            json.wind_direction !== undefined &&
            json.wind_string.includes("VRB")
          ) {
            // Clear existing faded indicators if any
            document
              .querySelectorAll(".mancheAir.var")
              .forEach((el) => el.remove());

            // Main wind direction (fallback: center if VRB)
            const centerDir = 180; // arbitrary default if VRB without bounds
            mancheAir.style.transform = `rotate(${centerDir}deg)`;

            // Add variable range arms
            const extremes = [json.wind_min_direction, json.wind_max_direction];

            extremes.forEach((dir) => {
              if (dir && dir > 0) {
                const faded = mancheAir.cloneNode(true);
                faded.classList.add("var");
                faded.style.opacity = "0.4";
                faded.style.position = "absolute";
                faded.style.zIndex = "5";
                faded.style.transform = `rotate(${dir}deg)`;
                mancheAir.parentElement.appendChild(faded);
              }
            });
          } else if (
            json.wind_speed >= 5 &&
            json.wind_direction !== undefined
          ) {
            // No VRB, standard single direction
            mancheAir.style.transform = `rotate(${json.wind_direction}deg)`;

            // Remove any faded indicators
            document
              .querySelectorAll(".mancheAir.var")
              .forEach((el) => el.remove());
          } else {
            // Wind too calm — hide everything
            mancheAir.style.transform = "none";
            document
              .querySelectorAll(".mancheAir.var")
              .forEach((el) => el.remove());
          }
        } catch (err) {
          console.error("Erreur de parsing JSON:", err);
        }
      })
      .catch((error) => {
        console.error("Erreur réseau:", error);
      });
  }
});
