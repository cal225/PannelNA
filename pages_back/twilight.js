document.addEventListener("DOMContentLoaded", () => {
  fetch("/?page=5.1")
    .then(res => res.json())
    .then(data => {
      const sunriseDisplay = document.querySelector('.dawn');
      const sunsetDisplay = document.querySelector('.dusk');

      if (sunriseDisplay) sunriseDisplay.textContent = `${data.sunrise} UTC`;
      if (sunsetDisplay) sunsetDisplay.textContent = `${data.sunset} UTC`;

      console.log("Lever du soleil (UTC):", data.sunrise);
      console.log("Coucher du soleil (UTC):", data.sunset);
    })
    .catch(err => console.error("Erreur récupération suncalc:", err));
});