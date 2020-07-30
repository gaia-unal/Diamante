Vue.use(Buefy.default);

var bn = [];
var infoGeneral;
var tot = 0;

/* Store global para almacenar datos que se utilizan en diferentes componentes de la aplicación */
var Store = {
    state: {
        grados: [],
        niveles: [],
        estudiantes: [],
        cantidad: {
            registrados: 0,
            califPendiente: 0,
            reportes: 0
        },
        csrf: {
            name: {
                name: '',
                value: ''
            },
            value: {
                name: '',
                value: ''
            }
        },
        urls: {
            estudiantes: '',
            registrarEstudiante: '',
            calificarActividad: '',
            consultarReporte: ''
        }
    },
    setGrados: function (grados) {
        for (i in grados) {
            this.state.grados.push(grados[i]);
        }
    },
    setNiveles: function (niveles) {
        for (i in niveles) {
            this.state.niveles.push(niveles[i]);
        }
    },
    setEstudiantes: function (estudiantes) {
        this.state.estudiantes = [];
        if (estudiantes.length > 0) {
            for (i in estudiantes) {
                estudiantes[i].grado = this.crearObjetoGrado(estudiantes[i].gradoId);
                estudiantes[i].estado = this.crearObjetoEstado(estudiantes[i].estado);
                this.state.estudiantes.push(estudiantes[i]);
            }
        }
    },
    addEstudiante: function (estudiante) {
        estudiante.grado = this.crearObjetoGrado(estudiante.gradoId);
        estudiante.estado = this.crearObjetoEstado(estudiante.estado);
        this.state.estudiantes.push(estudiante);
        this.addCantidadRegistrados();
    },
    setCalificaciones: function (estudiantes, pruebas) {
        this.state.estudiantes = [];
        for (i in estudiantes) {
            estudiantes[i].grado = this.crearObjetoGrado(estudiantes[i].gradoId);
            estudiantes[i].estado = this.crearObjetoEstado(estudiantes[i].estado);
            estudiantes[i].prueba = pruebas.find(function (pr) {
                return pr.estudianteId == estudiantes[i].id
            });
            this.state.estudiantes.push(estudiantes[i]);
        }
    },
    setReportes: function (estudiantes) {
        this.state.estudiantes = [];
        for (i in estudiantes) {
            estudiantes[i].grado = this.crearObjetoGrado(estudiantes[i].gradoId);
            this.state.estudiantes.push(estudiantes[i]);
        }
    },
    remActividadCalificacion: function (estudianteId, actividadId, pruebaTerminada) {
        for (i in this.state.estudiantes) {
            if (estudianteId == this.state.estudiantes[i].id) {
                for (j in this.state.estudiantes[i].prueba.actividades) {
                    if (actividadId == this.state.estudiantes[i].prueba.actividades[j].id) {
                        this.state.estudiantes[i].prueba.actividades.splice(j, 1);
                        if (pruebaTerminada) {
                            this.state.estudiantes.splice(i, 1);
                            this.remCantidadCalifPendiente();
                            return true;
                        }
                        break;
                    }
                }
                break;
            }
        }
        return false;
    },
    setCantidades: function (cantidades) {
        this.state.cantidad.registrados = cantidades.registrados;
        this.state.cantidad.califPendiente = cantidades.califPendiente;
        this.state.cantidad.reportes = cantidades.reportes;
    },
    addCantidadRegistrados: function () {
        this.state.cantidad.registrados++;
    },
    remCantidadCalifPendiente: function () {
        if (this.state.cantidad.califPendiente > 0) {
            this.state.cantidad.califPendiente--;
        }
    },
    setUrls: function (urls) {
        this.state.urls.estudiantes = urls.estudiantes;
        this.state.urls.registrarEstudiante = urls.registrarEstudiante;
        this.state.urls.calificarActividad = urls.calificarActividad;
        this.state.urls.consultarReporte = urls.consultarReporte;
    },
    setCamposCsrf: function (nameEl, valueEl) {
        this.state.csrf.name.name = nameEl.name;
        this.state.csrf.name.value = nameEl.value;
        this.state.csrf.value.name = valueEl.name;
        this.state.csrf.value.value = valueEl.value;
    },
    crearObjetoGrado: function (gradoId) {
        return this.state.grados.find(function (gr) {
            return gr.id == gradoId
        });
    },
    crearObjetoEstado: function (estado) {
        obj = {
            codigo: estado,
            texto: '',
            clase: '',
        };
        switch (estado) {
            case Utilidades.estados.estudiante.CUENTA_NO_ACTIVA.codigo:
                obj.clase = 'is-light';
                obj.texto = Utilidades.estados.estudiante.CUENTA_NO_ACTIVA.texto;
                break;
            case Utilidades.estados.estudiante.PRUEBA_FINALIZADA.codigo:
                obj.clase = 'is-success';
                obj.texto = Utilidades.estados.estudiante.PRUEBA_FINALIZADA.texto;
                break;
            case Utilidades.estados.estudiante.CALIF_PENDIENTE.codigo:
                obj.clase = 'is-danger';
                obj.texto = Utilidades.estados.estudiante.CALIF_PENDIENTE.texto;
                break;
            case Utilidades.estados.estudiante.PRUEBA_PENDIENTE.codigo:
                obj.clase = 'is-warning';
                obj.texto = Utilidades.estados.estudiante.PRUEBA_PENDIENTE.texto;
                break;
            case Utilidades.estados.estudiante.PRUEBA_NO_INICIADA.codigo:
                obj.clase = 'is-info';
                obj.texto = Utilidades.estados.estudiante.PRUEBA_NO_INICIADA.texto;
        }
        return obj;
    }
};

