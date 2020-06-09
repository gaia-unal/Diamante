window.addEventListener('load', function(){
	cronometro();
	iniciarCanvas();
});

var boton = document.getElementById('btn-continuar');
boton.addEventListener('click', procesarPuntaje, false);

var puntajes = [null, null, null];

function procesarPuntaje(){
    var puntaje = 0;
    for(var i=0; i < puntajes.length; i++){
        if(isNaN(puntajes[i]) || puntajes[i] == null){
            var texto = 'Por favor completa la actividad';
			if(typeof parent.mostrarAlerta === "function") {
				parent.mostrarAlerta(texto);
			}else{
				alert(texto);
			}
            ocultarContinuar();
            return false;
        }else{
            puntaje += puntajes[i];
        }
    }

    parent.enviarPuntaje(puntaje);
    //alert('Puntaje: ' + puntaje);
}

function mostrarContinuar(){
	document.getElementById('continuar').style.display = "block";
}

function ocultarContinuar(){
	document.getElementById('continuar').style.display = "none";
}

function sonido(){
	sound=document.createElement("embed");
	sound.src=" ";
	sound.style.visibility="hidden";
	sound.style.position="absolute";
	document.body.appendChild(sound);
}

//variables de tiempo
var tiempoCuenta = 5;
var futuro1 = (Math.floor(new Date()/1000)) + tiempoCuenta;

//funcion que controla el tiempo y cambia las imagenes para que se digite la respuesta
function cronometro(){
	var actual=Math.floor(new Date()/1000); 
	futuro=futuro1-actual;
	if (futuro>0) { 
		horas_dec=((futuro/60)/60);
		horas=Math.floor(horas_dec);
		minutos=horas_dec-horas;
		minutos_dec=minutos*60;
		minutos=Math.floor(minutos_dec);
		segundos=minutos_dec-minutos;
		segundos=Math.floor(segundos*60);
		document.getElementById("tiempo").value=segundos;
	}
	else{ 
		// Eliminar cronometro
		document.getElementById("inicial").innerHTML = "";

		// Mostrar contenido de la actividad
		document.getElementById("contenido").style.display = "block";
	} 
	setTimeout("cronometro()",1); 
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
        var posContenedoresY = 110;
        var posYObjetos = 250;
        var posXObjetos = [10, 110, 210, 310, 410, 510]; // Debe coincidir con el tamaño del arreglo 'objetos'

        contenedores = [
            {
                nombre: 'TAPA 1',
                src: 'tapa.png',
                largo: 90,
                alto: 79,
                img: null,
                posX: 125,
                posY: posContenedoresY,
                tipo: 'A'
            },
            {
                nombre: 'TAPA 2',
                src: 'tapa.png',
                largo: 90,
                alto: 79,
                img: null,
                posX: 253,
                posY: posContenedoresY,
                tipo: 'B'
            },
            {
                nombre: 'TAPA 3',
                src: 'tapa.png',
                largo: 90,
                alto: 79,
                img: null,
                posX: 385,
                posY: posContenedoresY,
                tipo: 'C'
            },
        ];

        ordenAleatorio(posXObjetos);

        var objLargo = 80;
        var objAlto = 70;

        objetos = [
        	{
                nombre: 'OPCION 1',
                src: 'num1.png',
                largo: objLargo,
                alto: objAlto,
                img: null,
                posX: posXObjetos[0],
                posY: posYObjetos,
                tipo: 'A'
            },
            {
                nombre: 'OPCION 2',
                src: 'num2.png',
                largo: objLargo,
                alto: objAlto,
                img: null,
                posX: posXObjetos[1],
                posY: posYObjetos,
                tipo: 'B'
            },
            {
                nombre: 'OPCION 3',
                src: 'num3.png',
                largo: objLargo,
                alto: objAlto,
                img: null,
                posX: posXObjetos[2],
                posY: posYObjetos,
                tipo: 'C'
            },
            {
                nombre: 'OPCION 4',
                src: 'num4.png',
                largo: objLargo,
                alto: objAlto,
                img: null,
                posX: posXObjetos[3],
                posY: posYObjetos,
                tipo: 'N/A'
            },
            {
                nombre: 'OPCION 5',
                src: 'num5.png',
                largo: objLargo,
                alto: objAlto,
                img: null,
                posX: posXObjetos[4],
                posY: posYObjetos,
                tipo: 'N/A'
            },
            {
                nombre: 'OPCION 6',
                src: 'num6.png',
                largo: objLargo,
                alto: objAlto,
                img: null,
                posX: posXObjetos[5],
                posY: posYObjetos,
                tipo: 'N/A'
            },
        ];

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
            	console.log(puntajes);
            	console.log('cont: ' + contenedores[i].tipo + ' ' + ', obj: ' + objeto.tipo);
                if (objeto.tipo == contenedores[i].tipo) {
                    puntajes[i] = 1/(contenedores.length);
                } else {
                    puntajes[i] = 0;
                }
                break;
            }
        }
        console.log(puntajes);
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

    // Ordena aleatoriamente el arreglo indicado
    function ordenAleatorio(arreglo){
        for (var i = arreglo.length-1; i > 0; i--){
            var j = Math.floor(Math.random() * (i + 1));
            var temp = arreglo[i];
            arreglo[i] = arreglo[j];
            arreglo[j] = temp;
        }
    }
}