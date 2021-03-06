// Iniciar el Canvas cuando se haya cargado la página
window.addEventListener('load', function () {
    iniciarCanvas();
    document.getElementById('btn-continuar').onclick = function () { procesarPuntaje() };
});

var objetos;
var realizado = false;

function sonido() {
    sound = document.createElement("embed");
    sound.src = "pS3.mp3";
    sound.style.visibility = "hidden";
    sound.style.position = "absolute";
    document.body.appendChild(sound);
}

function procesarPuntaje() {
    var valido = true;
    if (!realizado) {
        var texto = 'Por favor completa la actividad';
        if (typeof parent.mostrarAlerta === "function") {
            parent.mostrarAlerta(texto);
        } else {
            alert(texto);
        }
        ocultarContinuar();
        valido = false;
    }

    if (valido) {
        var puntaje = 0;
        var resultado = 0;

        for (var i = 0; i < objetos.length; i++) {

            resultado += objetos[i].valor;
        }

        if ((objetos.length - resultado) == 2) {
            puntaje = 1;
        }

        parent.enviarPuntaje(puntaje);
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

    var contenedores;

    var indiceObjetoSeleccionado;
    var arrastrando;
    var mouseX;
    var mouseY;
    var mouseArrastrandoX;
    var mouseArrastrandoY;

    iniciar();

    // Carga los recursos iniciales dentro del canvas
    function iniciar() {
        var posObjetosY = 250;
        var objetosLargo = 50;
        var objetosAlto = 71;

        contenedores = [
            {
                nombre: 'CONJUNTO',
                src: 'conjunto.png',
                largo: 424,
                alto: 175,
                img: null,
                posX: 88,
                posY: 30,
                tipo: 'A'
            },
        ];

        objetos = [
            {
                nombre: 'PERICO AZUL 1',
                src: 'perico_azul.png',
                largo: objetosLargo,
                alto: objetosAlto,
                img: null,
                posX: 120,
                posY: 90,
                tipo: 'A',
                valor: 1
            },
            {
                nombre: 'PERICO BLANCO 1',
                src: 'perico_blanco.png',
                largo: objetosLargo,
                alto: objetosAlto,
                img: null,
                posX: 200,
                posY: 120,
                tipo: 'A',
                valor: 1
            },
            {
                nombre: 'PERICO AZUL 2',
                src: 'perico_azul.png',
                largo: objetosLargo,
                alto: objetosAlto,
                img: null,
                posX: 280,
                posY: 90,
                tipo: 'A',
                valor: 1
            },
            {
                nombre: 'PERICO BLANCO 2',
                src: 'perico_blanco.png',
                largo: objetosLargo,
                alto: objetosAlto,
                img: null,
                posX: 360,
                posY: 120,
                tipo: 'A',
                valor: 1
            },
            {
                nombre: 'PERICO AZUL 3',
                src: 'perico_azul.png',
                largo: objetosLargo,
                alto: objetosAlto,
                img: null,
                posX: 440,
                posY: 90,
                tipo: 'A',
                valor: 1
            },

        ];

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
                    contenedores.forEach(function (cont) {
                        var imgJ = new Image(cont.largo, cont.alto);
                        imgJ.src = cont.src;

                        imgJ.onload = function () {
                            cont.img = imgJ;
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
        contenedores.forEach(function (cont) {
            ctx.drawImage(cont.img, cont.posX, cont.posY, cont.largo, cont.alto);
        });
        objetos.forEach(function (obj) {
            ctx.drawImage(obj.img, obj.posX, obj.posY, obj.largo, obj.alto);
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
            realizado = true;
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
        }
    }

    function calificarObjeto(objeto) {
        var objPosX1 = objeto.posX;
        var objPosX2 = objPosX1 + objeto.largo;
        var objPosY1 = objeto.posY;
        var objPosY2 = objPosY1 + objeto.alto;

        for (var i = 0; i < contenedores.length; i++) {
            var jauPosX1 = contenedores[i].posX;
            var jauPosX2 = jauPosX1 + contenedores[i].largo;
            var jauPosY1 = contenedores[i].posY;
            var jauPosY2 = jauPosY1 + contenedores[i].alto;
            if (
                objPosX1 >= jauPosX1 &&
                objPosX2 <= jauPosX2 &&
                objPosY1 >= jauPosY1 &&
                objPosY2 <= jauPosY2
            ) {
                if (objeto.tipo == contenedores[i].tipo) {
                    objeto.valor = 1;
                } else {
                    objeto.valor = 0;
                }
                break;
            } else {
                objeto.valor = 0;
                mostrarContinuar();
            }
        }
    }
}