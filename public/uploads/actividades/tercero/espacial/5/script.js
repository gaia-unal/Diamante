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

var input = document.getElementById('caja');
input.addEventListener('input', function(e){
	calificar(this.value);
});

var usados=[];
function repetido(num){
	var repe=false;
	var i;
	for (i=0;i<usados.length; i++) 
	{
		if(num==usados[i]) 
		{
			repe = true;
		}
	}
	return repe;
}

var imagenObjetivo;
function imag(){
	var imagenes=[];
    imagenes[0]="2-31.png";
    imagenes[1]="2-32.png";
    imagenes[2]="2-33.png";
    imagenes[3]="2-34.png";
    imagenes[4]="2-35.png";
    imagenes[5]="2-36.png";
    imagenes[6]="2-37.png";	
	if (usados.length!=(7-1)){
		var num;
		var repe=false;
		do {
			num = Math.floor(Math.random()*(5-1+1))+1;
			repe = repetido(num);
		} while (repe!=false);
		usados.push(num);
		imagenObjetivo=num;
	}
	
    return imagenes[num-1];
}

function cours(){
	var sour=imag();
	document.getElementById("imagen").src=sour
}

function calificar(valor){
	if(!valor){
		ocultarContinuar();
		return false;
	}

	switch(imagenObjetivo){
		case 1:
			if(valor == 4){
				Correcto();
			}else{
				Error();
			}
			break;
		case 2:
			if(valor == 10){
				Correcto();
			}else{
				Error();
			}
			break;
		case 3:
			if(valor == 5){
				Correcto();
			}else{
				Error();
			}
			break;
		case 4:
			if(valor == 4){
				Correcto();
			}else{
				Error();
			}
			break;
		case 5:
			if(valor == 3){
				Correcto();
			}else{
				Error();
			}
			break;
		case 6:
			if(valor == 6){
				Correcto();
			}else{
				Error();
			}
			break;
		case 7:
			if(valor == 8){
				Correcto();
			}else{
				Error();
			}
			break;
	}
}