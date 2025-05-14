document.addEventListener("DOMContentLoaded", () => {
  const times = SunCalc.getTimes(new Date(), 46.9, 6.3667); // Pontarlier

  const sunriseDisplay = document.querySelector('.dawn');
  const sunsetDisplay = document.querySelector('.dusk');

  const sunrise = times.sunrise;
  const sunset = times.sunset;

  const formatTime = (date) => {
    const hh = date.getUTCHours().toString().padStart(2, "0");
    const mm = date.getUTCMinutes().toString().padStart(2, "0");
    return `${hh}:${mm}`;
  };

  const leverSoleil = formatTime(sunrise);
  const coucherSoleil = formatTime(sunset);

  console.log("Lever du soleil (UTC):", leverSoleil);
  console.log("Coucher du soleil (UTC):", coucherSoleil);

  if (sunriseDisplay) sunriseDisplay.innerHTML = `${leverSoleil} UTC`;
  if (sunsetDisplay) sunsetDisplay.innerHTML = `${coucherSoleil} UTC`;
});
