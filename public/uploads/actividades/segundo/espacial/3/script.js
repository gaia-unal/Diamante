// Iniciar el Canvas cuando se haya cargado la página
window.addEventListener('load', function () {
	iniciarCanvas();
	document.getElementById('btn-continuar').onclick = function () { procesarPuntaje() };
});

var imagenes = [
	{ src: "num_1.png", texto: "OCHOCIENTOS TREINTA Y SEIS" },
	{ src: "num_2.png", texto: "TRESCIENTOS OCHENTA Y TRES" },
	{ src: "num_3.png", texto: "SEISCIENTOS CINCUENTA Y UNO" },
	{ src: "num_4.png", texto: "DOSCIENTOS CUARENTA Y CINCO" },
];

var sonidos = [
	{ src: "sE3-1.mp3", texto: "OCHOCIENTOS TREINTA Y SEIS" },
	{ src: "sE3-2.mp3", texto: "TRESCIENTOS OCHENTA Y TRES" },
	{ src: "sE3-3.mp3", texto: "SEISCIENTOS CINCUENTA Y UNO" },
	{ src: "sE3-4.mp3", texto: "DOSCIENTOS CUARENTA Y CINCO" },
];

var pos_num = 0;

window.onload = function () {
	pos_num = Math.floor(Math.random() * imagenes.length);
	var img = document.getElementById('num_dictado');
	img.src = imagenes[pos_num].src;
}

var canvas, ctx;
var mouseX;
var mouseY;
var mouseActivo;
var dibujoTerminado;

function audioObjetivo() {
	return sonidos[pos_num].src;
}

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
	ctx.lineWidth = 7;
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
	if (mouseActivo) {
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

function mostrarContinuar() {
	document.getElementById('continuar').style.display = "block";
}

function ocultarContinuar() {
	document.getElementById('continuar').style.display = "none";
}

function procesarPuntaje() {
	if (!dibujoTerminado) {
		ocultarContinuar();
		parent.mostrarAlerta('Por favor completa la actividad');
	} else {
		var img = canvas.toDataURL('image/jpeg', 0.5);
		parent.enviarActividadManual(img, 'Dibujar el número ' + imagenes[pos_num].texto);
	}
}

function sonido() {
	sound = document.createElement("embed");
	sound.src = audioObjetivo();
	sound.style.visibility = "hidden";
	sound.style.position = "absolute";
	document.body.appendChild(sound);
}