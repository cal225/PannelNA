async function loadFlights() {
    try {
        const res = await fetch("?page=5.4");
        const json = await res.json();
        console.log(json);

        const table = document.querySelector("table");
        if (!table) return;

        let tbody = table.querySelector("tbody");
        if (!tbody) {
            tbody = document.createElement("tbody");
            table.appendChild(tbody);
        }
        tbody.innerHTML = "";

        if (!json.data || json.data.length === 0) {
            const tr = document.createElement("tr");
            const td = document.createElement("td");
            td.colSpan = 6;
            td.textContent = "No flights available.";
            tr.appendChild(td);
            tbody.appendChild(tr);
            return;
        }

        json.data.slice(0, 17).forEach((flight) => {
            const tr = document.createElement("tr");
            tr.className = "tbRow";

            // Format date
            let etdFormatted = "";
            if (flight.Date) {
                const etdDate = new Date(flight.Date);

                const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
                    day: "2-digit",
                    month: "short",
                });

                const timeFormatter = new Intl.DateTimeFormat("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                });

                const datePart = dateFormatter
                    .format(etdDate)
                    .replace(".", "")
                    .replace(/ /g, "-");
                const timePart = timeFormatter.format(etdDate);

                etdFormatted = `<div class="ETDWrapper"><span class="flightDate">${datePart}</span> <span class="flightTime">${timePart} lt</span></div>`;
            }

            // const volText = flight.TypeVol || "PRIVÉ";
            // VOL cell
            let volText = "Privé";
            if (flight.TypeVol === "2") {
                volText = (flight.Instruction === "0") ? "Instruction" : flight.Instruction;
            }

            // 👇 EQUIPAGE formatting logic
            let equipageText = "-";
            if (flight.NomClient && flight.PrenomClient) {
                const initials = `${flight.PrenomClient.charAt(0)}. ${flight.NomClient}`;

                if (flight.TypeVol === "2") {
                    const fiDisplay = flight.FI === "SOL" ? "---" : (flight.FI || "?");
                    equipageText = `<div class="equipageFIWrapper equiP"><span>${initials} / ${fiDisplay}</span></div>`;
                } else {
                    equipageText = `<div class="equipageWrapper equiP"><span class="clientInitials">${initials}</span></div>`;
                }
            }



            const cells = [
                { text: etdFormatted, cls: "ETD" },
                // { text: "-", cls: "DEST" }, // Still no destination
                { text: equipageText, cls: "EQUIPAGE" },
                { text: flight.Avion || "-", cls: "PLANE" },
                { text: volText, cls: "VOL" },
                // { text: "-", cls: "DISPO" }, // Still no availability
            ];

            cells.forEach(({ text, cls }) => {
                const td = document.createElement("td");
                td.className = `tbCell ${cls}`;
                td.innerHTML = text;
                tr.appendChild(td);
            });

            tbody.appendChild(tr);
        });
    } catch (err) {
        console.error("Error loading flights:", err);
    }
}

window.onload = loadFlights;
