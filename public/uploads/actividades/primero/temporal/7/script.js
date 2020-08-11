var puntaje = null;

var boton = document.getElementById('btn-continuar');
boton.addEventListener('click', procesarPuntaje, false);

function mostrarContinuar() {
	document.getElementById('continuar').style.display = "block";
}

function ocultarContinuar() {
	document.getElementById('continuar').style.display = "none";
}

function procesarPuntaje() {
	if (puntaje == null || isNaN(puntaje)) {
		alert('Por favor completa la actividad');
		ocultarContinuar();
	} else {
		parent.enviarPuntaje(puntaje);
	}
}

function Error() {
	if (puntaje == null) puntaje = 0;
	mostrarContinuar();
}

function Correcto() {
	puntaje += 1 / 3;
	if (puntaje > 1) puntaje = 1;
	mostrarContinuar();
}

function sonido() {
	sound = document.createElement("embed");
	sound.src = "pT7.mp3";/*Falta el audio para vincularlo*/
	sound.style.visibility = "hidden";
	sound.style.position = "absolute";
	document.body.appendChild(sound);
}

var usados = [];
function repetido(num) {
	var repe = false;
	var i;
	for (i = 0; i < usados.length; i++) {
		if (num == usados[i]) {
			repe = true;
		}
	}
	return repe;
}

var respuesta = [];
var fuentes = [];
function imag() {
	var imagenes = [];
	imagenes[0] = "num1.png";
	imagenes[1] = "num2.png";
	imagenes[2] = "num3.png";
	imagenes[3] = "num4.png";
	imagenes[4] = "num5.png";
	imagenes[5] = "num6.png";
	imagenes[6] = "num7.png";
	imagenes[7] = "num8.png";
	imagenes[8] = "num9.png";
	var i;
	for (i = 0; i < 9; i++) {
		var num;
		var repe = false;
		do {
			num = Math.floor(Math.random() * (9 - 1 + 1)) + 1;
			repe = repetido(num);
		} while (repe != false);
		usados.push(num);
		fuentes[i] = imagenes[num - 1];
		respuesta[i] = num;
	}
	var sour1 = fuentes[0];
	var sour2 = fuentes[1];
	var sour3 = fuentes[2];
	document.getElementById("carta1").src = sour1;
	document.getElementById("carta2").src = sour2;
	document.getElementById("carta3").src = sour3;
}

var tiempo = 15;
var futuro1 = (Math.floor(new Date() / 1000)) + tiempo;
function faltan() {
	var actual = Math.floor(new Date() / 1000);
	futuro = futuro1 - actual;
	if (futuro > 0) {
		horas_dec = ((futuro / 60) / 60);
		horas = Math.floor(horas_dec);
		minutos = horas_dec - horas;
		minutos_dec = minutos * 60;
		minutos = Math.floor(minutos_dec);
		segundos = minutos_dec - minutos;
		segundos = Math.floor(segundos * 60);
		document.formulario.reloj.value = segundos;
	}
	else {
		document.getElementById("carta1").parentNode.removeChild(document.getElementById("carta1"));
		document.getElementById("carta2").parentNode.removeChild(document.getElementById("carta2"));
		document.getElementById("carta3").parentNode.removeChild(document.getElementById("carta3"));
		document.getElementById("crono").parentNode.removeChild(document.getElementById("crono"));
		var t1 = document.getElementById("tapa1");
		t1.src = "tapa.png";
		t1.height = "80";
		var t2 = document.getElementById("tapa2");
		t2.src = "tapa.png";
		t2.height = "80";
		var t3 = document.getElementById("tapa3");
		t3.src = "tapa.png";
		t3.height = "80";
		document.getElementById("res1").innerHTML = 1;
		document.getElementById("res2").innerHTML = 2;
		document.getElementById("res3").innerHTML = 3;
		document.getElementById("res4").innerHTML = 4;
		document.getElementById("res5").innerHTML = 5;
		document.getElementById("res6").innerHTML = 6;
		document.getElementById("res7").innerHTML = 7;
		document.getElementById("res8").innerHTML = 8;
		document.getElementById("res9").innerHTML = 9;
	}
	setTimeout("faltan()", 1);
}

function showHide1() {
	var image1 = document.getElementById("marco1");
	var nume1 = document.getElementById("nume1");
	image1.style.display = (image1.style.display == "none") ? "inline" : "none";
	nume1.style.display = (nume1.style.display == "none") ? "inline" : "none";
	document.getElementById("nume1").innerHTML = contador;
}
function showHide2() {
	var image2 = document.getElementById("marco2");
	var nume2 = document.getElementById("nume2");
	image2.style.display = (image2.style.display == "none") ? "inline" : "none";
	nume2.style.display = (nume2.style.display == "none") ? "inline" : "none";
	document.getElementById("nume2").innerHTML = contador;
}
function showHide3() {
	var image3 = document.getElementById("marco3");
	var nume3 = document.getElementById("nume3");
	image3.style.display = (image3.style.display == "none") ? "inline" : "none";
	nume3.style.display = (nume3.style.display == "none") ? "inline" : "none";
	document.getElementById("nume3").innerHTML = contador;
}
function showHide4() {
	var image4 = document.getElementById("marco4");
	var nume4 = document.getElementById("nume4");
	image4.style.display = (image4.style.display == "none") ? "inline" : "none";
	nume4.style.display = (nume4.style.display == "none") ? "inline" : "none";
	document.getElementById("nume4").innerHTML = contador;
}
function showHide5() {
	var image5 = document.getElementById("marco5");
	var nume5 = document.getElementById("nume5");
	image5.style.display = (image5.style.display == "none") ? "inline" : "none";
	nume5.style.display = (nume5.style.display == "none") ? "inline" : "none";
	document.getElementById("nume5").innerHTML = contador;
}
function showHide6() {
	var image6 = document.getElementById("marco6");
	var nume6 = document.getElementById("nume6");
	image6.style.display = (image6.style.display == "none") ? "inline" : "none";
	nume6.style.display = (nume6.style.display == "none") ? "inline" : "none";
	document.getElementById("nume6").innerHTML = contador;
}
function showHide7() {
	var image7 = document.getElementById("marco7");
	var nume7 = document.getElementById("nume7");
	image7.style.display = (image7.style.display == "none") ? "inline" : "none";
	nume7.style.display = (nume7.style.display == "none") ? "inline" : "none";
	document.getElementById("nume7").innerHTML = contador;
}
function showHide8() {
	var image8 = document.getElementById("marco8");
	var nume8 = document.getElementById("nume8");
	image8.style.display = (image8.style.display == "none") ? "inline" : "none";
	nume8.style.display = (nume8.style.display == "none") ? "inline" : "none";
	document.getElementById("nume8").innerHTML = contador;
}
function showHide9() {
	var image9 = document.getElementById("marco9");
	var nume9 = document.getElementById("nume9");
	image9.style.display = (image9.style.display == "none") ? "inline" : "none";
	nume9.style.display = (nume9.style.display == "none") ? "inline" : "none";
	document.getElementById("nume9").innerHTML = contador;
}

var contador = 3
function sumnum() {
	contador = contador - 1;
}

function Validar(a, respuesta) {
	switch (contador) {
		case 0:
			if (respuesta[0] == a) {
				Correcto();
			}
			else {
				Error();
			}
			break;
		case 1:
			if (respuesta[1] == a) {
				Correcto();
			}
			else {
				Error();
			}
			break;
		case 2:
			if (respuesta[2] == a) {
				Correcto();
			}
			else {
				Error();
			}
			break;
	}
}