/* Componente del formulario para registrar estudiantes */
var FormRegistrarEstudiante = {
    template:
        '<div class="modal-card">\
    <header class="modal-card-head has-text-centered">\
        <p class="modal-card-title">Registrar estudiante</p>\
    </header>\
    <section class="modal-card-body">\
        <form @submit.prevent="registrar">\
            <div class="columns">\
                <div class="column">\
                    <b-field label="Nombres" :type="errores.nombres ? \'is-danger\':\'\'" :message="errores.nombres">\
                        <b-input type="text" v-model="form.nombres" maxlength="25"></b-input>\
                    </b-field>\
                </div>\
                <div class="column">\
                    <b-field label="Apellidos" :type="errores.apellidos ? \'is-danger\':\'\'" :message="errores.apellidos">\
                        <b-input type="text" v-model="form.apellidos" maxlength="25"></b-input>\
                    </b-field>\
                </div>\
            </div>\
            <div class="columns">\
                <div class="column">\
                    <b-field label="Género" :type="errores.genero ? \'is-danger\':\'\'" :message="errores.genero"></b-field>\
                    <b-field>\
                        <b-radio v-model="form.genero" native-value="M">Masculino</b-radio>\
                        <b-radio v-model="form.genero" native-value="F">Femenino</b-radio>\
                    </b-field>\
                </div>\
                <div class="column">\
                    <b-field label="Fecha de nacimiento" :type="errores.nacimiento ? \'is-danger\':\'\'" :message="errores.nacimiento">\
                        <b-datepicker v-model="form.nacimiento" :month-names="calendario.meses" :day-names="calendario.dias"\
                            :min-date="calendario.fechaMinima" :max-date="calendario.fechaMaxima" :date-formatter="formatearFecha"\
                            placeholder="Selecciona" icon="calendar-today"></b-datepicker>\
                    </b-field>\
                </div>\
                <div class="column">\
                    <b-field label="Grado" :type="errores.grado ? \'is-danger\':\'\'" :message="errores.grado">\
                        <b-select v-model="form.grado">\
                            <option value="-1" disabled>Selecciona</option>\
                            <option v-for="gr in state.grados" :key="gr.id" :value="gr.id">{{ gr.nombre }}</option>\
                        </b-select>\
                    </b-field>\
                </div>\
            </div>\
            <b-field label="Observación (opcional)" :type="errores.observacion ? \'is-danger\':\'\'" :message="errores.observacion">\
                <b-input v-model="form.observacion" type="textarea" maxlength="300"\
                    placeholder="¿El estudiante posee alguna necesidad especial (discapacidad física, cognitiva, intelectual)?"></b-input>\
            </b-field>\
            <div class="buttons is-centered">\
                <button type="button" class="button" @click="$parent.close();recarga()">Cerrar</button>\
                <button type="submit" class="button is-success" :class="{\'is-loading\': cargando}">Registrar</button>\
            </div>\
        </form>\
    </section>\
</div>',
    data: function () {
        return {
            state: Store.state,
            form: {
                nombres: '',
                apellidos: '',
                genero: 'M',
                nacimiento: null,
                grado: -1,
                observacion: ''
            },
            errores: {
                nombres: '',
                apellidos: '',
                genero: '',
                nacimiento: '',
                grado: '',
                observacion: ''
            },
            calendario: {
                meses: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
                dias: ['D', 'L', 'M', 'Mi', 'J', 'V', 'S'],
                fechaMinima: new Date(new Date().setFullYear(new Date().getFullYear() - 10)), // Fecha minima es 10 años atrás
                fechaMaxima: new Date()
            },
            cargando: false
        }
    },
    methods: {
        registrar: function () {
            if (this.validarCampos()) {
                this.cargando = true;
                var url = this.state.urls.registrarEstudiante;
                var datos = {
                    'nombre': this.form.nombres,
                    'apellido': this.form.apellidos,
                    'genero': this.form.genero,
                    'fecha_nacimiento': this.formatearFecha(this.form.nacimiento),
                    'grado': this.form.grado,
                    'observacion': this.form.observacion
                };
                datos[this.state.csrf.name.name] = this.state.csrf.name.value;
                datos[this.state.csrf.value.name] = this.state.csrf.value.value;
                var v = this;
                axios.post(url, datos)
                    .then(function (res) {
                        if (res.data.respuesta) {
                            if (res.data.respuesta.registro) {
                                Store.addEstudiante({
                                    id: res.data.respuesta.estudiante.id,
                                    nombre: datos.nombre,
                                    apellido: datos.apellido,
                                    genero: datos.genero,
                                    fechaNacimiento: datos.fecha_nacimiento,
                                    gradoId: datos.grado,
                                    observacion: datos.observacion,
                                    usuario: res.data.respuesta.estudiante.usuario,
                                    estado: res.data.respuesta.estudiante.estado,
                                    fechaCreacion: v.formatearFecha(new Date()),
                                    ultimoAcceso: null
                                });
                                v.reiniciarCampos();
                                var contenido = 'Indícale que inicie sesión con el usuario <strong>' + res.data.respuesta.estudiante.usuario + '</strong> para que pueda establecer su contraseña'
                                swal({
                                    title: 'Estudiante registrado',
                                    type: 'success',
                                    html: contenido
                                });
                            } else {
                                swal({
                                    type: 'warning',
                                    text: 'Ha ocurrido un error durante el registro, por favor vuelve a intentarlo'
                                })
                            }
                        } else if (res.data.errores) {
                            var errores = res.data.errores;
                            if (errores.nombre) v.errores.nombres = errores.nombre[0];
                            if (errores.apellido) v.errores.apellidos = errores.apellido[0];
                            if (errores.genero) v.errores.genero = errores.genero[0];
                            if (errores.fecha_nacimiento) v.errores.nacimiento = errores.fecha_nacimiento[0];
                            if (errores.grado) v.errores.grado = errores.grado[0];
                        }
                    }).catch(function (err) {
                        Utilidades.mostrarMensajeErrorAjax();
                    }).finally(function () {
                        v.cargando = false;
                    });

            }
        },
        validarCampos: function () {
            this.reiniciarErrores();
            var invalido = 'El campo es inválido';
            var vacio = 'Este campo es obligatorio';
            if (this.form.nombres) {
                if (!Utilidades.validarSoloLetras(this.form.nombres)) {
                    this.errores.nombres = invalido;
                }
            } else {
                this.errores.nombres = vacio;
            }
            if (this.form.apellidos) {
                if (!Utilidades.validarSoloLetras(this.form.apellidos)) {
                    this.errores.apellidos = invalido;
                }
            } else {
                this.errores.apellidos = vacio;
            }
            if (this.form.genero) {
                if (this.form.genero != 'M' && this.form.genero != 'F') {
                    this.errores.genero = invalido;
                }
            } else {
                this.errores.genero = vacio;
            }
            if (!this.form.nacimiento) {
                this.errores.nacimiento = vacio;
            }
            if (this.form.grado) {
                if (this.form.grado <= 0) {
                    this.errores.grado = 'Selecciona una opción válida';
                }
            } else {
                this.errores.grado = vacio;
            }
            if (this.form.observacion) {
                if (this.form.observacion.length > 300) {
                    this.errores.observacion = 'Este campo debe contener máximo 300 caracteres';
                }
            }

            if (Utilidades.objetoTienePropiedadValida(this.errores)) {
                return false;
            }
            return true;
        },
        formatearFecha: function (fecha) {
            return Utilidades.formatearFecha(fecha);
        },
        reiniciarCampos: function () {
            this.form = {
                nombres: '',
                apellidos: '',
                genero: 'M',
                nacimiento: null,
                grado: -1,
                observacion: ''
            };
        },
        reiniciarErrores: function () {
            this.errores = {
                nombres: '',
                apellidos: '',
                genero: '',
                nacimiento: '',
                grado: '',
                observacion: ''
            };
        },
        recarga: function () {
            swal("Atención", "Por favor recarga la página para observar los cambios realizados", "info")
        }
    },
};

