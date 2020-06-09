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

const numberWithCommas = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

var numero1 = 0;
var numero2 = 0;
var resultado = 0;

window.onload = function(){
	var num_temp = 0;
	var numeroMinimo = 1;
	var numeroMaximo = 999999;
	numero1 = Math.floor(Math.random() * (numeroMaximo - numeroMinimo + 1)) + numeroMinimo;
	numero2 = Math.floor(Math.random() * (numeroMaximo - numeroMinimo + 1)) + numeroMinimo;
	var num1 = document.getElementById('numero1')
	var num2 = document.getElementById('numero2')
	resultado = numero1 - numero2;
	// console.log(String(numero1).length)
	num1.textContent = numberWithCommas(numero1);
	num2.textContent = numberWithCommas(numero2);
	if (numero2 > numero1) {
		resultado = numero2 - numero1;
		num1.textContent = numberWithCommas(numero2);
		num2.textContent = numberWithCommas(numero1);
		num_temp = numero1;
		numero1 = numero2;
		numero2 = num_temp;
	}
	if (String(numero1).length == 2) {
		num1.style.position = "absolute";
		num1.style.left = "132px";
	} else {
		if (String(numero1).length == 3) {
			num1.style.position = "absolute";
			num1.style.left = "99px";
		} else {
			if (String(numero1).length == 4) {
				num1.style.position = "absolute";
				num1.style.left = "66px";
			} else {
				if (String(numero1).length == 5) {
					num1.style.position = "absolute";
					num1.style.left = "33px";	
				} else {
					if (String(numero1).length == 1) {
						num1.style.position = "absolute";
						num1.style.left = "165px";
					}
				}
			}
		}
	}
	// document.getElementById('numero2').textContent = numero2;
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
