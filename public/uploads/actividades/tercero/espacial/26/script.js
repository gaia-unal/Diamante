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

var img1 = document.getElementById("imagen1");
var img2 = document.getElementById("imagen2");
var img3 = document.getElementById("imagen3");
var img4 = document.getElementById("imagen4");
var img5 = document.getElementById("imagen5");
var img6 = document.getElementById("imagen6");
var img7 = document.getElementById("imagen7");
var img8 = document.getElementById("imagen8");
var img9 = document.getElementById("imagen9");

function seleccionar(numero){
	var colorSeleccion = "#62bda8";
	var colorDefault = "#CCC";
	switch(numero){
		case 1:
			Error();
			img1.style.borderColor = colorSeleccion;
			img2.style.borderColor = colorDefault;
			img3.style.borderColor = colorDefault;
			img4.style.borderColor = colorDefault;
			img5.style.borderColor = colorDefault;
			img6.style.borderColor = colorDefault;
			img7.style.borderColor = colorDefault;
			img8.style.borderColor = colorDefault;
			img9.style.borderColor = colorDefault;
			break;
		case 2:
		    Error();
			img1.style.borderColor = colorDefault;
			img2.style.borderColor = colorSeleccion;
			img3.style.borderColor = colorDefault;
			img4.style.borderColor = colorDefault;
			img5.style.borderColor = colorDefault;
			img6.style.borderColor = colorDefault;
			img7.style.borderColor = colorDefault;
			img8.style.borderColor = colorDefault;
			img9.style.borderColor = colorDefault;
			break;
		case 3:
			Correcto();
			img1.style.borderColor = colorDefault;
			img2.style.borderColor = colorDefault;
			img3.style.borderColor = colorSeleccion;
			img4.style.borderColor = colorDefault;
			img5.style.borderColor = colorDefault;
			img6.style.borderColor = colorDefault;
			img7.style.borderColor = colorDefault;
			img8.style.borderColor = colorDefault;
			img9.style.borderColor = colorDefault;
			break;
		case 4:
			Error();
			img1.style.borderColor = colorDefault;
			img2.style.borderColor = colorDefault;
			img3.style.borderColor = colorDefault;
			img4.style.borderColor = colorSeleccion;
			img5.style.borderColor = colorDefault;
			img6.style.borderColor = colorDefault;
			img7.style.borderColor = colorDefault;
			img8.style.borderColor = colorDefault;
			img9.style.borderColor = colorDefault;
			break;
		case 5:
			Error();
			img1.style.borderColor = colorDefault;
			img2.style.borderColor = colorDefault;
			img3.style.borderColor = colorDefault;
			img4.style.borderColor = colorDefault;
			img5.style.borderColor = colorSeleccion;
			img6.style.borderColor = colorDefault;
			img7.style.borderColor = colorDefault;
			img8.style.borderColor = colorDefault;
			img9.style.borderColor = colorDefault;
			break;
		case 6:
			Error();
			img1.style.borderColor = colorDefault;
			img2.style.borderColor = colorDefault;
			img3.style.borderColor = colorDefault;
			img4.style.borderColor = colorDefault;
			img5.style.borderColor = colorDefault;
			img6.style.borderColor = colorSeleccion;
			img7.style.borderColor = colorDefault;
			img8.style.borderColor = colorDefault;
			img9.style.borderColor = colorDefault;
			break;
		case 7:
			Error();
			img1.style.borderColor = colorDefault;
			img2.style.borderColor = colorDefault;
			img3.style.borderColor = colorDefault;
			img4.style.borderColor = colorDefault;
			img5.style.borderColor = colorDefault;
			img6.style.borderColor = colorDefault;
			img7.style.borderColor = colorSeleccion;
			img8.style.borderColor = colorDefault;
			img9.style.borderColor = colorDefault;
			break;
		case 8:
			Error();
			img1.style.borderColor = colorDefault;
			img2.style.borderColor = colorDefault;
			img3.style.borderColor = colorDefault;
			img4.style.borderColor = colorDefault;
			img5.style.borderColor = colorDefault;
			img6.style.borderColor = colorDefault;
			img7.style.borderColor = colorDefault;
			img8.style.borderColor = colorSeleccion;
			img9.style.borderColor = colorDefault;
			break;
		case 9:
			Error();
			img1.style.borderColor = colorDefault;
			img2.style.borderColor = colorDefault;
			img3.style.borderColor = colorDefault;
			img4.style.borderColor = colorDefault;
			img5.style.borderColor = colorDefault;
			img6.style.borderColor = colorDefault;
			img7.style.borderColor = colorDefault;
			img8.style.borderColor = colorDefault;
			img9.style.borderColor = colorSeleccion;
			break;

	}
}