/* Componente de la vista de estudiantes */
Vue.component('vista-estudiantes', {
    template:
        /**
         *  Agregar despues de observación, línea 412
         *  <b-table-column label="Editar" width="30" centered><button class="button is-small is-primary" @click="editar(props.row)"><b-icon icon="pencil"></b-icon></button></b-table-column>\
         *  Activar función editar estudiante 467
         *                
        */
        '<div>\
            <div class="level">\
                <div class="level-left">\
                    <div class="level-item" v-show="state.cantidad.registrados > 0">\
                        <p class="title">{{ state.cantidad.registrados }} estudiante<span v-show="state.cantidad.registrados > 1">s</span></p>\
                    </div>\
                    <div class="level-item" v-show="state.cantidad.registrados > 0">\
                        <b-select v-model="tabla.grado" @input="cargarEstudiantes">\
                            <option value="-1">Todos los grados</option>\
                            <option v-for="(gr, index) in state.grados" :key="index" :value="gr.id">Grado {{ gr.nombre }}</option>\
                        </b-select>\
                    </div>\
                    <div class="level-item">\
                        <button class="button is-success" @click="abrirModalRegistrar()">\
                            <b-icon icon="account-plus"></b-icon><span>Registrar estudiante</span>\
                        </button>\
                    </div>\
                </div>\
            </div>\
            <div v-if="state.cantidad.registrados > 0">\
                <b-table :data="state.estudiantes" hoverable v-if="cargado">\
                    <template slot-scope="props">\
                        <b-table-column label="Nombre">{{ props.row.nombre + " " + props.row.apellido }}</b-table-column>\
                        <b-table-column label="Usuario"><code>{{ props.row.usuario }}</code></b-table-column>\
                        <b-table-column label="Grado" centered>{{ props.row.grado.nombre }}</b-table-column>\
                        <b-table-column label="Estado" centered><b-tag :type="props.row.estado.clase">{{ props.row.estado.texto }}</b-tag></b-table-column>\
                        <b-table-column label="Fecha registro" centered>{{ props.row.fechaCreacion }}</b-table-column>\
                        <b-table-column label="Observación" centered>{{ props.row.observacion }}</b-table-column>\
                    </template>\
                    <template slot="empty">\
                        <section class="section">\
                            <div class="content has-text-grey has-text-centered">\
                                <p><b-icon icon="help-circle" size="is-large"></b-icon></p>\
                                <p class="subtitle">No hay estudiantes que coincidan con la búsqueda</p>\
                            </div>\
                        </section>\
                    </template>\
                </b-table>\
            </div>\
            <div v-else>\
                <section class="section">\
                    <div class="content has-text-grey has-text-centered">\
                        <p><b-icon icon="alert-circle" size="is-large"></b-icon></p>\
                        <p class="subtitle">Aún no has registrado estudiantes</p>\
                    </div>\
                </section>\
            </div>\
        </div>',
    data: function () {
        return {
            state: Store.state,
            tabla: {
                grado: -1,
                cargando: false
            },
            cargado: false
        }
    },
    methods: {
        cargarEstudiantes: function () {
            if (this.state.cantidad.registrados > 0) {
                this.$emit('cargando', true);
                var url = this.state.urls.estudiantes;
                var params = {
                    tipo: 'estuds'
                };
                if (this.tabla.grado > 0) params.grado = this.tabla.grado;
                var v = this;
                axios.get(url, { params: params })
                    .then(function (res) {
                        if (res.data.estudiantes) {
                            Store.setEstudiantes(res.data.estudiantes);
                        }
                    }).catch(function (err) {
                        Utilidades.mostrarMensajeErrorAjax();
                    }).finally(function () {
                        v.cargado = true;
                        v.$emit('cargando', false);
                    });
            } else {
                this.cargado = true;
            }
        },
        abrirModalRegistrar: function () {
            this.$modal.open({
                parent: this,
                component: FormRegistrarEstudiante,
                hasModalCard: true
            });
        },
        /*editar: function (estudiante) {
            alert('Editar estudiante: ' + estudiante.usuario);
        },
        eliminar: function (estudiante) {
            alert('Eliminar estudiante: ' + estudiante.usuario);
        },*/
    },
    created: function () {
        this.cargarEstudiantes();
    }
});

