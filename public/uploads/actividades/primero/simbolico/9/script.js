// Iniciar el Canvas cuando se haya cargado la página
window.addEventListener('load', function() {
    iniciarCarga()
    continuar=document.getElementById('btn-continuar');
    continuar.onclick=function(){procesarPuntaje()}
});
domOpcion1= document.getElementById('num1');
domOpcion2= document.getElementById('signo1');
domOpcion3= document.getElementById('num2');
domOpcion4= document.getElementById('num3');
domOpcion5= document.getElementById('num4');
domOpcion6= document.getElementById('signo2');
domOpcion7= document.getElementById('num5');
domOpcion8= document.getElementById('num6');

var marcada= null;
var puntaje=0;
var movidas=0;
var contadas=0;
var signos=['+', '-']
var listaSignos=[];
var listaSignos2=[];
var s=0;
var respuestaSignos=[];

function iniciarCarga(){
	final=crearOperacion();
	finalSignos=elegirSignos();
	listaSignos2=finalSignos;
	console.log('Aquí esta signos2');
	console.log(listaSignos2);

	if(final[0] > final[1]){
		domOpcion1.innerHTML=final[0];
		domOpcion3.innerHTML=final[1];
		domOpcion4.innerHTML=hacerOperacion(final[0],finalSignos[0], final[1]);
	}
	else{
		domOpcion1.innerHTML=final[1];
		domOpcion3.innerHTML=final[0];
		domOpcion4.innerHTML=hacerOperacion(final[1],finalSignos[0], final[0]);
	}

	if(final[2] > final[3]){
		domOpcion5.innerHTML=final[2];
		domOpcion7.innerHTML=final[3];
		domOpcion8.innerHTML=hacerOperacion(final[2],finalSignos[1], final[3]);
	}

	else{
		domOpcion5.innerHTML=final[3];
		domOpcion7.innerHTML=final[2];
		domOpcion8.innerHTML=hacerOperacion(final[3],finalSignos[1], final[2]);
	}

	
	
}



function crearOperacion(){

	var final=[];
	var i=0;
	num1=Math.floor(Math.random() * 21);
	num2= Math.floor(Math.random() * 21);
	num3=Math.floor(Math.random() * 21);
	num4= Math.floor(Math.random() * 21);


	final[0]=num1;
	final[1]=num2;
	final[2]=num3;
	final[3]=num4;
	
	console.log('NÚMEROS ELEGIDOS')
	console.log(final)
	return final;	
}

function hacerOperacion(number1,signo, number2) {
	if(signo == '+'){
		return number1+number2;
	}
	else{
		if(number1 > number2){
			return number1-number2;
		}
		else{
			return number2-number1;
		}
		
	}
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
	console.log('Aquí esta signos2 parte 2');
	console.log(listaSignos2);
    var elem_id = event.dataTransfer.getData("text");
    movidas=movidas+1;
    event.target.appendChild( traer(elem_id) );
    droppedIn = true;
    traer(elem_id).style.width="100%";
    traer(elem_id).style.height="100%";
    traer(elem_id).style.border="0";
    respuestaSignos[s]=traer(elem_id).innerHTML;
    s=s+1;

    if(s>1){
    	mostrarContinuar();
    	response=respuestaSignos[0];
    	correct=listaSignos2[0];

    	if(correct != response){
    		puntaje= 1;
    		event.preventDefault();
    		traer(elem_id).removeAttribute("draggable");
        	traer(elem_id).style.cursor = "default";
        }
        else{
        	console.log('NO ES IGUAL');
        	puntaje=0;
        	}
    	procesarPuntaje(puntaje);
    	
    }
 
    }
   

function elegirSignos(){
	
	signo1=Math.floor(Math.random() *2);
	if(signo1 == 0){
		listaSignos[0]= '+';
		listaSignos[1]= '-';

	}
	else{
		listaSignos[0]= '-'
		listaSignos[1]= '+'
	}
	
	return listaSignos;
}

function procesarPuntaje(puntaje){
	console.log('Este es el puntaje: ');
	console.log(puntaje)
	parent.enviarPuntaje(puntaje);
	}

function mostrarContinuar(){
    document.getElementById('continuar').style.display = "inline-block";
}

