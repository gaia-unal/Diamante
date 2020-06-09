Vue.use(Buefy.default);

var vm = new Vue({
    el: '#app',
    data: function() {
        return {
            // se referencian iconos de la libreria Material Design Icons
            niveles: [
                {id:1, nombre: 'Espacial', icono: 'layers', descripcion: 'Ayuda identificar la ubicación entre su cuerpo y los objetos'},
                {id:2, nombre: 'Temporal', icono: 'clock', descripcion: 'Sitúa sucesos en el pasado o en el futuro, proporcionándole así un horizonte temporal'},
                {id:3, nombre: 'Simbólico', icono :'plus-minus', descripcion: 'Representación de operaciones o relaciones entre números o valores por medio de imágenes'},
                {id:4, nombre: 'Cognitivo', icono: 'brain', descripcion: 'Permite captar, codificar, almacenar y trabajar la información con el fin de obtener algún producto mental'}
            ],
            navMovilActivo: false
        }
    },
    methods: {
        toggleNavMovil: function() {
            this.navMovilActivo = !this.navMovilActivo;
        }
    }
});