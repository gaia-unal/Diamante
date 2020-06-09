var OPCIONES = {
	secuencia1: false,
	secuencia2: false,
	secuencia3: false,
	secuencia4: false
};

var CANTIDAD = 4;

var puntaje = 0;
var boton = document.getElementById('btn-continuar');
boton.addEventListener('click', procesarPuntaje, false);

function procesarPuntaje(){
	var puntaje = calificarOpciones();
	parent.enviarPuntaje(puntaje);
}

function calificarOpciones(){
	var puntaje = 0;
	if(OPCIONES.secuencia1 && !OPCIONES.secuencia2 && OPCIONES.secuencia3 && !OPCIONES.secuencia4){
		puntaje = 1;
	}
	return puntaje;
}

function mostrarContinuar(){
	document.getElementById('continuar').style.display = "block";
}

function ocultarContinuar(){
	document.getElementById('continuar').style.display = "none";
}

function seleccionar(numero){
	if(numero == 0){
		OPCIONES.secuencia1 = !OPCIONES.secuencia1;
	}else if(numero == 1){
		OPCIONES.secuencia2 = !OPCIONES.secuencia2;
	}else if(numero == 2){
		OPCIONES.secuencia3 = !OPCIONES.secuencia3;
	}else if(numero == 3){
		OPCIONES.secuencia4 = !OPCIONES.secuencia4;
	}

	validarSelecciones();
}

function validarSelecciones(){
	var noSeleccionados = 0;
	Object.keys(OPCIONES).forEach(function(key,index){
		if(!OPCIONES[key]){
			noSeleccionados++;
		}
	});
	if(noSeleccionados == CANTIDAD){
		ocultarContinuar();
	}else{
		mostrarContinuar();
	}
}