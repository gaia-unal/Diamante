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
		var texto = 'Por favor completa la actividad';
		if (typeof parent.mostrarAlerta === "function") {
			parent.mostrarAlerta(texto);
		} else {
			alert(texto);
		}
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
	sound.src = "pS4.mp3";
	sound.style.visibility = "hidden";
	sound.style.position = "absolute";
	document.body.appendChild(sound);
}

var numero1 = 0;
var numero2 = 0;
var resultado = 0;

window.onload = function () {
	var numeroMinimo = 1;
	var numeroMaximo = 9;
	numero1 = Math.floor(Math.random() * (numeroMaximo - numeroMinimo + 1)) + numeroMinimo;
	numero2 = Math.floor(Math.random() * (numeroMaximo - numeroMinimo + 1)) + numeroMinimo;
	resultado = numero1 + numero2;

	document.getElementById('numero1').textContent = numero1;
	document.getElementById('resultado').textContent = resultado;

	if (resultado > 9) document.getElementById('resultado').parentNode.style.left = "287px";
}

var input = document.getElementById('respuesta');
input.addEventListener('input', function (e) {
	calificar(this.value);
});

function calificar(valor) {
	if (!valor || isNaN(valor)) {
		ocultarContinuar();
		return false;
	}

	if (valor == numero2) {
		Correcto();
	} else {
		Error();
	}
}