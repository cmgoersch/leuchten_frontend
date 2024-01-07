var openLamb = document.getElementById('open_lamb');
var closedLamb = document.getElementById('closed_lamb');
var openPlate = document.getElementById('open_plate');
var closedPlate = document.getElementById('closed_plate');

function toggleSvg() {
    if(openLamb.style.display === 'block') {
        openLamb.style.display = 'none';
        closedLamb.style.display = 'block';
    } else {
        openLamb.style.display = 'block';
        closedLamb.style.display = 'none';
    }
    if(openPlate.style.display === 'block') {
        openPlate.style.display = 'none';
        closedPlate.style.display = 'block';
    } else {
        openPlate.style.display = 'block';
        closedPlate.style.display = 'none';
    }
}

openLamb.addEventListener('click', toggleSvg);
closedLamb.addEventListener('click', toggleSvg);

