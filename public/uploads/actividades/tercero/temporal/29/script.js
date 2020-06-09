var OPCIONES = {
	anio: false,
	horas: false,
	meses: false,
	segundos: false,
	dias: false,
	minutos: false
};

var CANTIDAD = 6;

var boton = document.getElementById('btn-continuar');
boton.addEventListener('click', procesarPuntaje, false);

function procesarPuntaje(){
	var puntaje = calificarOpciones();
	parent.enviarPuntaje(puntaje);
}

function calificarOpciones(){
	var puntaje = 0;
	if(OPCIONES.horas && OPCIONES.minutos && OPCIONES.segundos 
		&& !OPCIONES.anio && !OPCIONES.meses && !OPCIONES.dias){
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

function sonido(){
	sound=document.createElement("embed");
	sound.src=" ";
	sound.style.visibility="hidden";
	sound.style.position="absolute";
	document.body.appendChild(sound);
}

function seleccionar(numero){
	if(numero == 0){
		OPCIONES.anio = !OPCIONES.anio;
	}else if(numero == 1){
		OPCIONES.horas = !OPCIONES.horas;
	}else if(numero == 2){
		OPCIONES.meses = !OPCIONES.meses;
	}else if(numero == 3){
		OPCIONES.segundos = !OPCIONES.segundos;
	}else if(numero == 4){
		OPCIONES.dias = !OPCIONES.dias;
	}else if(numero == 5){
		OPCIONES.minutos = !OPCIONES.minutos;
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