/* Componente que muestra los detalles de calificación del estudiante seleccionado */
var DetalleCalificacion = {
    template:
        '<div>\
            <p class="title is-4">Prueba de {{ estudiante.nombre + \' \' + estudiante.apellido }}, finalizada el {{ estudiante.prueba.fechaFin }}</p>\
            <p class="subtitle" style="margin-bottom: 0.5em">Actividades pendientes por calificar:</p>\
            <div class="columns">\
                <div class="column">\
                    <div class="box item-lista" v-for="(act, index) in actividades" :key="act.id" @click="seleccionar(act)"><p><b>{{ (index+1) + \'. \' + act.nombre }}</b></p></div>\
                    <button class="button is-info" @click="regresar">\
                        <b-icon icon="arrow-left-thick"></b-icon><span>Regresar</span>\
                    </button>\
                </div>\
                <div class="column">\
                    <div v-if="seleccion">\
                        <div class="box has-text-centered">\
                            <p class="title is-4">Objetivo: {{ seleccion.objetivo }}</p>\
                                <div class="contenedor-imagen">\
                                <figure class="image">\
                                    <img :src="seleccion.imagen" alt="Imagen de la actividad realizada"/>\
                                </figure>\
                                </div>\
                            <form>\
                            <div class="contenedor-slider">\
                            <div class="level is-mobile">\
                                <div class="level-item has-text-centered">\
                                    <p class="title">0</p>\
                                </div>\
                                <div class="level-item has-text-centered">\
                                    <input type="range" v-model="calificacion" class="slider-calificacion" min="0" max="5" step="1" :disabled="cargando"/>\
                                </div>\
                                <div class="level-item has-text-centered">\
                                    <p class="title">5</p>\
                                </div>\
                            </div>\
                            </div>\
                            <p class="title is-4">Calificación: {{ calificacion }}</p>\
                            <button class="button is-success" :class="{\'is-loading\': cargando}" @click.prevent="calificar">\
                                <b-icon icon="clipboard-check"></b-icon><span>Enviar</span>\
                            </button>\
                            </form>\
                        </div>\
                    </div>\
                    <div v-else>\
                        <section class="section">\
                            <div class="content has-text-grey has-text-centered">\
                                <p><b-icon icon="information" size="is-large"></b-icon></p>\
                                <p class="subtitle">Selecciona una actividad para calificarla</p>\
                            </div>\
                        </section>\
                    </div>\
                </div>\
            </div>\
        </div>',
    data: function () {
        return {
            state: Store.state,
            actividades: [],
            seleccion: null,
            calificacion: 5,
            cargando: false
        }
    },
    props: ['estudiante'],
    methods: {
        seleccionar: function (actividad) {
            this.seleccion = actividad;
        },
        calificar: function () {
            if (!isNaN(this.calificacion)) {
                this.cargando = true;
                var url = this.state.urls.calificarActividad;
                var datos = {
                    docente: this.estudiante.docenteId,
                    estudiante: this.estudiante.id,
                    prueba: this.estudiante.prueba.id,
                    actividad: this.seleccion.id,
                    calificacion: Number(this.calificacion)
                };
                datos[this.state.csrf.name.name] = this.state.csrf.name.value;
                datos[this.state.csrf.value.name] = this.state.csrf.value.value;
                var v = this;
                axios.post(url, datos)
                    .then(function (res) {
                        if (res.data.respuesta) {
                            if (res.data.respuesta.calificado) {
                                swal({
                                    type: 'success',
                                    text: 'Actividad calificada con éxito'
                                }).then(function () {
                                    if (Store.remActividadCalificacion(
                                        datos.estudiante,
                                        datos.actividad,
                                        res.data.respuesta.pruebaTerminada)) {
                                        swal({
                                            type: 'info',
                                            text: 'La prueba del estudiante está completa, ya puedes revisar sus resultados en la pestaña de Reportes' +
                                                ' Te recomendamos recargar la página para ver los cambios efectuados'
                                        }).then(function () {
                                            v.regresar();
                                        });
                                    }
                                });
                            } else {
                                swal({
                                    type: 'warning',
                                    text: 'Ha ocurrido un error al calificar la actividad, por favor vuelve a intentarlo'
                                });
                            }
                        } else {
                            swal({
                                type: 'warning',
                                text: 'Ha ocurrido un error al calificar la actividad, por favor vuelve a intentarlo'
                            });
                        }
                    }).catch(function (err) {
                        Utilidades.mostrarMensajeErrorAjax();
                    }).finally(function () {
                        v.cargando = false;
                    });
            } else {
                swal({
                    type: 'warning',
                    text: 'Selecciona una calificación válida'
                });
            }
        },
        regresar: function () {
            this.$emit('regresar');
        }
    },
    created: function () {
        this.actividades = this.estudiante.prueba.actividades;
    }
};

