Vue.use(Buefy.default);

var vm = new Vue({
    el: '#app',
    data: function() {
        return {
            actividades: [],
            indice: null
        }
    },
    computed: {
        porcentaje: function() {
            return ((this.indice) / this.actividades.length) * 100;
        }
    },
    methods: {
        aumentarIndice: function() {
            if((this.indice + 1) >= this.actividades.length) {
                var url = this.$refs.regresar.href;
                swal({
                    type: 'info',
                    title: 'Terminaste las actividades de prueba',
                    text: 'Registra tus estudiantes para que puedan realizar estas actividades y muchas más.'
                }).then(function(){
                    Utilidades.redireccionar(url);
                });
            }else{
                this.indice++;
            }
        },
        recargarIframe: function() {
            this.$refs.iframe.src += '';
        }
    },
    beforeMount: function() {
        var datos = JSON.parse(this.$el.attributes['data-actividades'].value);
        if(datos.length > 0) {
            this.actividades = datos;
            this.indice = 0;
        }
    }
});

function enviarPuntaje(puntaje){
    if(puntaje == null || isNaN(puntaje)){
        mostrarAlerta('Por favor completa la actividad', 'advertencia', vm.recargarIframe);
    }else{
        if(puntaje <= 0){
            mostrarAlerta('Te has equivocado, pero la próxima lo harás bien!', 'advertencia', vm.aumentarIndice);
        }else if(puntaje > 0 && puntaje < 1){
            mostrarAlerta('Tienes algún error, pero no te preocupes!', 'advertencia', vm.aumentarIndice);
        }else{
            mostrarAlerta('Respuesta correcta!', 'exito', vm.aumentarIndice);
        }
    }
}

function enviarActividadManual() {
    mostrarAlerta('Muy bien!', 'exito', vm.aumentarIndice);
}

function mostrarAlerta(texto, tipo = null, callback = null){
    switch(tipo){
        case 'exito':
            tipo = 'success';
            break;
        default:
            tipo = 'warning';
    }

    if(callback){
        swal({
            title: texto,
            type: tipo
        }).then(function(){
            callback();
        });
    }else{
        swal({
            title: texto,
            type: tipo
        });
    }
}

function mostrarConfirmar(texto, tipo = null){
    if(!tipo) tipo = 'question';
    swal({
        title: texto,
        type: tipo,
        showCancelButton: true,
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar'
    }).then(function(res) {
        if(res.value){
            return true;
        }
        return false;
    });
}