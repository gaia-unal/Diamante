var objetos = [
	{
		nombre: 'objetos dispersos',
		seleccionado: false
	},
	{
		nombre: 'objetos al exterior',
		seleccionado: false
	},
];

var valorCorrecto = 1/(objetos.length);
var puntajes=[0,0];


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
	
			
	}
	img.style.display=(img.style.display=="none")?"inline":"none";
	mostrarContinuar();
	calificar(numero);
}

function Error(pos){
	puntajes[pos] = 0;
}

function Correcto(pos){
	puntajes[pos] = valorCorrecto;
}

function calificar(numero){
	objetos[numero].seleccionado = !objetos[numero].seleccionado;
	if(objetos[numero].seleccionado){
		Correcto(numero);
	}else{
		Error(numero);
	}
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