/* Componente de la vista de calificaciones */
Vue.component('vista-calificaciones', {
    template:
        '<div>\
            <div v-show="!seleccionado">\
                <div v-if="state.cantidad.califPendiente > 0">\
                    <p class="title">{{ state.cantidad.califPendiente }} Calificaciones pendientes</p>\
                    <b-table :data="state.estudiantes" hoverable v-if="cargado">\
                        <template slot-scope="props">\
                            <b-table-column label="Nombre">{{ props.row.nombre + " " + props.row.apellido }}</b-table-column>\
                            <b-table-column label="Usuario"><code>{{ props.row.usuario }}</code></b-table-column>\
                            <b-table-column label="Grado" centered>{{ props.row.grado.nombre }}</b-table-column>\
                            <b-table-column label="Fecha finalización" centered>{{ props.row.prueba.fechaFin }}</b-table-column>\
                            <b-table-column label="Calificar" width="30" centered><button class="button is-small is-warning" @click="calificar(props.row)"><b-icon icon="clipboard-check"></b-icon></button></b-table-column>\
                        </template>\
                    </b-table>\
                </div>\
                <div v-else>\
                    <section class="section">\
                        <div class="content has-text-grey has-text-centered">\
                            <p><b-icon icon="emoticon-excited" size="is-large"></b-icon></p>\
                            <p class="subtitle">No tienes calificaciones pendientes.</p>\
                        </div>\
                    </section>\
                </div>\
            </div>\
            <div v-if="seleccionado">\
                <detalle-calificacion :estudiante="seleccionado" @regresar="deseleccionar"></detalle-calificacion>\
            </div>\
        </div>',
    data: function () {
        return {
            state: Store.state,
            seleccionado: null,
            cargado: false
        }
    },
    methods: {
        cargarEstudiantes: function () {
            this.$emit('cargando', true);
            var url = this.state.urls.estudiantes;
            var params = {
                tipo: 'califs'
            };
            var v = this;
            axios.get(url, { params: params })
                .then(function (res) {
                    if (res.data.pendientes) {
                        if (res.data.estudiantes.length > 0 && res.data.pruebas.length > 0) {
                            Store.setCalificaciones(res.data.estudiantes, res.data.pruebas);
                        }
                    }
                }).catch(function (err) {
                    Utilidades.mostrarMensajeErrorAjax();
                }).finally(function () {
                    v.cargado = true;
                    v.$emit('cargando', false);
                });
        },
        calificar: function (estudiante) {
            this.seleccionado = estudiante;
        },
        deseleccionar: function () {
            this.seleccionado = null;
        }
    },
    components: {
        'detalle-calificacion': DetalleCalificacion
    },
    created: function () {
        this.cargarEstudiantes();
    }
});

