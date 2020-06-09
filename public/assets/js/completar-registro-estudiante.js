Vue.use(Buefy.default);

var vm = new Vue({
    el: '#app',
    data: {
        estudiante: {
            nombre: '',
            usuario: ''
        },
        form: {
            password: '',
            passwordC: ''
        },
        errores: {
            password: '',
            passwordC: ''
        }
    },
    methods: {
        completarRegistro: function(){
            if(this.validarCampos()){
                this.cargando = true;
                var url = this.$refs.formulario.dataset.url;
                var datos = {
                    'password': this.form.password
                };
                datos[this.$refs.csrfname.name] = this.$refs.csrfname.value;
                datos[this.$refs.csrfvalue.name] = this.$refs.csrfvalue.value;
                var v = this;
                axios.post(url, datos)
                    .then(function(res){
                        if(res.data.respuesta){
                            if(res.data.respuesta.completado && res.data.respuesta.url){
                                Utilidades.redireccionar(res.data.respuesta.url);
                            }else{
                                swal({
                                    type: 'warning',
                                    text: res.data.respuesta.texto
                                });
                            }
                        }else if(res.data.errores){
                            v.errores.password = res.data.errores.password;
                        }
                    }).catch(function(err){
                        Utilidades.mostrarMensajeErrorAjax();
                    }).finally(function(){
                        v.cargando = false;
                    });
            }
        },
        validarCampos: function(){
            this.reiniciarErrores();
            var vacio = 'Este campo es obligatorio';
            if(this.form.password){
                if(this.form.password.length < 5){
                    this.errores.password = 'La contraseña debe poseer al menos 5 caracteres';
                }
            }else{
                this.errores.password = vacio;
            }
            if(this.form.passwordC){
                if(this.form.passwordC !== this.form.password){
                    this.errores.passwordC = 'El campo no coincide con la contraseña ingresada';
                }
            }else{
                this.errores.passwordC = vacio;
            }

            if(Utilidades.objetoTienePropiedadValida(this.errores)){
                return false;
            }
            return true;
        },
        reiniciarErrores: function(){
            this.errores = {
                password: '',
                passwordC: ''
            };
        }
    },
    beforeMount: function(){
        this.estudiante = JSON.parse(this.$el.attributes['data-estudiante'].value);
    }
});