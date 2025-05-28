const confirmationEl = document.querySelector("#confirmationMessage");
const formEl = document.querySelector("#associationForm");
const viewResultsButton = document.querySelector("#viewResultsButton");
const confirmResultsModal = document.querySelector("#confirmResultsModal");
const confirmResultsYes = document.querySelector("#confirmResultsYes");
const confirmResultsNo = document.querySelector("#confirmResultsNo");
const fullNameEl = document.querySelector("#fullName");
const bibNumberEl = document.querySelector("#bibNumber");
const positionEl = document.querySelector("#position");

document.addEventListener("DOMContentLoaded", initPage);

function initPage() {
    confirmationEl.textContent = "JS has connected";
    setupEventListeners();
}

function setupEventListeners() {
    formEl.addEventListener("submit", handleFormSubmit);
    viewResultsButton.addEventListener("click", showConfirmModal);
    confirmResultsYes.addEventListener("click", finalizeResults);
    confirmResultsNo.addEventListener("click", hideConfirmModal);
}

async function handleFormSubmit(e) {
    e.preventDefault();

    const fullName = fullNameEl.value.trim();
    const bibNumber = parseInt(bibNumberEl.value.trim());
    const position = parseInt(positionEl.value.trim());

    try {
        const runners = await fetchRunners();
        updateRunner(runners, fullName, bibNumber, position);
        await saveRunners(runners);
        displayMessage("Runner associated successfully.");
    } catch (err) {
        displayMessage("Saved locally. Will sync when online.");
    }

    formEl.reset();
}

function showConfirmModal() {
    confirmResultsModal.classList.remove("hidden");
}

function hideConfirmModal() {
    confirmResultsModal.classList.add("hidden");
}

async function finalizeResults() {
    try {
        const localRunners = JSON.parse(localStorage.getItem("offlineRunners") || "[]");

        if (localRunners.length > 0) {
            await fetch("/save-all-runners", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(localRunners)
            });
            localStorage.removeItem("offlineRunners");
        }

        hideConfirmModal();
        window.location.href = "/results";
    } catch (err) {
        displayMessage("Couldn't finalize results. Try again.");
        hideConfirmModal();
    }
}

function displayMessage(message) {
    confirmationEl.textContent = message;
}

async function saveRunners(runners) {
    try {
        const response = await fetch("/save-all-runners", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(runners)
        });

        if (!response.ok) throw new Error("Server failed");
        return await response.text();
    } catch (err) {
        saveRunnersOffline(runners);
        throw err;
    }
}

function saveRunnersOffline(runners) {
    localStorage.setItem("offlineRunners", JSON.stringify(runners));
}

async function fetchRunners() {
    const response = await fetch("/runners.json");
    if (!response.ok) throw new Error("Failed to load runner data.");
    return await response.json();
}

function updateRunner(runners, fullName, bibNumber, position) {
    let runner = runners.find(r => parseInt(r.position) === position);

    if (runner) {
        runner.fullName = fullName;
        runner.bib = bibNumber;
    } else {
        runner = { position, fullName, bib: bibNumber };
        runners.push(runner);
    }

    return runner;
}
