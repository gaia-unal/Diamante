// Iniciar el Canvas cuando se haya cargado la página
window.addEventListener('load', function() {
    iniciarCarga()
    continuar=document.getElementById('btn-continuar');
    continuar.onclick=function(){procesarPuntaje()}
});

domOpciones= document.getElementsByClassName('respuesta');

var elegidos=new Array(3);
var respondido=new Array(3);
var puntaje=0;
var contadas=0;
var movidas=0;
var s=0;

var listaOraciones=['Desayuno','Almuerzo','Cena'];

function iniciarCarga(){
	//console.log('opciones');
	//console.log(domOpciones);
	elegirFrases();
	
}

function elegirFrases(){
    var posicion;
    var imagen;
    for (var i = 0; i < domOpciones.length; i++) {
        posicion= obtenerAzar(listaOraciones);
        domOpciones[i].innerHTML=listaOraciones[posicion];
        delete listaOraciones[posicion];
        
    }
    
}

function obtenerAzar(lista){
    var opcion=-1;
    opcion=Math.floor(Math.random() *3);
    while(lista[opcion] == null){
        opcion=Math.floor(Math.random() *3);
    }
    return opcion;
}


function drag_start(event) {
    //El target devuelve  el elemento que desencadeno la acción del evento
    event.dataTransfer.dropEffect = "move";
    event.dataTransfer.setData("text", event.target.getAttribute('id') );
    }

function traer(id){
    return document.getElementById(id); 
    }


function drag_drop(event) {
    var elem_id = event.dataTransfer.getData("text");
    respondido[movidas]=elem_id;
    movidas=movidas+1;
    event.target.appendChild( traer(elem_id) );
    droppedIn = true;
    traer(elem_id).style.width="100%";
    traer(elem_id).style.height="100%";
    traer(elem_id).style.border="0";
    if (movidas==3) {
    	mostrarContinuar();
    }
 
    }
 
function procesarPuntaje(puntaje){
	var val;
	console.log('Esto es lo respondido: '+respondido);
	for (var i = 0; i < respondido.length; i++) {
		if(respondido[i]==i){
			val=true
		}
		else{
			val=false
		}
	}
	//console.log('Este es el puntaje: ');
	if (val==true) {
		puntaje=1;
	}
	else{
		puntaje=0;
	}
	//console.log(puntaje);
	parent.enviarPuntaje(puntaje);
	}

function mostrarContinuar(){
    document.getElementById('continuar').style.display = "inline-block";
    procesarPuntaje()
}

