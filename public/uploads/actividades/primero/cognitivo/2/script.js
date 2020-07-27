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
	if(puntaje == null || isNaN(puntaje)){
		var texto = 'Por favor completa la actividad';
		if(typeof parent.mostrarAlerta === "function") {
			parent.mostrarAlerta(texto);
		}else{
			alert(texto);
		}
		ocultarContinuar();
	}else{
		parent.enviarPuntaje(puntaje);
	}
}

function Error(){
	puntaje = 0;
	mostrarContinuar();
}

function Correcto(){
	puntaje = 1;
	mostrarContinuar();
}

function sonido(){
	sound=document.createElement("embed");
	sound.src="pC2.mp3";
	sound.style.visibility="hidden";
	sound.style.position="absolute";
	document.body.appendChild(sound);
}

var tachados = 0;
var respuesta = null;

var input = document.getElementById('respuesta');
input.addEventListener('input', function(e){
	calificar(this.value);
});

function calificar(valor){
	if(!valor || isNaN(valor)){
		ocultarContinuar();
		return false;
	}

	respuesta = valor;

	validar();
}

var raya1 = document.getElementById('raya1');
var raya2 = document.getElementById('raya2');
var raya3 = document.getElementById('raya3');
var raya4 = document.getElementById('raya4');

function tachar(numero, esRaya){
	switch(numero){
		case 0:
			mostrarOcultar(raya1);
			break;
		case 1:
			mostrarOcultar(raya2);
			break;
		case 2:
			mostrarOcultar(raya3);
			break;
		case 3:
			mostrarOcultar(raya4);
			break;
	}
	if(esRaya){
		tachados--;
	}else{
		tachados++;
	}

	validar();
}

function validar(){
	if(tachados <= 0 || tachados > 4 || respuesta == null || isNaN(respuesta)){
		ocultarContinuar();
		return false;
	}

	if(tachados == 2 && respuesta == 2){
		Correcto();
	}else{
		Error();
	}
}

function mostrarOcultar(objetoImagen){
	objetoImagen.style.display=(objetoImagen.style.display=='none') ? 'inline' : 'none';
}