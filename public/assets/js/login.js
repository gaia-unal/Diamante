Vue.use(Buefy.default);

Vue.component('form-login-estudiante', {
    data: function() {
        return {
            form: {
                usuario: '',
                password: ''
            },
            errores: {
                usuario: '',
                password: ''
            },
            usuarioValido: false,
            cargando: false
        }
    },
    methods: {
        procesar: function(){
            if(this.usuarioValido){
                this.iniciarSesion();
            }else{
                this.verificarUsuario();
            }
        },
        iniciarSesion: function(){
            if(this.validarCampos()){
                this.cargando = true;
                var url = this.$refs.formulario.dataset.url;
                var datos = {
                    'usuario': this.form.usuario,
                    'password': this.form.password
                };
                datos[this.$refs.csrfname.name] = this.$refs.csrfname.value;
                datos[this.$refs.csrfvalue.name] = this.$refs.csrfvalue.value;
                var v = this;
                axios.post(url, datos)
                    .then(function(res){
                        if(res.data.accion){
                            if(res.data.accion == 'existe' && res.data.url){
                                Utilidades.redireccionar(res.data.url);
                            }else{
                                v.errores.password = res.data.texto;
                            }
                        }
                    }).catch(function(err){
                        Utilidades.mostrarMensajeErrorAjax();
                    }).finally(function(){
                        v.cargando = false;
                    });
            }
        },
        verificarUsuario: function(){
            this.reiniciarErrores();
            if(this.form.usuario){
                this.cargando = true;
                var url = this.$refs.formulario.dataset.url;
                var datos = {
                    'usuario': this.form.usuario
                };
                datos[this.$refs.csrfname.name] = this.$refs.csrfname.value;
                datos[this.$refs.csrfvalue.name] = this.$refs.csrfvalue.value;
                var v = this;
                axios.post(url, datos)
                    .then(function(res){
                        if(res.data.accion){
                            if(res.data.accion == 'existe'){
                                v.usuarioValido = true;
                            }else if(res.data.accion == 'nuevo' && res.data.url){
                                Utilidades.redireccionar(res.data.url);
                            }else{
                                v.errores.usuario = res.data.texto;
                            }
                        }
                    }).catch(function(err){
                        Utilidades.mostrarMensajeErrorAjax();
                    }).finally(function(){
                        v.cargando = false;
                    });
            }else{
                this.errores.usuario = 'Este campo es obligatorio';
            }
        },
        cambiarUsuario: function(){
            this.reiniciarErrores();
            this.form.usuario = '';
            this.usuarioValido = false;
        },
        validarCampos: function(){
            this.reiniciarErrores();
            var vacio = 'Este campo es obligatorio';
            if(!this.form.usuario){
                this.errores.usuario = vacio;
            }
            if(!this.form.password){
                this.errores.password = vacio;
            }

            if(Utilidades.objetoTienePropiedadValida(this.errores)){
                return false;
            }
            return true;
        },
        reiniciarErrores: function(){
            this.errores = {
                usuario: '',
                password: ''
            }
        }
    }
});

Vue.component('form-login-docente', {
    data: function() {
        return {
            form: {
                email: '',
                password: ''
            },
            errores: {
                email: '',
                password: ''
            },
            cargando: false
        }
    },
    methods: {
        iniciarSesion: function(){
            if(this.validarCampos()){
                this.cargando = true;
                var url = this.$refs.formulario.dataset.url;
                var datos = {
                    'email': this.form.email,
                    'password': this.form.password
                };
                datos[this.$refs.csrfname.name] = this.$refs.csrfname.value;
                datos[this.$refs.csrfvalue.name] = this.$refs.csrfvalue.value;
                var v = this;
                axios.post(url, datos)
                    .then(function(res){
                        if(res.data.login && res.data.url){
                            Utilidades.redireccionar(res.data.url);
                        }else {
                            v.errores.email = 'El email o la contraseña son incorrectas';
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
            if(this.form.email){
                if(!Utilidades.validarEmail(this.form.email)){
                    this.errores.email = 'El email es inválido'
                }
            }else{
                this.errores.email = vacio;
            }
            if(!this.form.password){
                this.errores.password = vacio;
            }

            if(Utilidades.objetoTienePropiedadValida(this.errores)){
                return false;
            }
            return true;
        },
        reiniciarErrores: function(){
            this.errores = {
                email: '',
                password: ''
            }
        }
    }
});

var vm = new Vue({
    el: '#app'
});