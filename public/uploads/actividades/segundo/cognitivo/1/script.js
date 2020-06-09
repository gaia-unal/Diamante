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

window.onload = function(){
	var numeroMinimo = 1;
	var numeroMaximo = 999;
	numero1 = Math.floor(Math.random() * (numeroMaximo - numeroMinimo + 1)) + numeroMinimo;
	numero2 = Math.floor(Math.random() * (numeroMaximo - numeroMinimo + 1)) + numeroMinimo;
	var num1 = document.getElementById('numero1')
	var num2 = document.getElementById('numero2')
	resultado = numero1 + numero2;
	num1.textContent = numero1;
	num2.textContent = numero2;
	if (String(numero1).length == 2) {
		num1.style.position = "absolute";
		num1.style.left = "33px";
	}
	if (String(numero2).length == 2) {
		num2.style.position = "absolute";
		num2.style.left = "33px";
	}
}

var input = document.getElementById('respuesta');
input.addEventListener('input', function(e){
	calificar(this.value);
});

function calificar(valor){
	console.log(resultado)
	if(!valor || isNaN(valor)){
		ocultarContinuar();
		return false;
	}

	if(valor == resultado){
		Correcto();
	}else{
		Error();
	}
}