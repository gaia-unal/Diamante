// Iniciar el Canvas cuando se haya cargado la página
window.addEventListener('load', function () {
    iniciarCanvas();
    document.getElementById('btn-continuar').onclick = function () { procesarPuntaje() };
});

function sonido() {
	sound = document.createElement("embed");
	sound.src = "sC20.mp3";
	sound.style.visibility = "hidden";
	sound.style.position = "absolute";
	document.body.appendChild(sound);
}

var puntajes = [];
var punt = 0;
var cont = 0;

function procesarPuntaje() {
    var puntaje = 0
    for (var i = 0; i < puntajes.length; i++) {
        if (isNaN(puntajes[i]) || puntajes[i] == null) {
            puntaje += 1;
        }
    }
    //alert("Tu puntaje es: " + punt/3);
    parent.enviarPuntaje(punt / 3);
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

    var contenedores;
    var objetos;

    var indiceObjetoSeleccionado;
    var arrastrando;
    var mouseX;
    var mouseY;
    var mouseArrastrandoX;
    var mouseArrastrandoY;

    iniciar();

    // Carga los recursos iniciales dentro del canvas
    function iniciar() {

        contenedores = [
            {
                nombre: 'Contenedor A',
                src: 'contenedor.png',
                largo: 195,
                alto: 150,
                img: null,
                posX: 3,
                posY: 50,
                tipo: 'A'
            },
            {
                nombre: 'Contenedor B',
                src: 'contenedor.png',
                largo: 195,
                alto: 150,
                img: null,
                posX: 190,
                posY: 50,
                tipo: 'B'
            },
            {
                nombre: 'Contenedor C',
                src: 'contenedor.png',
                largo: 195,
                alto: 150,
                img: null,
                posX: 377,
                posY: 50,
                tipo: 'C'
            },
        ];

        objetos = [
            {
                src: 'fresa.png',
                largo: 100,
                alto: 110,
                img: null,
                posX: 130,
                posY: 200,
                tipo: 'A'
            },
            {
                src: 'piedra.png',
                largo: 100,
                alto: 110,
                img: null,
                posX: 250,
                posY: 200,
                tipo: 'C'
            },
            {
                src: 'libro.png',
                largo: 100,
                alto: 110,
                img: null,
                posX: 370,
                posY: 200,
                tipo: 'B'
            },
        ];

        /*puntajes = [null, null, null, null, null, null];*/

        objetos.forEach(function (obj) {
            puntajes.push(true);
        });

        cargarImagenes(dibujarCanvas);

        canvas.addEventListener('mousedown', mousePresionado, false);
    }

    // Carga inicial de las imagenes, cuando se han cargado todas, las dibuja en el canvas
    function cargarImagenes(callback) {
        var objetosCargados = 0;
        var contenedoresCargadas = 0;
        objetos.forEach(function (actual) {
            var img = new Image(actual.largo, actual.alto);
            img.src = actual.src;

            img.onload = function () {
                actual.img = img;
                objetosCargados++;
                if (objetosCargados >= objetos.length) {
                    contenedores.forEach(function (jaula) {
                        var imgJ = new Image(jaula.largo, jaula.alto);
                        imgJ.src = jaula.src;

                        imgJ.onload = function () {
                            jaula.img = imgJ;
                            contenedoresCargadas++;
                            if (contenedoresCargadas >= contenedores.length) {
                                callback();
                            }
                        }
                    });
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
        contenedores.forEach(function (conten) {
            ctx.drawImage(conten.img, conten.posX, conten.posY, conten.largo, conten.alto);
        });
        objetos.forEach(function (recipiente) {
            ctx.drawImage(recipiente.img, recipiente.posX, recipiente.posY, recipiente.largo, recipiente.alto);
        });
    }

    // Determina si un objeto ha sido seleccionado según posiciones indicadas
    function objetoSeleccionado(objeto, mx, my) {
        if (
            mx >= (objeto.posX) &&
            mx <= (objeto.posX + objeto.largo) &&
            my >= (objeto.posY) &&
            my <= (objeto.posY + objeto.alto)
        ) {
            return true;
        }
        return false;
    }

    // Evento cuando se presiona el mouse
    function mousePresionado(evento) {
        var i;

        var indiceMasCercano = -1;

        // Obtener posición precisa del mouse
        var bRect = canvas.getBoundingClientRect();
        mouseX = (evento.clientX - bRect.left) * (canvas.width / bRect.width);
        mouseY = (evento.clientY - bRect.top) * (canvas.height / bRect.height);

        for (i = 0; i < objetos.length; i++) {
            if (objetoSeleccionado(objetos[i], mouseX, mouseY)) {
                arrastrando = true;
                if (i > indiceMasCercano) {
                    // Tendremos en cuenta el punto del cual el mouse está sosteniendo el objeto
                    mouseArrastrandoX = mouseX - objetos[i].posX;
                    mouseArrastrandoY = mouseY - objetos[i].posY;
                    indiceMasCercano = i;
                    indiceObjetoSeleccionado = i;
                }
            }
        }

        if (arrastrando) {
            window.addEventListener('mousemove', mouseMoviendose, false);
        }
        canvas.removeEventListener('mousedown', mousePresionado, false);
        window.addEventListener('mouseup', mouseNoPresionado, false);

        // Evita que el evento de mouse presionado tenga efecto fuera de la ventana principal del navegador
        if (evento.preventDefault) {
            evento.preventDefault();
        } else if (evento.returnValue) {
            evento.returnValue = false;
        }
        return false;
    }

    // Evento cuando se mueve el mouse
    function mouseMoviendose(evento) {
        var posX;
        var posY;
        var largoObjeto = objetos[indiceObjetoSeleccionado].largo;
        var altoObjeto = objetos[indiceObjetoSeleccionado].alto;
        //var minX = largoObjeto;
        var minX = 0;
        var maxX = canvas.width - largoObjeto;
        //var minY = altoObjeto;
        var minY = 0;
        var maxY = canvas.height - altoObjeto;

        // Obtener posición precisa del mouse
        var bRect = canvas.getBoundingClientRect();
        mouseX = (evento.clientX - bRect.left) * (canvas.width / bRect.width);
        mouseY = (evento.clientY - bRect.top) * (canvas.height / bRect.height);

        // Evita que el objeto sea movido fuera del canvas
        posX = mouseX - mouseArrastrandoX;
        posX = (posX < minX) ? minX : ((posX > maxX) ? maxX : posX);
        posY = mouseY - mouseArrastrandoY;
        posY = (posY < minY) ? minY : ((posY > maxY) ? maxY : posY);

        objetos[indiceObjetoSeleccionado].posX = posX;
        objetos[indiceObjetoSeleccionado].posY = posY;

        dibujarCanvas();
    }

    // Evento cuando se deja de presionar el mouse
    function mouseNoPresionado(evento) {
        canvas.addEventListener('mousedown', mousePresionado, false);
        window.removeEventListener('mouseup', mouseNoPresionado, false);
        if (arrastrando) {
            arrastrando = false;
            window.removeEventListener('mousemove', mouseMoviendose, false);
            calificarObjeto(objetos[indiceObjetoSeleccionado]);
            verificarPuntajes();
        }
    }

    function calificarObjeto(objeto) {
        var objPosX1 = objeto.posX;
        var objPosX2 = objPosX1 + objeto.largo;
        var objPosY1 = objeto.posY;
        var objPosY2 = objPosY1 + objeto.alto;

        for (var i = 0; i < contenedores.length; i++) {
            var canPosX1 = contenedores[i].posX;
            var canPosX2 = canPosX1 + contenedores[i].largo;
            var canPosY1 = contenedores[i].posY;
            var canPosY2 = canPosY1 + contenedores[i].alto;
            if (
                objPosX1 >= canPosX1 &&
                objPosX2 <= canPosX2 &&
                objPosY1 >= canPosY1 &&
                objPosY2 <= canPosY2
            ) {
                if (objeto.tipo == contenedores[i].tipo) {
                    puntajes[indiceObjetoSeleccionado] = true;
                    punt++;
                }
            } else {
                puntajes[indiceObjetoSeleccionado] = null;
            }
        }
    }

    function verificarPuntajes() {
        var puntajesCorrectos = true;
        cont++;
        for (var i = 0; i < puntajes.length; i++) {
            if (puntajes[i] == null) {
                puntajesCorrectos = false;
                break;
            }
        }

        if (puntajesCorrectos) {
            ocultarContinuar();
        } else {
            if (cont == 3) {
                mostrarContinuar();
            }
        }
    }
}