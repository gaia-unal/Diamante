var rtas = ["menor", "medio", "mayor"]
var html;
window.onload = function(){
	html = document.getElementById('contenedor').innerHTML;
};  

function mostrarContinuar(){
  document.getElementById('continuar').style.display = "block";
}

function mostrarReset(){
  document.getElementById('reset').style.display = "block";
}

function valida_existe() {
  mostrarReset();
  var flag = true;
	var hijo = document.getElementsByClassName("opcion");
  for (var i = 0; i < hijo.length; i++) {
    var obj = hijo[i].childNodes[0];
    if (typeof obj == "undefined") {
      flag = false;
      break;
    }
  }
  if (flag == true){
    mostrarContinuar();
  }
}

function procesarPuntaje() {
  var puntaje = 0
  var opciones = document.getElementsByClassName("opcion");
  for(var i = 0; i < opciones.length; i++){
    var child = opciones[i].childNodes[0]
    if (child.id == rtas[i]) {
      puntaje += 1;
  	}
  }
  parent.enviarPuntaje(puntaje/3);
}

function reset(){
  var container = document.getElementById("contenedor");
  container.innerHTML= html;
}                

function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  if (ev.target.childNodes.length == 0 && ev.target.parentNode.getAttribute("class") != "opcion") {
    ev.target.appendChild(document.getElementById(data));
  } else {
    var texto = 'Si quieres cambiar el orden, haz clic en el botón Reiniciar';
    if(typeof parent.mostrarAlerta === "function") {
      parent.mostrarAlerta(texto);
    }else{
      alert(texto);
    }
  }
  valida_existe();
}