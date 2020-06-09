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
	check = document.querySelector('input[name="hora_digital"]:checked');
	if (check.value == "false") {
		puntaje = 0;
		parent.enviarPuntaje(puntaje);
	}else{
		puntaje = 1;
		parent.enviarPuntaje(puntaje);
	}
}


function imag(){
	var relojes=[];
	var horas = []
    relojes[0]="reloj_3.png";
    relojes[1]="reloj_4.png";
    relojes[2]="reloj_5.png";
    reloj = Math.floor(Math.random() * 3);
    document.getElementById("reloj").src = relojes[reloj]
    horas[0] = ["hora_1.png", "hora_2.png", "hora_3.png"]
    horas[1] = ["hora_5.png", "hora_7.png", "hora_9.png"]
    horas[2] = ["hora_4.png", "hora_6.png", "hora_8.png"]
    document.getElementById("rta_hora_1").style.backgroundImage = "url("+horas[reloj][0]+")";
    document.getElementById("rta_hora_2").style.backgroundImage = "url("+horas[reloj][1]+")";
    document.getElementById("rta_hora_3").style.backgroundImage = "url("+horas[reloj][2]+")";
}