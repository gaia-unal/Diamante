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
	check = document.querySelector('input[name="mes"]:checked');
	if (check.value == "false") {
		var texto = 'Por favor completa la actividad';
		if(typeof parent.mostrarAlerta === "function") {
			parent.mostrarAlerta(texto);
		}else{
			alert(texto);
		}
		document.getElementById(check.id).checked = false;
		ocultarContinuar();
	}else{
		puntaje = 1;
		parent.enviarPuntaje(puntaje);
	}
}

function imag(){
	var preguntas=[];
	var meses = []
    preguntas[0]="pregunta_1.png";
    preguntas[1]="pregunta_2.png";
    mes = Math.floor(Math.random() * 2);
    document.getElementById("pregunta").src = preguntas[mes]
    meses[0] = ["img_2.png", "img_1.png", "img_3.png", "img_4.png"]
    meses[1] = ["img_6.png", "img_7.png", "img_5.png", "img_8.png"]
    document.getElementById("rta_mes_1").style.backgroundImage = "url("+meses[mes][0]+")";
    document.getElementById("rta_mes_2").style.backgroundImage = "url("+meses[mes][1]+")";
    document.getElementById("rta_mes_3").style.backgroundImage = "url("+meses[mes][2]+")";
    document.getElementById("rta_mes_4").style.backgroundImage = "url("+meses[mes][3]+")";
}