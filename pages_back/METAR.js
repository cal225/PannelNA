async function fetchAviationData(icaoCode) {
  const wrapper = document.querySelector(`.codeWrapper[data-icao="${icaoCode}"]`);
  if (!wrapper) return;

  const metarP = wrapper.querySelector(".MetarCode");
  const tafP = wrapper.querySelector(".TafCode");

  try {
    const response = await fetch(`/path/to/aviation_cache.php?icao=${icaoCode}`);
    if (!response.ok) throw new Error("API error");

    const data = await response.json();
    metarP.textContent = data.metar || "No METAR";
    tafP.textContent = data.taf || "No TAF";
  } catch (err) {
    console.error(`Error loading aviation data for ${icaoCode}:`, err);
    metarP.textContent = "Error METAR";
    tafP.textContent = "Error TAF";
  }
}

// Call for multiple airports
["LFGJ", "LSGC"].forEach(code => fetchAviationData(code));
