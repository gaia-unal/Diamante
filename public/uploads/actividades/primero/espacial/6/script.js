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

function showHide1(){
	var image1=document.getElementById("marco1"); 
	var image2=document.getElementById("marco2"); 
	var image3=document.getElementById("marco3");
	image1.style.display=(image1.style.display=="none")?"inline":"none"; 
	image2.style.display="none";
	image3.style.display="none";
}

function showHide2(){
	var image1=document.getElementById("marco1"); 
	var image2=document.getElementById("marco2");
	var image3=document.getElementById("marco3"); 
	image2.style.display=(image2.style.display=="none")?"inline":"none";
	image1.style.display="none";
	image3.style.display="none";
}

function showHide3(){
	var image1=document.getElementById("marco1"); 
	var image2=document.getElementById("marco2");
	var image3=document.getElementById("marco3"); 
	image3.style.display=(image3.style.display=="none")?"inline":"none";
	image1.style.display="none";
	image2.style.display="none";
}