async function getWeather(icaoCode) {
  const url = `https://avwx.rest/api/metar/${icaoCode}`;
  const response = await fetch(url, {
    headers: {
      'Authorization': 'Bearer rDahirOQPf9u5UajlxNP7GbD_rJDSEjbFTNRRfe2CMo',
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    console.error(`Error fetching METAR for ${icaoCode}:`, response.statusText);
    return;
  }

  const data = await response.json();
  console.log(data); // You can now use this in your UI
}

getWeather("LFGJ");
getWeather("LSGC");