/* Componente de la gráfica circular para el reporte de nivel */
var GraficaReporteNivel = {
    extends: VueChartJs.Doughnut,
    props: ['nivel'],
    methods: {
        determinarColor: function () {
            var color = "#CCC";
            if (this.nivel.porcentaje > 0.8) {
                color = "#4caf50";
            } else if (this.nivel.porcentaje > 0.5) {
                color = "#2196f3";
            } else {
                color = "#ff9800";
            }
            return color;
        }
    },
    mounted: function () {
        var data = {
            labels: [this.nivel.nombre, ''],
            datasets: [{
                backgroundColor: [this.determinarColor(), '#CCC'],
                data: [this.nivel.porcentaje, (1 - this.nivel.porcentaje)]
            }]
        };
        var options = {
            responsive: false,
            maintainAspectRatio: true,
            legend: { display: false },
            tooltips: {
                enabled: false
            }
        };
        this.renderChart(data, options);
    }
};

/* Componente de la gráfica circular para el reporte general */
var GraficaReporteGeneral = {
    extends: VueChartJs.Doughnut,
    props: ['datos'],
    methods: {
        determinarColor: function () {
            var color = "#CCC";
            if (this.datos > 0.796) {
                color = "#4caf50";
            } else if (this.datos > 0.496) {
                color = "#2196f3";
                infoGeneral = 'Tiene algunas dificultades en matemáticas pero no hay tendencia a la discalculia.'
            } else {
                color = "#ff9800";
                infoGeneral = 'Tiene muchas dificultades con la matemática y tendencia a la discalculia. Se recomienda reforzar.'
            }
            return color;
        }
    },
    mounted: function () {
        var data = {
            labels: ['General', ''],
            datasets: [{
                backgroundColor: [this.determinarColor(), '#CCC'],
                data: [this.datos, (1 - this.datos)]
            }]
        };
        var options = {
            responsive: false,
            maintainAspectRatio: true,
            legend: { display: false },
            tooltips: {
                enabled: false
            }
        };
        this.renderChart(data, options);
    }
};

/* Componente que muestra el reporte detallado de una prueba específica */
var DetalleReporte = {
    template:
        '<div class="columns is-vcentered">\
            <div class="column">\
                <div class="columns is-multiline">\
                    <div v-for="(nivel, index) in reporte.niveles" :key="index" class="column is-6">\
                        <div class="box" style="cursor: pointer;"  @click="seleccionarNivel(nivel)">\
                            <div class="has-text-centered contenedor-grafica-reporte">\
                                <p class="subtitle">{{ nivel.nombre }}</p>\
                                <grafica-nivel :nivel="nivel" :width="120" :height="120"></grafica-nivel>\
                                <div class="porcentaje-nivel">\
                                    <p class="subtitle">{{ nivel.porcentaje * 100 }}%</p>\
                                </div>\
                            </div>\
                        </div>\
                    </div>\
                </div>\
            </div>\
            <div class="column">\
                <div class="box" style="cursor: pointer;"  @click="detalleTotal()">\
                    <div class="has-text-centered contenedor-grafica-reporte">\
                        <p class="subtitle">Desempeño general</p>\
                        <grafica-general :datos="reporte.porcentajeTotal" :width="200" :height="200"></grafica-general>\
                        <div class="porcentaje-general">\
                            <p class="subtitle">{{ reporte.porcentajeTotal * 100 }}%</p>\
                        </div>\
                    </div>\
                </div>\
            </div>\
        </div>',
    props: ['reporte'],
    data: function () {
        return {
            state: Store.state
        }
    },
    methods: {
        /* TODO, cambiar vista y mostrar las actividades/categorias */
        seleccionarNivel: function (nivel) {
            var rec = '';
            if (nivel.porcentaje <= 0.5)
                rec = 'Se recomienda reforzar el nivel porque presenta grandes dificultades y tendencia a la discalculia';
            else if (nivel.porcentaje <= 0.8)
                rec = 'No hay tendencia a la discalculia, pero se presentan dificultades en el nivel, se recomienda reforzar';
            switch (nivel.nombre) {
                case "Nivel Espacial":
                    swal(nivel.nombre, `<b>Descripción:</b> Ayuda a identificar la ubicación entre su cuerpo y los objetos. <br>
                        <b>Correctas:</b> ` + bn[0] + "/5. <br>" + rec, "info");
                    break;
                case "Nivel Temporal":
                    swal(nivel.nombre, `<b>Descripción:</b> Sitúa sucesos en el pasado o en el futuro, proporcionándole así un 
                        horizonte temporal.<br> <b>Correctas:</b> ` + bn[1] + "/5. <br>" + rec, "info");
                    break;
                case "Nivel Simbolico":
                    swal(nivel.nombre, `<b>Descripción:</b> Representación de operaciones o relaciones entre números o valores 
                        por medio de imágenes. <br> <b>Correctas:</b> ` + bn[2] + "/5. <br>" + rec, "info");
                    break;
                case "Nivel Cognitivo":
                    swal(nivel.nombre, `<b>Descripción:</b> Permite captar, codificar, almacenar y trabajar la información con 
                        el fin de obtener algún producto mental. <br> <b>Correctas:</b> ` + bn[3] + "/5. <br>" + rec, "info");
                    break;
                default:
                    swal("Ups", "Ocurrió un error", "error");
                    break;
            }
        },
        detalleTotal: function () {
            swal("Desempeño General", "Puntaje: " + tot.toFixed(2) + ". Para un total de 20 actividades. <br>" + infoGeneral, "info");
        }
    },
    components: {
        'grafica-nivel': GraficaReporteNivel,
        'grafica-general': GraficaReporteGeneral
    }
};

