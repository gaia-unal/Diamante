Vue.use(Buefy.default);

var vm = new Vue({
    el: '#app',
    data: function() {
        return {
            navMovilActivo: false
        }
    },
    methods: {
        toggleNavMovil: function() {
            this.navMovilActivo = !this.navMovilActivo;
        }
    }
});