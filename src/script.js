const openLamb = document.getElementById('open_lamb');
const closedLamb = document.getElementById('closed_lamb');
const openPlate = document.getElementById('open_plate');
const closedPlate = document.getElementById('closed_plate');
const statusContainer = document.getElementById('statusContainer');
const counterContainer = document.getElementById('counterContainer');
const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const favicon = document.getElementById('favicon');
const copyrightElement = document.getElementById('copyright');
const currentYear = new Date().getFullYear();

if (copyrightElement) {
  copyrightElement.innerHTML = `© ${currentYear} Das Leuchten.<br> All rights reserved.`;
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js').catch(err =>
    console.error('Service Worker Registration failed', err)
  );
}

// Timer-Logik
let timerId = null;
let localUptimeSeconds = 0;

function startTimer(initialSeconds) {
  stopTimer(); // alten Timer beenden
  localUptimeSeconds = initialSeconds;
  updateDisplay(localUptimeSeconds);

  timerId = setInterval(() => {
    localUptimeSeconds++;
    updateDisplay(localUptimeSeconds);
  }, 1000);
}

function stopTimer() {
  clearInterval(timerId);
  timerId = null;
  localUptimeSeconds = 0;
  resetTimerDisplay();
}

function updateDisplay(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  minutesDisplay.innerText = minutes;
  secondsDisplay.innerText = secs;
}

function resetTimerDisplay() {
  minutesDisplay.innerText = '0';
  secondsDisplay.innerText = '0';
}

function toggleFavicon(state) {
  favicon.href = state === 'on' ? '/public/favOn.svg' : '/public/favOff.svg';
}

async function fetchStatusAndUpdate() {
  try {
    const response = await fetch('http://localhost:3000/api/wled-status');
    const data = await response.json();

    console.log('Empfangener Status:', data);

    if (data.state === 'on') {
      // Anzeige: offen
      openLamb.style.display = 'block';
      closedLamb.style.display = 'none';
      openPlate.style.display = 'block';
      closedPlate.style.display = 'none';
      statusContainer.style.display = 'none';
      counterContainer.style.display = 'block';

      if (data.uptimeSeconds != null) {
        startTimer(data.uptimeSeconds);
      }
    } else {
      // Anzeige: geschlossen oder unreachable
      openLamb.style.display = 'none';
      closedLamb.style.display = 'block';
      openPlate.style.display = 'none';
      closedPlate.style.display = 'block';
      statusContainer.style.display = 'block';
      counterContainer.style.display = 'none';
      stopTimer();
    }

    toggleFavicon(data.state);
  } catch (error) {
    console.error('Fehler beim Abrufen der Daten vom lokalen Server:', error);
    openLamb.style.display = 'none';
    closedLamb.style.display = 'block';
    openPlate.style.display = 'none';
    closedPlate.style.display = 'block';
    statusContainer.style.display = 'block';
    counterContainer.style.display = 'none';
    stopTimer();
    toggleFavicon('off');
  }
}

setInterval(fetchStatusAndUpdate, 60000);
window.onload = fetchStatusAndUpdate;