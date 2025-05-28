# Race Control App – by up2246858

## Key Features

This web app allows a user to time races, record runners results, and sync data while offline. It was built with JavaScript and an Express Server in line with coursework specification.

All data is persisted either via the server (to JSON files) or via `localStorage` when offline, with manual sync support.

* Start and Stop a race timer
* Record finish times for runners via a tappable interface
* Associate runners with name and positions
* Store all race data locally when offline
* Manual sync button to upload data when back online
* Download results as CSV for easy reporting
* Clear all race data from device and server with confirmation
* State restoration in case of accidental page reload or navigation

---

### How to use
```bash
npm install
npm run setup
npm start       #runs on http://localhost:8080
```

### Pages
1. `/index`: Allows navigation to the three main functional pages, with manual sync data page
2. `/timer`: Start timer and tap to record runner times
3. `/association`: Assign names and bib numbers to finish positions
4. `/results`: View race results, export CSV, reset data

### Offline Mode
* Works in airplane mode
* Stores finish times and bib data using `localStorage`
* Press Sync Data on homepage to upload stored data

---

### 1. Start a Race Timer

**How to find it:** Navigate to `/timer`.  
**How to use it:** Click the **Start** button to begin the race.  
**Design decisions:**  
* The timer runs continuously and updates the display every second.
* To record every time a runner crosses the line, the circle is tapped; making it easier to tap continuously for concurrent finishes and ease in recording results
* The state of the timer is still running in the background and saved across pages using `localStroage`
* The **Finish** button only appears after the race to prevent premature interaction

---

### 2. Record Finish Times

**How to find it:** (in `/timer`) Tap the large circular area during the race.  
**How to use it:** Each tap logs a runner crossing the line with the elapsed time.  
**Design decisions:**  
* Laps are associated with an incrementing position and prepended to the top so the most recent runner time is viewed
* Lap times saved to `laps.json` if online, or stored in `localStorage` if offline.
* When synced, locally stored data is uploaded and merged with server data


---

### 3. Associate Runners to Positions

**How to find it:** Go to `/association`
**How to use it:** Enter a runner's full name, bib number, and their race position.  
**Design decisions:**  
* Data is merged with existing records on the server to be dispalyed on the **Results Page**

---

### 4. Offline Support & Manual Sync

**How to find it:** The **Sync Data** button is available on the home screen.  
**How to use it:** Tap it to upload locally stored laps/runners to the server.  
**Design decisions:**  
* Uses `localStorage` to track laps and runners if offline.
* Uploads them using `fetch()` and appends to server data
* Data is cleared only if the upload was successful

---

### 5. Reset and Return

**How to find it:** **Reset Data** Button at the bottom of `/results`  
**How to use it:** Clears all race data and returns to the homepage
**Design decisions:**  
* Confirms decision with a modal before wiping.
* Resets both runners and laps server json files

---

### 6. Export Results as CSV

**How to find it:** On `/results`, use the **Download CSV** button.  
**How to use it:** Click to export a table of all positions, names, and finish times.  
**Design decisions:**  
* Uses `Blob` and `URL.createObjectURL()` to generate the CSV file
* Includes empty names if no association was made.

---

## AI Usage

### What I Used AI For
When the module began, I had no prior knowledge of JavaScript, but I knew my way around HTML and CSS. After the lab sessions, I began using AI, specifically ChatGPT, to enhance my understanding of key JS concets such as query selectors, event listeners, and asynchronous functions. 

AI was especially useful for debugging and understanding how best to structure my code. I used it to guide me through errors, but to avoid over reliance, I regularly added phrases like "Don't generate full code" to ensure the AI focused on teaching me rather than solving everything for me.

---

### Prompts to develop HTML files

> What is the business-standard way to construct the head of an HTML file?

````bash 
meta charset="UTF-8"
````
ensures proper text encoding.


````bash
meta name="viewport" 
````
enables mobile responsiveness by controlling layout on smaller screens.

The title tag improves SEO and helps users understand the page purpose from browser tabs.

Optionally, you might also include:
````bash
meta name="description" content="Brief description of the page"
meta name="author" content="Your Name"
````
These are useful for SEO and project clarity in professional environments.

**I was struggling in the beginning to start on development so I needed a kick start before I fell back into what I knew.**

---

### Prompts to improve visual styling (CSS-only checkered flag)

> okay so i'm trying to create a checkered fag for my css file the best way i could come up with was this: 
````html
<<div class="icon flag">
            div class="flag-box">
            <div></div><div></div><div></div><div></div>
            <div></div><div></div><div></div><div></div>
            <div></div><div></div><div></div><div></div>
            </div>
        </div> 
