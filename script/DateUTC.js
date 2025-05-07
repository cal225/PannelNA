function updateUtcClock() {
  const now = new Date();
  const utcHours = String(now.getUTCHours()).padStart(2, "0");
  const utcMinutes = String(now.getUTCMinutes()).padStart(2, "0");
  const utcDay = String(now.getUTCDate()).padStart(2, "0");
  const utcMonth = String(now.getUTCMonth() + 1).padStart(2, "0"); // getUTCMonth() is zero-based
  const utcYear = now.getUTCFullYear();

  const timeStr = `${utcHours}:${utcMinutes}`;
  const dateStr = `${utcDay}/${utcMonth}/${utcYear}`;
  const clockdateStr = `${utcDay}`;

  document.getElementById("utc-time").textContent = timeStr;
  document.getElementById("utc-date").textContent = dateStr;
  document.getElementById("utc-clock-date").textContent = clockdateStr;
}

setInterval(updateUtcClock, 1000); // update every second
updateUtcClock(); // run immediately

function updateClock() {
  const now = new Date();
  const LTDay = String(now.getDate()).padStart(2, "0");

  const clockdateStr = `${LTDay}`;

  document.getElementById("clock-date").textContent = clockdateStr;
}

setInterval(updateClock, 1000); // update every second
updateClock(); // run immediately
