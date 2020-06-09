var puntaje = 0;
var boton = document.getElementById('btn-continuar');
boton.addEventListener('click', procesarPuntaje, false);

function mostrarContinuar(){
	document.getElementById('continuar').style.display = "block";
}

function ocultarContinuar(){
	document.getElementById('continuar').style.display = "none";
}

function procesarPuntaje(){
	var bandera = true;
	var selected = validar();
	console.log(selected);
	for (var i = 0; i < selected.length; i++) {
		if (selected[i] == "true") {
			console.log(selected[i]);
			puntaje += 0.50;
		}
	}
	console.log(puntaje);
	parent.enviarPuntaje(puntaje);
	//alert(puntaje);


	}

function validar() {
	var checkboxes = document.getElementsByName('unidades');
	var selected = [];
	  for (var i=0; i<checkboxes.length; i++) {
	     if (checkboxes[i].checked) {
	        selected.push(checkboxes[i].value);
	     }
	  }
	  return selected;
};