````
this is the css code: 
```` css 
.flag-box div:nth-child(odd):nth-child(-n+4),
.flag-box div:nth-child(even):nth-child(n+5):nth-child(-n+8),
.flag-box div:nth-child(odd):nth-child(n+9):nth-child(-n+12) {
    background-color: #f2c45d;
````
**Although ChatGPT suggested an alternative, I chose not to follow the suggested improvements as I didnt fully understand the route it took and whilst it isn't the most modular piece og code, it doesn't take away from the core functionality as it just generates an image.**

---
### formatting the Timer
> how would i create a function, let's call it formatTime that increments the clock

To create a formatTime function that increments a clock and returns a formatted string (e.g., HH:MM:SS), you need two things:

A stateful timer (like a startTime saved as a timestamp).

A function that computes the elapsed time based on Date.now() and formats it.

Here’s how you would define formatTime:

````js
function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}
````
**I decided to directly copy this function as it is the standard way to convert milliseconfs to HH:MM:SS. The logic behind it isn't unique as it's the same across dozens of applications, so copying this doesn't inhibit the individuality of my code.**

---
### Console.logs
> are console logs important and when is best use them

es, console.log() is important — but how and when you use it matters. Here's a breakdown to help you use it effectively, especially in the context of your project.

✅ Why and When to Use console.log()
1. Debugging logic
Use it to understand what your code is doing:

````js
console.log("Runner submitted:", runner);
````
This helps you verify variables contain what you expect at a certain point.

2. Tracking flow
You can log when a certain function or conditional is reached:

````js
console.log("Lap recorded successfully");
````
3. Spotting errors early
Instead of waiting for a bug to show in the UI, logs can give you early warnings:

````js
console.warn("No runner data found for position:", position);
````
🚫 When Not to Use console.log() (or when to remove it)
After deployment:
Logging personal data or excessive logs in production can clutter the console or expose private info.

Too many logs:
Logging every small thing (e.g. every millisecond update in a timer) can flood your console and make it hard to read.

Redundant logs:
If you're logging the same unchanged value repeatedly, it adds noise without insight.

💡 Better Alternatives in Some Cases
Use console.error() for serious failures (like a failed fetch).

Use console.table() to print arrays or objects cleanly.

Use debugger; if you're using dev tools and want to pause execution at a point.

In Your App
For your race timing app, logs were useful during:

Fetching data from /laps.json and /runners.json

Diagnosing why merges failed (console.log('Laps:', laps))

Checking which data was uploaded during sync

But it's good practice to remove or comment out any logs you don’t need anymore — especially those that just confirm something obvious.


---
### Understanding event listeners

> what’s the difference between .addEventListener('click', function) and .onclick = function? also, how do I use async and await inside an event listener without it breaking should I wrap everything in try/catch?

.addEventListener('click', someFunction) vs .onclick = someFunction:

.addEventListener() is the preferred modern way because it allows multiple listeners on the same event. You can attach several callbacks to the same event without overwriting the previous ones.

.onclick = someFunction is more old-school and overwrites any existing click handler. You can only have one at a time.

Using async/await inside event listeners:

Yes, you can absolutely use async/await inside an event listener. Just declare the callback as async — like async function handleClick(e) { ... }.

It's best practice to wrap your await logic in a try/catch so you can catch any network or runtime errors cleanly and give feedback to the user (e.g., show an error message or retry).

This approach is clean, readable, and makes asynchronous code much easier to follow than chaining .then() callbacks.

> how would i structure it? for example i want click to navigate to a page

To structure an event handler that navigates to another page, you can use either .onclick = function() or .addEventListener('click', function).

Here’s a breakdown:

* .onclick = function() is simpler for single-use handlers:
````js
document.getElementById('myButton').onclick = function () {
  window.location.href = 'target.html';
};
````
* .addEventListener('click', function) is more flexible and preferred for multiple listeners:

````js
document.getElementById('myButton').addEventListener('click', () => {
  window.location.href = 'target.html';
});
````
If your navigation depends on an asynchronous task (e.g., verifying a condition or saving data), you can structure the function like this:

