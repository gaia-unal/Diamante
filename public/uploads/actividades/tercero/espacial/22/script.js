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

var input = document.getElementById('caja');
input.addEventListener('input', function(e){
	calificar(this.value);
});

function calificar(valor){
	if(!valor){
		ocultarContinuar();
		return false;
	}

	var respuestaCorrecta = 13;
	if(valor == respuestaCorrecta){
		puntaje = 1;
	}else{
		puntaje = 0;
	}
	mostrarContinuar();
}

function sonido(){
	sound=document.createElement("embed");
	sound.src=" ";
	sound.style.visibility="hidden";
	sound.style.position="absolute";
	document.body.appendChild(sound);
}