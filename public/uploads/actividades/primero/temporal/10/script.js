// Iniciar el Canvas cuando se haya cargado la página
window.addEventListener('load', function() {
    iniciarCarga()
    continuar=document.getElementById('btn-continuar');
    continuar.onclick=function(){procesarPuntaje()}
});

domOpciones= document.getElementsByClassName('opcion');
domOpcion1= document.getElementById('opcion1');
domOpcion2= document.getElementById('opcion2');
domOpcion3= document.getElementById('opcion3');
domOpcion4= document.getElementById('opcion4');
domOpcion5= document.getElementById('opcion5');
domOpcion6= document.getElementById('opcion6');

domOpcion1.onclick=function(){cambioColor(domOpcion1)}
domOpcion2.onclick=function(){cambioColor(domOpcion2)}
domOpcion3.onclick=function(){cambioColor(domOpcion3)}
domOpcion4.onclick=function(){cambioColor(domOpcion4)}
domOpcion5.onclick=function(){cambioColor(domOpcion5)}
domOpcion6.onclick=function(){cambioColor(domOpcion6)}

var elegidos=new Array(6);
var listaCorrectas=new Array(6);
var listaMarcadas= new Array(6);
var puntaje=0;
var contadas=0;

var listaOraciones=['Ayer comí un sandwich','Tengo clase en la tarde','A las 3 iré al parque',
'El año pasado estaba en Cali','El próximo mes compraré ropa', 'Mañana visitaré a mi abuela', 
'Mi mamá hizo galletas en Navidad','En la noche terminaré la tarea', 'En 2018 fui de campamento'];
var listaValores=[1,0,0,1,0,0,1,0,1];

function iniciarCarga(){
	//console.log('opciones');
	//console.log(domOpciones);
	elegirFrases();
	//console.log('Elegidos')
	//console.log(elegidos)
	for (var i = 0; i < domOpciones.length; i++) {
			domOpciones[i].innerHTML=listaOraciones[elegidos[i]];
		}	
	
}

function elegirFrases(){
	var azar;
	var pos=0;
	var repetida=false
	for (pos=0; pos<6;pos++){
		//console.log('Posición');
		//console.log(pos);
		azar=Math.floor(Math.random() * listaOraciones.length);
		if(pos ==0){
			//console.log('Posición 1 de elegidos')
			elegidos[pos]=azar;
			listaCorrectas[pos]=listaValores[azar];
		}
		else{
			for (var i = 0; i < elegidos.length; i++) {
				//console.log('Posición en elegidos');
				//console.log(i)
				//console.log('Comparación')
				//console.log(elegidos[i])
				//console.log(azar)
				if(elegidos[i]== azar){
					//console.log('Son iguales')
					while(elegidos[i]== azar){
						azar=Math.floor(Math.random() * listaOraciones.length);
						for (var i = 0; i < elegidos.length; i++) {
							if(elegidos[i]== azar){
								break;
							}
						}
					}
					//console.log('Encontré uno diferente')
				}
				elegidos[pos]=azar;
				listaCorrectas[pos]=listaValores[azar];
			}
		}
	}
	//console.log('Terminé de elegir');
	//console.log(elegidos)
}


 
function cambioColor(domOpcion){
	dom=domOpcion.innerHTML;
	dom=dom.split(' ');
	if(dom[1]== '+'){
		marcada=marcada+1;
		console.log('Son iguales')
	}
	domOpcion.style.background= '#EEE';
	mostrarContinuar();

}

function procesarPuntaje(puntaje){
	var correcta=0;
	var marcadas=0;
	for (var i = 0; i < listaCorrectas.length; i++) {
		correctas= correctas+listaCorrectas[i];
	}

	for (var i = 0; i < listaMarcadas.length; i++) {
		marcadas= correctas+listaMarcadas[i];
	}
	if (marcadas== correctas) {
		puntaje=1;
	}
	else{
		puntaje=0;
	}
	console.log('Este es el puntaje: ');
	console.log(puntaje)
	parent.enviarPuntaje(puntaje);
	}

function mostrarContinuar(){
    document.getElementById('continuar').style.display = "inline-block";
}