/* Componente que muestra los reportes asociados a un estudiante específico */
var ReportesEstudiante = {
    template:
        `<div>
        <p class="title is-4">Reportes de {{ estudiante.nombre }}</p>
        <div class="columns">
            <div class="column is-one-third">
                <div class="box item-lista" v-for="(pr, index) in estudiante.pruebas" :key="pr.id" @click="generarReporte(pr)">
                    <p><strong>{{ index + 1 }}. Prueba finalizada en {{ pr.fechaFin }}</strong></p>
                </div>
                <button class="button is-info" @click="$emit(\'regresar\')">
                    <b-icon icon="arrow-left-thick"></b-icon><span>Regresar</span>
                </button>
                <p id="guiaResultados"><br>
                    <button class="button is-info" @click="descargarReporte()">
                        <b-icon icon="arrow-down-thick"></b-icon><span>Descargar</span>
                    </button>
                <br><b style="center">Guia de Resultados</b><br>
                    Puedes hacer clic en cada nivel para conocer el detalle de cuantas respuestas fueron correctas.
                    <ul>
                        <li><b>- Naranja:</b> Indica que tiene discalculia o tiende a tenerla</li>
                        <li><b>- Azul:</b> Tiene algunas dificultades pero no es propenso a tener discalculia</li>
                        <li><b>- Verde:</b> No tienen ninguna dificultad con las matemáticas.</li>
                    </ul>
                </p>
            </div>
            <div class="column">
                <detalle-reporte v-if="reporte" :reporte="reporte"></detalle-reporte>
                <section class="section" v-show="!reporte">
                    <div class="content has-text-grey has-text-centered">
                        <p><b-icon icon="information" size="is-large"></b-icon></p>
                        <p class="subtitle">Selecciona una prueba para ver su reporte asociado</p>
                    </div>
                </section>
            </div>
        </div>
    </div>`,
    data: function () {
        return {
            state: Store.state,
            reporte: null
        }
    },
    props: ['estudiante'],
    methods: {
        generarReporte: function (prueba) {
            this.$emit('cargando', true);
            var url = this.state.urls.consultarReporte;
            var params = {
                prueba: prueba.id
            };
            var v = this;
            axios.get(url, { params: params })
                .then(function (res) {
                    v.reporte = v.procesarReporte(res.data.reporte);
                }).catch(function (err) {
                    Utilidades.mostrarMensajeErrorAjax();
                }).finally(function () {
                    v.$emit('cargando', false);
                });
            var gr = document.getElementById('guiaResultados');
            gr.style.display = (gr.style.display == 'none') ? 'block' : 'block';
        },
        procesarReporte: function (puntajes) {
            var reporte = {
                niveles: [],
                cantActividades: 0,
                valorTotal: 0,
                tiempoTotal: 0,
                porcentajeTotal: 0
            };
            if (puntajes.length > 0) {
                var indice = 0;
                this.state.niveles.forEach(function (item) {
                    var nivel = {
                        id: item.id,
                        nombre: 'Nivel ' + item.nombre,
                        puntajes: [],
                        valor: 0,
                        tiempo: 0
                    };
                    for (var i = indice; i < puntajes.length; i++) {
                        var obj = puntajes[i];
                        if (obj.nivel_id == nivel.id) {
                            nivel.valor += obj.puntaje;
                            nivel.tiempo += obj.tiempo;
                            nivel.puntajes.push(obj);
                            reporte.cantActividades++;
                            // Como los puntajes vienen ordenados por nivel, se rompe el ciclo al cambiar de nivel_id
                            if (puntajes[i + 1] == undefined || puntajes[i + 1].nivel_id != obj.nivel_id) {
                                indice = i + 1;
                                break;
                            }
                        }

                    }
                    reporte.niveles.push(nivel);
                    reporte.valorTotal += nivel.valor;
                    reporte.tiempoTotal += nivel.tiempo;
                    switch (nivel.nombre) {
                        case "Nivel Espacial":
                            bn[0] = nivel.valor;
                            break;
                        case "Nivel Temporal":
                            bn[1] = nivel.valor;
                            break;
                        case "Nivel Simbolico":
                            bn[2] = nivel.valor;
                            break;
                        case "Nivel Cognitivo":
                            bn[3] = nivel.valor;
                            break;
                    }
                    tot = tot + nivel.valor;
                });
                reporte.porcentajePorNivel = reporte.niveles.length / reporte.cantActividades;
                reporte.porcentajeTotal = Utilidades.calcularNumeroConDecimales((reporte.valorTotal / reporte.cantActividades), 2);
                reporte.niveles.forEach(function (nivel) {
                    nivel.porcentaje = Utilidades.calcularNumeroConDecimales((nivel.valor / nivel.puntajes.length), 2);
                });
            }
            return reporte;
        },
        descargarReporte: function(){
            this.$emit('cargando', true);
            var url = this.state.urls.descargarReporte;
            return url;
        }
    },
    components: {
        'detalle-reporte': DetalleReporte
    }
};

