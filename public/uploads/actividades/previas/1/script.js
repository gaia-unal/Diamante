// Iniciar el Canvas cuando se haya cargado la página
window.addEventListener('load', function() {
	var imagenes = ['imagen1.png', 'imagen2.png'];
	var fuente = imagenes[Math.floor(Math.random() * imagenes.length)];
	document.getElementById('imagen').src = fuente;
	iniciarCanvas();
	document.getElementById('btn-continuar').onclick = function(){ continuarActividad()};
});

var canvas, ctx;
var mouseX;
var mouseY;
var mouseActivo;
var dibujoTerminado;

// Inicializa el canvas y los eventos relacionados
function iniciarCanvas() {
	canvas = document.getElementById('lienzo');
	ctx = canvas.getContext('2d');

	canvas.addEventListener('mousedown', mousePresionado, false);
	canvas.addEventListener('mousemove', mouseMoviendose, false);
	canvas.addEventListener('mouseup', mouseNoPresionado, false);

	dibujarCanvas();
}

// Prepara el canvas para dibujar las imagenes
function dibujarCanvas() {
	ctx.fillStyle = '#FFF';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ocultarContinuar();
	dibujoTerminado = false;
}

// Evento cuando se presiona el mouse
function mousePresionado(evento) {    	
	var posMouse = posicionMouse(evento);

	mouseActivo = true;
	ctx.beginPath();
	ctx.lineWidth = 5;
	ctx.moveTo(posMouse[0], posMouse[1]);

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
    if(mouseActivo){
    	var posMouse = posicionMouse(evento);
    	ctx.strokeStyle = '#000';
    	ctx.lineCap = 'round';
    	ctx.lineTo(posMouse[0], posMouse[1]);
    	ctx.stroke();
    	mostrarContinuar();
    }
}

// Evento cuando se deja de presionar el mouse
function mouseNoPresionado(evento) {
    ctx.closePath();
    mouseActivo = false;
    dibujoTerminado = true;
}

// Obtener posición precisa del mouse
function posicionMouse(evento) {
    var bRect = canvas.getBoundingClientRect();
    mouseX = (evento.clientX - bRect.left) * (canvas.width / bRect.width);
    mouseY = (evento.clientY - bRect.top) * (canvas.height / bRect.height);

   	return [mouseX, mouseY];
}

function mostrarContinuar(){
	document.getElementById('continuar').style.display = "block";
}

function ocultarContinuar(){
	document.getElementById('continuar').style.display = "none";
}

function continuarActividad(){
	parent.completarActividadPrevia('¡Dibujas muy bien!');
}

function sonido(){
	sound=document.createElement("embed");
	sound.src=" ";/*Falta el audio para vincularlo*/
	sound.style.visibility="hidden";
	sound.style.position="absolute";
	document.body.appendChild(sound);
}