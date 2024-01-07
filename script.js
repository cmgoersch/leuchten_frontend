var openLamb = document.getElementById('open_lamb');
var closedLamb = document.getElementById('closed_lamb');
var openPlate = document.getElementById('open_plate');
var closedPlate = document.getElementById('closed_plate');
var statusContainer = document.getElementById('statusContainer');
var counterContainer = document.getElementById('counterContainer');

let timerId = null; 
let seconds = 0; 
let minutes = 0;


function initializeDisplay() {
    statusContainer.style.display = 'block'; 
    counterContainer.style.display = 'none'; 

    openLamb.style.display = 'none';
    closedLamb.style.display = 'block';
    openPlate.style.display = 'none';
    closedPlate.style.display = 'block';
}

function toggleSvg() {
    if(openLamb.style.display === 'block') {
        openLamb.style.display = 'none';
        closedLamb.style.display = 'block';
        openPlate.style.display = 'none';
        closedPlate.style.display = 'block';

        statusContainer.style.display = 'block';
        counterContainer.style.display = 'none';

        stopTimer(); // Stoppt den Timer und setzt ihn zurück, wenn closedLamb angezeigt wird
    } else {
        openLamb.style.display = 'block';
        closedLamb.style.display = 'none';
        openPlate.style.display = 'block';
        closedPlate.style.display = 'none';

        // Schalte zwischen den Counter-Containern um
        statusContainer.style.display = 'none';
        counterContainer.style.display = 'block';

        startTimer(); // Startet den Timer, wenn openLamb angezeigt wird
        counterContainer.innerHTML = 'Das grüne Leuchten ist seit<strong></br> <span id="minutes">0</span> Minuten und <span id="seconds">0</span> Sekunden </strong>geöffnet.'; // Setzt den ursprünglichen Text zurück
    }
}

// Event-Listener für das Klicken auf die SVG-Elemente
openLamb.addEventListener('click', toggleSvg);
closedLamb.addEventListener('click', toggleSvg);

// Funktion zum Inkrementieren der Zeit
function incrementTime() {
    seconds++; // Erhöht die Sekunden um 1
    if (seconds >= 60) {
        minutes++; // Erhöht die Minuten um 1, wenn die Sekunden 60 erreichen
        seconds = 0; // Setzt die Sekunden zurück auf 0
    }
    document.getElementById('seconds').innerText = seconds;
    document.getElementById('minutes').innerText = minutes;
}

// Funktion zum Starten des Timers
function startTimer() {
    if (timerId === null) { // Startet das Intervall nur, wenn es nicht bereits läuft
        timerId = setInterval(incrementTime, 1000);
    }
}

// Funktion zum Stoppen des Timers
function stopTimer() {
    if (timerId !== null) { // Stoppt das Intervall, wenn es läuft
        clearInterval(timerId);
        timerId = null;
    }
    // Setzt Timer und Text für beide Counter-Container zurück
    seconds = 0;
    minutes = 0;
    document.getElementById('seconds').innerText = seconds;
    document.getElementById('minutes').innerText = minutes;
    statusContainer.innerHTML = 'Das grüne Leuchten ist geschlossen. </br> Wenn es öffnet, siehst du es hier.';
}

// Rufe die Initialisierungsfunktion auf, wenn das Fenster geladen wird
window.onload = initializeDisplay;
