Vue.use(Buefy.default);

Vue.component('form-registro-docente', {
    data: function() {
        return {
            form: {
                nombres: '',
                apellidos: '',
                institucion: -1,
                email: '',
                password: '',
                passwordC: ''
            },
            errores: {
                nombres: '',
                apellidos: '',
                institucion: '',
                email: '',
                password: '',
                passwordC: ''
            },
            cargando: false
        }
    },
    methods: {
        registrar: function(){
            if(this.validarCampos()){
                this.cargando = true;
                var url = this.$refs.formulario.dataset.url;
                var datos = {
                    'nombre': this.form.nombres,
                    'apellido': this.form.apellidos,
                    'institucion': this.form.institucion,
                    'email': this.form.email,
                    'password': this.form.password,
                    'password_confirmar': this.form.passwordC
                };
                datos[this.$refs.csrfname.name] = this.$refs.csrfname.value;
                datos[this.$refs.csrfvalue.name] = this.$refs.csrfvalue.value;
                var v = this;
                axios.post(url, datos)
                    .then(function(res){
                        if(res.data.respuesta){
                            if(res.data.respuesta.registro){
                                v.reiniciarCampos();
                                var destino = res.data.respuesta.url;
                                swal({
                                    type: 'success',
                                    text: 'Tu cuenta ha sido creada éxitosamente',
                                    confirmButtonText: 'Iniciar sesión'
                                }).then(function(op){
                                    if(op.value){
                                        Utilidades.redireccionar(destino);
                                    }
                                });
                            }else{
                                swal({
                                    type: 'warning',
                                    text: 'Ha ocurrido un error al crear tu cuenta. Por favor, revisa los datos y vuelve a intentarlo'
                                });
                            }
                        }
                        else if(res.data.errores){
                            var errores = res.data.errores;
                            if(errores.nombre) v.errores.nombres = errores.nombre[0];
                            if(errores.apellido) v.errores.apellidos = errores.apellido[0];
                            if(errores.institucion) v.errores.institucion = errores.institucion[0];
                            if(errores.email) v.errores.email = errores.email[0];
                            if(errores.password) v.errores.password = errores.password[0];
                            if(errores.password_confirmar) v.errores.passwordC = errores.password_confirmar[0];
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
            var invalido = 'El campo es inválido';
            var vacio = 'Este campo es obligatorio';
            if(this.form.nombres){
                if(!Utilidades.validarSoloLetras(this.form.nombres)){
                    this.errores.nombres = invalido;
                }
            }else{
                this.errores.nombres = vacio;
            }
            if(this.form.apellidos){
                if(!Utilidades.validarSoloLetras(this.form.apellidos)){
                    this.errores.apellidos = invalido;
                }
            }else{
                this.errores.apellidos = vacio;
            }
            if(this.form.institucion){
                if((this.form.institucion <= 0)){
                    this.errores.institucion = 'Selecciona una opción válida';
                }
            }else{
                this.errores.institucion = vacio;
            }
            if(this.form.email){
                if(!Utilidades.validarEmail(this.form.email)){
                    this.errores.email = 'El email es inválido';
                }
            }else{
                this.errores.email = vacio;
            }
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
        reiniciarCampos: function(){
            this.form = {
                nombres: '',
                apellidos: '',
                institucion: 0,
                email: '',
                password: '',
                passwordC: ''
            };
        },
        reiniciarErrores: function(){
            this.errores = {
                nombres: '',
                apellidos: '',
                institucion: '',
                email: '',
                password: '',
                passwordC: ''
            };
        },
    }
});

var vm = new Vue({
    el: '#app'
});