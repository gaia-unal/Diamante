var puntaje = 1/2;
var boton = document.getElementById('btn-continuar');
boton.addEventListener('click', procesarPuntaje, false);

function mostrarContinuar(){
	document.getElementById('continuar').style.display = "block";
}

function ocultarContinuar(){
	document.getElementById('continuar').style.display = "none";
}

function procesarPuntaje(){
	if(isNaN(puntaje) || puntaje == null){
		var texto = 'Por favor completa la actividad';
			if(typeof parent.mostrarAlerta === "function") {
				parent.mostrarAlerta(texto);
			}else{
				alert(texto);
			}
            ocultarContinuar();
            return false;
	}
	parent.enviarPuntaje(puntaje);
}

function incrementarPuntaje() {
	puntaje += 1/6;
}

function disminuirPuntaje() {
	puntaje -= 1/6;
}

function calificar(opcion) {
	switch(opcion){
		case 1:
			if(document.getElementById("tiempo_1").checked){
				incrementarPuntaje();
			}else{
				disminuirPuntaje();
			}
			break;
		case 2:
			if(document.getElementById("tiempo_2").checked){
				disminuirPuntaje();
			}else{
				incrementarPuntaje();
			}
			break;
		case 3:
			if(document.getElementById("tiempo_3").checked){
				disminuirPuntaje();
			}else{
				incrementarPuntaje();
			}
			break;
		case 4:
			if(document.getElementById("tiempo_4").checked){
				incrementarPuntaje();
			}else{
				disminuirPuntaje();
			}
			break;
		case 5:
			if(document.getElementById("tiempo_5").checked){
				incrementarPuntaje();
			}else{
				disminuirPuntaje();
			}
			break;
		case 6:
			if(document.getElementById("tiempo_6").checked){
				disminuirPuntaje();
			}else{
				incrementarPuntaje();
			}
			break;
	}
	if(puntaje < 0){
		puntaje = 0;
	}else if(puntaje > 1){
		puntaje = 1;
	}
	mostrarContinuar();
};