// Iniciar el Canvas cuando se haya cargado la página
window.addEventListener('load', function() {
    iniciarCarga()
    continuar=document.getElementById('btn-continuar');
    continuar.onclick=function(){procesarPuntaje()}
});
domOpcion1= document.getElementById('opcion1');
domOpcion2= document.getElementById('opcion2');
domOpcion3= document.getElementById('opcion3');
domOpcion4= document.getElementById('opcion4');
domOpcion5= document.getElementById('opcion5');
domOpcion6= document.getElementById('opcion6');
var marcada= 0;
var puntaje=0;
var contadas=0;
var listaOraciones=['+','-','4','7','9','=','23','?','<','3','862','45'];
domOpciones= document.getElementsByClassName('respuesta');

domOpcion1.onclick=function(){cambioColor(domOpcion1)}
domOpcion2.onclick=function(){cambioColor(domOpcion2)}
domOpcion3.onclick=function(){cambioColor(domOpcion3)}
domOpcion4.onclick=function(){cambioColor(domOpcion4)}
domOpcion5.onclick=function(){cambioColor(domOpcion5)}
domOpcion6.onclick=function(){cambioColor(domOpcion6)}

function procesarPuntaje(){
	
	console.log('CONTADAS')
	console.log(contadas)
	console.log('MARCADAS')
	console.log(marcada)
	if(contadas == marcada){
		console.log('ESTE ES EL PUNTAJE');
		puntaje=1;
		console.log(puntaje)
		parent.enviarPuntaje(puntaje);
	}
	else{
		puntaje= marcada/contadas;
		console.log('ESTE ES EL PUNTAJE');
		console.log(puntaje);
		parent.enviarPuntaje(puntaje);
	}

}

function mostrarContinuar(){
    document.getElementById('continuar').style.display = "inline-block";
}

function ocultarContinuar(){
    document.getElementById('continuar').style.display = "none";
}
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
        if (listaOraciones[posicion]=='-' || listaOraciones[posicion]=='+' || listaOraciones[posicion]=='='){
        	contadas=contadas+1;
        }
        delete listaOraciones[posicion];
        
    }
    
}

function obtenerAzar(lista){
    var opcion=-1;
    opcion=Math.floor(Math.random() *12);
    while(lista[opcion] == null){
        opcion=Math.floor(Math.random() *12);
    }
    return opcion;
}

function cambioColor(domOpcion){
	dom=domOpcion.innerHTML;
	if(dom== '-' || dom== '+' || dom=='='){
		marcada=marcada+1;
		console.log('Son iguales')
	}
	domOpcion.style.background= '#EEE';
	mostrarContinuar();

}
