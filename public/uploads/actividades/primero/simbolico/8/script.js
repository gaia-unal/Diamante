// Iniciar el Canvas cuando se haya cargado la página
window.addEventListener('load', function () {
	iniciarCarga()
	continuar = document.getElementById('btn-continuar');
	continuar.onclick = function () { procesarPuntaje() }
});

function sonido() {
	sound = document.createElement("embed");
	sound.src = "pS8.mp3";
	sound.style.visibility = "hidden";
	sound.style.position = "absolute";
	document.body.appendChild(sound);
}

domOpcion1 = document.getElementById('opcion1');
domOpcion2 = document.getElementById('opcion2');
domOpcion3 = document.getElementById('opcion3');
domOpcion4 = document.getElementById('opcion4');
domOpcion5 = document.getElementById('opcion5');
domOpcion6 = document.getElementById('opcion6');
var marcada = null;
var puntaje = 0;
var contadas = 0;

domOpcion1.onclick = function () { cambioColor(domOpcion1) }
domOpcion2.onclick = function () { cambioColor(domOpcion2) }
domOpcion3.onclick = function () { cambioColor(domOpcion3) }
domOpcion4.onclick = function () { cambioColor(domOpcion4) }
domOpcion5.onclick = function () { cambioColor(domOpcion5) }
domOpcion6.onclick = function () { cambioColor(domOpcion6) }

function procesarPuntaje() {

	console.log('CONTADAS')
	console.log(contadas)
	console.log('MARCADAS')
	console.log(marcada)
	if (contadas == marcada) {
		console.log('ESTE ES EL PUNTAJE');
		puntaje = 1;
		console.log(puntaje)
		parent.enviarPuntaje(puntaje);
	}
	else {
		puntaje = marcada / contadas;
		console.log('ESTE ES EL PUNTAJE');
		console.log(puntaje);
		parent.enviarPuntaje(puntaje);
	}

}

function mostrarContinuar() {
	document.getElementById('continuar').style.display = "inline-block";
}

function ocultarContinuar() {
	document.getElementById('continuar').style.display = "none";
}

var signos = ['+', '-']
function iniciarCarga() {
	var opcion1 = crearOperacion();
	var opcion2 = crearOperacion();
	var opcion3 = crearOperacion();
	var opcion4 = crearOperacion();
	var opcion5 = crearOperacion();
	var opcion6 = crearOperacion();
	cargarOpciones(opcion1, opcion2, opcion3, opcion4, opcion5, opcion6)
}

function crearOperacion() {
	var final
	num1 = Math.floor(Math.random() * 16);
	num2 = Math.floor(Math.random() * 16);
	signo = Math.floor(Math.random() * 2);
	if (signo == 0) {
		suma = num1 + num2;
		final = num1 + ' ' + signos[signo] + ' ' + num2 + ' ' + '=' + ' ' + suma;
	}
	else {
		if (num1 > num2) {
			suma = num1 - num2;
			final = num1 + ' ' + signos[signo] + ' ' + num2 + ' ' + '=' + ' ' + suma;
		}
		else {
			suma = num2 - num1;
			final = num2 + ' ' + signos[signo] + ' ' + num1 + ' ' + '=' + ' ' + suma;
		}
	}


	return final;
}

function cargarOpciones(opcion1, opcion2, opcion3, opcion4, opcion5, opcion6) {
	domOpcion1.innerHTML = opcion1;
	domOpcion2.innerHTML = opcion2;
	domOpcion3.innerHTML = opcion3;
	domOpcion4.innerHTML = opcion4;
	domOpcion5.innerHTML = opcion5;
	domOpcion6.innerHTML = opcion6;
	var cont = 0;

	op1 = opcion1.split(' ');
	op2 = opcion2.split(' ');
	op3 = opcion3.split(' ');
	op4 = opcion4.split(' ');
	op5 = opcion5.split(' ');
	op6 = opcion6.split(' ');


	if (op1[1] == '-') {
		console.log(op1);
		console.log(op1[1]);
		cont = cont + 1;
		console.log(cont);
	}
	if (op2[1] == '-') {
		console.log(op2);
		console.log(op1[1]);
		cont = cont + 1;
		console.log(cont);

	}
	if (op3[1] == '-') {
		console.log(op3)
		console.log(op1[1])
		cont = cont + 1;
		console.log(cont);
	}
	if (op4[1] == '-') {
		console.log(op4);
		console.log(op1[1]);
		cont = cont + 1;
		console.log(cont)
	}
	if (op5[1] == '-') {
		console.log(op5);
		console.log(op5[1]);
		cont = cont + 1;
		console.log(cont)
	}
	if (op6[1] == '-') {
		console.log(op6);
		console.log(op6[1]);
		cont = cont + 1;
		console.log(cont)
	}
	contadas = cont;
	if (cont == 0) {
		console.log('EL CONTADOR ESTA EN CERO');
		marcada = 0;
		mostrarContinuar();
	}


}

function cambioColor(domOpcion) {
	dom = domOpcion.innerHTML;
	dom = dom.split(' ');
	if (dom[1] == '-') {
		marcada = marcada + 1;
		console.log('Son iguales')
	}
	domOpcion.style.background = '#EEE';
	mostrarContinuar();

}
