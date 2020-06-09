lineas = [];

function mostrarContinuar(){
  document.getElementById('continuar').style.display = "block";
}

function draw() {
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext("2d");
  canvas.style.cursor = "pointer";

  tam_dibujo = 10;
  i = 0;
  direccion = ["h", "v", "h", "v", "d", "d", "d", "d", "d"];
  var pos_x = [160, 400, 400, 160, 160, 100, 160, 400, 460, 400];
  var pos_y = [70, 70, 200, 200, 70, 135, 200, 70, 135, 200];

  for(; i < tam_dibujo; i++) {
    var x = pos_x[i];
    var y = pos_y[i];
    
    if (i) ctx.lineTo(x, y);
    else ctx.moveTo(x, y);    
    
    lineas.push({          
      x: x,
      y: y,
      color: "black",
      tipo: direccion[i]
    });
  }

  ctx.lineWidth = 7;
  ctx.lineJoin = "bevel";
  ctx.strokeStyle = "black";
  ctx.stroke();

  function verificarLineas(){
    cont = 0;
    for (var i = 0; i < lineas.length; i++) {
      if (lineas[i].color != "black") {
        cont += 1;
      }
      if (cont == 9) {
        mostrarContinuar();
        break;
      } 
    }
  }

  canvas.onclick = function(e) {
    var r = canvas.getBoundingClientRect(),
    x = e.clientX - r.left,
    y = e.clientY - r.top,
    i = 0
    var imgData = ctx.getImageData(x, y, 1, 1);
    red = imgData.data[0];
    green = imgData.data[1];
    blue = imgData.data[2];
    var color = "rgb(" + red + "," + green + "," + blue + ")"
    for(; i < tam_dibujo - 1; i++) {
      ctx.beginPath();
      ctx.moveTo(lineas[i].x, lineas[i].y);
      ctx.lineTo(lineas[i+1].x, lineas[i+1].y); 
      if (ctx.isPointInStroke(x, y)) {
        if (color == "rgb(0,0,255)" || color =="rgb(0,0,0)") {
          ctx.strokeStyle = "rgb(255,0,0)";
          lineas[i].color = "rojo"           
          ctx.stroke();
        } else {
          if (color == "rgb(255,0,0)") {
            ctx.strokeStyle = "rgb(0,150,0)";
            lineas[i].color = "verde"            
            ctx.stroke();
          } else {
            if (color == "rgb(0,150,0)") {
              ctx.strokeStyle = "rgb(0,0,255)";
              lineas[i].color = "azul"               
              ctx.stroke();
            }
          }
        }        
      }
    }
    verificarLineas();
  }
}

function procesarPuntaje(){
  puntaje = 0;
  for (var i = 0; i < lineas.length; i++) {
    if (lineas[i].tipo == "h" && lineas[i].color == "rojo"){
      puntaje += 1;
    } else {
      if (lineas[i].tipo == "v" && lineas[i].color == "verde"){
        puntaje += 1;
      }
      else {
        if (lineas[i].tipo == "d" && lineas[i].color == "azul"){
          puntaje += 1;
        }
      }
    }
  }
  parent.enviarPuntaje(puntaje/9);
}