document.addEventListener("DOMContentLoaded", () => {
  const windDisplay = document.querySelector(".metarWind p");
  const dewpointDisplay = document.querySelector(".rose p");
  const qnh = document.querySelector('.QNH p')
  const zd = document.querySelector('.pressure')

  fetch("./?page=5")
    .then((response) => response.text()) // read as raw text
    .then((text) => {
      console.log("Réponse brute du serveur:", text);

      try {
        const json = JSON.parse(text); // parse to JSON
        console.log("Données JSON valides:", json);

        //left side
        windDisplay.textContent = json.wind_string || "Pas de données vent"; // Show wind string

        //right side
        const temp = json.temperature;
        const dewpoint = json.dewpoint;

        // Correct way to set text content for temperature and dewpoint
        dewpointDisplay.textContent = `${temp}° / ${dewpoint}°` || "données illisible";
        qnh.textContent = `Q${json.qnh}` || "Pas de données QNH";
        zd.textContent = `Zd : ${json.zd} ft` || "Pas de données QNH";

      } catch (err) {
        console.error("Erreur JSON:", err);
      }
    })
    .catch((error) => {
      console.error("Erreur réseau:", error);
    });
});
