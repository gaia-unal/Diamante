var puntaje = 0;
var n = 0;
var m = 0;
domOpciones = document.getElementsByClassName('opcion');

$(document).ready(function () {
 });


function mostrarContinuar(){
	document.getElementById('continuar').style.display = "block";
}

function ocultarContinuar(){
	document.getElementById('continuar').style.display = "none";
}

function procesarPuntaje() {
    var porClase = document.getElementsByClassName('paso');
    var porImagen = document.getElementsByClassName('imagen');
    for (var i = 0; i < porClase.length; i++) {
        console.log('califica');
        console.log(porClase[i].id);
        console.log(porImagen[i].id);
        if (porClase[i].id == porImagen[i].id) {
            console.log('iguales')
            puntaje = puntaje + 1;
            console.log('Ya cambio: ' + puntaje)
        }
        else {
            console.log('Diferentes');
            console
        }

    }
    if (puntaje == 3) {
        puntaje = 1;
    }
    else {
        puntaje = 0;
    }
    console.log('Este es el puntaje')
    console.log(puntaje);
    parent.enviarPuntaje(puntaje);
}


function allowDrop(ev) {
    console.log('Allow')
    ev.preventDefault();
}

function drag(ev) {
    console.log('Drag');
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    console.log('Drop');
    ev.preventDefault();
    console.log('Default');
    var data = ev.dataTransfer.getData("text");
    console.log(data)
    ev.target.appendChild(document.getElementById(data));
    m = m + 1;
    if (m == 3) {
        mostrarContinuar();
    }
    
}