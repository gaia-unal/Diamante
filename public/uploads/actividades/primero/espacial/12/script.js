// Iniciar el Canvas cuando se haya cargado la página
window.addEventListener('load', function () {
    iniciarCanvas();
    document.getElementById('continuar').onclick = function () { procesarPuntaje() };
});

var puntajes = [];
var realizado = false;

function procesarPuntaje() {
    if (realizado) {
        var puntaje = 0;
        for (var i = 0; i < puntajes.length; i++) {
            if (isNaN(puntajes[i]) || puntajes[i] == null) {
                alert("Por favor completa la actividad");
                ocultarContinuar();
                return false;
            } else {
                puntaje += puntajes[i];
            }
        }

        parent.enviarPuntaje(puntaje);
    } else {
        alert('Por favor completa la actividad');
    }
}

function mostrarContinuar() {
    document.getElementById('continuar').style.display = "block";
}

function ocultarContinuar() {
    document.getElementById('continuar').style.display = "none";
}

function iniciarCanvas() {
    var canvas = document.getElementById('lienzo');
    var ctx = canvas.getContext('2d');

    var tipos = ['IZQ', 'DER'];

    var imagenes;
    var objetos;

    var largoObjeto = 75;
    var altoObjeto = 117;

    var posYObjetos = 120;

    var posXInicialObjetos = 15;
    var posDeltaObjetos = 55;
    var posXDeltaObjetos = 145;

    var indiceObjetoSeleccionado;
    var seleccionado;
    var mouseX;
    var mouseY;

    iniciar();

    // Carga los recursos iniciales dentro del canvas
    function iniciar() {
        imagenes = [
            {
                tipo: tipos[0],
                src: 'banderin_izq.png',
                largo: largoObjeto,
                alto: altoObjeto,
                img: null
            },
            {
                tipo: tipos[1],
                src: 'banderin_der.png',
                largo: largoObjeto,
                alto: altoObjeto,
                img: null
            },
        ];

        objetos = [
            {
                nombre: 'BANDERIN 1',
                tipo: seleccionarTipoAleatorio(),
                posX1: null,
                posX2: null,
                posY1: posYObjetos,
                posY2: null
            },
            {
                nombre: 'BANDERIN 2',
                tipo: seleccionarTipoAleatorio(),
                posX1: null,
                posX2: null,
                posY1: posYObjetos,
                posY2: null
            },
            {
                nombre: 'BANDERIN 3',
                tipo: seleccionarTipoAleatorio(),
                posX1: null,
                posX2: null,
                posY1: posYObjetos,
                posY2: null
            },
            {
                nombre: 'BANDERIN 4',
                tipo: seleccionarTipoAleatorio(),
                posX1: null,
                posX2: null,
                posY1: posYObjetos,
                posY2: null
            },
        ];

        for (var i = 0; i < objetos.length; i++) {
            objetos[i].posX1 = calcularPosicionXObjeto(i, objetos[i].tipo);
        }

        objetos.forEach(function (obj) {
            puntajes.push(null);
        });

        for (var i = 0; i < objetos.length; i++) {
            calificarObjeto(i);
        }

        cargarImagenes(dibujarCanvas);

        canvas.addEventListener('mousedown', mousePresionado, false);
    }

    // Retorna un tipo aleatorio del arreglo de tipos
    function seleccionarTipoAleatorio() {
        var aleatorio = Math.floor(Math.random() * tipos.length);
        return tipos[aleatorio];
    }

    // Calcula la posición X de un objeto según su indice y tipo
    function calcularPosicionXObjeto(indice, tipo) {
        var respuesta;
        if (tipo == tipos[0]) {
            respuesta = posXInicialObjetos + (indice * posXDeltaObjetos);
        } else {
            respuesta = posXInicialObjetos + posDeltaObjetos + (indice * posXDeltaObjetos);
        }

        return respuesta;
    }

    // Carga inicial de las imagenes, cuando se han cargado todas, las dibuja en el canvas
    function cargarImagenes(callback) {
        var objetosCargados = 0;
        imagenes.forEach(function (actual) {
            var img = new Image(actual.largo, actual.alto);
            img.src = actual.src;

            img.onload = function () {
                actual.img = img;
                objetosCargados++;
                if (objetosCargados >= imagenes.length) {
                    callback();
                }
            }
        });
    }

    // Prepara el canvas para dibujar las imagenes
    function dibujarCanvas() {
        ctx.fillStyle = '#FFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        dibujarImagenes();
    }

    // Dibuja en el canvas todas las imagenes
    function dibujarImagenes() {
        ctx.fillStyle = 'rgb(4, 206, 125)';
        ctx.fillRect(50, 237, 500, 15);

        var i;
        objetos.forEach(function (objeto) {
            for (i = 0; i < imagenes.length; i++) {
                if (objeto.tipo == imagenes[i].tipo) {
                    ctx.drawImage(imagenes[i].img, objeto.posX1, objeto.posY1, imagenes[i].largo, imagenes[i].alto);
                    objeto.posX2 = objeto.posX1 + imagenes[i].largo;
                    objeto.posY2 = objeto.posY1 + imagenes[i].alto;
                    break;
                }
            }
        });
    }

    // Determina si un objeto ha sido seleccionado según posiciones indicadas
    function objetoSeleccionado(objeto, mx, my) {
        if (
            mx >= (objeto.posX1) &&
            mx <= (objeto.posX2) &&
            my >= (objeto.posY1) &&
            my <= (objeto.posY2)
        ) {
            return true;
        }

        return false;
    }

    // Evento cuando se presiona el mouse
    function mousePresionado(evento) {
        // Obtener posición precisa del mouse
        var bRect = canvas.getBoundingClientRect();
        mouseX = (evento.clientX - bRect.left) * (canvas.width / bRect.width);
        mouseY = (evento.clientY - bRect.top) * (canvas.height / bRect.height);

        for (var i = 0; i < objetos.length; i++) {
            if (objetoSeleccionado(objetos[i], mouseX, mouseY)) {
                seleccionado = true;
                indiceObjetoSeleccionado = i;
                break;
            }
        }

        if (seleccionado) {
            realizado = true;
            canvas.removeEventListener('mousedown', mousePresionado, false);
            window.addEventListener('mouseup', mouseNoPresionado, false);
        }

        // Evita que el evento de mouse presionado tenga efecto fuera de la ventana principal del navegador
        if (evento.preventDefault) {
            evento.preventDefault();
        } else if (evento.returnValue) {
            evento.returnValue = false;
        }

        return false;
    }

    // Evento cuando se deja de presionar el mouse
    function mouseNoPresionado(evento) {
        canvas.addEventListener('mousedown', mousePresionado, false);
        window.removeEventListener('mouseup', mouseNoPresionado, false);
        if (seleccionado) {
            seleccionado = false;

            cambiarDireccionObjeto(indiceObjetoSeleccionado);

            calificarObjeto(indiceObjetoSeleccionado);

            dibujarCanvas();

            verificarPuntajes();
        }
    }

    // Cambia la dirección del objeto indicado por el indice
    function cambiarDireccionObjeto(indice) {
        objetos[indice].tipo = (objetos[indice].tipo == tipos[0]) ? tipos[1] : tipos[0];
        objetos[indice].posX1 = calcularPosicionXObjeto(indice, objetos[indice].tipo);
    }

    // Califica el objeto indicado por el indice
    function calificarObjeto(indice) {
        var puntaje = 1 / (objetos.length);
        var tipo = objetos[indice].tipo;
        switch (indice) {
            case 0:
                puntajes[indice] = (tipo == tipos[1]) ? puntaje : 0;
                break;
            case 1:
                puntajes[indice] = (tipo == tipos[0]) ? puntaje : 0;
                break;
            case 2:
                puntajes[indice] = (tipo == tipos[0]) ? puntaje : 0;
                break;
            case 3:
                puntajes[indice] = (tipo == tipos[0]) ? puntaje : 0;
        }
    }

    function verificarPuntajes() {
        var puntajesCorrectos = true;
        for (var i = 0; i < puntajes.length; i++) {
            if (puntajes[i] == null) {
                puntajesCorrectos = false;
                break;
            }
        }

        if (puntajesCorrectos) {
            mostrarContinuar();
        } else {
            ocultarContinuar();
        }
    }
}

function sonido() {
    sound = document.createElement("embed");
    sound.src = "pE12.mp3";
    sound.style.visibility = "hidden";
    sound.style.position = "absolute";
    document.body.appendChild(sound);
}