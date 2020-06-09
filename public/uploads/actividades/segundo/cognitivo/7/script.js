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
	sound.src=" ";
	sound.style.visibility="hidden";
	sound.style.position="absolute";
	document.body.appendChild(sound);
}

var respuestaOperacion = null;
var respuestaValor = null;

function seleccionar(valor){
	switch(valor){
		case 0:
			respuestaOperacion = "SUMA";
			document.getElementById('btnSigno1').classList.add('seleccionado');
			document.getElementById('btnSigno2').classList.remove('seleccionado');
			document.getElementById('btnSigno3').classList.remove('seleccionado');
			break;
		case 1:
			respuestaOperacion = "RESTA";
			document.getElementById('btnSigno2').classList.add('seleccionado');
			document.getElementById('btnSigno1').classList.remove('seleccionado');
			document.getElementById('btnSigno3').classList.remove('seleccionado');
			break;
		case 2:
			respuestaOperacion = "MULTIPLICACION";
			document.getElementById('btnSigno3').classList.add('seleccionado');
			document.getElementById('btnSigno1').classList.remove('seleccionado');
			document.getElementById('btnSigno2').classList.remove('seleccionado');
			break;
	}

	verificarRespuestas();
}

var input = document.getElementById('respuesta');
input.addEventListener('input', function(e){
	calificar(this.value);
});

function calificar(valor){
	if(!valor || isNaN(valor)){
		ocultarContinuar();
		return false;
	}

	respuestaValor = valor;

	verificarRespuestas();
}

function verificarRespuestas(){
	if(respuestaOperacion != null && respuestaValor != null && !isNaN(respuestaValor)){
		if(respuestaOperacion == "RESTA" && respuestaValor == 8){
			Correcto();
		}else{
			Error();
		}
		mostrarContinuar();
	}else{
		ocultarContinuar();
	}
}