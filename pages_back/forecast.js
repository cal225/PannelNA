document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".weatherUpdate");

  // WeatherAPI key and endpoint
  const apiKey = "95e866d055a843c0bb882659251405";
  const location = "pontarlier";
  const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=1&aqi=no&alerts=no`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const hours = data.forecast.forecastday[0].hour;
      const currentUTC = new Date().getUTCHours();

      // Get H-1, H, H+1
      const displayHours = [
        hours.find((h) => new Date(h.time).getUTCHours() === currentUTC),
        hours.find((h) => new Date(h.time).getUTCHours() === currentUTC + 2),
        hours.find((h) => new Date(h.time).getUTCHours() === currentUTC + 4),
      ];

      container.innerHTML = ""; // Clear previous content

      displayHours.forEach((hour) => {
        if (!hour) return; // Skip null values (e.g., around midnight)

        const utcHour = new Date(hour.time).getUTCHours();
        const formattedHour = utcHour.toString().padStart(2, "0");
        const icon = getCustomIcon(hour.condition.code, hour.is_day);

        container.innerHTML += `
          <div class="previsiont">
            <p>${formattedHour}:00 <span>UTC</span></p>
            <img src="${icon}" alt="${hour.condition.text}">
          </div>
        `;
        // console.log(data);
      });
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error);
      container.innerHTML = `<p>Erreur météo</p>`;
    });
});

function getCustomIcon(code, isDay) {
  const map = {
    1000: "clear", // Sunny / Clear
    1003: "cloudy-1",
    1006: "cloudy-2",
    1009: "cloudy",
    1030: "fog",
    1063: "rainy-1",
    1066: "snowy-1",
    1069: "snow-and-sleet-mix",
    1072: "frost",
    1087: "isolated-thunderstorms",
    1114: "snowy-2",
    1117: "snowy-3",
    1135: "fog",
    1147: "fog",
    1150: "rainy-1",
    1153: "rainy-1",
    1168: "rainy-2",
    1171: "rainy-3",
    1180: "rainy-1",
    1183: "rainy-2",
    1186: "rainy-2",
    1189: "rainy-2",
    1192: "rainy-3",
    1195: "rainy-3",
    1198: "rain-and-sleet-mix",
    1201: "rain-and-sleet-mix",
    1204: "snow-and-sleet-mix",
    1207: "snow-and-sleet-mix",
    1210: "snowy-1",
    1213: "snowy-1",
    1216: "snowy-2",
    1219: "snowy-2",
    1222: "snowy-3",
    1225: "snowy-3",
    1237: "hail",
    1240: "rainy-1",
    1243: "rainy-2",
    1246: "rainy-3",
    1249: "rain-and-sleet-mix",
    1252: "rain-and-sleet-mix",
    1255: "snowy-2",
    1258: "snowy-3",
    1261: "hail",
    1264: "hail",
    1273: "scattered-thunderstorms",
    1276: "severe-thunderstorm",
    1279: "snowy-2",
    1282: "snowy-3",
  };

  let base = map[code] || "cloudy";

  // Add day/night variant if available
  const hasDayNight = [
    "clear",
    "cloudy-1",
    "cloudy-2",
    "cloudy-3",
    "fog",
    "frost",
    "haze",
    "isolated-thunderstorms",
    "rainy-1",
    "rainy-2",
    "rainy-3",
    "scattered-thunderstorms",
    "snowy-1",
    "snowy-2",
    "snowy-3",
  ];

  if (hasDayNight.includes(base)) {
    base += isDay ? "-day" : "-night";
  }

  return `../../assets/animated/${base}.svg`;
}
