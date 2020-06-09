var puntaje = null;

var input_1 = document.getElementById('res1');
var input_2 = document.getElementById('res2');
var boton = document.getElementById('btn-continuar');
boton.addEventListener('click', procesarPuntaje, false);

function mostrarContinuar(){
	document.getElementById('continuar').style.display = "block";
}

function ocultarContinuar(){
	document.getElementById('continuar').style.display = "none";
}

function procesarPuntaje(){
	if (input_1.value == (num_base - 2) && input_2.value == (num_base + 2)) {
		puntaje = 1;
		parent.enviarPuntaje(puntaje);
	}
}

var num_base = 0;

window.onload = function(){
	var numeroMinimo = 3;
	var numeroMaximo = 996;
	num_base = Math.floor(Math.random() * (numeroMaximo - numeroMinimo + 1)) + numeroMinimo;
	
	document.getElementById('numero1').textContent = num_base - 3;
	document.getElementById('numero2').textContent = num_base;
	document.getElementById('numero3').textContent = num_base + 3;
}

function validar(){
	if (input_1.value == "" || input_2.value == "") {
		ocultarContinuar();
		return false;
	} else {
		mostrarContinuar();
		return true;
	}
}