/* Componente de la vista de reportes
 * Linea 972 <b-table-column label="Pruebas realizadas" centered>{{ props.row.pruebas.length }}</b-table-column>\ 
*/
Vue.component('vista-reportes', {
    template:
        '<div>\
            <div v-show="!seleccionado">\
                <div v-if="state.cantidad.reportes > 0">\
                    <p class="title">Reportes disponibles: {{ state.cantidad.reportes }}</p>\
                    <b-table :data="state.estudiantes" hoverable v-if="cargado">\
                        <template slot-scope="props">\
                            <b-table-column label="Nombre">{{ props.row.nombre }}</b-table-column>\
                            <b-table-column label="Usuario"><code>{{ props.row.usuario }}</code></b-table-column>\
                            <b-table-column label="Grado" centered>{{ props.row.grado.nombre }}</b-table-column>\
                            <b-table-column label="Ver" width="30" centered><button class="button is-small is-info" @click="seleccionar(props.row)"><b-icon icon="account-search"></b-icon></button></b-table-column>\
                        </template>\
                    </b-table>\
                </div>\
                <div v-else>\
                    <section class="section">\
                        <div class="content has-text-grey has-text-centered">\
                            <p><b-icon icon="emoticon-sad" size="is-large"></b-icon></p>\
                            <p class="subtitle">No tienes reportes disponibles. Recuerda calificar las actividades realizadas por los estudiantes para poder generar reportes.</p>\
                        </div>\
                    </section>\
                </div>\
            </div>\
            <reportes-estudiante v-if="seleccionado" :estudiante="seleccionado" @regresar="deseleccionar"></reportes-estudiante>\
        </div>',
    data: function () {
        return {
            state: Store.state,
            seleccionado: null,
            cargado: false
        }
    },
    methods: {
        cargarEstudiantes: function () {
            this.$emit('cargando', true);
            var url = this.state.urls.estudiantes;
            var params = {
                tipo: 'reports'
            };
            var v = this;
            axios.get(url, { params: params })
                .then(function (res) {
                    Store.setReportes(res.data.estudiantes);
                }).catch(function (err) {
                    Utilidades.mostrarMensajeErrorAjax();
                }).finally(function () {
                    v.cargado = true;
                    v.$emit('cargando', false);
                });
        },
        seleccionar: function (estudiante) {
            this.seleccionado = estudiante;
        },
        deseleccionar: function () {
            this.seleccionado = null;
        }
    },
    components: {
        'reportes-estudiante': ReportesEstudiante
    },
    created: function () {
        this.cargarEstudiantes();
    }
});

var vm = new Vue({
    el: '#app',
    data: function () {
        return {
            vistaActual: 'Estudiantes',
            vistas: [
                { nombre: 'Estudiantes', icono: 'account-multiple' },
                { nombre: 'Calificaciones', icono: 'clipboard-text' },
                { nombre: 'Reportes', icono: 'file-chart' }
            ],
            navMovilActivo: false,
            cargaInicial: false,
            componenteCargado: false
        }
    },
    computed: {
        componenteVistaActual: function () {
            return 'vista-' + this.vistaActual.toLowerCase()
        }
    },
    methods: {
        toggleNavMovil: function () {
            this.navMovilActivo = !this.navMovilActivo;
        },
        cargandoComponente: function (estado) {
            this.componenteCargado = estado;
        }
    },
    beforeMount: function () {
        var datos = JSON.parse(this.$el.attributes['data-info'].value);
        console.log(datos);
        Store.setGrados(datos.grados);
        Store.setNiveles(datos.niveles);
        Store.setCantidades(datos.cantidades);
        Store.setUrls(datos.urls);
    },
    mounted: function () {
        Store.setCamposCsrf(this.$refs.csrfname, this.$refs.csrfvalue);
        this.cargaInicial = true;
    }
});