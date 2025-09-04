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
            json.wind_min_direction !== undefined &&
            json.wind_max_direction !== undefined &&
            json.windString == "VRB"
        ) {
            const min = parseInt(json.wind_min_direction);
            const max = parseInt(json.wind_max_direction);
            const diff = (max - min + 360) % 360;
            const center = (min + diff / 2) % 360;

            mancheAir.style.transform = `rotate(${center}deg)`;

            backPiste.style.display = "block";
            backPiste.style.transform = `rotate(${min}deg)`;
            backPiste.style.background = `conic-gradient(hex(ff8f0) ${diff}deg, transparent 0deg)`;

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
        const windDir = data.wind_direction;
        const windStr = data.wind_string;

        let activeRunway = "02"; // Default to 02

        if (windStr !== "CALM" && typeof windDir === "number") {
            if (windDir > 180 && windDir < 270) {
                activeRunway = "02";
            } else {
                activeRunway = "20";
            }
        }

        const runways = ["02", "20"];

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
            const crossCFiltered = Math.abs(crosswind);
            pCrosswind.textContent = `${crossCFiltered}kt`;

            const crossHFiltered = Math.abs(headwind);
            pHeadwind.textContent = `${crossHFiltered}kt`;

            const dir = data.wind_direction; // 0 to 360
            const hasCrosswind = crosswind !== 0;
            const hasHeadwind = headwind !== 0;

            // Clear existing classes
            pCrosswind.className = "";
            pHeadwind.className = "";
            img.className = "";

            // Determine visual direction based only on wind_direction (absolute 0–360)
            if (crosswind === 0) {
                pCrosswind.classList.add("hidden");
            } else if (dir >= 0 && dir < 180) {
                pCrosswind.classList.add("right");
            } else if (dir >= 180 && dir < 360) {
                pCrosswind.classList.add("left");
            } else {
                pCrosswind.classList.add("right");
            }
            //  else if (dir === 'VRB') {
            //   pCrosswind.classList.add("hidden");
            // }

            if (headwind === 0) {
                pHeadwind.className.add("hidden")
            } else if (dir >= 180 && dir < 270) {
                pHeadwind.classList.add("bttm");
            } else {
                pHeadwind.classList.add("up");
            }



            if (dir >= 0 && dir < 90) {
                img.classList.add("leftNbottom"); // 0° to 89°
            } else if (dir >= 90 && dir < 180) {
                img.classList.add("leftNup"); // 90° to 179°
            } else if (dir >= 180 && dir < 270) {
                img.classList.add("rightNup"); //180° to 269°
            } else if (dir >= 270 && dir < 360) {
                img.classList.add("rightNbottom"); //270° to 359°
            } else {
                img.classList.add("down"); // fallback
            }

            // Update arrow image
            img.src = (hasHeadwind && hasCrosswind)
                ? "../../assets/wind arrows.svg"
                : "../../assets/wind arrow.svg";
            // const one = 0
            const windStr = data.wind_string;
            if (windStr === "CALM") {
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
