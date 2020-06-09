// Iniciar el Canvas cuando se haya cargado la página
window.addEventListener('load', function() {
    iniciarCanvas();
    document.getElementById('btn-continuar').onclick = function(){procesarPuntaje()};
});

var puntajes = [];
var resto = 4;

function procesarPuntaje(){
    var puntaje = 0;
    for(var i=0; i < puntajes.length; i++){
        if(isNaN(puntajes[i]) || puntajes[i] == null){
            puntaje += 1
       }
    }
    if(puntaje > resto){
        puntaje = 0
    }
    parent.enviarPuntaje(puntaje/resto);
}

function mostrarContinuar(){
    document.getElementById('continuar').style.display = "block";
}

function ocultarContinuar(){
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
                nombre: 'Canasta A',
                src: 'canasta.png',
                largo: 490,
                alto: 200,
                img: null,
                posX: 5,
                posY: 50,
                tipo: 'A'
            },
        ];

        objetos = [
        	{
                src: 'fresa.png',
                largo: 50,
                alto: 71,
                img: null,
                posX: 55,
                posY: 100,
                tipo: 'A'
            },
            {
                src: 'fresa.png',
                largo: 50,
                alto: 71,
                img: null,
                posX: 115,
                posY: 120,
                tipo: 'A'
            },
            {
                src: 'fresa.png',
                largo: 50,
                alto: 71,
                img: null,
                posX: 180,
                posY: 140,
                tipo: 'A'
            },
            {
                src: 'fresa.png',
                largo: 50,
                alto: 71,
                img: null,
                posX: 290,
                posY: 110,
                tipo: 'A'
            },
            {
                src: 'fresa.png',
                largo: 50,
                alto: 71,
                img: null,
                posX: 230,
                posY: 100,
                tipo: 'A'
            },
            {
                src: 'fresa.png',
                largo: 50,
                alto: 71,
                img: null,
                posX: 350,
                posY: 140,
                tipo: 'A'
            },
            {
                src: 'fresa.png',
                largo: 50,
                alto: 71,
                img: null,
                posX: 400,
                posY: 120,
                tipo: 'A'
            },
        ];

        /*puntajes = [null, null, null, null, null, null];*/

        objetos.forEach(function(obj){
        	puntajes.push(true);
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
                    contenedores.forEach(function(jaula) {
                        var imgJ = new Image(jaula.largo, jaula.alto);
                        imgJ.src = jaula.src;

                        imgJ.onload = function() {
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
        contenedores.forEach(function(jaula) {
            ctx.drawImage(jaula.img, jaula.posX, jaula.posY, jaula.largo, jaula.alto);
        });
        objetos.forEach(function(perico) {
            ctx.drawImage(perico.img, perico.posX, perico.posY, perico.largo, perico.alto);
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
        
        for(var i=0; i < contenedores.length; i++){
        	var canPosX1 = contenedores[i].posX;
            var canPosX2 = canPosX1 + contenedores[i].largo;
            var canPosY1 = contenedores[i].posY;
            var canPosY2 = canPosY1 + contenedores[i].alto;
            if (
                objPosX1 >= canPosX1 &&
                objPosX2 <= canPosX2 &&
                objPosY1 >= canPosY1 &&
                objPosY2 <= canPosY2
            ){
                if (objeto.tipo == contenedores[i].tipo) {
                    puntajes[indiceObjetoSeleccionado] = true;
                }
            }else{
            	puntajes[indiceObjetoSeleccionado] = null;
            }
        }
    }

    function verificarPuntajes(){
    	var puntajesCorrectos = true;
    	for(var i=0; i < puntajes.length; i++){
    		if(puntajes[i] == null){
    			puntajesCorrectos = false;
    			break;
    		}
    	}

        if(puntajesCorrectos){
            ocultarContinuar();
        }else{
            mostrarContinuar();
        }
    }
}