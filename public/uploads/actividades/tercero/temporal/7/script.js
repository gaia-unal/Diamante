// Iniciar el Canvas cuando se haya cargado la página
window.addEventListener('load', function() {
    iniciarCanvas();
    document.getElementById('btn-continuar').onclick = function(){procesarPuntaje()};
});

var puntajes = [];

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
        
        var posXObjetos = [10, 150, 300, 450, 50, 200, 350]; // Debe coincidir con la cantidad de objetos

        contenedores = [
            {
                nombre: 'MARCO 1',
                src: 'marco.png',
                largo: 150,
                alto: 70,
                img: null,
                posX: 0,
                posY: 20,
                tipo: 'A'
            },
            {
                nombre: 'MARCO 2',
                src: 'marco.png',
                largo: 150,
                alto: 70,
                img: null,
                posX: 145,
                posY: 20,
                tipo: 'B'
            },
            {
                nombre: 'MARCO 3',
                src: 'marco.png',
                largo: 150,
                alto: 70,
                img: null,
                posX: 290,
                posY: 20,
                tipo: 'C'
            },
            {
                nombre: 'MARCO 4',
                src: 'marco.png',
                largo: 150,
                alto: 70,
                img: null,
                posX: 435,
                posY: 20,
                tipo: 'D'
            },
            {
                nombre: 'MARCO 5',
                src: 'marco.png',
                largo: 150,
                alto: 70,
                img: null,
                posX: 55,
                posY: 120,
                tipo: 'E'
            },
            {
                nombre: 'MARCO 6',
                src: 'marco.png',
                largo: 150,
                alto: 70,
                img: null,
                posX: 200,
                posY: 120,
                tipo: 'F'
            },
            {
                nombre: 'MARCO 7',
                src: 'marco.png',
                largo: 150,
                alto: 70,
                img: null,
                posX: 345,
                posY: 120,
                tipo: 'G'
            },
            
        ];

        ordenAleatorio(posXObjetos);


        objetos = [
            {
                nombre: 'LUNES',
                src: 'a.jpg',
                largo: 100,
                alto: 45,
                img: null,
                posX: 465,
                posY: 200,
                tipo: 'A'
            },
            {
                nombre: 'MARTES',
                src: 'b.jpg',
                largo: 100,
                alto: 50,
                img: null,
                posX: 20,
                posY: 200,
                tipo: 'B'
            },
            {
                nombre: 'MIERCOLES',
                src: 'c.jpg',
                largo: 120,
                alto: 50,
                img: null,
                posX: 215,
                posY: 270,
                tipo: 'C'
            },
            {
                nombre: 'JUEVES',
                src: 'd.jpg',
                largo: 120,
                alto: 50,
                img: null,
                posX: 150,
                posY: 200,
                tipo: 'D'
            },
            {
                nombre: 'VIERNES',
                src: 'e.jpg',
                largo: 100,
                alto: 50,
                img: null,
                posX: 85,
                posY: 270,
                tipo: 'E'
            },
            {
                nombre: 'SABADO',
                src: 'f.jpg',
                largo: 120,
                alto: 50,
                img: null,
                posX: 365,
                posY: 270,
                tipo: 'F'
            },
            {
                nombre: 'DOMINGO',
                src: 'g.jpg',
                largo: 140,
                alto: 50,
                img: null,
                posX: 300,
                posY: 200,
                tipo: 'G'
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
    		btnContinuar.style.display = "block";
    	}else{
    		btnContinuar.style.display = "none";
    	}
    }

    // Ordena aleatoriamente el arreglo pasado
    function ordenAleatorio(arreglo){
        for (var i = arreglo.length-1; i > 0; i--){
            var j = Math.floor(Math.random() * (i + 1));
            var temp = arreglo[i];
            arreglo[i] = arreglo[j];
            arreglo[j] = temp;
        }
    }
}

function procesarPuntaje(){
    var puntaje = 0;
    for(var i=0; i < puntajes.length; i++){
    	
    	if(puntajes[i] == null){
    		alert("Por favor completa la actividad");
    		document.getElementById('continuar').style.display = "none";
    		return;
    	}
    	puntaje += puntajes[i];
    }
    
   parent.enviarPuntaje(puntaje);
   //alert(puntaje);
}