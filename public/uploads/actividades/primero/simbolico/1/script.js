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

var numero1 = 0;
var numero2 = 0;
var resultado = 0;
var operaciones = [
	{nombre: 'SUMA', respuesta: false},
	{nombre: 'RESTA', respuesta: false}
];

window.onload = function(){
	var numeroMinimo = 1;
	var numeroMaximo = 9;
	numero1 = Math.floor(Math.random() * (numeroMaximo - numeroMinimo + 1)) + numeroMinimo;
	numero2 = Math.floor(Math.random() * (numeroMaximo - numeroMinimo + 1)) + numeroMinimo;

	var cantOp = operaciones.length;
	var posOp = Math.floor(Math.random() * cantOp);
	switch(operaciones[posOp].nombre){
		case 'SUMA':
			resultado = numero1 + numero2;
			break;
		case 'RESTA':
			resultado = numero1 - numero2;
			if(resultado < 0){
				numero2 = numero1;
				resultado = 0;
			}
			break;
	}
	operaciones[posOp].respuesta = true;

	document.getElementById('numero1').textContent = numero1;
	document.getElementById('numero2').textContent = numero2;
	document.getElementById('resultado').textContent = resultado;

	if(resultado > 9) document.getElementById('resultado').parentNode.style.left = "287px";

	document.getElementById('signo').textContent = '?';
}

function seleccionar(valor){
	switch(valor){
		case 0:
			if(operaciones[0].respuesta){
				Correcto();
			}else{
				Error();
			}
			document.getElementById('signo').textContent = '+';
			break;
		case 1:
			if(operaciones[1].respuesta){
				Correcto();
			}else{
				Error();
			}
			document.getElementById('signo').textContent = '\u2212'; // Signo menos
			break;
	}
}