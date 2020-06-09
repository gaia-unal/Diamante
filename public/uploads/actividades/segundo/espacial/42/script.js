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
	check = document.querySelector('input[name="num_menor"]:checked');
	if (check.value == "false") {
		var texto = 'Por favor completa la actividad';
		if(typeof parent.mostrarAlerta === "function") {
			puntaje = 0;
			parent.enviarPuntaje(puntaje);
		}else{
			puntaje = 0;
			parent.enviarPuntaje(puntaje);
		}
		document.getElementById(check.id).checked = false;
		ocultarContinuar();
	}else{
		puntaje = 1;
		parent.enviarPuntaje(puntaje);
	}
}