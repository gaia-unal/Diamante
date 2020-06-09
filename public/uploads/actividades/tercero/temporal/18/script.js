// Iniciar el Canvas cuando se haya cargado la página
window.addEventListener('load', function() {
    iniciarCanvas();
    document.getElementById('continuar').onclick = function(){enviarPuntajes()};
});

var puntajes = [];

function iniciarCanvas() {
    var canvas = document.getElementById('lienzo');
    var ctx = canvas.getContext('2d');

    var contenedores;
    var objetos;
    var zonas;

    var indiceObjetoSeleccionado;
    var arrastrando;
    var mouseX;
    var mouseY;
    var mouseArrastrandoX;
    var mouseArrastrandoY;

    iniciar();

    // Carga los recursos iniciales dentro del canvas
    function iniciar() {
        var posContenedoresX = 60;
        var posObjetosY = 255;

        contenedores = [
            {
                nombre: 'Canasta A',
                src: 'conjuntoA.png',
                largo: 460,
                alto: 100,
                img: null,
                posX: posContenedoresX,
                posY: 35,
            },
            {
                nombre: 'Canasta B',
                src: 'conjuntoB.png',
                largo: 460,
                alto: 100,
                img: null,
                posX: posContenedoresX,
                posY: 140,
            },
        ];

        var contPosX = contenedores[1].posX;
        var contPosY = contenedores[1].posY;
        var contLargo = contenedores[1].largo/5;
        var contAlto = contenedores[1].alto/1;

        zonas = [
            {
               nombre: 'CUADRANTE 1',
                posX1: contPosX,
                posX2: contPosX + (1 * contLargo),
                posY1: contPosY,
                posY2: contPosY + contAlto,
                tipo: 'B'
            },
            {
                nombre: 'CUADRANTE 2',
                posX1: contPosX + (1 * contLargo),
                posX2: contPosX + (2 * contLargo),
                posY1: contPosY,
                posY2: contPosY + contAlto,
                tipo: 'E'
            },
            {
                nombre: 'CUADRANTE 3',
                posX1: contPosX + (2 * contLargo),
                posX2: contPosX + (3 * contLargo),
                posY1: contPosY,
                posY2: contPosY + (1 * contAlto),
                tipo: 'A'
            },
            {
                nombre: 'CUADRANTE 4',
                posX1: contPosX + (3 * contLargo),
                posX2: contPosX + (4 * contLargo),
                posY1: contPosY,
                posY2: contPosY + (1 * contAlto),
                tipo: 'D'
            },
            {
                nombre: 'CUADRANTE 5',
                posX1: contPosX + (4 * contLargo),
                posX2: contPosX + (5 * contLargo),
                posY1: contPosY,
                posY2: contPosY + (1 * contAlto),
                tipo: 'C'
            },
            
        ];

        objetos = [
            {
                nombre: 'CACTUS',
                src: 'cactus.png',
                largo: 35,
                alto: 90,
                img: null,
                posX: 90,
                posY: posObjetosY,
                tipo: 'A'
            },
            {
                nombre: 'CARRO',
                src: 'carro.png',
                largo: 65,
                alto: 50,
                img: null,
                posX: 155,
                posY: 285,
                tipo: 'B'
            },
            {   
                nombre: 'PEZ1',
                src: 'pez1.png',
                largo: 70,
                alto: 60,
                img: null,
                posX: 250,
                posY: 285,
                tipo: 'C'
            },
            {
                nombre: 'ESTRELLAMAR',
                src: 'estrellamar.png',
                largo: 70,
                alto: 60,
                img: null,
                posX: 345,
                posY: 285,
                tipo: 'D'
            },
            {
                nombre: 'FISH',
                src: 'fish.png',
                largo: 70,
                alto: 60,
                img: null,
                posX: 435,
                posY: 285,
                tipo: 'E'
            },

        ];

        objetos.forEach(function(obj){
            puntajes.push(null);
        });

        cargarImagenes(dibujarCanvas);

        canvas.addEventListener('mousedown', mousePresionado, false);
    }

    // Carga inicial de las imagenes, cuando se han cargado todas, las dibuja en el canvas
    function cargarImagenes(callback) {
        var objetosCargados = 0;
        var contenedoresCargadas = 0;
        objetos.forEach(function(actual) {
            var img = new Image(actual.largo, actual.alto);
            img.src = actual.src;

            img.onload = function() {
                actual.img = img;
                objetosCargados++;
                if (objetosCargados >= objetos.length) {
                    contenedores.forEach(function(cont) {
                        var imgJ = new Image(cont.largo, cont.alto);
                        imgJ.src = cont.src;

                        imgJ.onload = function() {
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
        contenedores.forEach(function(cont) {
            ctx.drawImage(cont.img, cont.posX, cont.posY, cont.largo, cont.alto);
        });
        objetos.forEach(function(obj) {
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
            mostrarContinuar();
        }
    }

    function calificarObjeto(objeto) {
        var objPosX1 = objeto.posX;
        var objPosX2 = objPosX1 + objeto.largo;
        var objPosY1 = objeto.posY;
        var objPosY2 = objPosY1 + objeto.alto;        
        
        for(var i=0; i < zonas.length; i++){
            if (
                objPosX1 >= zonas[i].posX1 &&
                objPosX2 <= zonas[i].posX2 &&
                objPosY1 >= zonas[i].posY1 &&
                objPosY2 <= zonas[i].posY2
            ){
                if (objeto.tipo == zonas[i].tipo) {
                    puntajes[indiceObjetoSeleccionado] = 1/(objetos.length);
                } else {
                    puntajes[indiceObjetoSeleccionado] = 0;
                }
                break;
            }else{
                puntajes[indiceObjetoSeleccionado] = null;
            }
        }
    }

    function mostrarContinuar(){
        var puntajesCorrectos = true;
        for(var i=0; i < puntajes.length; i++){
            if(puntajes[i] == null){
                puntajesCorrectos = false;
                break;
            }
        }

        var btnContinuar = document.getElementById('continuar');
        if(puntajesCorrectos){
            btnContinuar.style.display = "inline-block";
        }else{
            btnContinuar.style.display = "none";
        }
    }
}

function enviarPuntajes(){
    var puntaje = 0;
    for(var i=0; i < puntajes.length; i++){
        
        if(puntajes[i] == null){
            alert("Por favor completa la actividad");
            document.getElementById('continuar').style.display = "none";
            return;
        }
        puntaje += puntajes[i];
    }
    
    alert("Puntaje final: "+puntaje);
}