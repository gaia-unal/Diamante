var puntaje = null;

var boton = document.getElementById('btn-continuar');
boton.addEventListener('click', procesarPuntaje, false);

function mostrarContinuar(){
	document.getElementById('continuar').style.display = "block";
}

function ocultarContinuar(){
	document.getElementById('continuar').style.display = "none";
}

function procesarPuntaje(){
	if(puntaje == null || isNaN(puntaje)){
		alert('Por favor completa la actividad');
		ocultarContinuar();
	}else{
		parent.enviarPuntaje(puntaje);
	}
}

function Error(){
	puntaje = 0;
	mostrarContinuar();
}

function Correcto(){
	puntaje = 1;
	mostrarContinuar();
}

function sonido(){
	sound=document.createElement("embed");
	sound.src="pC5.mp3";
	sound.style.visibility="hidden";
	sound.style.position="absolute";
	document.body.appendChild(sound);
}

var usados=[];
function repetido(num)
{
	var repe=false;
	var i;
	for (i=0;i<usados.length; i++) 
	{
		if(num==usados[i]) 
		{
			repe = true;
		}
	}
	return repe;
}

var usados1=[];
function repetido1(num)
{
	var repe=false;
	var i;
	for (i=0;i<usados1.length; i++) 
	{
		if(num==usados1[i]) 
		{
			repe = true;
		}
	}
	return repe;
}

var a;
function aleatoreo()
{
	var num;
	num=Math.floor(Math.random()*(9-1+1))+1;
	a=num;
    return num;
}

var res=[];
var imagenes=[];
	imagenes[0]="num1.png";
  	imagenes[1]="num2.png";
  	imagenes[2]="num3.png";
    imagenes[3]="num4.png";
    imagenes[4]="num5.png";   
    imagenes[5]="num6.png";
    imagenes[6]="num7.png";
    imagenes[7]="num8.png";
	imagenes[8]="num9.png";
function imag()
{
	for(var i=0;i<9;i++) 
	{
		var num;
		var repe=false;
		do {
			num = Math.floor(Math.random()*(9-1+1))+1;
			repe = repetido(num);
		} while (repe!=false);
		usados.push(num);
		res.push(imagenes[num-1]);
	}
	var num1;
	var repe1=false;
	do {
		num1 = Math.floor(Math.random()*(3-1+1))+1;
		repe1 = repetido1(num);
	} while (repe1!=false);
	var aux=res[num1-1];
	res[num1-1]=imagenes[a-1];
	if(num1==1)
	{
		if(res[1]==imagenes[a-1])
		{
			res[1]=aux;
		}
		else if(res[2]==imagenes[a-1])
		{
			res[2]=aux;
		}
	}
	else if(num1==2)
	{
		if(res[0]==imagenes[a-1])
		{
			res[0]=aux;
		}
		else if(res[2]==imagenes[a-1])
		{
			res[2]=aux;
		}
	}
	else if(num1==imagenes[a-1])
	{
		if(res[0]==imagenes[a-1])
		{
			res[0]=aux;
		}
		else if(res[1]==imagenes[a-1])
		{
			res[1]=aux;
		}
	}
	return res;
}

function cours()
{
	var resp=aleatoreo();
	document.getElementById("numero").innerHTML=resp;
	var sour=imag();
	document.getElementById("res1").src=sour[0];
	document.getElementById("res2").src=sour[1];
	document.getElementById("res3").src=sour[2];
}

function showHide1()
{
	var image1=document.getElementById("marco1"); 
	var image2=document.getElementById("marco2"); 
	var image3=document.getElementById("marco3");
	image1.style.display=(image1.style.display=="none")?"inline":"none"; 
	image2.style.display="none";
	image3.style.display="none";
}
function showHide2()
{
	var image1=document.getElementById("marco1"); 
	var image2=document.getElementById("marco2");
	var image3=document.getElementById("marco3"); 
	image2.style.display=(image2.style.display=="none")?"inline":"none";
	image1.style.display="none";
	image3.style.display="none";
}
function showHide3()
{
	var image1=document.getElementById("marco1"); 
	var image2=document.getElementById("marco2");
	var image3=document.getElementById("marco3"); 
	image3.style.display=(image3.style.display=="none")?"inline":"none";
	image1.style.display="none";
	image2.style.display="none";
}

function Validar(resp)
{
	if(imagenes[a-1]==resp)
	{
		Correcto();
	}
	else
	{
		Error();
	}
}