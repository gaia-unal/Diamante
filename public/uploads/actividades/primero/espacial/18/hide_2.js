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
