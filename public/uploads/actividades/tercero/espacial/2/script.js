﻿// Iniciar el Canvas cuando se haya cargado la página
window.addEventListener('load', function() {
	iniciarCanvas();
	document.getElementById('btn-continuar').onclick = function(){ procesarPuntaje()};
});

var imagenes = [
	{src: "num1.png", texto: "CIENTO CUARENTA MIL DOSCIENTOS"},
	{src: "num2.png", texto: "TRES MIL DOSCIENTOS UNO"},
	{src: "num3.png", texto: "SETENTA MIL NOVECIENTOS"},
	{src: "num4.png", texto: "QUINIENTOS MIL TRESCIENTOS CUATRO"},
	{src: "num5.png", texto: "SEISCIENTOS MIL NOVENTA Y NUEVE"},
	{src: "num6.png", texto: "OCHOCIENTOS MIL TRESCIENTOS DOS"},
	{src: "num7.png", texto: "SIETE MIL CUATROCIENTOS TREINTA Y DOS"},
	{src: "num8.png", texto: "TRESCIENTOS MIL QUINIENTOS DOS"},
];

var pos_num = 0;

window.onload = function(){
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
	// TODO reproducir audio asociado al objetivo a dibujar
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

function procesarPuntaje(){
	if(!dibujoTerminado){
		ocultarContinuar();
		var texto = 'Por favor completa la actividad';
		if(typeof parent.mostrarAlerta === "function") {
			parent.mostrarAlerta(texto);
		}else{
			alert(texto);
		}
	}else{
		var img = canvas.toDataURL('image/jpeg', 0.5);
		parent.enviarActividadManual(img, 'Dibujar el número ' + imagenes[pos_num].texto);
	}
}

function sonido(){
	sound=document.createElement("embed");
	sound.src=" ";/*Falta el audio para vincularlo*/
	sound.style.visibility="hidden";
	sound.style.position="absolute";
	document.body.appendChild(sound);
}