````js
document.getElementById('myButton').addEventListener('click', async () => {
  try {
    await someAsyncCheck();
    window.location.href = 'next.html';
  } catch (err) {
    console.error("Navigation failed:", err);
    alert("Could not proceed.");
  }
);
````
Yes, always use try/catch with await in event listeners to avoid unhandled rejections and provide user feedback if something goes wrong.

---
### Prompts to get Modal to hide
> i'm adding a modal for confirmation. how would i make it disappear as right now it's always visible right now. 

*To control modal visibility, you'll want to toggle the .hidden class on the modal container (#syncConfirmModal) using JavaScript event listeners.*

*Since you’ve already defined .modal.hidden { display: none; }, you can use classList.remove("hidden") to show the modal and classList.add("hidden") to hide it again.*

*This setup lets your modal stay hidden by default (class="modal hidden") and appear only when needed. It also ensures your sync logic only runs after confirmation from the user.*

*For accessibility, consider using aria-hidden or role="dialog" as well, but your core logic here is sound and consistent with best practice.*

---
### Understanding Express Routing
> what's the difference between app.post and app.get and when should I use one over the other in my server?

app.get('/something', ...) is used when the client (usually the browser) wants to retrieve data from the server. It’s like saying, “Give me this thing.”

📦 Examples:

Viewing race results:
app.get('/results', ...)

Fetching JSON files:
app.get('/laps.json', ...)

app.post('/something', ...) is used when the client wants to send data to the server. It’s like saying, “Here’s some new info, please save it.”

📝 Examples:

* Submitting a new lap time:
    app.post('/save-lap', ...)

* Uploading a batch of runners:
    app.post('/save-all-runners', ...)

When to Use Each
* Use GET when the request is safe, meaning it won’t change server data.
* Use POST when the request modifies or adds data to the server (e.g. form submissions, race sync).

💡 Bonus:
If you’re building RESTful APIs, follow this rule:

* GET /laps → get all laps
* POST /laps → add a new lap


---
### Prompts to build a working server
> i'm so confused!!! i've been trying to run my server using express and i don't know why it's not working. it's listening for port 8080 and i don't know what's wrong??????
````js
import express = require('express');
import fs = require('fs');
import path = require('path');

const app = express();
app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => res.sendFile(__dirname + '/public/index.html'));

// Save lap
app.post('/save-lap', (req, res) => {
  const laps = require('./laps.json');
  laps.push(req.body);
  fs.writeFileSync('./laps.json', JSON.stringify(laps));
  res.send('Saved');
});

app.listen(8080, () => console.log('Running on 8080'));
````
Response: There are a few issues in your server code that could be causing problems:

1. Syntax Error:
The line:
````js
import express = require('express');
````
mixes ESModules with CommonJS. If your project is using "type": "module" in package.json, you should use:

````js
import express from 'express';
````
Similarly, for other modules, replace require(...) with import ... from.

2. require(...) inside .post():
Using require('./laps.json') like this reuses a cached version, so your changes won’t persist. Instead, use fs.readFileSync and parse the JSON every time:
````js
let laps = [];
if (fs.existsSync('./laps.json')) {
  const data = fs.readFileSync('./laps.json', 'utf8');
  laps = JSON.parse(data || '[]');
}
````
3. Using __dirname in ESModules:
If you're using ESModules ("type": "module"), __dirname isn’t defined by default. You’ll need to construct it manually:
````js
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
````
**I decided to follow ChatGPT's advice because I realised that the issus it highlighted were causing my server to fail. The use of require alongside import was something I didn't know was problemnatic. The explanation helped me understand how to yse fileURLToPath to define dirname. I asjusted my server.js to handle edge cases like empty JSONs.**

---
### Merging data to display Results
> this function doesn't work like i want it to. it's supposed to merge laps and runners by position so every clicked finish is listed, even if not associated with a name but it's skipping results. whyyy (no code please)
````js
function mergeData(runners, laps) {
    return runners.map(runner => {
        const lap = laps.find(l => l.position === runner.position);
        return {
            position: runner.position,
            fullName: runner.fullName,
            time: lap.time
        };
    })
}
````

The issue here is that you’re iterating over runners, not laps. That means if a runner hasn’t been associated with a name yet (i.e., no runner exists for that position), their lap won’t be included at all in the results.

Also, if a matching lap isn’t found for a runner, lap.time will throw an error because lap is undefined.

To fix this, iterate over laps instead—since every finish time matters—and then try to find a matching runner for each one. That way, all finishes are listed even if no name was submitted yet. You can handle missing names with a fallback like "—".

---
### Understanding Promise.all()
> what does promise.all do and when should i use it

Promise.all() is a method in JavaScript used to run multiple asynchronous operations in parallel and wait until all of them have completed (or until one fails).

What it does:
````js
Promise.all([promise1, promise2, promise3])
````
* It takes an array of promises.
* It waits for all promises to resolve.
* If all succeed, it returns an array of results, in the same order as the input.
* If any one fails (rejects), the entire Promise.all() fails immediately with that error.

