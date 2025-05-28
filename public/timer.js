let startTime = null;
let timerInterval = null;
let running = false;
let positionCounter = 1;
let firstLapRecorded = false;

const startButton = document.querySelector("#startButton");
const stopButton = document.querySelector("#stopButton");
const runnersBox = document.querySelector(".runners-box");
const lapArea = document.querySelector("#lapArea");
const confirmModal = document.querySelector("#confirmFinishModal");
const confirmYes = document.querySelector("#confirmYes");
const confirmNo = document.querySelector("#confirmNo");
const timerDisplay = document.querySelector("#timerDisplay");
const runnerList = document.querySelector("#runnerList");
const saveStatus = document.querySelector("#saveStatus");

document.addEventListener("DOMContentLoaded", () => {
    setupUI();
    setupEventListeners();
    restoreState();
});

function setupUI() {
    startButton.style.display = "inline-block";
    stopButton.style.display = "none";
    stopButton.disabled = true;
    runnersBox.classList.add("hidden");
}

function setupEventListeners() {
    startButton.addEventListener("click", startTimer);
    stopButton.addEventListener("click", handleStopClick);
    lapArea.addEventListener("click", recordLap);
    confirmYes.addEventListener("click", confirmFinish);
    confirmNo.addEventListener("click", () => confirmModal.classList.add("hidden"));
}

function handleStopClick() {
    if (running) confirmModal.classList.remove("hidden");
}

async function confirmFinish() {
    clearInterval(timerInterval);
    running = false;
    confirmModal.classList.add("hidden");
    saveStatus.classList.remove("hidden");

    const laps = Array.from(runnerList.querySelectorAll("tr")).map(getLapData);

    try {
        const response = await fetch('/save-all-laps', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(laps)
        });
        if (!response.ok) throw new Error('Failed to save all laps');

        localStorage.removeItem("raceState");
        startTime = null;
        timerDisplay.textContent = "00:00:00";
        positionCounter = 1;
        startButton.style.display = "inline-block";
        stopButton.style.display = "none";

        window.location.href = "/association";
    } catch (err) {
        alert("Failed to save laps. Please try again.");
        saveStatus.classList.add("hidden");
    }
}

function startTimer() {
    if (running) return;
    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 1000);
    running = true;

    startButton.style.display = "none";
    stopButton.style.display = "inline-block";
    stopButton.disabled = false;

    persistState();
}

function stopTimer() {
    if (!running) return;
    clearInterval(timerInterval);
    running = false;
    stopButton.disabled = true;
    startButton.disabled = false;
    persistState();
}

function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}

function updateTimer() {
    const now = Date.now();
    const elapsed = now - startTime;
    timerDisplay.textContent = formatTime(elapsed);
}

function getLapData(row) {
    const cells = row.querySelectorAll("td");
    return {
        position: parseInt(cells[0].textContent),
        time: cells[1].textContent
    };
}

function persistState() {
    const laps = Array.from(runnerList.children).map(getLapData);
    const raceState = {
        startTime,
        running,
        positionCounter,
        laps
    };
    localStorage.setItem("raceState", JSON.stringify(raceState));
}

function restoreState() {
    const saved = localStorage.getItem("raceState");
    if (!saved) return;

    const { startTime: savedStart, running: wasRunning, positionCounter: savedCounter, laps } = JSON.parse(saved);

    if (laps && laps.length > 0) {
        for (const { position, time } of [...laps].reverse()) {
            addRunnerRow(position, time);
        }
        runnersBox.classList.remove("hidden");
        firstLapRecorded = true;
    }

    positionCounter = savedCounter || 1;
    startTime = savedStart;

    if (wasRunning && startTime) {
        running = true;
        timerInterval = setInterval(updateTimer, 1000);
        startButton.style.display = "none";
        stopButton.style.display = "inline-block";
    } else {
        startButton.style.display = "inline-block";
        stopButton.style.display = "none";
    }

    startButton.disabled = wasRunning;
    stopButton.disabled = !wasRunning;
}

function addRunnerRow(position, time) {
    const row = document.createElement("tr");

    const positionCell = document.createElement("td");
    positionCell.textContent = `${position}`;

    const timeCell = document.createElement("td");
    timeCell.textContent = time;

    row.appendChild(positionCell);
    row.appendChild(timeCell);

    if (runnerList.firstChild) {
        runnerList.insertBefore(row, runnerList.firstChild);
    } else {
        runnerList.appendChild(row);
    }
}

async function recordLap() {
    if (!running) return;
    if (!firstLapRecorded) {
        runnersBox.classList.remove("hidden");
        firstLapRecorded = true;
    }
    const now = Date.now();
    const elapsed = now - startTime;
    const formattedTime = formatTime(elapsed);

    addRunnerRow(positionCounter, formattedTime);
    await saveLap(positionCounter, formattedTime);

    positionCounter++;
    persistState();
}

async function saveLap(position, time) {
    const lap = { position, time };
    try {
        const response = await fetch('/save-lap', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(lap)
        });
        if (!response.ok) throw new Error("Offline or server error");
    } catch (err) {
        const stored = JSON.parse(localStorage.getItem("offlineLaps") || "[]");
        stored.push(lap);
        localStorage.setItem("offlineLaps", JSON.stringify(stored));
    }
}
