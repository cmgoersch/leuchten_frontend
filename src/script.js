"use strict";


// --- Element-Referenzen ---
const openLamb         = document.getElementById('open_lamb');
const closedLamb       = document.getElementById('closed_lamb');
const openPlate        = document.getElementById('open_plate');
const closedPlate      = document.getElementById('closed_plate');
const statusContainer  = document.getElementById('statusContainer');
const counterContainer = document.getElementById('counterContainer');

const hoursDisplay     = document.getElementById('hours');
const minutesDisplay   = document.getElementById('minutes');
const secondsDisplay   = document.getElementById('seconds');
const hoursBlock       = document.getElementById('hoursBlock');   // optional (nur wenn im HTML vorhanden)

const favicon          = document.getElementById('favicon');
const copyrightElement = document.getElementById('copyright');

// --- Footer-Copyright dynamisch ---
(() => {
  const currentYear = new Date().getFullYear();
  if (copyrightElement) {
    copyrightElement.innerHTML = `© ${currentYear} Das Leuchten.<br> All rights reserved.`;
  }
})();

// --- Timer-Status ---
let timerId = null;
let localUptimeSeconds = 0;

// --- Timer-API ---
function startTimer(initialSeconds) {
  stopTimer(); // alten Timer beenden, falls aktiv
  localUptimeSeconds = Number.isFinite(initialSeconds) ? Math.max(0, Math.floor(initialSeconds)) : 0;
  updateDisplay(localUptimeSeconds);

  timerId = setInterval(() => {
    localUptimeSeconds++;
    updateDisplay(localUptimeSeconds);
  }, 1000);
}

function stopTimer() {
  if (timerId !== null) {
    clearInterval(timerId);
    timerId = null;
  }
  localUptimeSeconds = 0;
  resetTimerDisplay();
}

function updateDisplay(totalSeconds) {
  const hours   = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const secs    = totalSeconds % 60;

  if (hoursDisplay)   hoursDisplay.textContent   = String(hours);
  if (minutesDisplay) minutesDisplay.textContent = String(minutes);
  if (secondsDisplay) secondsDisplay.textContent = String(secs).padStart(2, '0'); 

  if (hoursBlock) {
    hoursBlock.style.display = hours > 0 ? 'inline' : 'none';
  }

  if (hoursLabel) {
    const lang = localStorage.getItem('lang') || 'de';
    if (lang === 'de') {
      hoursLabel.textContent = hours === 1 ? 'Stunde' : 'Stunden';
    } else {
      hoursLabel.textContent = hours === 1 ? 'hour' : 'hours';
    }
  }
}

function resetTimerDisplay() {
  if (hoursDisplay)   hoursDisplay.textContent   = '0';
  if (minutesDisplay) minutesDisplay.textContent = '0';
  if (secondsDisplay) secondsDisplay.textContent = '0';
}

// --- Sonstiges UI ---
function toggleFavicon(state) {
  if (!favicon) return;
  favicon.href = state === 'on' ? '/favOn.svg' : '/favOff.svg';
}

// --- Daten-Polling ---
async function fetchStatusAndUpdate() {
  try {
    const response = await fetch('http://localhost:3000/api/wled-status', { cache: 'no-cache' });
    // Falls der Server Fehler wirft
    if (!response.ok) throw new Error(`HTTP ${response.status} ${response.statusText}`);

    const data = await response.json();
    console.log('Empfangener Status:', data);

    // Zustände absichern
    const state = data?.state === 'on' ? 'on' : 'off';
    const uptime = Number.isFinite(data?.uptimeSeconds) ? Math.max(0, Math.floor(data.uptimeSeconds)) : 0;

    if (state === 'on') {
      // Anzeige: offen
      if (openLamb)    openLamb.style.display = 'block';
      if (closedLamb)  closedLamb.style.display = 'none';
      if (openPlate)   openPlate.style.display = 'block';
      if (closedPlate) closedPlate.style.display = 'none';
      if (statusContainer)  statusContainer.style.display = 'none';
      if (counterContainer) counterContainer.style.display = 'block';

      startTimer(uptime);
    } else {
      // Anzeige: geschlossen oder unreachable
      if (openLamb)    openLamb.style.display = 'none';
      if (closedLamb)  closedLamb.style.display = 'block';
      if (openPlate)   openPlate.style.display = 'none';
      if (closedPlate) closedPlate.style.display = 'block';
      if (statusContainer)  statusContainer.style.display = 'block';
      if (counterContainer) counterContainer.style.display = 'none';

      stopTimer();
    }

    toggleFavicon(state);
  } catch (error) {
    console.error('Fehler beim Abrufen der Daten vom lokalen Server:', error);

    // Fallback: geschlossen darstellen
    if (openLamb)    openLamb.style.display = 'none';
    if (closedLamb)  closedLamb.style.display = 'block';
    if (openPlate)   openPlate.style.display = 'none';
    if (closedPlate) closedPlate.style.display = 'block';
    if (statusContainer)  statusContainer.style.display = 'block';
    if (counterContainer) counterContainer.style.display = 'none';

    stopTimer();
    toggleFavicon('off');
  }
}