Example:
````js
const [runners, laps] = await Promise.all([
  fetch("/runners.json").then(res => res.json()),
  fetch("/laps.json").then(res => res.json())
]);
````
This is faster than:
````js
const runners = await fetch("/runners.json").then(res => res.json());
const laps = await fetch("/laps.json").then(res => res.json());
````
...because the second fetch won’t even start until the first one finishes. With Promise.all, both fetches begin at the same time.

When to use Promise.all:
✅ Use it when:

* You want to run multiple async tasks at the same time.
* All the results are needed to proceed.
* The tasks are independent (i.e., one doesn’t depend on the other).

❌ Don’t use it when:
* You want to handle each result individually as it arrives.
* You want to tolerate partial success (use Promise.allSettled() instead).

Summary:
Use Promise.all() when:
* You need everything to succeed.
* You want maximum speed by doing things in parallel.
* You can’t move forward without all the results.

Let me know if you want to see the difference with Promise.allSettled() or Promise.race() too.

---
### Improving modularity
> modularity is importat for this project so is there a cleaner way to navigate to another page in JavaScript without writing window.location.href every time

Yes — defining a modular navigation helper function is a cleaner and more maintainable way to handle page changes in your project. Since your app involves multiple pages repeating window.location.href = "..." everywhere introduces unnecessary duplication.

A better, more modular solution would be:

````js
const goTo = (path) => window.location.href = path;
````
Why this is modular:
Single responsibility: One function handles all navigation logic.

Reusability: Use goTo('/page1'), goTo('/'), etc., across your event listeners.

Ease of updates: If you ever need to modify how navigation works (e.g., logging, adding transition effects), you only change it in one place.

Improved readability: goTo('/page2') is clearer and more intention-revealing than window.location.href = "/page2" sprinkled everywhere.

This fits your project goals perfectly — clean, minimal, framework-free JavaScript with an emphasis on maintainability.

---
### Exporting a CSV
> don't give me the code, but how would i go about downloading my results into a csv file

To download your results as a CSV file in JavaScript, you'd go through these key steps:

1. Gather your data: Make sure you have both runners and laps available (likely by fetching runners.json and laps.json from the server).
2. Merge them: Combine them based on a shared property like position, ensuring every lap has a corresponding name (or a placeholder if none).
3. Format as CSV: Convert your array of objects into a CSV string. This usually means:
    * Creating a string for the header row (e.g. "Position,Full Name,Time"),
    * Looping through each data row and converting it to a comma-separated string.
4. Create a downloadable file:
    * Use the Blob object to turn your CSV string into a file-like object,
    * Create a temporary a tag with a download attribute and a URL from URL.createObjectURL,
    * Trigger a click on the a element to start the download.
5. Clean up: Revoke the object URL and remove the a element from the DOM if it was appended.

This approach doesn’t rely on any third-party libraries

> what is blob? 
A Blob (short for Binary Large Object) is a JavaScript object used to represent raw data — usually files or file-like data — in a way that can be easily handled, stored, or transferred by the browser.

* Bundle your CSV string into a file-like object, with the correct MIME type (text/csv)
* Generate a downloadable URL from that Blob via URL.createObjectURL(blob)
* Trigger a download by assigning that URL to an a tag's href and simulating a click

Real-world analogy:
Imagine you’ve written your CSV data on paper (a string in memory). A Blob is like wrapping that paper in an envelope so the browser knows how to handle and deliver it properly — whether saving it as a file or sending it somewhere.

Key properties:
* Can hold text, images, JSON, or any other binary data
* Must be given a MIME type (e.g. text/plain, text/csv, application/json)
* Works well with FileReader, fetch, and URL.createObjectURL

It’s particularly useful when you're generating files on the client side, like:
* CSV downloads
* Image previews
* Exporting data offline

Let me know if you want to see a CSV Blob in action or how it compares to File objects.

---
### AI Reflections

Using AI helped speed up development when I was stuck, especially on architectural thinking and debugging logic bugs. However, I had to frequently tweak AI responses to fit my constraints (no frameworks, no third-party libraries), so I learned not to copy-paste, but instead integrate its solutions with personal understanding.

---

## Improvements since last shown Prototype

* Introduced modal confirmations for page navigation and termination of certain functions
* Implemented CSV export (additional features).
* Start button only displayed at the beginning of the race
* Improved offline reliability 
* Persisted timer state using `localStorage`, as I couldn't quite grasp implenting a one-page-app

---
