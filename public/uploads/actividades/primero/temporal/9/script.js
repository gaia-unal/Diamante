var puntaje = null;

var boton = document.getElementById('btn-continuar');
boton.addEventListener('click', procesarPuntaje, false);

function mostrarContinuar() {
	document.getElementById('continuar').style.display = "block";
}

function ocultarContinuar() {
	document.getElementById('continuar').style.display = "none";
}

function procesarPuntaje() {
	if (puntaje == null || isNaN(puntaje)) {
		alert('Por favor completa la actividad');
		ocultarContinuar();
	} else {
		parent.enviarPuntaje(puntaje);
	}
}

function Error() {
	puntaje = 0;
	mostrarContinuar();
}

function Correcto() {
	puntaje = 1;
	mostrarContinuar();
}

function sonido() {
	sound = document.createElement("embed");
	sound.src = "pT9.mp3";/*Falta el audio para vincularlo*/
	sound.style.visibility = "hidden";
	sound.style.position = "absolute";
	document.body.appendChild(sound);
}