'use strict';

import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const filePath = (name) => path.join(__dirname, name);
const sendHtml = (res, filename) => res.sendFile(filePath(`public/${filename}`));
const readJson = (filepath) => fs.existsSync(filepath) ? JSON.parse(fs.readFileSync(filepath, 'utf8') || '[]') : [];
const writeJson = (filepath, data, res, msg) => {
  fs.writeFile(filepath, JSON.stringify(data, null, 2), err => {
    if (err) res.status(500).send(`Failed to save ${msg}`);
    else res.send(`${msg} saved successfully.`);
  });
};

app.get('/', (req, res) => sendHtml(res, 'index.html'));
app.get('/association', (req, res) => sendHtml(res, 'association.html'));
app.get('/timer', (req, res) => sendHtml(res, 'timer.html'));
app.get('/results', (req, res) => sendHtml(res, 'results.html'));

app.post('/save-lap', (req, res) => {
  const lap = req.body;
  const laps = readJson(filePath('laps.json'));
  laps.push(lap);
  writeJson(filePath('laps.json'), laps, res, 'Lap');
});

app.post('/save-runner', (req, res) => {
  const runner = req.body;
  const runners = readJson(filePath('runners.json'));
  runners.push(runner);
  writeJson(filePath('runners.json'), runners, res, 'Runner');
});

app.post('/save-all-laps', (req, res) => {
  writeJson(filePath('laps.json'), req.body, res, 'Laps');
});

app.post('/save-all-runners', (req, res) => {
  writeJson(filePath('runners.json'), req.body, res, 'Runners');
});

app.post('/clear-runners', (req, res) => {
  writeJson(filePath('runners.json'), [], res, 'Runners');
});

app.post('/clear-laps', (req, res) => {
  writeJson(filePath('laps.json'), [], res, 'Laps');
});

app.get('/runners.json', (req, res) => {
  const runnersFile = filePath('runners.json');
  if (!fs.existsSync(runnersFile)) return res.status(404).send('runners.json not found');
  res.sendFile(runnersFile);
});

app.get('/laps.json', (req, res) => {
  const lapsFile = filePath('laps.json');
  if (!fs.existsSync(lapsFile)) return res.status(404).send('laps.json not found');
  res.sendFile(lapsFile);
});

app.use((req, res) => res.status(404).send('Page not found'));

app.listen(port, () => {
  console.log('Server running at http://localhost:8080');
});
