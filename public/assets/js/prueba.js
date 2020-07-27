Vue.use(Buefy.default);

/* Objeto global que permite obtener el tiempo de realización de cada actividad, en segundos */
var Cronometro = {
    estado: {
        timer: new Timer(),
        tiempo: null
    },
    iniciar: function() {
        this.estado.tiempo = undefined;
        if(this.estado.timer){
            this.estado.timer.start({precision: 'seconds'});
        }
    },
    detener: function() {
        if(this.estado.timer){
            this.estado.tiempo = this.estado.timer.getTotalTimeValues().seconds;
            this.estado.timer.stop();

            return this.estado.tiempo;
        }
        return 0;
    }
};

var vm = new Vue({
    el: '#app',
    data: function() {
        return {
            actividades: [],
            actividadesPrevias: [],
            actividadActual: null,
            indiceActual: null,
            contadorActual: null,
            totalActual: null,
            urlCompletarActividad: '',
            urlBase: '',
            cargando: false
        }
    },
    computed: {
        porcentaje: function() {
            return (this.contadorActual / this.totalActual) * 100;
        },
        urlActividad: function() {
            return this.urlBase + this.actividadActual.rutaArchivo;
        }
    },
    methods: {
        cargarActividades: function() {
            this.cargando = true;
            var url = this.$refs.urlactividades.attributes['data-url'].value;
            var v = this;
            axios.get(url)
                .then(function(res){
                    if(res.data.datos){
                        var datos = res.data.datos;
                        v.actividades = datos.actividades;
                        v.urlCompletarActividad = datos.urlEnviar;
                        v.urlBase = datos.urlBase;
                        if(datos.actividadesPrevias){
                            v.actividadesPrevias = datos.actividadesPrevias;
                            v.iniciarActividadesPrevias();
                        }else{
                            v.iniciarActividades(parseInt(datos.actual, 10), parseInt(datos.total, 10));
                        }
                    }
                }).catch(function(err){
                    Utilidades.mostrarMensajeErrorAjax('Ha ocurrido un error al cargar las actividades, por favor recarga la página');
                }).finally(function(){
                    v.cargando = false;
                });
        },
        iniciarActividades: function(contador, total) {
            this.indiceActual = 0;
            this.contadorActual = contador;
            this.totalActual = total;
            this.actividadActual = this.actividades[this.indiceActual];
        },
        iniciarActividadesPrevias: function() {
            var v = this;
            swal({
                type: 'info',
                title: 'Antes de empezar',
                text: 'Las siguientes actividades te ayudarán a conocer la dinámica para realizar la prueba, por lo que no se calificarán.'
            }).then(function(){
                v.indiceActual = 0;
                v.contadorActual = 0;
                v.totalActual = v.actividadesPrevias.length;
                v.actividadActual = v.actividadesPrevias[v.indiceActual];
            });
        },
        completarActividadPrevia: function(mensaje) {
            this.indiceActual++;
            this.contadorActual++;
            var v = this;
            swal({
                type: 'info',
                title: mensaje
            }).then(function(){
                if(v.indiceActual < v.totalActual){
                    v.actividadActual = v.actividadesPrevias[v.indiceActual];
                }else{
                    swal({
                        type: 'info',
                        title: 'Comienza la prueba',
                        text: 'Las próximas actividades hacen parte de la prueba, presta atención y resuelve lo que se te pide.'
                    }).then(function(){
                        Cronometro.detener();
                        v.iniciarActividades(0, v.actividades.length);
                    });
                }
            });
        },
        recargarIframe: function() {
            this.$refs.iframe.src += '';
        },
        completarActividad: function(puntaje) {
            var tiempo = Cronometro.detener();
            var v = this;
            if(puntaje == null || isNaN(puntaje)){
                swal({
                    type: 'warning',
                    title: 'Por favor completa la actividad'
                }).then(function(e){
                    v.recargarIframe();
                });
                return false;
            }
            
            v.cargando = true;
            var datos = {
                'actividad_id': parseInt(v.actividadActual.id, 10),
                'puntaje': puntaje,
                'tiempo': tiempo
            };
            datos[v.$refs.csrfname.name] = v.$refs.csrfname.value;
            datos[v.$refs.csrfvalue.name] = v.$refs.csrfvalue.value;

            axios.post(v.urlCompletarActividad, datos)
                .then(function(res){
                    v.procesarRespuesta(res.data);
                }).catch(function(err){
                    Utilidades.mostrarMensajeErrorAjax('Ha ocurrido un error al procesar la actividad, por favor vuelve a realizarla');
                    v.recargarIframe();
                }).finally(function(){
                    v.cargando = false;
                });
        },
        completarActividadManual: function(imagen, objetivo) {
            var tiempo = Cronometro.detener();
            var v = this;
            if(imagen == null || objetivo == null){
                swal({
                    type: 'warning',
                    title: 'Por favor completa la actividad'
                }).then(function(e){
                    v.recargarIframe();
                });
                return false;
            }

            v.cargando = true;
            var datos = {
                'actividad_id': parseInt(v.actividadActual.id, 10),
                'imagen': imagen,
                'objetivo': objetivo,
                'tiempo': tiempo
            };
            datos[v.$refs.csrfname.name] = v.$refs.csrfname.value;
            datos[v.$refs.csrfvalue.name] = v.$refs.csrfvalue.value;

            axios.post(v.urlCompletarActividad, datos)
                .then(function(res){
                    v.procesarRespuesta(res.data);
                }).catch(function(err){
                    Utilidades.mostrarMensajeErrorAjax('Ha ocurrido un error al procesar la actividad, por favor vuelve a realizarla');
                    v.recargarIframe();
                }).finally(function(){
                    v.cargando = false;
                });
        },
        procesarRespuesta: function(res){
            if(res.respuesta){
                if(res.respuesta.accion == 'CONTINUAR'){
                    this.indiceActual++;
                    this.contadorActual++;
                    this.actividadActual = this.actividades[this.indiceActual];
                }else if(res.respuesta.accion == 'FINALIZAR'){
                    this.contadorActual = this.totalActual;
                    var icono = this.$refs.iconodiamante;
                    var v = this;
                    swal({
                        title: 'Felicitaciones!',
                        text: 'Terminaste la prueba, lo hiciste muy bien!',
                        imageUrl: icono.src,
                        imageWidth: icono.width,
                        imageHeight: icono.height,
                        imageAlt: icono.alt
                    }).then(function(){
                        v.regresar(true);
                    });
                }
            }else if(res.error){
                Utilidades.mostrarMensajeErrorAjax('Ha ocurrido un error al procesar la actividad, por favor vuelve a realizarla');
                this.recargarIframe();
            }
        },
        iframeCargado: function() {
            Cronometro.iniciar();
        },
        regresar: function(terminado = false) {
            var url = this.$refs.urlestudiante.attributes['data-url'].value;
            if(terminado){
                Utilidades.redireccionar(url);
            }else{
                swal({
                    title: 'No has finalizado la prueba',
                    text: 'Si sales ahora, podrás reanudar la prueba después.',
                    type: 'question',
                    showCancelButton: true,
                    confirmButtonText: 'Salir',
                    cancelButtonText: 'Cancelar'
                }).then(function(res) {
                    if(res.value){
                        Utilidades.redireccionar(url);
                    }
                });
            }
        }
    },
    mounted: function() {
        this.cargarActividades();
    }
});

function completarActividadPrevia(mensaje){
    vm.completarActividadPrevia(mensaje);
}

function enviarPuntaje(puntaje){
    vm.completarActividad(puntaje);
}

function enviarActividadManual(imagen, objetivo){
    vm.completarActividadManual(imagen, objetivo);
}