// --- Initialisierung ---
window.addEventListener('load', fetchStatusAndUpdate);
// Status alle 60 Sekunden neu abfragen
setInterval(fetchStatusAndUpdate, 60_000);


// =====================
// Sprachumschaltung
// =====================

// Buttons
const btnDE = document.getElementById('btnDE');
const btnEN = document.getElementById('btnEN');
const langSwitch = document.querySelector('.lang-switch');

// Text-Knoten
const closedLine1   = document.getElementById('closedLine1');
const closedLine2   = document.getElementById('closedLine2');
const openedText    = document.getElementById('openedText');
const hoursLabel    = document.getElementById('hoursLabel');
const minutesLabel  = document.getElementById('minutesLabel');
const secondsLabel  = document.getElementById('secondsLabel');
const andLabel      = document.getElementById('andLabel');
const openedSuffix  = document.getElementById('openedSuffix');

// Sprachdaten
const i18n = {
  de: {
    closed1: 'Das Leuchten ist geschlossen.',
    closed2: 'Wenn es geöffnet ist, siehst du es hier.',
    openedText: 'Das Leuchten ist seit',
    hoursLabel: 'Stunden',
    minutesLabel: 'Minuten',
    secondsLabel: 'Sekunden',
    andLabel: 'und',
    openedSuffix: 'geöffnet.',
    ui: { btnDE: 'DE', btnEN: 'EN' }
  },
  en: {
    closed1: 'Das Leuchten is closed.',
    closed2: 'When it is open, you will see it here.',
    openedText: 'The light has been open for',
    hoursLabel: 'hours',
    minutesLabel: 'minutes',
    secondsLabel: 'seconds',
    andLabel: 'and',
    openedSuffix: '',
    ui: { btnDE: 'DE', btnEN: 'EN' }
  }
};

// Hilfsfunktion: sicher Text setzen (nur wenn Knoten existiert)
function setText(el, value) {
  if (el) el.textContent = value ?? "";
}

// Unterstützte Sprachen
const SUPPORTED_LANGS = new Set(["de", "en"]);

// zentral: Anwenden der Sprache
function applyLanguage(lang) {
  // Fallback auf 'de', falls etwas anderes reinkommt
  const safeLang = SUPPORTED_LANGS.has(lang) ? lang : "de";
  const t = i18n[safeLang] || i18n.de;

  // Sichtbare Texte aktualisieren
  setText(closedLine1,  t.closed1);
  setText(closedLine2,  t.closed2);
  setText(openedText,   t.openedText);
  setText(hoursLabel,   t.hoursLabel);
  setText(minutesLabel, t.minutesLabel);
  setText(secondsLabel, t.secondsLabel);
  setText(andLabel,     t.andLabel);
  setText(openedSuffix, t.openedSuffix);

  // Toggle-UI synchronisieren
  if (btnDE && btnEN) {
    const isDE = safeLang === "de";
    btnDE.setAttribute("aria-pressed", isDE ? "true" : "false");
    btnEN.setAttribute("aria-pressed", !isDE ? "true" : "false");
    // Labels (falls du sie i18n-steuern willst)
    setText(btnDE, t.ui.btnDE);
    setText(btnEN, t.ui.btnEN);
  }

  // „Cooler“ Toggle-Hintergrund steuern
  if (langSwitch) {
    langSwitch.dataset.active = safeLang; // für CSS ::before Animation
  }

  // <html lang="…"> setzen (SEO/AT, Screenreader)
  document.documentElement.setAttribute("lang", safeLang);

  // Persistieren
  localStorage.setItem("lang", safeLang);

  // Optional: anderen Modulen Bescheid sagen (z. B. Plural-Labels im Timer)
  window.dispatchEvent(new CustomEvent("languagechange", { detail: { lang: safeLang } }));
}

// Initiale Sprache (localStorage > Browser-Sprache)
const initialLang =
  localStorage.getItem("lang") ||
  (navigator.language && navigator.language.toLowerCase().startsWith("de") ? "de" : "en");

// Erste Anwendung
applyLanguage(initialLang);

// Klick-Events
if (btnDE) btnDE.addEventListener("click", () => applyLanguage("de"));
if (btnEN) btnEN.addEventListener("click", () => applyLanguage("en"));

// Tastatur-Support für den Toggle (Barrierefreiheit)
if (langSwitch) {
  langSwitch.addEventListener("keydown", (e) => {
    const current = (localStorage.getItem("lang") || initialLang);
    if (e.key === "ArrowLeft") {
      applyLanguage("de");
      e.preventDefault();
    } else if (e.key === "ArrowRight") {
      applyLanguage("en");
      e.preventDefault();
    } else if (e.key === " " || e.key === "Enter") {
      applyLanguage(current === "de" ? "en" : "de");
      e.preventDefault();
    }
  });
}

