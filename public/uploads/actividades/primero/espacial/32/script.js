var objetos = [
	{ nombre: 'objetos dentro', seleccionado: false },
	{ nombre: 'objeto solo', seleccionado: false },
	{ nombre: 'objeto exterior', seleccionado: false },
	{ nombre: 'objetos agrupados', seleccionado: false },
	{ nombre: 'objeto interior', seleccionado: false },
	{ nombre: 'caja vacia', seleccionado: false }
];

var valorCorrecto = 1 / (objetos.length);
var puntajes = [0, valorCorrecto, valorCorrecto, 0, 0, valorCorrecto];

var boton = document.getElementById('btn-continuar');
boton.addEventListener('click', procesarPuntaje, false);

function mostrarContinuar() {
	document.getElementById('continuar').style.display = "block";
}

function ocultarContinuar() {
	document.getElementById('continuar').style.display = "none";
}

function procesarPuntaje() {
	if (verificarPuntajes()) {
		var puntaje = 0;
		puntajes.forEach(function (pun) {
			puntaje += pun;
		});

		parent.enviarPuntaje(puntaje);
	} else {
		var texto = 'Por favor completa la actividad';
		if (typeof parent.mostrarAlerta === "function") {
			parent.mostrarAlerta(texto);
		} else {
			alert(texto);
		}
		ocultarContinuar();
	}
}

function Error(pos) {
	puntajes[pos] = 0;
}

function Correcto(pos) {
	puntajes[pos] = valorCorrecto;
}

function sonido() {
	sound = document.createElement("embed");
	sound.src = "pE32.mp3";
	sound.style.visibility = "hidden";
	sound.style.position = "absolute";
	document.body.appendChild(sound);
}

function seleccionar(numero) {
	var img;
	switch (numero) {
		case 0:
			img = document.getElementById("marco1");
			break;
		case 1:
			img = document.getElementById("marco2");
			break;
		case 2:
			img = document.getElementById("marco3");
			break;
		case 3:
			img = document.getElementById("marco4");
			break;
		case 4:
			img = document.getElementById("marco5");
			break;
		case 5:
			img = document.getElementById("marco6");
	}
	img.style.display = (img.style.display == "none") ? "inline" : "none";

	objetos[numero].seleccionado = !objetos[numero].seleccionado;

	calificar(numero);
}

function calificar(numero) {
	var correcto = false;
	switch (numero) {
		case 0:
			if (objetos[0].seleccionado) {
				Correcto(numero);
				correcto = true;
			}
			break;
		case 1:
			if (!objetos[1].seleccionado) {
				Correcto(numero);
				correcto = true;
			}
			break;
		case 2:
			if (!objetos[2].seleccionado) {
				Correcto(numero);
				correcto = true;
			}
			break;
		case 3:
			if (objetos[3].seleccionado) {
				Correcto(numero);
				correcto = true;
			}
			break;
		case 4:
			if (objetos[4].seleccionado) {
				Correcto(numero);
				correcto = true;
			}
			break;
		case 5:
			if (!objetos[5].seleccionado) {
				Correcto(numero);
				correcto = true;
			}
	}

	if (!correcto) Error(numero);

	if (verificarPuntajes()) {
		mostrarContinuar();
	} else {
		ocultarContinuar();
	}
}

function verificarPuntajes() {
	for (var i = 0; i < puntajes.length; i++) {
		if (puntajes[i] == null) {
			return false;
		}
	}

	return true;
}