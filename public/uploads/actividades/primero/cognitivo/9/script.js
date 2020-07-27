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
	sound.src="pC9.mp3";
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
function imag()
{
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
	var num;
	num=Math.floor(Math.random()*(9-1+1))+1;
	a=num;
    return imagenes[num-1];
}

var res=[];
function aleatoreo()
{
	var respuestas=[1,2,3,4,5,6,7,8,9];
	for(var i=0;i<9;i++) 
	{
		var num;
		var repe=false;
		do {
			num = Math.floor(Math.random()*(9-1+1))+1;
			repe = repetido(num);
		} while (repe!=false);
		usados.push(num);
		res.push(respuestas[num-1]);
	}
	var num1;
	var repe1=false;
	do {
		num1 = Math.floor(Math.random()*(3-1+1))+1;
		repe1 = repetido1(num);
	} while (repe1!=false);
	var aux=res[num1-1];
	res[num1-1]=a;
	if(num1==1)
	{
		if(res[1]==a)
		{
			res[1]=aux;
		}
		else if(res[2]==a)
		{
			res[2]=aux;
		}
	}
	else if(num1==2)
	{
		if(res[0]==a)
		{
			res[0]=aux;
		}
		else if(res[2]==a)
		{
			res[2]=aux;
		}
	}
	else if(num1==3)
	{
		if(res[0]==a)
		{
			res[0]=aux;
		}
		else if(res[1]==a)
		{
			res[1]=aux;
		}
	}
	return res;
}

function cours()
{
	var sour=imag();
	document.getElementById("imagen").src=sour;
	var resp=aleatoreo();
	document.getElementById("res1").innerHTML=resp[0];
	document.getElementById("res2").innerHTML=resp[1];
	document.getElementById("res3").innerHTML=resp[2];
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

function Validar(res)
{
	if(a==res)
	{
		Correcto();
	}
	else
	{
		Error();
	}
}