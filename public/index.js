const syncBtn = document.querySelector("#syncDataBtn");
const modal = document.querySelector("#syncConfirmModal");
const syncYes = document.querySelector("#syncYes");
const syncNo = document.querySelector("#syncNo");

let pendingLaps = [];
let pendingRunners = [];

document.addEventListener("DOMContentLoaded", () => {
    setupNavigation();
    setupSync();
});

function setupNavigation() {
    const goTo = (path) => window.location.href = path;

    const panels = [
        { selector: ".top", path: "timer.html", label: "Start timer" },
        { selector: ".middle", path: "association.html", label: "Runner association" },
        { selector: ".bottom", path: "results.html", label: "View results" },
    ];

    for (const { selector, path, label } of panels) {
        const el = document.querySelector(selector);
        if (!el) continue;

        el.setAttribute("role", "button");
        el.setAttribute("tabindex", "0");
        el.setAttribute("aria-label", label);

        el.addEventListener("click", () => goTo(path));
        el.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                goTo(path);
            }
        });
    }
}

function setupSync() {
    syncBtn?.addEventListener("click", handleSyncClick);
    syncYes.addEventListener("click", performSync);
    syncNo.addEventListener("click", hideSyncModal);
}

function handleSyncClick() {
    pendingLaps = JSON.parse(localStorage.getItem("offlineLaps") || "[]");
    pendingRunners = JSON.parse(localStorage.getItem("offlineRunners") || "[]");

    if (pendingLaps.length === 0 && pendingRunners.length === 0) {
        alert("No offline data to sync.");
        return;
    }

    modal.classList.remove("hidden");
}

function hideSyncModal() {
    modal.classList.add("hidden");
}

async function performSync() {
    modal.classList.add("hidden");

    let lapsUploaded = false;
    let runnersUploaded = false;

    try {
        if (pendingLaps.length > 0) {
            const lapResponse = await fetch('/save-all-laps', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pendingLaps)
            });
            if (lapResponse.ok) lapsUploaded = true;
        } else {
            lapsUploaded = true;
        }

        if (pendingRunners.length > 0) {
            const runnerResponse = await fetch('/save-all-runners', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pendingRunners)
            });
            if (runnerResponse.ok) runnersUploaded = true;
        } else {
            runnersUploaded = true;
        }

        if (lapsUploaded && runnersUploaded) {
            localStorage.removeItem("offlineLaps");
            localStorage.removeItem("offlineRunners");
            alert("Sync complete. Local data cleared.");
        } else {
            alert("Partial sync completed. Local data preserved.");
        }
    } catch (err) {
        alert("Sync failed. Local data preserved.");
    }
}
