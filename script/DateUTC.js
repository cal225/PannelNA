function updateUtcClock() {
    const now = new Date();
    const utcHours = String(now.getUTCHours()).padStart(2, '0');
    const utcMinutes = String(now.getUTCMinutes()).padStart(2, '0');
    const timeStr = `${utcHours}:${utcMinutes}`;
    document.getElementById("utc-time").textContent = timeStr;
}

setInterval(updateUtcClock, 1000); // update every second
updateUtcClock(); // run immediately