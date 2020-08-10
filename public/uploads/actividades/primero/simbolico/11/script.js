var puntaje = null;
var valor = -1;
var resp = -1;

function sonido() {
    sound = document.createElement("embed");
    sound.src = "pS11.mp3";
    sound.style.visibility = "hidden";
    sound.style.position = "absolute";
    document.body.appendChild(sound);
}

listaOraciones = [1, 2, 5, 8, 6, 3, 7, 10, 4, 9];
domOpciones = document.getElementsByClassName('opcion');

$(document).ready(function () {
    elegirFrases();

    $('div').click(function () {
        if ($(this).hasClass("opcion")) {
            $(this).removeClass();
            valor = $(this).text();
            console.log('Aqu� esta el seleccionado ' + valor)
            $('.opcionSeleccionada').each(function (index, elemento) {
                $(this).removeClass('opcionSeleccionada');
                $(this).addClass('opcion');
            })
            $(this).addClass('opcionSeleccionada');
            $('#continuar').css('display', 'block');
        }
    });

});


function elegirFrases() {
    var posicion;
    for (var i = 0; i < 4; i++) {
        posicion = obtenerAzar(listaOraciones);
        domOpciones[i].innerHTML = listaOraciones[posicion];
        if (listaOraciones[posicion] > resp) {
            resp = listaOraciones[posicion];
        }
        delete listaOraciones[posicion];

    }

}


function obtenerAzar(lista) {
    var opcion = -1;
    opcion = Math.floor(Math.random() * 10);
    while (lista[opcion] == null) {
        opcion = Math.floor(Math.random() * 10);
    }
    return opcion;
}

function mostrarContinuar() {
    document.getElementById('continuar').style.display = "block";
}

function ocultarContinuar() {
    document.getElementById('continuar').style.display = "none";
}

function procesarPuntaje() {
    console.log('valor: ' + valor);
    console.log('Respuesta: ' + resp)
    if (valor == resp) {
        puntaje = 1;
    }
    else {
        puntaje = 0;
    }
    console.log(puntaje);
    parent.enviarPuntaje(puntaje);
}
