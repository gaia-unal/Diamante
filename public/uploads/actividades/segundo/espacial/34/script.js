// Iniciar el Canvas cuando se haya cargado la página
window.addEventListener('load', function() {
    iniciarCanvas();
    document.getElementById('btn-continuar').onclick = function(){procesarPuntaje()};
});

var puntajes = [];

function procesarPuntaje(){
    var puntaje = 0;
    for(var i=0; i < puntajes.length; i++){
        if(isNaN(puntajes[i]) || puntajes[i] == null){
            alert("Por favor completa la actividad");
            ocultarContinuar();
            return false;
        }else{
            puntaje += puntajes[i];
        }
    }

   parent.enviarPuntaje(puntaje);
   //alert(puntaje);
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

    var fondo;
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

        fondo = {
            nombre: 'Fondo',
            src: 'fondo.png',
            largo: canvas.width,
            alto: canvas.height,
            img: null,
            posX: 0,
            posY: 0
        };

        contenedores = [
            {
                nombre: 'Canasta frutas',
                src: 'canasta_frutas.png',
                largo: 230,
                alto: 127,
                img: null,
                posX: 50,
                posY: 120,
                tipo: 'A'
            },
            {
                nombre: 'Canasta verduras',
                src: 'canasta_verduras.png',
                largo: 230,
                alto: 127,
                img: null,
                posX: 320,
                posY: 120,
                tipo: 'B'
            },
        ];

        objetos = [
        	{
                nombre: 'FRUTA 1',
                src: 'fruta1.png',
                largo: 60,
                alto: 85,
                img: null,
                posX: 30,
                posY: 240,
                tipo: 'A'
            },
            {
                nombre: 'VERDURA 1',
                src: 'verdura1.png',
                largo: 57,
                alto: 82,
                img: null,
                posX: 120,
                posY: 245,
                tipo: 'B'
            },
            {
                nombre: 'FRUTA 2',
                src: 'fruta2.png',
                largo: 73,
                alto: 77,
                img: null,
                posX: 210,
                posY: 250,
                tipo: 'A'
            },
            {
                nombre: 'VERDURA 2',
                src: 'verdura2.png',
                largo: 61,
                alto: 84,
                img: null,
                posX: 315,
                posY: 250,
                tipo: 'B'
            },
            {
                nombre: 'FRUTA 3',
                src: 'fruta3.png',
                largo: 68,
                alto: 68,
                img: null,
                posX: 500,
                posY: 260,
                tipo: 'A'
            },
            {
                nombre: 'VERDURA 3',
                src: 'verdura3.png',
                largo: 93,
                alto: 93,
                img: null,
                posX: 400,
                posY: 240,
                tipo: 'B'
            },
        ];

        //puntajes = [null, null, null, null, null, null];

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
                                var imgF = new Image(fondo.largo, fondo.alto);
                                imgF.src = fondo.src;
                                
                                imgF.onload = function(){
                                    fondo.img = imgF;
                                    callback();
                                }
                            }
                        }
                    });
                }
            }
        });
    }

    // Prepara el canvas para dibujar las imagenes
    function dibujarCanvas() {
        /*ctx.fillStyle = '#FFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);*/

        ctx.drawImage(fondo.img, fondo.posX, fondo.posY, fondo.largo, fondo.alto);

        dibujarImagenes();
    }

    // Dibuja en el canvas todas las imagenes
    function dibujarImagenes() {
        contenedores.forEach(function(cont) {
            ctx.drawImage(cont.img, cont.posX, cont.posY, cont.largo, cont.alto);
        });
        objetos.forEach(function(objeto) {
            ctx.drawImage(objeto.img, objeto.posX, objeto.posY, objeto.largo, objeto.alto);
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
        	var jauPosX1 = contenedores[i].posX;
            var jauPosX2 = jauPosX1 + contenedores[i].largo;
            var jauPosY1 = contenedores[i].posY;
            var jauPosY2 = jauPosY1 + contenedores[i].alto;
            if (
                objPosX1 >= jauPosX1 &&
                objPosX2 <= jauPosX2 &&
                objPosY1 >= jauPosY1 &&
                objPosY2 <= jauPosY2
            ){
                if (objeto.tipo == contenedores[i].tipo) {
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

    function verificarPuntajes(){
    	var puntajesCorrectos = true;
    	for(var i=0; i < puntajes.length; i++){
    		if(puntajes[i] == null){
    			puntajesCorrectos = false;
    			break;
    		}
    	}

    	if(puntajesCorrectos){
            mostrarContinuar();
        }else{
            ocultarContinuar();
        }
    }
}