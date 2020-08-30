var puntaje = null;

function sonido() {
	sound = document.createElement("embed");
	sound.src = "sC22.mp3";
	sound.style.visibility = "hidden";
	sound.style.position = "absolute";
	document.body.appendChild(sound);
}

var boton = document.getElementById('btn-continuar');
boton.addEventListener('click', procesarPuntaje, false);

window.onload = function(){
	var numeroMinimo = 1;
	var numeroMaximo = 999;
	num_base = Math.floor(Math.random() * (numeroMaximo - numeroMinimo + 1)) + numeroMinimo;
	var num = document.getElementById('num_base')
	num.textContent = num_base;
}


function mostrarContinuar(){
	var cen = document.getElementById("cen").value
	var dec = document.getElementById("dec").value
	var uni = document.getElementById("uni").value
	if (cen != "" && dec != "" && uni != "") {
		document.getElementById('continuar').style.display = "block";
	}
	else {
		ocultarContinuar()
	}
}

function ocultarContinuar(){
	document.getElementById('continuar').style.display = "none";
}

function procesarPuntaje(){
	num_base = String(num_base)
	if (num_base.length == 1) {
		num_base = "00" + num_base
	}
	if (num_base.length == 2) {
		num_base = "0" + num_base
	}
	var cen = document.getElementById("cen").value == num_base[0]
	var dec = document.getElementById("dec").value == num_base[1]
	var uni = document.getElementById("uni").value == num_base[2]
	if (cen == false || dec == false || uni == false) {
		puntaje = 0;
		parent.enviarPuntaje(puntaje);
	}else{
		puntaje = 1;
		parent.enviarPuntaje(puntaje);
	}
}

function validarNumeros(e){
  var key = window.event ? e.which : e.keyCode;
  if (key < 48 || key > 57) {
    e.preventDefault();
  }
}