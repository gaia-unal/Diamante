var valoresCorrectos = [4, 2, 7];
var respuesta = [null, null, null];

window.addEventListener('load', function () {
	document.getElementById('btn-continuar').onclick = function () { continuarActividad() };
});

var input1 = document.getElementById('respuesta1');
var input2 = document.getElementById('respuesta2');
var input3 = document.getElementById('respuesta3');

input1.addEventListener('change', function (e) {
	calificar(1);
});
input2.addEventListener('change', function (e) {
	calificar(2);
});
input3.addEventListener('change', function (e) {
	calificar(3);
});

function calificar(numero) {
	var valor = 0;
	switch (numero) {
		case 1:
			valor = document.getElementById('respuesta1').value;
			if (valor) {
				respuesta[0] = (valor == valoresCorrectos[0]) ? 1 : 0;
			} else {
				respuesta[0] = null;
			}
			break;
		case 2:
			valor = document.getElementById('respuesta2').value;
			if (valor) {
				respuesta[1] = (valor == valoresCorrectos[1]) ? 1 : 0;
			} else {
				respuesta[1] = null;
			}
			break;
		case 3:
			valor = document.getElementById('respuesta3').value;
			if (valor) {
				respuesta[2] = (valor == valoresCorrectos[2]) ? 1 : 0;
			} else {
				respuesta[2] = null;
			}
			break;
	}

	mostrarContinuar();
}

function reproducirAudio(numero) {
	src = "aP3-";
	switch (numero) {
		case 1:
			src += "1.mp3";
			break;
		case 2:
			src += "2.mp3";
			break;
		case 3:
			src += "3.mp3";
			break;
	}
	sound = document.createElement("embed");
	sound.src = src;
	sound.style.visibility = "hidden";
	sound.style.position = "absolute";
	document.body.appendChild(sound);
}

function mostrarContinuar() {
	document.getElementById('continuar').style.display = "block";
}

function ocultarContinuar() {
	document.getElementById('continuar').style.display = "none";
}

function continuarActividad() {
	var valido = true;
	for (var i = 0; i < respuesta.length; i++) {
		if (respuesta[i] == null) {
			valido = false;
			break;
		}
	}

	if (valido) {
		var mensaje = '';
		if (respuesta[0] == 1 && respuesta[1] == 1 && respuesta[2] == 1) {
			mensaje = '¡Lo has hecho muy bien!';
		} else {
			mensaje = 'Tienes algún error, pero la próxima vez lo harás bien!';
		}
		parent.completarActividadPrevia(mensaje);
	} else {
		alert('Por favor completa la actividad');
		ocultarContinuar();
	}
}