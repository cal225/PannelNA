function updateUtcClock() {
  const now = new Date();
  const utcHours = String(now.getUTCHours()).padStart(2, "0");
  const utcMinutes = String(now.getUTCMinutes()).padStart(2, "0");
  const utcDay = String(now.getUTCDate()).padStart(2, "0");
  const utcMonth = String(now.getUTCMonth() + 1).padStart(2, "0"); // getUTCMonth() is zero-based
  const utcYear = now.getUTCFullYear();

  const timeStr = `${utcHours}:${utcMinutes}`;
  const dateStr = `${utcDay}/${utcMonth}/${utcYear}`;

  document.getElementById("utc-time").textContent = timeStr;
  document.getElementById("utc-date").textContent = dateStr;
}
function updateLocalClock() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  const timeStr = `${hours}:${minutes}`;

  const ltTimeEl = document.getElementById("lt-time");
  if (ltTimeEl) ltTimeEl.textContent = timeStr;
}

setInterval(updateLocalClock, 1000);
updateLocalClock();


setInterval(updateUtcClock, 1000); // update every second
updateUtcClock(); // run immediately

