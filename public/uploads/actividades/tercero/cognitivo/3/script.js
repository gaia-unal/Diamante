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

function numeroConPuntos(numero) {
	return numero.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");	
}

var numero1 = 0;
var numero2 = 0;
var resultado = 0;

window.onload = function(){
	var num_temp = 0;
	var numeroMinimo = 1;
	var numeroMaximo = 9999;
	numero1 = Math.floor(Math.random() * (numeroMaximo - numeroMinimo + 1)) + numeroMinimo;
	numero2 = Math.floor(Math.random() * (numeroMaximo - numeroMinimo + 1)) + numeroMinimo;
	var num1 = document.getElementById('numero1');
	var num2 = document.getElementById('numero2');
	num1.textContent = numeroConPuntos(numero1);
	num2.textContent = numeroConPuntos(numero2);
	if (numero2 > numero1) {
		resultado = numero2 - numero1;
		num1.textContent = numeroConPuntos(numero2);
		num2.textContent = numeroConPuntos(numero1);
		num_temp = numero1;
		numero1 = numero2;
		numero2 = num_temp;
	}
	resultado = numero1 - numero2;
	var igual = document.getElementsByClassName("igual")[0];
	var input = document.getElementById("respuesta");
	if(String(numero2).length == 2){
		igual.style.left = "385px";
		input.style.left = "445px";
	}else if(String(numero2).length == 3){
		igual.style.left = "420px";
		input.style.left = "475px";
	}
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
	if(valor == resultado){
		Correcto();
	}else{
		Error();
	}
}
