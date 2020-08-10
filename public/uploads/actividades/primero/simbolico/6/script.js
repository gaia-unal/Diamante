// Iniciar el Canvas cuando se haya cargado la página
window.addEventListener('load', function () {
	iniciarCarga()
});

boton1 = document.getElementById('opcion1');
boton1.onclick = function () { verificar(boton1.innerHTML) };
boton2 = document.getElementById('opcion2');
boton2.onclick = function () { verificar(boton2.innerHTML) };


function verificar(valor) {
	mostrarContinuar();
	if (valor == 'Suma') {
		valor = '+';
	}
	else {
		valor = '-';
	}
	sum = document.getElementById('operacion').innerHTML
	separador = ' '
	signo = sum.split(separador)
	if (valor == signo[2]) {
		puntaje = 1;
	}
	else {
		puntaje = 0;
	}

	procesarPuntaje(puntaje);
}

function procesarPuntaje(puntaje) {
	console.log(puntaje);
	parent.enviarPuntaje(puntaje);
}



function mostrarContinuar() {
	document.getElementById('continuar').style.display = "inline-block";
}

function ocultarContinuar() {
	document.getElementById('continuar').style.display = "none";
}
function sonido() {
	sound = document.createElement("embed");
	sound.src = "pS6.mp3";/*Falta el audio para vincularlo*/
	sound.style.visibility = "hidden";
	sound.style.position = "absolute";
	document.body.appendChild(sound);
}

function seleccionarNumero() {
	return Math.floor(Math.random() * 16);
}

function seleccionarOperador() {
	operador = Math.floor(Math.random() * 2);
	if (operador == 0) {
		return '+';
	}
	else {
		return '-';
	}

}

function iniciarCarga() {
	var num1 = seleccionarNumero();
	var num2 = seleccionarNumero();
	var operacion = seleccionarOperador();
	var opcion = seleccionarOperador();
	if (num2 > num1) {
		if (operacion == '+') {
			resultudo = num2 + num1
		}
		else {
			resultudo = num2 - num1
		}
		document.getElementById('operacion').innerHTML = num2 + ' ' + ' ' + operacion + ' ' + num1 + ' ' + '=' + ' ' + resultudo
	}
	else {
		if (operacion == '+') {
			resultudo = num1 + num2
		}
		else {
			resultudo = num1 - num2;
		}
		document.getElementById('operacion').innerHTML = num1 + ' ' + ' ' + operacion + ' ' + num2 + ' ' + '=' + ' ' + resultudo;
	}

	if (opcion == '+') {
		boton1.innerHTML = 'Suma';
		boton1.value = 'Suma';
		boton2.innerHTML = 'Resta';
		boton2.value = 'Resta';
	}
	else {
		boton1.innerHTML = 'Resta';
		boton1.innerHTML = 'Resta';
		boton2.innerHTML = 'Suma';
		boton2.innerHTML = 'Suma';
	}

}