const resetButton = document.querySelector("#resetDataButton");
const resetModal = document.querySelector("#resetModal");
const resetYes = document.querySelector("#resetYes");
const resetNo = document.querySelector("#resetNo");
const downloadCsvButton = document.querySelector("#downloadCsvButton");

document.addEventListener("DOMContentLoaded", handlePageLoad);

function handlePageLoad() {
    loadResults();
    setupListeners();
}

async function loadResults() {
    try {
        displayMessage("Loading results...");
        const [runners, laps] = await Promise.all([
            fetchJson("/runners.json"),
            fetchJson("/laps.json")
        ]);
        const combined = mergeData(runners, laps);
        makeTable(combined);
        displayMessage("");
    } catch (error) {
        displayMessage("Error loading results. Please try again.");
    }
}

function setupListeners() {
    resetButton.addEventListener("click", showResetModal);
    resetYes.addEventListener("click", resetData);
    resetNo.addEventListener("click", hideResetModal);
    downloadCsvButton.addEventListener("click", downloadCsv);
}

function showResetModal() {
    resetModal.classList.remove("hidden");
}

function hideResetModal() {
    resetModal.classList.add("hidden");
}

async function resetData() {
    try {
        await Promise.all([
            fetch("/clear-runners", { method: "POST" }),
            fetch("/clear-laps", { method: "POST" })
        ]);
        window.location.href = "/";
    } catch (err) {
        alert("Failed to reset data.");
    }
}

async function downloadCsv() {
    try {
        const [runners, laps] = await Promise.all([
            fetchJson("/runners.json"),
            fetchJson("/laps.json")
        ]);
        const combined = mergeData(runners, laps);
        const sorted = combined.sort((a, b) => a.position - b.position);
        const csvContent = generateCSV(sorted);

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "race_results.csv";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    } catch (err) {
        alert("Could not generate CSV. Try again.");
    }
}

async function fetchJson(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch ${url}`);
    return await response.json();
}

function mergeData(runners, laps) {
    return laps.map(lap => {
        const runner = runners.find(r => r.position === lap.position);
        return {
            position: lap.position,
            fullName: runner?.fullName ?? "—",
            time: lap.time
        };
    });
}

function generateCSV(data) {
    const headers = ["Position", "Full Name", "Time"];
    const rows = data.map(r => [r.position, `"${r.fullName}"`, r.time].join(","));
    return [headers.join(","), ...rows].join("\n");
}

function makeTable(data) {
    const sorted = data.sort((a, b) => a.position - b.position);
    const tbody = document.querySelector("table tbody");

    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }

    for (const runner of sorted) {
        const row = document.createElement("tr");

        const posCell = document.createElement("td");
        posCell.textContent = runner.position;

        const nameCell = document.createElement("td");
        nameCell.textContent = runner.fullName;

        const timeCell = document.createElement("td");
        timeCell.textContent = runner.time;

        row.appendChild(posCell);
        row.appendChild(nameCell);
        row.appendChild(timeCell);

        tbody.appendChild(row);
    }
}

function displayMessage(msg) {
    let el = document.querySelector("#statusMessage");
    if (!el) {
        el = document.createElement("div");
        el.id = "statusMessage";
        el.style.marginTop = "10px";
        el.style.color = "#f2c45d";
        el.style.fontSize = "1rem";
        document.body.insertBefore(el, document.body.children[1]);
    }
    el.textContent = msg;
}
