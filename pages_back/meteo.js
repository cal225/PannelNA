let lastRequestTime = 0;
const debounceTime = 1000; // 1 second delay between requests

document.addEventListener("DOMContentLoaded", () => {
  const windDisplay = document.querySelector(".metarWind p");
  const dewpointDisplay = document.querySelector(".rose p");
  const pressure = document.querySelector('.METAR_bottom')

  // Initial data fetch
  fetchData();

  // Function to handle fetching data
  function fetchData() {
    const currentTime = new Date().getTime();

    // Prevent sending a request if the last one was sent too recently
    if (currentTime - lastRequestTime < debounceTime) {
      console.log("Request too fast, skipping this one.");
      return;
    }

    lastRequestTime = currentTime; // Set the time of the current request

    // Fetch the METAR data
    fetch("./?page=5")
      .then((response) => response.text()) // read as raw text
      .then((text) => {
        console.log("Réponse brute du serveur:", text);

        try {
          const json = JSON.parse(text); // parse to JSON
          console.log("Données JSON valides:", json);

          // Check if temperature and dewpoint data exist
          if (!json || !json.temperature || !json.dewpoint) {
            console.error("Invalid or missing data:", json);
            return;
          }

          const temp = json.temperature;
          const dewpoint = json.dewpoint;

          const qnh = json.qnh;
          const zd = json.zd

          // Update the dewpoint and wind display
          dewpointDisplay.textContent = `${temp}° / ${dewpoint}°`;
          windDisplay.textContent = json.wind_string || "Pas de données vent";
          pressure.innerHTML =  `
          <div class="QNH">
            <img class="pressureIcon" src="../../assets/small heavy pressure icon.svg" alt="">
            <p>${qnh}</p>
        </div>
        <div class="pressure">
            <p class="capitalize">Zd ${zd} <span class="lowercase">ft</span></p>
        </div>`;
        } catch (err) {
          console.error("Erreur de parsing JSON:", err);
        }
      })
      .catch((error) => {
        console.error("Erreur réseau:", error);
      });
  }
});
