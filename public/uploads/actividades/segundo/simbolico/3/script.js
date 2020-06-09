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
	{nombre: 'RESTA', respuesta: false},
	{nombre: 'MULTIPLICACION', respuesta: false}
];

window.onload = function(){
	var numeroMinimo = 1;
	var numeroMaximo = 9;	

	var cantOp = operaciones.length;
	var posOp = Math.floor(Math.random() * cantOp);
	determinarResultadoSegunOperacion(operaciones[posOp].nombre);
	
	operaciones[posOp].respuesta = true;

	mostrarNumeros();
}

function determinarResultadoSegunOperacion(operacion){
	var numeroMinimo = 1;
	var numeroMaximo = 99;

	numero1 = Math.floor(Math.random() * (numeroMaximo - numeroMinimo + 1)) + numeroMinimo;
	if(operacion == 'SUMA'){
		numero2 = Math.floor(Math.random() * (numeroMaximo - numeroMinimo + 1)) + numeroMinimo;
		resultado = numero1 + numero2;
	}else if(operacion == 'RESTA'){
		numero2 = Math.floor(Math.random() * (numero1 - numeroMinimo + 1)) + numeroMinimo;
		resultado = numero1 - numero2;
	}else{
		numero1 = Math.floor(Math.random() * (9 - numeroMinimo + 1)) + numeroMinimo;
		numero2 = Math.floor(Math.random() * (9 - numeroMinimo + 1)) + numeroMinimo;
		resultado = numero1 * numero2;
	}

	if(numero1 < numero2){
		var temp = numero1;
		numero1 = numero2;
		numero2 = temp;
	}
}

function mostrarNumeros(){
	var num1 = document.getElementById('numero1');
	var num2 = document.getElementById('numero2');
	var res = document.getElementById('resultado');
	num1.textContent = numero1;
	num2.textContent = numero2;
	res.textContent = resultado;

	if(resultado > 99){
		if(numero1 > 9){
			num1.parentNode.style.left = '348px';
		}else{
			num1.parentNode.style.left = '382px';
		}
		if(numero2 > 9){
			num2.parentNode.style.left = '348px';
		}else{
			num2.parentNode.style.left = '382px';
		}
	}else if(resultado > 9){
		res.parentNode.style.left = '330px';
		if(numero1 > 9){
			num1.parentNode.style.left = '330px';
		}else{
			num1.parentNode.style.left = '364px';
		}
		if(numero2 > 9){
			num2.parentNode.style.left = '330px';
		}else{
			num2.parentNode.style.left = '364px';
		}
	}else{
		res.parentNode.style.left = '350px';
		if(numero1 > 9){
			num1.parentNode.style.left = '330px';
			res.parentNode.style.left = '365px';
		}else{
			num1.parentNode.style.left = '350px';
		}
		if(numero2 > 9){
			num2.parentNode.style.left = '330px';
			res.parentNode.style.left = '365px';
		}else{
			if(numero1 > 9){
				num2.parentNode.style.left = '365px';
			}else{
				num2.parentNode.style.left = '350px';
			}
		}
	}
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
        case 2:
		if(operaciones[2].respuesta){
				Correcto();
			}else{
				Error();
			}
			document.getElementById('signo').textContent = '\u00D7'; // Signo multiplicación
			break;
	}
}