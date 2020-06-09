// Iniciar el Canvas cuando se haya cargado la página
window.addEventListener('load', function() {
    iniciarCanvas();
    document.getElementById('btn-continuar').onclick = function(){procesarPuntaje()};
});

var contenedor = [];

function procesarPuntaje(){
    // Quita 2 pelota del conjunto A, añade 3 al conjunto B y añade 1 pelota más al conjunta A
    var puntaje = 0;
    if(contenedor[0].existe.length == 2 && contenedor[1].existe.length == 3){
        puntaje = 1;
    }
    parent.enviarPuntaje(puntaje);
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
        var posContenedoresY = 0;
        var posObjetosY = 250;

        fondo = {
            nombre: 'Fondo',
            src: 'fondo_2.png',
            largo: canvas.width,
            alto: canvas.height,
            img: null,
            posX: 0,
            posY: 0
        };

        contenedores = [
            {
                nombre: 'Canasta A',
                src: 'jaula_a.png',
                largo: 290,
                alto: 170,
                img: null,
                posX: 5,
                posY: 0,
                tipo: 'A',
                puntaje: ["True", "True", "True"],
                existe: [0, 1, 2]
            },
            {
                nombre: 'Canasta B',
                src: 'jaula_b.png',
                largo: 290,
                alto: 170,
                img: null,
                posX: 300,
                posY: 0,
                tipo: 'A',
                existe: [],
                puntaje: []
            },
        ];

        var largo = 50;
        var alto = 44;

        objetos = [
        	{
                src: 'pelota_2.png',
                largo: largo,
                alto: alto,
                img: null,
                posX: 50,
                posY: 100,
                tipo: 'A'
            },
            {
                src: 'pelota_2.png',
                largo: largo,
                alto: alto,
                img: null,
                posX: 110,
                posY: 70,
                tipo: 'A'
            },
            {
                src: 'pelota_2.png',
                largo: largo,
                alto: alto,
                img: null,
                posX: 170,
                posY: 100,
                tipo: 'A'
            },
            {
                src: 'pelota_2.png',
                largo: largo,
                alto: alto,
                img: null,
                posX: 20,
                posY: posObjetosY - 30,
                tipo: 'A'
            },
            {
                src: 'pelota_2.png',
                largo: largo,
                alto: alto,
                img: null,
                posX: 110,
                posY: posObjetosY + 50,
                tipo: 'A'
            },
            {
                src: 'pelota_2.png',
                largo: largo,
                alto: alto,
                img: null,
                posX: 230,
                posY: posObjetosY + 10,
                tipo: 'A'
            },
            {
                src: 'pelota_2.png',
                largo: largo,
                alto: alto,
                img: null,
                posX: 325,
                posY: posObjetosY - 40,
                tipo: 'A'
            },
            {
                src: 'pelota_2.png',
                largo: largo,
                alto: alto,
                img: null,
                posX: 475,
                posY: posObjetosY + 40,
                tipo: 'A'
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
        ctx.drawImage(fondo.img, fondo.posX, fondo.posY, fondo.largo, fondo.alto);
        // ctx.fillStyle = '#FFF';
        // ctx.fillRect(0, 0, canvas.width, canvas.height);

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
                    if (!contenedores[i].existe.includes(indiceObjetoSeleccionado)) {
                        contenedores[i].existe.push(indiceObjetoSeleccionado)
                        contenedores[i].puntaje.push('True')
                    }
                }
            }else{
                var index = contenedores[i].existe.indexOf(indiceObjetoSeleccionado);
                if (index > -1){
                    contenedores[i].existe.splice(index, 1);
                    contenedores[i].puntaje.pop()
                }
            }
        }
    }

    function verificarPuntajes(){
        if (true) {
            contenedor.push(contenedores[0]);
            contenedor.push(contenedores[1]);
            mostrarContinuar();
        }
    }
}