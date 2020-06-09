var puntaje = null;

var boton = document.getElementById('btn-continuar');
boton.addEventListener('click', procesarPuntaje, false);

function mostrarContinuar(){
	document.getElementById('continuar').style.display = "block";
}

function ocultarContinuar(){
	document.getElementById('continuar').style.display = "none";
}

function procesarPuntaje(){
	check = document.querySelector('input[name="num_mayor"]:checked');
	if (check.value == "false") {
		puntaje = 0;
		parent.enviarPuntaje(puntaje);
	}else{
		puntaje = 1;
		parent.enviarPuntaje(puntaje);
	}
}