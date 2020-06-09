var puntajes = [null, null, null, null];
var valorCorrecto = 1/(puntajes.length);

var boton = document.getElementById('btn-continuar');
boton.addEventListener('click', procesarPuntaje, false);

function mostrarContinuar(){
	document.getElementById('continuar').style.display = "block";
}

function ocultarContinuar(){
	document.getElementById('continuar').style.display = "none";
}

function procesarPuntaje(){
	if(verificarPuntajes()){
		var puntaje = 0;
		puntajes.forEach(function(pun){
			puntaje += pun;
		});

		parent.enviarPuntaje(puntaje);
	}else{
		var texto = 'Por favor completa la actividad';
		if(typeof parent.mostrarAlerta === "function") {
			parent.mostrarAlerta(texto);
		}else{
			alert(texto);
		}
		ocultarContinuar();
	}
}

function Error(pos, nulo){
	if(nulo){
		puntajes[pos] = null;
	}else{
		puntajes[pos] = 0;
	}
}

function Correcto(pos){
	puntajes[pos] = valorCorrecto;
}

function sonido(){
	sound=document.createElement("embed");
	sound.src=" ";
	sound.style.visibility="hidden";
	sound.style.position="absolute";
	document.body.appendChild(sound);
}
			
var input1 = document.getElementById('caja1');
var input2 = document.getElementById('caja2');
var input3 = document.getElementById('caja3');
var input4 = document.getElementById('caja4');

input1.addEventListener('input', function(e){
	calificar(0, this.value);
});
input2.addEventListener('input', function(e){
	calificar(1, this.value);
});
input3.addEventListener('input', function(e){
	calificar(2, this.value);
});
input4.addEventListener('input', function(e){
	calificar(3, this.value);
});

function calificar(input, valor){
	if(!valor){
		Error(input, true);
		ocultarContinuar();
		return false;
	}

	var correcto = false;

	switch(input){
		case 0:
			if(valor == 3){
				Correcto(0);
				correcto = true;
			}
			break;
		case 1:
			if(valor == 1){
				Correcto(1);
				correcto = true;
			}
			break;
		case 2:
			if(valor == 2){
				Correcto(2);
				correcto = true;
			}
			break;
		case 3:
			if(valor == 3){
				Correcto(3);
				correcto = true;
			}
			break;
	}

	if(!correcto) Error(input, false);

	if(verificarPuntajes()){
		mostrarContinuar();
	}else{
		ocultarContinuar();
	}
}

function verificarPuntajes(){
	for(var i = 0; i < puntajes.length; i++){
		if(puntajes[i] == null){
			return false;
		}
	}

	return true;
}