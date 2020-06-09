var flechas = ["2190", "2191", "2192", "2193"];
var id = [];
var direcciones = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var camino = ["2192", "2192", "2193", "2193", "2192", "2192", "2192", "2191", "2191", "2192", "2192", "2193", "2193", "2193", "2193", "2193", "2190", "2190", "2190", "2190", "2190"];
var clicks = 0;
var minClicks = 40;

function rotacion(event) {
	clicks++;
	if(clicks >= minClicks){
		document.getElementById("continuar").style.display = "block";
	}
	var direccion = document.getElementById(this.event.srcElement.id).textContent.charCodeAt(0).toString(16);
	while (true) {
	if (flechas.includes(direccion)) {
		if (direccion == flechas[0]) {
			document.getElementById(this.event.srcElement.id).textContent = '\u2191';
			sentido = document.getElementById(this.event.srcElement.id).textContent.charCodeAt(0).toString(16);
			break;
		} else {
			if (direccion == flechas[1]) {
				document.getElementById(this.event.srcElement.id).textContent = '\u2192';
				sentido = document.getElementById(this.event.srcElement.id).textContent.charCodeAt(0).toString(16);
				break;
			} else {
				if (direccion == flechas[2]) {
					document.getElementById(this.event.srcElement.id).textContent = '\u2193';
					sentido = document.getElementById(this.event.srcElement.id).textContent.charCodeAt(0).toString(16);
					break;
				} else {
					if (direccion == flechas[3]) {
						document.getElementById(this.event.srcElement.id).textContent = '\u2190';
						sentido = document.getElementById(this.event.srcElement.id).textContent.charCodeAt(0).toString(16);
						break;
					}
				}
			}
		}
	}
}
pos = this.event.srcElement.id.substring(6,8);
if (!id.includes(this.event.srcElement.id)){
	if (this.event.srcElement.id.length == 7) {
		pos = Number(this.event.srcElement.id.charAt(this.event.srcElement.id.length-1));
	}
	id.push(this.event.srcElement.id)
	direcciones[pos] = sentido;
} else {
	direcciones[pos] = sentido;
}
}

function procesarPuntaje(){
	puntaje = 0;
	for (var i = 0; i < camino.length; i++) {
		if (camino[i] == direcciones[i]) {
			puntaje += 0.0476;
		}
	}
	puntaje = Number(puntaje.toFixed(2));
	parent.enviarPuntaje(puntaje);
}