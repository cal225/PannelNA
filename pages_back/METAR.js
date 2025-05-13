async function fetchAviationData(icaoCode, metarToken) {
  const metarUrl = `https://avwx.rest/api/metar/${icaoCode}`;
  const tafUrl = `https://avwx.rest/api/taf/${icaoCode}`;
  const wrapper = document.querySelector(`.codeWrapper[data-icao="${icaoCode}"]`);

  if (!wrapper) return;

  const metarP = wrapper.querySelector(".MetarCode");
  const tafP = wrapper.querySelector(".TafCode");

  try {
    const [metarRes, tafRes] = await Promise.all([
      fetch(metarUrl, {
        headers: {
          Authorization: metarToken,
          Accept: "application/json"
        }
      }),
      fetch(tafUrl, {
        headers: {
          Authorization: metarToken,
          Accept: "application/json"
        }
      })
    ]);

    // METAR
    if (metarRes.ok) {
      const metarData = await metarRes.json();
      metarP.textContent = metarData.raw || "No METAR available";
    } else {
      metarP.textContent = "Error fetching METAR";
    }

    // TAF
    if (tafRes.ok) {
      const tafData = await tafRes.json();
      tafP.textContent = tafData.raw || "No TAF available";
    } else {
      tafP.textContent = "No TAF data";
    }
  } catch (err) {
    console.error(`Failed to fetch data for ${icaoCode}:`, err);
    metarP.textContent = "Error loading METAR";
    tafP.textContent = "Error loading TAF";
  }
}

// Get token from PHP
// const METAR = "<?= getenv('METAR') ?>";

// Airports
["LFGJ", "LSGC"].forEach(code => fetchAviationData(code, METAR));
