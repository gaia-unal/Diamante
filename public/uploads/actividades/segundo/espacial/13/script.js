var objetos = [
	{
		nombre: 'objeto lejos',
		seleccionado: false
	},
	{
		nombre: 'objeto arriba',
		seleccionado: false
	},
	{
		nombre: 'objeto encima',
		seleccionado: false
	},
	{
		nombre: 'objeto cerca',
		seleccionado: false
	},
    {
		nombre: 'objeto detras',
		seleccionado: false
	},
	{
		nombre: 'objeto delante',
		seleccionado: false
	}
];

var valorCorrecto = 1/(objetos.length);
var puntajes = [valorCorrecto, 0, valorCorrecto, 0,valorCorrecto,0];

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

function Error(pos){
	puntajes[pos] = 0;
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

function seleccionar(numero){
	var img;
	switch(numero){
		case 0:
			img = document.getElementById("marco1");
			break;
		case 1:
			img = document.getElementById("marco2");
			break;
		case 2:
			img = document.getElementById("marco3");
			break;
		case 3:
			img = document.getElementById("marco4");
			break;
		case 4:
			img = document.getElementById("marco5");
			break;
		case 5:
			img = document.getElementById("marco6");
			break;
	}
	img.style.display=(img.style.display=="none")?"inline":"none";
	
	objetos[numero].seleccionado = !objetos[numero].seleccionado;

	calificar(numero);
}

function calificar(numero){
	var correcto = false;
	switch(numero){
		case 0:
			if(!objetos[0].seleccionado){
				Correcto(numero);
				correcto = true;
			}
			break;
		case 1:
			if(objetos[1].seleccionado){
				Correcto(numero);
				correcto = true;
			}
			break;
		case 2:
			if(!objetos[2].seleccionado){
				Correcto(numero);
				correcto = true;
			}
			break;
		case 3:
			if(objetos[3].seleccionado){
				Correcto(numero);
				correcto = true;
			}
			break;
		case 4:
			if(!objetos[4].seleccionado){
				Correcto(numero);
				correcto = true;
			}
			break;
		case 5:
			if(objetos[5].seleccionado){
				Correcto(numero);
				correcto = true;
			}
			break;
	}

	if(!correcto) Error(numero);

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