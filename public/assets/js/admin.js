Vue.use(Buefy.default);

/* Store global para almacenar datos que se utilizan en diferentes componentes de la aplicación */
var Store = {
    state: {
        grados: [],
        niveles: [],
        institucion: [],
        categorias: [],
        habilidades: [],
        cantidad: {
            actividades: 0,
            actividadesPrevias: 0,
            estudiantes: 0,
            docentes: 0,
            instituciones: 0
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
            actividades: '',
            actividadesPrevias: '',
            cargarActividad: '',
            cargarActividadPrevia: '',
            editarActividad: '',
            editarActividadPrevia: '',
            categoriasHabilidades: '',
            crearCategoria: '',
            crearHabilidad: '',
            instituciones: ''
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
    setCategorias: function (categorias) {
        this.state.categorias = [];
        if (categorias.length > 0) {
            for (i in categorias) {
                this.state.categorias.push(categorias[i]);
            }
        }
    },
    getCategorias: function (nivel = null) {
        if (nivel) {
            return this.state.categorias.filter(function (categoria) {
                return categoria.nivelId == nivel
            });
        } else {
            return this.state.categorias;
        }
    },
    addCategoria: function (categoria) {
        this.state.categorias.push(categoria);
    },
    setHabilidades: function (habilidades) {
        this.state.habilidades = [];
        if (habilidades.length > 0) {
            for (i in habilidades) {
                habilidades[i].esFuncion = (habilidades[i].esFuncion == "0") ? false : true;
                this.state.habilidades.push(habilidades[i]);
            }
        }
    },
    addHabilidad: function (habilidad) {
        this.state.habilidades.push(habilidad);
    },
    setInstituciones: function (institucion) {
        this.state.institucion = [];
        if (institucion.length > 0) {
            for (i in institucion) {
                this.state.institucion.push(institucion[i]);
            }
        }
    },
    setCantidades: function (cantidades) {
        this.state.cantidad.actividades = cantidades.actividades;
        this.state.cantidad.actividadesPrevias = cantidades.actividadesPrevias;
        this.state.cantidad.estudiantes = cantidades.estudiantes;
        this.state.cantidad.docentes = cantidades.docentes;
        this.state.cantidad.instituciones = cantidades.instituciones;
    },
    addCantidadActividades: function () {
        this.state.cantidad.actividades++;
    },
    addCantidadActividadesPrevias: function () {
        this.state.cantidad.actividadesPrevias++;
    },

    setCamposCsrf: function (nameEl, valueEl) {
        this.state.csrf.name.name = nameEl.name;
        this.state.csrf.name.value = nameEl.value;
        this.state.csrf.value.name = valueEl.name;
        this.state.csrf.value.value = valueEl.value;
    },
    setUrls: function (urls) {
        this.state.urls.actividades = urls.actividades;
        this.state.urls.actividadesPrevias = urls.actividadesPrevias;
        this.state.urls.cargarActividad = urls.cargarActividad;
        this.state.urls.cargarActividadPrevia = urls.cargarActividadPrevia;
        this.state.urls.editarActividad = urls.editarActividad;
        this.state.urls.editarActividadPrevia = urls.editarActividadPrevia;
        this.state.urls.categoriasHabilidades = urls.categoriasHabilidades;
        this.state.urls.crearCategoria = urls.crearCategoria;
        this.state.urls.crearHabilidad = urls.crearHabilidad;
    },
    crearObjetoGrado: function (gradoId) {
        return this.state.grados.find(function (gr) {
            return gr.id == gradoId
        });
    },
    crearObjetoNivel: function (nivelId) {
        return this.state.niveles.find(function (nv) {
            return nv.id == nivelId
        });
    },
    crearObjetoTipo: function (tipo) {
        obj = {
            codigo: tipo,
            texto: '',
            clase: '',
            valor: 0
        };
        switch (tipo) {
            case Utilidades.actividades.tipos.AUTOMATICA.codigo:
                obj.clase = 'is-info';
                obj.texto = Utilidades.actividades.tipos.AUTOMATICA.texto;
                obj.valor = 1;
                break;
            case Utilidades.actividades.tipos.MANUAL.codigo:
                obj.clase = 'is-warning';
                obj.texto = Utilidades.actividades.tipos.MANUAL.texto;
                obj.valor = 2;
        }
        return obj;
    },
    crearObjetoEstado: function (estado) {
        obj = {
            codigo: estado,
            texto: '',
            clase: '',
            valor: 0
        };
        switch (estado) {
            case Utilidades.actividades.estados.ACTIVA.codigo:
                obj.clase = 'is-success';
                obj.texto = Utilidades.actividades.estados.ACTIVA.texto;
                obj.valor = 1;
                break;
            case Utilidades.actividades.estados.INACTIVA.codigo:
                obj.clase = 'is-danger';
                obj.texto = Utilidades.actividades.estados.INACTIVA.texto;
                obj.valor = 2;
        }
        return obj;
    }
};

/* Componente de la vista de inicio */
Vue.component('vista-inicio', {
    template:
        '<div>\
            <div class="columns is-multiline">\
                <div class="column is-12-tablet is-6-desktop is-3-widescreen">\
                    <div class="notification is-warning has-text-centered">\
                        <p class="title is-1">{{ state.cantidad.estudiantes }}</p>\
                        <b-icon icon="account-multiple" custom-size="mdi-48px"></b-icon>\
                        <p class="subtitle is-4">Estudiantes</p>\
                    </div>\
                </div>\
                <div class="column is-12-tablet is-6-desktop is-3-widescreen">\
                    <div class="notification is-info has-text-centered">\
                        <p class="title is-1">{{ state.cantidad.docentes }}</p>\
                        <b-icon icon="account" custom-size="mdi-48px"></b-icon>\
                        <p class="subtitle is-4">Docentes</p>\
                    </div>\
                </div>\
                <div class="column is-12-tablet is-6-desktop is-3-widescreen">\
                    <div class="notification is-primary has-text-centered">\
                        <p class="title is-1">{{ state.cantidad.instituciones }}</p>\
                        <b-icon icon="school" custom-size="mdi-48px"></b-icon>\
                        <p class="subtitle is-4">Instituciones</p>\
                    </div>\
                </div>\
                <div class="column is-12-tablet is-6-desktop is-3-widescreen">\
                    <div class="notification is-success has-text-centered">\
                        <p class="title is-1">{{ state.cantidad.actividades }}</p>\
                        <b-icon icon="shape-plus" custom-size="mdi-48px"></b-icon>\
                        <p class="subtitle is-4">Actividades</p>\
                    </div>\
                </div>\
                <div class="column is-12-tablet is-6-desktop is-3-widescreen">\
                    <div class="notification is-success has-text-centered">\
                        <p class="title is-1">{{ state.institucion }}</p>\
                        <b-icon icon="shape-plus" custom-size="mdi-48px"></b-icon>\
                        <p class="subtitle is-4">Actividades</p>\
                    </div>\
                </div>\
            </div>\
        </div>',
    data: function () {
        return {
            state: Store.state
        }
    }
});

/* Componente del formulario para cargar actividades normales */
var FormCargarActividad = {
    template:
        '<div class="modal-card">\
            <header class="modal-card-head has-text-centered">\
                <p class="modal-card-title">Cargar actividad</p>\
            </header>\
            <section class="modal-card-body">\
                <form @submit.prevent="cargar">\
                    <div class="columns">\
                        <div class="column">\
                            <b-field label="Nombre" :type="errores.nombre ? \'is-danger\':\'\'" :message="errores.nombre">\
                                <b-input type="text" v-model="form.nombre" maxlength="100"></b-input>\
                            </b-field>\
                        </div>\
                        <div class="column">\
                        <b-field label="Instrucción" :type="errores.instruccion ? \'is-danger\':\'\'" :message="errores.instruccion">\
                            <b-input type="text" v-model="form.instruccion" maxlength="150"></b-input>\
                        </b-field>\
                        </div>\
                    </div>\
                    <div class="columns">\
                        <div class="column">\
                            <b-field label="Descripción" :type="errores.descripcion ? \'is-danger\':\'\'" :message="errores.descripcion">\
                                <b-input type="textarea" v-model="form.descripcion" maxlength="500"></b-input>\
                            </b-field>\
                        </div>\
                    </div>\
                    <div class="columns">\
                        <div class="column">\
                            <b-field label="Grado" :type="errores.grado ? \'is-danger\':\'\'" :message="errores.grado">\
                                <b-select v-model="form.grado" expanded>\
                                    <option value="-1" disabled>Selecciona un grado</option>\
                                    <option v-for="gr in state.grados" :key="gr.id" :value="gr.id">{{ gr.nombre }}</option>\
                                </b-select>\
                            </b-field>\
                        </div>\
                        <div class="column">\
                            <b-field label="Nivel" :type="errores.nivel ? \'is-danger\':\'\'" :message="errores.nivel">\
                                <b-select v-model="form.nivel" @input="obtenerCategorias" expanded>\
                                    <option value="-1" disabled>Selecciona un nivel</option>\
                                    <option v-for="nv in state.niveles" :key="nv.id" :value="nv.id">{{ nv.nombre }}</option>\
                                </b-select>\
                            </b-field>\
                        </div>\
                    </div>\
                    <div class="columns">\
                        <div class="column">\
                            <b-field v-if="categorias.length > 0" label="Categoria" :type="errores.categoria ? \'is-danger\':\'\'" :message="errores.categoria">\
                                <b-select v-model="form.categoria" expanded>\
                                    <option value="-1" disabled>Selecciona una categoria</option>\
                                    <option v-for="cat in categorias" :key="cat.id" :value="cat.id">{{ cat.nombre }}</option>\
                                </b-select>\
                            </b-field>\
                        </div>\
                        <div class="column">\
                            <b-tooltip label="Usa la tecla CTRL para elegir varias opciones" type="is-dark" position="is-top" animated>\
                            <b-field label="Habilidades" :type="errores.habilidades ? \'is-danger\':\'\'" :message="errores.habilidades">\
                                <b-select v-model="form.habilidades" multiple native-size="3" expanded>\
                                    <option v-for="hab in state.habilidades" :key="hab.id" :value="hab.id">{{ hab.nombre }}</option>\
                                </b-select>\
                            </b-field>\
                            </b-tooltip>\
                        </div>\
                    </div>\
                    <div class="columns is-multiline">\
                        <div class="column">\
                            <b-field class="file" :type="errores.archivo ? \'is-danger\':\'\'" :message="errores.archivo">\
                                <b-upload v-model="form.archivo" @input="validarArchivoActividad($event)">\
                                    <a class="button is-primary">\
                                        <b-icon icon="upload"></b-icon>\
                                        <span>Subir archivo</span>\
                                    </a>\
                                </b-upload>\
                                <span class="file-name" v-if="form.archivo && form.archivo.length">\
                                    {{ form.archivo[0].name }}\
                                </span>\
                            </b-field>\
                        </div>\
                        <div class="column">\
                            <b-field label="Tipo de revisión" :type="errores.tipoRevision ? \'is-danger\':\'\'" :message="errores.tipoRevision"></b-field>\
                            <b-field>\
                                <b-radio v-model="form.tipoRevision" native-value="1">Automática</b-radio>\
                                <b-radio v-model="form.tipoRevision" native-value="2">Manual</b-radio>\
                            </b-field>\
                        </div>\
                    </div>\
                    <div class="buttons is-centered">\
                        <button type="button" class="button" @click="$parent.close()">Cerrar</button>\
                        <button type="submit" class="button is-success" :class="{\'is-loading\': cargando}">\
                            <b-icon icon="cloud-upload"></b-icon>\
                            <span>Cargar actividad</span>\
                        </button>\
                    </div>\
                </form>\
            </section>\
        </div>',
    data: function () {
        return {
            state: Store.state,
            categorias: [],
            form: {
                nombre: '',
                descripcion: '',
                instruccion: '',
                grado: -1,
                nivel: -1,
                categoria: -1,
                habilidades: [],
                archivo: [],
                tipoRevision: 1
            },
            errores: {
                nombre: '',
                descripcion: '',
                instruccion: '',
                grado: '',
                nivel: '',
                categoria: '',
                habilidades: '',
                archivo: '',
                tipoRevision: ''
            },
            cargando: false
        }
    },
    methods: {
        cargar: function () {
            if (this.validarCampos()) {
                this.cargando = true;
                var url = this.state.urls.cargarActividad;
                var datos = new FormData();
                datos.append('archivo', this.form.archivo[0]);
                datos.append('nombre', this.form.nombre);
                datos.append('descripcion', this.form.descripcion);
                datos.append('instruccion', this.form.instruccion);
                datos.append('grado', this.form.grado);
                datos.append('nivel', this.form.nivel);
                datos.append('categoria', this.form.categoria);
                datos.append('habilidades', this.form.habilidades);
                datos.append('revision', this.form.tipoRevision);
                datos.append(this.state.csrf.name.name, this.state.csrf.name.value);
                datos.append(this.state.csrf.value.name, this.state.csrf.value.value);
                var v = this;
                axios.post(url, datos, { headers: { 'Content-Type': 'multipart/form-data' } })
                    .then(function (res) {
                        if (res.data.respuesta) {
                            var respuesta = res.data.respuesta;
                            if (respuesta.actividad) {
                                var nueva = {
                                    id: respuesta.actividad.id,
                                    nombre: v.form.nombre,
                                    instruccion: v.form.instruccion,
                                    descripcion: v.form.descripcion,
                                    gradoId: v.form.grado,
                                    nivelId: v.form.nivel,
                                    categoriaId: v.form.categoria,
                                    habilidades: v.form.habilidades,
                                    rutaArchivo: respuesta.actividad.rutaArchivo,
                                    tipoRevision: respuesta.actividad.tipoRevision,
                                    estado: respuesta.actividad.estado,
                                    fechaCreacion: respuesta.actividad.fechaCreacion,
                                };
                                v.$emit('actividadCargada', nueva);
                                v.reiniciarCampos();
                                v.$toast.open({
                                    duration: 3000,
                                    message: 'La actividad se ha cargado con éxito',
                                    position: 'is-top',
                                    type: 'is-dark'
                                });
                            } else if (respuesta.errores) {
                                if (respuesta.errores.grado) v.errores.grado = respuesta.errores.grado;
                                if (respuesta.errores.nivel) v.errores.nivel = respuesta.errores.nivel;
                                if (respuesta.errores.archivo) {
                                    swal({
                                        type: 'warning',
                                        title: 'Advertencia',
                                        text: respuesta.errores.archivo
                                    });
                                }
                            }
                        } else if (res.data.errores) {
                            var errores = res.data.errores;
                            if (errores.nombre) v.errores.nombre = errores.nombre[0];
                            if (errores.descripcion) v.errores.descripcion = errores.descripcion[0];
                            if (errores.instruccion) v.errores.instruccion = errores.instruccion[0];
                            if (errores.grado) v.errores.grado = errores.grado[0];
                            if (errores.nivel) v.errores.nivel = errores.nivel[0];
                            if (errores.categoria) v.errores.categoria = errores.categoria[0];
                            if (errores.habilidades) v.errores.habilidades = errores.habilidades[0];
                            if (errores.archivo) v.errores.archivo = errores.archivo[0];
                            if (errores.revision) v.errores.revision = errores.revision[0];
                        }
                    }).catch(function (err) {
                        Utilidades.mostrarMensajeErrorAjax();
                    }).finally(function () {
                        v.cargando = false;
                    });
            }
        },
        obtenerCategorias: function () {
            this.categorias = Store.getCategorias(this.form.nivel);
            this.form.categoria = -1;
        },
        validarArchivoActividad: function (archivo) {
            if (!Utilidades.validarArchivoActividad(archivo[0].type)) {
                this.form.archivo = [];
            }
        },
        validarCampos: function () {
            this.reiniciarErrores();
            var vacio = 'Este campo es obligatorio';
            if (!this.form.nombre) {
                this.errores.nombre = vacio;
            }
            if (!this.form.descripcion) {
                this.errores.descripcion = vacio;
            }
            if (!this.form.instruccion) {
                this.errores.instruccion = vacio;
            }
            if (!this.form.grado || this.form.grado == -1) {
                this.errores.grado = vacio;
            }
            if (!this.form.nivel || this.form.nivel == -1) {
                this.errores.nivel = vacio;
            }
            if (!this.form.categoria || this.form.categoria == -1) {
                this.errores.categoria = vacio;
            }
            if (!this.form.habilidades || this.form.habilidades.length == 0) {
                this.errores.habilidades = vacio;
            }
            if (!this.form.archivo || this.form.archivo.length == 0) {
                this.errores.archivo = 'Por favor selecciona un archivo';
            }
            if (!this.form.tipoRevision) {
                this.errores.tipoRevision = vacio;
            }

            if (Utilidades.objetoTienePropiedadValida(this.errores)) {
                return false;
            }
            return true;
        },
        reiniciarCampos: function () {
            this.categorias = [];
            this.form = {
                nombre: '',
                descripcion: '',
                instruccion: '',
                grado: -1,
                nivel: -1,
                categoria: -1,
                habilidades: [],
                archivo: [],
                tipoRevision: 1
            };
        },
        reiniciarErrores: function () {
            this.errores = {
                nombre: '',
                descripcion: '',
                instruccion: '',
                grado: '',
                nivel: '',
                categoria: '',
                habilidades: '',
                archivo: '',
                tipoRevision: ''
            };
        }
    }

};

/* Componente del formulario para cargar actividades previas */
var FormCargarActividadPrevia = {
    template:
        '<div class="modal-card">\
            <header class="modal-card-head has-text-centered">\
                <p class="modal-card-title">Cargar actividad previa</p>\
            </header>\
            <section class="modal-card-body">\
                <form @submit.prevent="cargar">\
                    <div class="columns">\
                        <div class="column">\
                            <b-field label="Nombre" :type="errores.nombre ? \'is-danger\':\'\'" :message="errores.nombre">\
                                <b-input type="text" v-model="form.nombre" maxlength="100"></b-input>\
                            </b-field>\
                        </div>\
                        <div class="column">\
                        <b-field label="Instrucción" :type="errores.instruccion ? \'is-danger\':\'\'" :message="errores.instruccion">\
                            <b-input type="text" v-model="form.instruccion" maxlength="150"></b-input>\
                        </b-field>\
                        </div>\
                    </div>\
                    <div class="columns">\
                        <div class="column">\
                            <b-field label="Descripción" :type="errores.descripcion ? \'is-danger\':\'\'" :message="errores.descripcion">\
                                <b-input type="textarea" v-model="form.descripcion" maxlength="500"></b-input>\
                            </b-field>\
                        </div>\
                    </div>\
                    <div class="columns">\
                        <div class="column">\
                            <b-field class="file" :type="errores.archivo ? \'is-danger\':\'\'" :message="errores.archivo">\
                                <b-upload v-model="form.archivo" @input="validarArchivoActividad($event)">\
                                    <a class="button is-primary">\
                                        <b-icon icon="upload"></b-icon>\
                                        <span>Subir archivo</span>\
                                    </a>\
                                </b-upload>\
                                <span class="file-name" v-if="form.archivo && form.archivo.length">\
                                    {{ form.archivo[0].name }}\
                                </span>\
                            </b-field>\
                        </div>\
                    </div>\
                    <div class="buttons is-centered">\
                        <button class="button" type="button" @click="$parent.close">Cerrar</button>\
                        <button type="submit" class="button is-success" :class="{\'is-loading\': cargando}">\
                            <b-icon icon="cloud-upload"></b-icon>\
                            <span>Cargar actividad previa</span>\
                        </button>\
                    </div>\
                </form>\
            </section>\
        </div>',
    data: function () {
        return {
            state: Store.state,
            form: {
                nombre: '',
                descripcion: '',
                instruccion: '',
                archivo: [],
            },
            errores: {
                nombre: '',
                descripcion: '',
                instruccion: '',
                archivo: '',
            },
            cargando: false
        }
    },
    methods: {
        cargar: function () {
            if (this.validarCampos()) {
                this.cargando = true;
                var url = this.state.urls.cargarActividadPrevia;
                var datos = new FormData();
                datos.append('archivo', this.form.archivo[0]);
                datos.append('nombre', this.form.nombre);
                datos.append('descripcion', this.form.descripcion);
                datos.append('instruccion', this.form.instruccion);
                datos.append(this.state.csrf.name.name, this.state.csrf.name.value);
                datos.append(this.state.csrf.value.name, this.state.csrf.value.value);
                var v = this;
                axios.post(url, datos, { headers: { 'Content-Type': 'multipart/form-data' } })
                    .then(function (res) {
                        if (res.data.respuesta) {
                            var respuesta = res.data.respuesta;
                            if (respuesta.actividad) {
                                var nueva = {
                                    id: respuesta.actividad.id,
                                    nombre: v.form.nombre,
                                    instruccion: v.form.instruccion,
                                    descripcion: v.form.descripcion,
                                    rutaArchivo: respuesta.actividad.rutaArchivo,
                                    estado: respuesta.actividad.estado,
                                    fechaCreacion: respuesta.actividad.fechaCreacion,
                                };
                                v.$emit('actividadCargada', nueva);
                                v.reiniciarCampos();
                                v.$toast.open({
                                    duration: 3000,
                                    message: 'La actividad se ha cargado con éxito',
                                    position: 'is-top',
                                    type: 'is-dark'
                                });
                            } else if (respuesta.errores.archivo) {
                                swal({
                                    type: 'warning',
                                    title: 'Advertencia',
                                    text: respuesta.errores.archivo
                                });
                            }
                        } else if (res.data.errores) {
                            var errores = res.data.errores;
                            if (errores.nombre) v.errores.nombre = errores.nombre[0];
                            if (errores.descripcion) v.errores.descripcion = errores.descripcion[0];
                            if (errores.instruccion) v.errores.instruccion = errores.instruccion[0];
                            if (errores.archivo) v.errores.archivo = errores.archivo[0];
                        }
                    }).catch(function (err) {
                        Utilidades.mostrarMensajeErrorAjax();
                    }).finally(function () {
                        v.cargando = false;
                    });
            }
        },
        validarArchivoActividad: function (archivo) {
            if (!Utilidades.validarArchivoActividad(archivo[0].type)) {
                this.form.archivo = [];
            }
        },
        validarCampos: function () {
            this.reiniciarErrores();
            var vacio = 'Este campo es obligatorio';
            if (!this.form.nombre) {
                this.errores.nombre = vacio;
            }
            if (!this.form.descripcion) {
                this.errores.descripcion = vacio;
            }
            if (!this.form.instruccion) {
                this.errores.instruccion = vacio;
            }
            if (!this.form.archivo || this.form.archivo.length == 0) {
                this.errores.archivo = 'Por favor selecciona un archivo';
            }

            if (Utilidades.objetoTienePropiedadValida(this.errores)) {
                return false;
            }
            return true;
        },
        reiniciarCampos: function () {
            this.categorias = [];
            this.form = {
                nombre: '',
                descripcion: '',
                instruccion: '',
                archivo: []
            };
        },
        reiniciarErrores: function () {
            this.errores = {
                nombre: '',
                descripcion: '',
                instruccion: '',
                archivo: ''
            };
        }
    }

};

Vue.component('paginacion-tabla', {
    template:
        '<div class="level paginacion-tabla">\
            <div class="level-left"></div>\
            <div clasS="level-right">\
                <div class="level-item">\
                    <div class="pagination">\
                        <ul class="pagination-list">\
                            <li v-if="inicial != pagina">\
                                <a class="pagination-link" @click="cambiarPagina(inicial)">{{ inicial }}</a>\
                            </li>\
                            <li v-if="anterior > inicial + 1">\
                                <span class="pagination-ellipsis">&hellip;</span>\
                            </li>\
                            <li v-if="anterior > inicial">\
                                <a class="pagination-link" @click="cambiarPagina(anterior)">{{ anterior }}</a>\
                            </li>\
                            <li>\
                                <a class="pagination-link is-current">{{ pagina }}</a>\
                            </li>\
                            <li v-if="siguiente < total">\
                                <a class="pagination-link" @click="cambiarPagina(siguiente)">{{ siguiente }}</a>\
                            </li>\
                            <li v-if="siguiente < total-1">\
                                <span class="pagination-ellipsis">&hellip;</span>\
                            </li>\
                            <li v-if="total != pagina">\
                                <a class="pagination-link" @click="cambiarPagina(total)">{{ total }}</a>\
                            </li>\
                        </ul>\
                    </div>\
                </div>\
            </div>\
        </div>',
    props: ['pagina', 'total'],
    data: function () {
        return {
            inicial: 1
        }
    },
    computed: {
        anterior: function () {
            return this.pagina - 1;
        },
        siguiente: function () {
            return this.pagina + 1;
        }
    },
    methods: {
        cambiarPagina: function (pagina) {
            this.$emit('cambiar', pagina);
        }
    }
});

/* Componente del formulario para editar actividades normales */
var FormEditarActividad = {
    template:
        '<form @submit.prevent="actualizar">\
                    <div class="columns">\
                        <div class="column">\
                            <b-field label="Nombre" :type="errores.nombre ? \'is-danger\':\'\'" :message="errores.nombre">\
                                <b-input type="text" v-model="nueva.nombre" maxlength="100"></b-input>\
                            </b-field>\
                        </div>\
                        <div class="column">\
                        <b-field label="Instrucción" :type="errores.instruccion ? \'is-danger\':\'\'" :message="errores.instruccion">\
                            <b-input type="text" v-model="nueva.instruccion" maxlength="150"></b-input>\
                        </b-field>\
                        </div>\
                    </div>\
                    <div class="columns">\
                        <div class="column">\
                            <b-field label="Descripción" :type="errores.descripcion ? \'is-danger\':\'\'" :message="errores.descripcion">\
                                <b-input type="textarea" v-model="nueva.descripcion" maxlength="500"></b-input>\
                            </b-field>\
                        </div>\
                    </div>\
                    <div class="columns">\
                        <div class="column">\
                            <b-field label="Grado" :type="errores.grado ? \'is-danger\':\'\'" :message="errores.grado">\
                                <b-select v-model="nueva.grado.id" expanded disabled>\
                                    <option value="-1" disabled>Selecciona un grado</option>\
                                    <option v-for="(gr, index) in state.grados" :key="index" :value="gr.id">{{ gr.nombre }}</option>\
                                </b-select>\
                            </b-field>\
                        </div>\
                        <div class="column">\
                            <b-field label="Nivel" :type="errores.nivel ? \'is-danger\':\'\'" :message="errores.nivel">\
                                <b-select v-model="nueva.nivel.id" @input="obtenerCategorias" expanded disabled>\
                                    <option value="-1" disabled>Selecciona un nivel</option>\
                                    <option v-for="(nv, index) in state.niveles" :key="index" :value="nv.id">{{ nv.nombre }}</option>\
                                </b-select>\
                            </b-field>\
                        </div>\
                    </div>\
                    <div class="columns">\
                        <div class="column">\
                            <b-field v-if="categorias.length > 0" label="Categoria" :type="errores.categoria ? \'is-danger\':\'\'" :message="errores.categoria">\
                                <b-select v-model="nueva.categoriaId" expanded>\
                                    <option value="-1" disabled>Selecciona una categoria</option>\
                                    <option v-for="cat in categorias" :key="cat.id" :value="cat.id">{{ cat.nombre }}</option>\
                                </b-select>\
                            </b-field>\
                        </div>\
                        <div class="column">\
                            <b-tooltip label="Usa la tecla CTRL para elegir varias opciones" type="is-dark" position="is-top" animated>\
                            <b-field label="Habilidades" :type="errores.habilidades ? \'is-danger\':\'\'" :message="errores.habilidades">\
                                <b-select v-model="nueva.habilidades" multiple native-size="3" expanded>\
                                    <option v-for="hab in state.habilidades" :key="hab.id" :value="hab.id">{{ hab.nombre }}</option>\
                                </b-select>\
                            </b-field>\
                            </b-tooltip>\
                        </div>\
                    </div>\
                    <div class="columns is-mobile is-multiline">\
                        <div class="column">\
                            <b-field label="Tipo de revisión" :type="errores.tipoRevision ? \'is-danger\':\'\'" :message="errores.tipoRevision"></b-field>\
                            <b-field>\
                                <b-radio v-model="nueva.tipo.valor" native-value="1">Automática</b-radio>\
                                <b-radio v-model="nueva.tipo.valor" native-value="2">Manual</b-radio>\
                            </b-field>\
                        </div>\
                        <div class="column">\
                            <b-tooltip label="Las actividades inactivas no aparecen en las pruebas" type="is-dark" position="is-top" animated>\
                            <b-field label="Estado" :type="errores.estado ? \'is-danger\':\'\'" :message="errores.estado">\
                                <b-switch v-model="nueva.estado.valor" true-value="1" false-value="2" type="is-success">\
                                    {{ nueva.estado.valor == 1 ? "Activa" : "Inactiva" }}\
                                </b-switch>\
                            </b-field>\
                            </b-tooltip>\
                        </div>\
                    </div>\
                    <div class="columns is-multiline" v-if="false">\
                        <div class="column">\
                            <b-field class="file" :type="errores.archivo ? \'is-danger\':\'\'" :message="errores.archivo">\
                                <b-upload v-model="form.archivo" @input="validarArchivoActividad($event)">\
                                    <a class="button is-primary">\
                                        <b-icon icon="upload"></b-icon>\
                                        <span>Subir archivo</span>\
                                    </a>\
                                </b-upload>\
                                <span class="file-name" v-if="form.archivo && form.archivo.length">\
                                    {{ form.archivo[0].name }}\
                                </span>\
                            </b-field>\
                        </div>\
                    </div>\
                    <div class="buttons is-centered">\
                        <button type="button" class="button" @click="$emit(\'regresar\')">Cancelar</button>\
                        <button type="submit" class="button is-success" :class="{\'is-loading\': cargando}" :disabled="!editado">\
                            <b-icon icon="square-edit-outline"></b-icon>\
                            <span>Actualizar actividad</span>\
                        </button>\
                    </div>\
                </form>',
    data: function () {
        return {
            state: Store.state,
            categorias: [],
            nueva: JSON.parse(JSON.stringify(this.actividad)),
            form: {
                archivo: []
            },
            errores: {
                nombre: '',
                descripcion: '',
                instruccion: '',
                grado: '',
                nivel: '',
                categoria: '',
                habilidades: '',
                archivo: '',
                tipoRevision: '',
                estado: ''
            },
            editado: false,
            cargando: false
        }
    },
    props: ['actividad'],
    watch: {
        nueva: {
            handler: function (newVal, oldVal) {
                this.editado = true;
            },
            deep: true
        }
    },
    methods: {
        actualizar: function () {
            if (this.validarCampos()) {
                this.cargando = true;
                var url = this.state.urls.editarActividad;
                var datos = new FormData();
                /*datos.append('archivo', this.form.archivo[0]);
                datos.append('grado', this.nueva.gradoId);
                datos.append('nivel', this.nueva.nivelId);*/
                datos.append('id', this.nueva.id);
                datos.append('nombre', this.nueva.nombre);
                datos.append('descripcion', this.nueva.descripcion);
                datos.append('instruccion', this.nueva.instruccion);
                datos.append('categoria', this.nueva.categoriaId);
                datos.append('habilidades', this.nueva.habilidades);
                datos.append('revision', this.nueva.tipo.valor);
                datos.append('estado', this.nueva.estado.valor);
                datos.append(this.state.csrf.name.name, this.state.csrf.name.value);
                datos.append(this.state.csrf.value.name, this.state.csrf.value.value);
                var v = this;
                axios.post(url, datos, { headers: { 'Content-Type': 'multipart/form-data' } })
                    .then(function (res) {
                        if (res.data.respuesta) {
                            if (res.data.respuesta.actualizado) {
                                v.$toast.open({
                                    duration: 3000,
                                    message: 'La actividad se ha actualizado con éxito',
                                    position: 'is-top',
                                    type: 'is-dark'
                                });
                                v.actualizarEstadoActividad(
                                    res.data.respuesta.actividad.tipoRevision,
                                    res.data.respuesta.actividad.estado
                                );
                            } else {
                                swal({
                                    type: 'warning',
                                    title: 'Advertencia',
                                    text: 'No se pudo actualizar la actividad. Por favor vuelve a intentarlo'
                                });
                            }
                        } else if (res.data.errores) {
                            var errores = res.data.errores;
                            if (errores.nombre) v.errores.nombre = errores.nombre[0];
                            if (errores.descripcion) v.errores.descripcion = errores.descripcion[0];
                            if (errores.instruccion) v.errores.instruccion = errores.instruccion[0];
                            if (errores.grado) v.errores.grado = errores.grado[0];
                            if (errores.nivel) v.errores.nivel = errores.nivel[0];
                            if (errores.categoria) v.errores.categoria = errores.categoria[0];
                            if (errores.habilidades) v.errores.habilidades = errores.habilidades[0];
                            if (errores.archivo) v.errores.archivo = errores.archivo[0];
                            if (errores.revision) v.errores.revision = errores.revision[0];
                            if (errores.estado) v.errores.estado = errores.estado[0];
                        }
                    }).catch(function (err) {
                        Utilidades.mostrarMensajeErrorAjax();
                    }).finally(function () {
                        v.cargando = false;
                    });
            }
        },
        actualizarEstadoActividad: function (tipoRevision, estado) {
            this.actividad.nombre = this.nueva.nombre;
            this.actividad.descripcion = this.nueva.descripcion;
            this.actividad.instruccion = this.nueva.instruccion;
            this.actividad.categoriaId = this.nueva.categoriaId;
            this.actividad.habilidades = this.nueva.habilidades;
            this.actividad.tipo = Store.crearObjetoTipo(tipoRevision);
            this.actividad.estado = Store.crearObjetoEstado(estado);
        },
        obtenerCategorias: function (nivel, previo = false) {
            this.categorias = Store.getCategorias(this.nueva.nivel.id);
            if (!previo) this.nueva.categoriaId = -1;
        },
        validarArchivoActividad: function (archivo) {
            if (!Utilidades.validarArchivoActividad(archivo[0].type)) {
                this.form.archivo = [];
            }
        },
        validarCampos: function () {
            this.reiniciarErrores();
            var vacio = 'Este campo es obligatorio';
            if (!this.nueva.nombre) {
                this.errores.nombre = vacio;
            }
            if (!this.nueva.descripcion) {
                this.errores.descripcion = vacio;
            }
            if (!this.nueva.instruccion) {
                this.errores.instruccion = vacio;
            }
            if (!this.nueva.gradoId || this.nueva.gradoId == -1) {
                this.errores.grado = vacio;
            }
            if (!this.nueva.nivelId || this.nueva.nivelId == -1) {
                this.errores.nivel = vacio;
            }
            if (!this.nueva.categoriaId || this.nueva.categoriaId == -1) {
                this.errores.categoria = vacio;
            }
            if (!this.nueva.habilidades || this.nueva.habilidades.length == 0) {
                this.errores.habilidades = vacio;
            }
            /*if(!this.form.archivo || this.form.archivo.length == 0){
                this.errores.archivo = 'Por favor selecciona un archivo';
            }*/
            if (!this.nueva.tipo.valor) {
                this.errores.tipoRevision = vacio;
            }
            if (!this.nueva.estado.valor) {
                this.errores.estado = vacio;
            }

            if (Utilidades.objetoTienePropiedadValida(this.errores)) {
                return false;
            }
            return true;
        },
        reiniciarErrores: function () {
            this.errores = {
                nombre: '',
                descripcion: '',
                instruccion: '',
                grado: '',
                nivel: '',
                categoria: '',
                habilidades: '',
                archivo: '',
                tipoRevision: '',
                estado: ''
            };
        }
    },
    created: function () {
        if (this.nueva.nivel.id) this.obtenerCategorias(this.nueva.nivel.id, true);
    }

};

/* Componente que muestra el detalle de la actividad seleccionada */
var DetalleActividad = {
    template:
        '<div>\
            <div class="columns">\
                <div class="column">\
                    <div class="level">\
                        <div class="level-left">\
                            <div class="level-item">\
                                <p class="subtitle">{{ actividad.nombre }}</p>\
                            </div>\
                        </div>\
                        <div class="level-right">\
                            <div class="level-item">\
                                <button type="button" class="button is-info" @click="$emit(\'regresar\')">\
                                    <b-icon icon="arrow-left-thick"></b-icon><span>Regresar</span>\
                                </button>\
                            </div>\
                        </div>\
                    </div>\
                    <div class="box">\
                        <form-editar-actividad :actividad="actividad" @regresar="$emit(\'regresar\')"></form-editar-actividad>\
                    </div>\
                </div>\
                <div class="column">\
                    <div class="instruccion-actividad">\
                        <p class="subtitle">{{ actividad.instruccion }}</p>\
                    </div>\
                    <div class="contenedor-iframe">\
                        <iframe :src="actividad.rutaArchivo" width="650" height="450" ref="iframe"></iframe>\
                    </div>\
                </div>\
            </div>\
        </div>',
    props: ['actividad'],
    components: {
        'form-editar-actividad': FormEditarActividad
    },
    mounted: function () {
        this.$el.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }
};

/* Componente que muestra la lista de actividades normales */
var ActividadesNormales = {
    template:
        '<div>\
            <div v-show="!seleccion">\
            <div class="level">\
                <div class="level-left">\
                    <div class="level-item" v-if="state.cantidad.actividades > 0">\
                        <p class="title">{{ state.cantidad.actividades }} actividad<span v-show="state.cantidad.actividades > 1">es</span></p>\
                    </div>\
                    <div class="level-item">\
                        <b-field>\
                            <b-input v-model="tabla.busqueda" placeholder="Nombre o instrucción" type="search"></b-input>\
                            <p class="control">\
                                <button class="button is-dark"><b-icon icon="magnify"></b-icon></button>\
                            </p>\
                        </b-field>\
                    </div>\
                    <div class="level-item">\
                        <b-select v-model="tabla.grado" @input="filtrarTabla">\
                            <option value="-1">Todos los grados</option>\
                            <option v-for="(gr, index) in state.grados" :key="index" :value="gr.id">Grado {{ gr.nombre }}</option>\
                        </b-select>\
                    </div>\
                    <div class="level-item">\
                        <b-select v-model="tabla.nivel" @input="filtrarTabla">\
                            <option value="-1">Todos los niveles</option>\
                            <option v-for="(nv, index) in state.niveles" :key="index" :value="nv.id">Nivel {{ nv.nombre }}</option>\
                        </b-select>\
                    </div>\
                    <div class="level-item">\
                        <button class="button is-success" @click="abrirModalCargar">\
                            <b-icon icon="file-plus"></b-icon><span>Cargar actividad</span>\
                        </button>\
                    </div>\
                </div>\
                <div class="level-right">\
                    <div class="level-item">\
                        <button class="button is-info is-rounded" @click="$emit(\'cambiar\')">\
                            <b-icon :icon="vsindice == 1 ? \'arrow-right-bold\' : \'arrow-left-bold\'"></b-icon>\
                            <span>{{ vsnombre }}</span>\
                        </button>\
                    </div>\
                </div>\
            </div>\
            <div v-if="actividades.length > 0">\
                <b-table v-if="cargado" :data="actividades" :loading="tabla.cargando" hoverable>\
                    <template slot-scope="props">\
                        <b-table-column label="Nombre" field="nombre">{{ props.row.nombre }}</b-table-column>\
                        <b-table-column label="Grado" centered>{{ props.row.grado.nombre }}</b-table-column>\
                        <b-table-column label="Nivel" centered>{{ props.row.nivel.nombre }}</b-table-column>\
                        <b-table-column label="Instrucción">{{ props.row.instruccion }}</b-table-column>\
                        <b-table-column label="Revisión" centered><b-tag :type="props.row.tipo.clase">{{ props.row.tipo.texto }}</b-tag></b-table-column>\
                        <b-table-column label="Estado" centered><b-tag :type="props.row.estado.clase">{{ props.row.estado.texto }}</b-tag></b-table-column>\
                        <b-table-column label="Editar" width="30" centered><button class="button is-small is-primary" @click="seleccionar(props.row)"><b-icon icon="pencil"></b-icon></button></b-table-column>\
                    </template>\
                </b-table>\
                <paginacion-tabla :pagina="tabla.pagina" :total="tabla.paginas" @cambiar=cambiarPagina($event)></paginacion-tabla>\
            </div>\
            <div v-if="actividades.length == 0 && cargado">\
                <section class="section">\
                    <div class="content has-text-grey has-text-centered">\
                        <div v-show="tabla.busqueda.length == 0 && tabla.grado <= 0">\
                            <p><b-icon icon="emoticon-sad" size="is-large"></b-icon></p>\
                            <p class="subtitle">No hay actividades cargadas en la plataforma</p>\
                        </div>\
                        <div v-show="tabla.busqueda.length > 0 || tabla.grado > 0">\
                            <p><b-icon icon="help-circle" size="is-large"></b-icon></p>\
                            <p class="subtitle">No hay actividades que coincidan con la búsqueda</p>\
                        </div>\
                    </div>\
                </section>\
            </div>\
            <div v-if="actividadesNuevas.length > 0" class="contenedor-actividades-nuevas">\
                <div class="level is-mobile">\
                    <div class="level-left">\
                        <div class="level-item">\
                            <p class="title is-4">Actividades recién creadas</p>\
                        </div>\
                    </div>\
                </div>\
                <b-table :data="actividadesNuevas" hoverable>\
                    <template slot-scope="props">\
                        <b-table-column label="Nombre">{{ props.row.nombre }}</b-table-column>\
                        <b-table-column label="Grado" centered>{{ props.row.grado.nombre }}</b-table-column>\
                        <b-table-column label="Nivel" centered>{{ props.row.nivel.nombre }}</b-table-column>\
                        <b-table-column label="Instrucción">{{ props.row.instruccion }}</b-table-column>\
                        <b-table-column label="Revisión" centered><b-tag :type="props.row.tipo.clase">{{ props.row.tipo.texto }}</b-tag></b-table-column>\
                        <b-table-column label="Estado" centered><b-tag :type="props.row.estado.clase">{{ props.row.estado.texto }}</b-tag></b-table-column>\
                        <b-table-column label="Editar" width="30" centered><button class="button is-small is-primary" @click="seleccionar(props.row)"><b-icon icon="pencil"></b-icon></button></b-table-column>\
                    </template>\
                </b-table>\
            </div>\
            </div>\
            <div v-if="seleccion">\
                <detalle-actividad :actividad="seleccion" @regresar="deseleccionar"></detalle-actividad>\
            </div>\
        </div>',
    data: function () {
        return {
            state: Store.state,
            actividades: [],
            actividadesNuevas: [],
            tabla: {
                pagina: 1,
                porPagina: 15,
                paginas: 0,
                busqueda: '',
                grado: -1,
                nivel: -1,
                cargando: false
            },
            seleccion: null,
            cargado: false
        }
    },
    props: ['vsindice', 'vsnombre'],
    components: {
        'detalle-actividad': DetalleActividad
    },
    watch: {
        'tabla.busqueda': Utilidades.debounce(function () {
            this.cambiarPagina(1);
        }, 2000)
    },
    methods: {
        cargaInicial: function () {
            EventBus.$emit('cargando', true);
            var url = this.state.urls.categoriasHabilidades;
            var v = this;
            axios.get(url)
                .then(function (res) {
                    v.setActividades(res.data.actividades.actividades);
                    v.setDatosPaginacion(
                        1,
                        res.data.actividades.porPagina,
                        res.data.actividades.paginas
                    );
                    Store.setCategorias(res.data.categorias);
                    Store.setHabilidades(res.data.habilidades);
                }).catch(function (err) {
                    Utilidades.mostrarMensajeErrorAjax('Ha ocurrido un error al cargar las actividades, por favor recarga la página');
                }).finally(function () {
                    v.cargado = true;
                    EventBus.$emit('cargando', false);
                });
        },
        abrirModalCargar: function () {
            this.$modal.open({
                parent: this,
                component: FormCargarActividad,
                events: {
                    'actividadCargada': this.addActividadNueva
                },
                hasModalCard: true
            });
        },
        seleccionar: function (actividad) {
            this.seleccion = actividad;
            console.log(actividad.rutaArchivo);
        },
        deseleccionar: function () {
            this.seleccion = null;
        },
        filtrarTabla: function () {
            this.cambiarPagina(1);
        },
        setActividades: function (actividades) {
            this.actividades = [];
            if (actividades.length > 0) {
                for (i in actividades) {
                    actividades[i].grado = Store.crearObjetoGrado(actividades[i].gradoId);
                    actividades[i].nivel = Store.crearObjetoNivel(actividades[i].nivelId);
                    actividades[i].tipo = Store.crearObjetoTipo(actividades[i].tipoRevision);
                    actividades[i].estado = Store.crearObjetoEstado(actividades[i].estado);
                    this.actividades.push(actividades[i]);
                }
            }
        },
        addActividadNueva: function (actividad) {
            actividad.grado = Store.crearObjetoGrado(actividad.gradoId);
            actividad.nivel = Store.crearObjetoNivel(actividad.nivelId);
            actividad.tipo = Store.crearObjetoTipo(actividad.tipoRevision);
            actividad.estado = Store.crearObjetoEstado(actividad.estado);
            this.actividadesNuevas.push(actividad);
            Store.addCantidadActividades();
        },
        cambiarPagina: function (pagina) {
            this.tabla.cargando = true;
            var url = this.state.urls.actividades;
            var params = {
                pagina: pagina
            };
            if (this.tabla.busqueda.length > 0) params.buscar = this.tabla.busqueda;
            if (this.tabla.grado > 0) params.grado = this.tabla.grado;
            if (this.tabla.nivel > 0) params.nivel = this.tabla.nivel;
            var v = this;
            axios.get(url, { params: params })
                .then(function (res) {
                    v.setActividades(res.data.actividades);
                    v.setDatosPaginacion(
                        pagina,
                        res.data.porPagina,
                        res.data.paginas
                    );
                    v.$el.scrollIntoView({ block: 'start', behavior: 'smooth' });
                }).catch(function (err) {
                    Utilidades.mostrarMensajeErrorAjax('Ha ocurrido un error al consultar las actividades. Por favor, prueba con otro término de búsqueda');
                }).finally(function () {
                    v.tabla.cargando = false;
                });
        },
        setDatosPaginacion: function (pagina, porPagina, paginas) {
            this.tabla.pagina = pagina;
            this.tabla.porPagina = porPagina;
            this.tabla.paginas = paginas;
        }
    },
    created: function () {
        this.cargaInicial();
    },
};

/* Componente del formulario para editar actividades previas */
var FormEditarActividadPrevia = {
    template:
        '<form @submit.prevent="actualizar">\
                    <div class="columns">\
                        <div class="column">\
                            <b-field label="Nombre" :type="errores.nombre ? \'is-danger\':\'\'" :message="errores.nombre">\
                                <b-input type="text" v-model="nueva.nombre" maxlength="100"></b-input>\
                            </b-field>\
                        </div>\
                        <div class="column">\
                        <b-field label="Instrucción" :type="errores.instruccion ? \'is-danger\':\'\'" :message="errores.instruccion">\
                            <b-input type="text" v-model="nueva.instruccion" maxlength="150"></b-input>\
                        </b-field>\
                        </div>\
                    </div>\
                    <div class="columns">\
                        <div class="column">\
                            <b-field label="Descripción" :type="errores.descripcion ? \'is-danger\':\'\'" :message="errores.descripcion">\
                                <b-input type="textarea" v-model="nueva.descripcion" maxlength="500"></b-input>\
                            </b-field>\
                        </div>\
                    </div>\
                    <div class="columns">\
                        <div class="column">\
                            <b-tooltip label="Las actividades inactivas no aparecen en las pruebas" type="is-dark" position="is-top" animated>\
                            <b-field label="Estado" :type="errores.estado ? \'is-danger\':\'\'" :message="errores.estado">\
                                <b-switch v-model="nueva.estado.valor" true-value="1" false-value="2" type="is-success">\
                                    {{ nueva.estado.valor == 1 ? "Activa" : "Inactiva" }}\
                                </b-switch>\
                            </b-field>\
                            </b-tooltip>\
                        </div>\
                    </div>\
                    <div class="columns is-multiline" v-if="false">\
                        <div class="column">\
                            <b-field class="file" :type="errores.archivo ? \'is-danger\':\'\'" :message="errores.archivo">\
                                <b-upload v-model="form.archivo" @input="validarArchivoActividad($event)">\
                                    <a class="button is-primary">\
                                        <b-icon icon="upload"></b-icon>\
                                        <span>Subir archivo</span>\
                                    </a>\
                                </b-upload>\
                                <span class="file-name" v-if="form.archivo && form.archivo.length">\
                                    {{ form.archivo[0].name }}\
                                </span>\
                            </b-field>\
                        </div>\
                    </div>\
                    <div class="buttons is-centered">\
                        <button type="button" class="button" @click="$emit(\'regresar\')">Cancelar</button>\
                        <button type="submit" class="button is-success" :class="{\'is-loading\': cargando}" :disabled="!editado">\
                            <b-icon icon="square-edit-outline"></b-icon>\
                            <span>Actualizar actividad</span>\
                        </button>\
                    </div>\
                </form>',
    data: function () {
        return {
            state: Store.state,
            nueva: JSON.parse(JSON.stringify(this.actividad)),
            form: {
                archivo: []
            },
            errores: {
                nombre: '',
                descripcion: '',
                instruccion: '',
                archivo: '',
                estado: ''
            },
            editado: false,
            cargando: false
        }
    },
    props: ['actividad'],
    watch: {
        nueva: {
            handler: function (newVal, oldVal) {
                this.editado = true;
            },
            deep: true
        }
    },
    methods: {
        actualizar: function () {
            if (this.validarCampos()) {
                this.cargando = true;
                var url = this.state.urls.editarActividadPrevia;
                var datos = new FormData();
                /*datos.append('archivo', this.form.archivo[0]);
                datos.append('grado', this.nueva.gradoId);
                datos.append('nivel', this.nueva.nivelId);*/
                datos.append('id', this.nueva.id);
                datos.append('nombre', this.nueva.nombre);
                datos.append('descripcion', this.nueva.descripcion);
                datos.append('instruccion', this.nueva.instruccion);
                datos.append('estado', this.nueva.estado.valor);
                datos.append(this.state.csrf.name.name, this.state.csrf.name.value);
                datos.append(this.state.csrf.value.name, this.state.csrf.value.value);
                var v = this;
                axios.post(url, datos, { headers: { 'Content-Type': 'multipart/form-data' } })
                    .then(function (res) {
                        if (res.data.respuesta) {
                            if (res.data.respuesta.actualizado) {
                                v.$toast.open({
                                    duration: 3000,
                                    message: 'La actividad se ha actualizado con éxito',
                                    position: 'is-top',
                                    type: 'is-dark'
                                });
                                v.actualizarEstadoActividadPrevia(res.data.respuesta.actividad.estado);
                            } else {
                                swal({
                                    type: 'warning',
                                    title: 'Advertencia',
                                    text: 'No se pudo actualizar la actividad. Por favor vuelve a intentarlo'
                                });
                            }
                        } else if (res.data.errores) {
                            var errores = res.data.errores;
                            if (errores.nombre) v.errores.nombre = errores.nombre[0];
                            if (errores.descripcion) v.errores.descripcion = errores.descripcion[0];
                            if (errores.instruccion) v.errores.instruccion = errores.instruccion[0];
                            if (errores.archivo) v.errores.archivo = errores.archivo[0];
                            if (errores.estado) v.errores.estado = errores.estado[0];
                        }
                    }).catch(function (err) {
                        Utilidades.mostrarMensajeErrorAjax();
                    }).finally(function () {
                        v.cargando = false;
                    });
            }
        },
        actualizarEstadoActividadPrevia: function (estado) {
            this.actividad.nombre = this.nueva.nombre;
            this.actividad.descripcion = this.nueva.descripcion;
            this.actividad.instruccion = this.nueva.instruccion;
            this.actividad.estado = Store.crearObjetoEstado(estado);
        },
        validarArchivoActividad: function (archivo) {
            if (!Utilidades.validarArchivoActividad(archivo[0].type)) {
                this.form.archivo = [];
            }
        },
        validarCampos: function () {
            this.reiniciarErrores();
            var vacio = 'Este campo es obligatorio';
            if (!this.nueva.nombre) {
                this.errores.nombre = vacio;
            }
            if (!this.nueva.descripcion) {
                this.errores.descripcion = vacio;
            }
            if (!this.nueva.instruccion) {
                this.errores.instruccion = vacio;
            }
            /*if(!this.form.archivo || this.form.archivo.length == 0){
                this.errores.archivo = 'Por favor selecciona un archivo';
            }*/
            if (!this.nueva.estado.valor) {
                this.errores.estado = vacio;
            }

            if (Utilidades.objetoTienePropiedadValida(this.errores)) {
                return false;
            }
            return true;
        },
        reiniciarErrores: function () {
            this.errores = {
                nombre: '',
                descripcion: '',
                instruccion: '',
                archivo: '',
                estado: ''
            };
        }
    }
};

/* Componente que muestra el detalle de la actividad previa seleccionada */
var DetalleActividadPrevia = {
    template:
        '<div>\
            <div class="columns">\
                <div class="column">\
                    <div class="level">\
                        <div class="level-left">\
                            <div class="level-item">\
                                <p class="subtitle">{{ actividad.nombre }}</p>\
                            </div>\
                        </div>\
                        <div class="level-right">\
                            <div class="level-item">\
                                <button type="button" class="button is-info" @click="$emit(\'regresar\')">\
                                    <b-icon icon="arrow-left-thick"></b-icon><span>Regresar</span>\
                                </button>\
                            </div>\
                        </div>\
                    </div>\
                    <div class="box">\
                        <form-editar-actividad-previa :actividad="actividad" @regresar="$emit(\'regresar\')"></form-editar-actividad-previa>\
                    </div>\
                </div>\
                <div class="column">\
                    <div class="instruccion-actividad">\
                        <p class="subtitle">{{ actividad.instruccion }}</p>\
                    </div>\
                    <div class="contenedor-iframe">\
                        <iframe :src="actividad.rutaArchivo" width="650" height="450" ref="iframe"></iframe>\
                    </div>\
                </div>\
            </div>\
        </div>',
    props: ['actividad'],
    components: {
        'form-editar-actividad-previa': FormEditarActividadPrevia
    },
    mounted: function () {
        this.$el.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }
};

/* Componente que muestra la lista de actividades previas */
var ActividadesPrevias = {
    template:
        '<div>\
            <div v-show="!seleccion">\
            <div class="level">\
                <div class="level-left">\
                    <div class="level-item" v-if="state.cantidad.actividadesPrevias > 0">\
                        <p class="title">{{ titulo }}</p>\
                    </div>\
                    <div class="level-item">\
                        <b-field>\
                            <b-input v-model="tabla.busqueda" placeholder="Nombre o instrucción" type="search"></b-input>\
                            <p class="control">\
                                <button class="button is-dark"><b-icon icon="magnify"></b-icon></button>\
                            </p>\
                        </b-field>\
                    </div>\
                    <div class="level-item">\
                        <button class="button is-success" @click="abrirModalCargar">\
                            <b-icon icon="file-plus"></b-icon><span>Cargar actividad</span>\
                        </button>\
                    </div>\
                </div>\
                <div class="level-right">\
                    <div class="level-item">\
                        <button class="button is-info is-rounded" @click="$emit(\'cambiar\')">\
                            <b-icon :icon="vsindice == 1 ? \'arrow-right-bold\' : \'arrow-left-bold\'"></b-icon>\
                            <span>{{ vsnombre }}</span>\
                        </button>\
                    </div>\
                </div>\
            </div>\
            <div v-if="actividades.length > 0">\
                <b-table :data="actividades" :loading="tabla.cargando" hoverable v-if="cargado">\
                    <template slot-scope="props">\
                        <b-table-column label="Nombre">{{ props.row.nombre }}</b-table-column>\
                        <b-table-column label="Instrucción">{{ props.row.instruccion }}</b-table-column>\
                        <b-table-column label="Estado" centered><b-tag :type="props.row.estado.clase">{{ props.row.estado.texto }}</b-tag></b-table-column>\
                        <b-table-column label="Editar" width="30" centered><button class="button is-small is-primary" @click="seleccionar(props.row)"><b-icon icon="pencil"></b-icon></button></b-table-column>\
                    </template>\
                </b-table>\
                <paginacion-tabla :pagina="tabla.pagina" :total="tabla.paginas" @cambiar=cambiarPagina($event)></paginacion-tabla>\
            </div>\
            <div v-if="actividades.length == 0 && actividadesNuevas.length == 0 && cargado">\
                <section class="section">\
                    <div class="content has-text-grey has-text-centered">\
                        <div v-show="tabla.busqueda.length == 0">\
                            <p><b-icon icon="emoticon-sad" size="is-large"></b-icon></p>\
                            <p class="subtitle">No hay actividades previas cargadas en la plataforma</p>\
                        </div>\
                        <div v-show="tabla.busqueda.length > 0">\
                            <p><b-icon icon="help-circle" size="is-large"></b-icon></p>\
                            <p class="subtitle">No hay actividades previas que coincidan con la búsqueda</p>\
                        </div>\
                    </div>\
                </section>\
            </div>\
            <div v-if="actividadesNuevas.length > 0" class="contenedor-actividades-nuevas">\
                <div class="level is-mobile">\
                    <div class="level-left">\
                        <div class="level-item">\
                            <p class="title is-4">Actividades recién creadas</p>\
                        </div>\
                    </div>\
                </div>\
                <b-table :data="actividadesNuevas" hoverable>\
                    <template slot-scope="props">\
                        <b-table-column label="Nombre">{{ props.row.nombre }}</b-table-column>\
                        <b-table-column label="Instrucción">{{ props.row.instruccion }}</b-table-column>\
                        <b-table-column label="Estado" centered><b-tag :type="props.row.estado.clase">{{ props.row.estado.texto }}</b-tag></b-table-column>\
                        <b-table-column label="Editar" width="30" centered><button class="button is-small is-primary" @click="seleccionar(props.row)"><b-icon icon="pencil"></b-icon></button></b-table-column>\
                    </template>\
                </b-table>\
            </div>\
            </div>\
            <div v-if="seleccion">\
                <detalle-actividad-previa :actividad="seleccion" @regresar="deseleccionar"></detalle-actividad-previa>\
            </div>\
        </div>',
    data: function () {
        return {
            state: Store.state,
            actividades: [],
            actividadesNuevas: [],
            tabla: {
                pagina: 1,
                porPagina: 15,
                paginas: 0,
                busqueda: '',
                cargando: false
            },
            seleccion: null,
            cargado: false
        }
    },
    props: ['vsindice', 'vsnombre'],
    components: {
        'detalle-actividad-previa': DetalleActividadPrevia
    },
    watch: {
        'tabla.busqueda': Utilidades.debounce(function () {
            this.cambiarPagina(1);
        }, 2000)
    },
    computed: {
        titulo: function () {
            var texto1 = this.state.cantidad.actividadesPrevias + ' ' + 'actividad';
            var texto2 = ' previa';
            if (this.state.cantidad.actividadesPrevias > 1) {
                return texto1 + 'es' + texto2 + 's';
            }
            return texto1 + texto2;
        }
    },
    methods: {
        cargaInicial: function () {
            EventBus.$emit('cargando', true);
            var url = this.state.urls.actividadesPrevias;
            var v = this;
            axios.get(url)
                .then(function (res) {
                    v.setActividadesPrevias(res.data.actividades);
                    v.setDatosPaginacion(
                        1,
                        res.data.actividades.porPagina,
                        res.data.actividades.paginas
                    );
                }).catch(function (err) {
                    Utilidades.mostrarMensajeErrorAjax('Ha ocurrido un error al cargar las actividades previas, por favor recarga la página');
                }).finally(function () {
                    v.cargado = true;
                    EventBus.$emit('cargando', false);
                });
        },
        abrirModalCargar: function () {
            this.$modal.open({
                parent: this,
                component: FormCargarActividadPrevia,
                events: {
                    'actividadCargada': this.addActividadPrevia
                },
                hasModalCard: true
            });
        },
        seleccionar: function (actividad) {
            this.seleccion = actividad;
        },
        deseleccionar: function () {
            this.seleccion = null;
        },
        cambiarPagina: function (pagina) {
            this.tabla.cargando = true;
            var url = this.state.urls.actividadesPrevias;
            var params = {
                pagina: pagina
            };
            if (this.tabla.busqueda.length > 0) params.buscar = this.tabla.busqueda;
            var v = this;
            axios.get(url, { params: params })
                .then(function (res) {
                    v.setActividadesPrevias(res.data.actividades);
                    v.setDatosPaginacion(
                        pagina,
                        res.data.porPagina,
                        res.data.paginas
                    );
                    v.$el.scrollIntoView({ block: 'start', behavior: 'smooth' });
                }).catch(function (err) {
                    Utilidades.mostrarMensajeErrorAjax('Ha ocurrido un error al consultar las actividades. Por favor, prueba con otro término de búsqueda');
                }).finally(function () {
                    v.tabla.cargando = false;
                });
        },
        setActividadesPrevias: function (actividades) {
            this.actividades = [];
            if (actividades.length > 0) {
                for (i in actividades) {
                    actividades[i].estado = Store.crearObjetoEstado(actividades[i].estado);
                    this.actividades.push(actividades[i]);
                }
            }
        },
        addActividadPrevia: function (actividad) {
            actividad.estado = Store.crearObjetoEstado(actividad.estado);
            this.actividadesNuevas.push(actividad);
            Store.addCantidadActividadesPrevias();
        },
        setDatosPaginacion: function (pagina, porPagina, paginas) {
            this.tabla.pagina = pagina;
            this.tabla.porPagina = porPagina;
            this.tabla.paginas = paginas;
        }
    },
    created: function () {
        this.cargaInicial();
    },
};

/* Componente del menú de actividades */
var MenuActividades = {
    template:
        '<div>\
            <component :is="vistas[vistaActual].componente" v-bind="propiedadesComponente" @cambiar="cambiarVista"></component>\
        </div>\
        ',
    data: function () {
        return {
            state: Store.state,
            cargado: false,
            vistaActual: 0,
            vistaSiguiente: 1,
            vistas: [
                { nombre: 'Actividades normales', componente: 'actividades-normales' },
                { nombre: 'Actividades previas', componente: 'actividades-previas' }
            ]
        };
    },
    computed: {
        propiedadesComponente: function () {
            return { vsindice: this.vistaSiguiente, vsnombre: this.vistas[this.vistaSiguiente].nombre }
        }
    },
    methods: {
        cambiarVista: function () {
            if (this.vistaActual == 0) {
                this.vistaActual = 1;
                this.vistaSiguiente = 0;
            } else {
                this.vistaActual = 0;
                this.vistaSiguiente = 1;
            }
        }
    },
    components: {
        'actividades-normales': ActividadesNormales,
        'actividades-previas': ActividadesPrevias
    }
};

/* Componente del formulario para crear categorias */
var FormCrearCategoria = {
    template:
        '<form>\
            <div class="modal-card">\
                <header class="modal-card-head has-text-centered">\
                    <p class="modal-card-title">Crear categoria</p>\
                </header>\
                <section class="modal-card-body">\
                    <b-field>\
                        <b-input type="text" v-model="form.nivel" icon="cube-outline" disabled></b-input>\
                    </b-field>\
                    <b-field :type="errores.nombre ? \'is-danger\':\'\'" :message="errores.nombre">\
                        <b-input type="text" v-model="form.nombre" placeholder="Nombre de la categoría" icon="format-color-text" maxlength="50"></b-input>\
                    </b-field>\
                </section>\
                <footer class="modal-card-foot">\
                    <button class="button" type="button" @click="$parent.close()">Cerrar</button>\
                    <button class="button is-success" :class="{\'is-loading\': cargando}" @click.prevent="crear">Crear</button>\
                </footer>\
            </div>\
        </form>',
    data: function () {
        return {
            state: Store.state,
            form: {
                nivel: '',
                nombre: ''
            },
            errores: {
                nombre: ''
            },
            cargando: false
        }
    },
    props: ['nivel'],
    methods: {
        crear: function () {
            this.errores.nombre = '';
            if (!this.form.nombre) {
                this.errores.nombre = 'Este campo es obligatorio';
                return false;
            }
            this.cargando = true;
            var url = this.state.urls.crearCategoria;
            var datos = {
                'nivel': this.nivel.id,
                'nombre': this.form.nombre
            };
            datos[this.state.csrf.name.name] = this.state.csrf.name.value;
            datos[this.state.csrf.value.name] = this.state.csrf.value.value;
            var v = this;
            axios.post(url, datos)
                .then(function (res) {
                    if (res.data.respuesta) {
                        Store.addCategoria({
                            id: res.data.respuesta.categoria.id,
                            nivelId: datos.nivel,
                            nombre: datos.nombre
                        });
                        v.$emit('actualizar');
                        v.form.nombre = '';
                        v.$toast.open({
                            duration: 3000,
                            message: 'Categoria creada con éxito',
                            position: 'is-top',
                            type: 'is-dark'
                        });
                    } else if (res.data.errores) {
                        var errores = res.data.errores;
                        if (errores.nivel) v.errores.nivel = errores.nivel[0];
                        if (errores.nombre) v.errores.nombre = errores.nombre[0];
                    }
                }).catch(function (err) {
                    Utilidades.mostrarMensajeErrorAjax();
                }).finally(function () {
                    v.cargando = false;
                });
        }
    },
    mounted: function () {
        this.form.nivel = 'Nivel ' + this.nivel.nombre;
    }
};

/* Componente del formulario para crear habilidades */
var FormCrearHabilidad = {
    template:
        '<form>\
            <div class="modal-card">\
                <header class="modal-card-head has-text-centered">\
                    <p class="modal-card-title">Crear habilidad</p>\
                </header>\
                <section class="modal-card-body">\
                    <b-field :type="errores.nombre ? \'is-danger\':\'\'" :message="errores.nombre">\
                        <b-input type="text" v-model="form.nombre" placeholder="Nombre de la habilidad" icon="format-color-text" maxlength="50"></b-input>\
                    </b-field>\
                    <b-field label="¿Es una función?" :type="errores.funcion ? \'is-danger\':\'\'" :message="errores.funcion">\
                        <b-switch v-model="form.funcion" true-value="1" false-value="-1">{{ form.funcion == -1 ? "No" : "Si" }}</b-switch>\
                    </b-field>\
                </section>\
                <footer class="modal-card-foot">\
                    <button class="button" type="button" @click="$parent.close()">Cerrar</button>\
                    <button class="button is-success" :class="{\'is-loading\': cargando}" @click.prevent="crear">Crear</button>\
                </footer>\
            </div>\
        </form>',
    data: function () {
        return {
            state: Store.state,
            form: {
                nombre: '',
                funcion: -1
            },
            errores: {
                nombre: '',
                funcion: ''
            },
            cargando: false
        }
    },
    methods: {
        crear: function () {
            if (!this.validarCampos()) {
                return false;
            }
            this.cargando = true;
            var url = this.state.urls.crearHabilidad;
            var datos = {
                'nombre': this.form.nombre,
                'funcion': this.form.funcion
            };
            datos[this.state.csrf.name.name] = this.state.csrf.name.value;
            datos[this.state.csrf.value.name] = this.state.csrf.value.value;
            var v = this;
            axios.post(url, datos)
                .then(function (res) {
                    if (res.data.respuesta) {
                        Store.addHabilidad({
                            id: res.data.respuesta.habilidad.id,
                            nombre: datos.nombre,
                            esFuncion: (datos.funcion == -1) ? false : true
                        });
                        v.reiniciarCampos();
                        v.$toast.open({
                            duration: 3000,
                            message: 'Habilidad creada con éxito',
                            position: 'is-top',
                            type: 'is-dark'
                        });
                    } else if (res.data.errores) {
                        var errores = res.data.errores;
                        if (errores.nombre) v.errores.nombre = errores.nombre[0];
                        if (errores.funcion) v.errores.funcion = errores.funcion[0];
                    }
                }).catch(function (err) {
                    Utilidades.mostrarMensajeErrorAjax();
                }).finally(function () {
                    v.cargando = false;
                });
        },
        validarCampos: function () {
            this.reiniciarErrores();
            if (!this.form.nombre) {
                this.errores.nombre = 'Este campo es obligatorio';
            }
            if (this.form.funcion != 1 && this.form.funcion != -1) {
                this.errores.funcion = 'Este campo tiene un valor inválido'
            }

            if (Utilidades.objetoTienePropiedadValida(this.errores)) {
                return false;
            }
            return true;
        },
        reiniciarCampos: function () {
            this.form = {
                nombre: '',
                funcion: -1
            };
        },
        reiniciarErrores: function () {
            this.errores = {
                nombre: '',
                funcion: ''
            }
        }
    }
};

var MenuNiveles = {
    template:
        '<div>\
            <div class="columns">\
                <div class="column">\
                    <div class="level is-mobile">\
                        <div class="level-left">\
                            <div class="level-item">\
                                <p class="title">Categorias</p>\
                            </div>\
                            <div class="level-item">\
                                <b-select v-model="seleccionado" @input="seleccionarNivel">\
                                    <option value="-1" disabled>Selecciona un nivel</option>\
                                    <option v-for="(nv, index) in state.niveles" :key="index" :value="index">Nivel {{ nv.nombre }}</option>\
                                </b-select>\
                            </div>\
                            <div class="level-item" v-if="nivel">\
                                <button class="button is-success" @click="abrirModalCrearCategoria">\
                                    <b-icon icon="plus"></b-icon><span>Nueva categoria</span>\
                                </button>\
                            </div>\
                        </div>\
                    </div>\
                    <div v-if="categorias.length > 0">\
                        <b-table :data="categorias" hoverable :mobile-cards="false">\
                            <template slot-scope="props">\
                                <b-table-column label="Nombre">{{ props.row.nombre }}</b-table-column>\
                                <b-table-column label="Editar" width="30" centered><button class="button is-small is-primary" @click="editarCategoria(props.row)"><b-icon icon="pencil"></b-icon></button></b-table-column>\
                            </template>\
                        </b-table>\
                    </div>\
                    <div v-if="categorias.length == 0 && seleccionado != -1">\
                        <section class="section">\
                            <div class="content has-text-grey has-text-centered">\
                                <p><b-icon icon="alert-circle" size="is-large"></b-icon></p>\
                                <p class="subtitle">Este nivel no tiene categorias asociadas</p>\
                            </div>\
                        </section>\
                    </div>\
                </div>\
                <div class="column">\
                    <div class="level is-mobile">\
                        <div class="level-left">\
                            <div class="level-item">\
                                <p class="title">Habilidades</p>\
                            </div>\
                            <div class="level-item">\
                                <button class="button is-success" @click="abrirModalCrearHabilidad">\
                                    <b-icon icon="plus"></b-icon><span>Nueva habilidad</span>\
                                </button>\
                            </div>\
                        </div>\
                    </div>\
                    <div v-if="state.habilidades.length > 0">\
                        <b-table :data="state.habilidades" hoverable :mobile-cards="false">\
                            <template slot-scope="props">\
                                <b-table-column label="Nombre">{{ props.row.nombre }}</b-table-column>\
                                <b-table-column label="¿Es función?" centered> {{ props.row.esFuncion ? "Si" : "No" }}</b-table-column>\
                                <b-table-column label="Editar" width="30" centered><button class="button is-small is-primary" @click="editarHabilidad(props.row)"><b-icon icon="pencil"></b-icon></button></b-table-column>\
                            </template>\
                        </b-table>\
                    </div>\
                    <div v-else>\
                        <section class="section">\
                            <div class="content has-text-grey has-text-centered">\
                                <p><b-icon icon="alert-circle" size="is-large"></b-icon></p>\
                                <p class="subtitle">Aún no se han creado habilidades</p>\
                            </div>\
                        </section>\
                    </div>\
                </div>\
            </div>\
        </div>',
    data: function () {
        return {
            state: Store.state,
            seleccionado: -1,
            nivel: null,
            categorias: []
        }
    },
    methods: {
        seleccionarNivel: function () {
            this.nivel = Store.state.niveles[this.seleccionado];
            this.obtenerCategorias();
        },
        obtenerCategorias: function () {
            this.categorias = Store.getCategorias(this.nivel.id);
        },
        abrirModalCrearCategoria: function () {
            this.$modal.open({
                parent: this,
                component: FormCrearCategoria,
                props: {
                    'nivel': this.nivel
                },
                events: {
                    'actualizar': this.obtenerCategorias
                },
                hasModalCard: true
            });
        },
        abrirModalCrearHabilidad: function () {
            this.$modal.open({
                parent: this,
                component: FormCrearHabilidad,
                hasModalCard: true
            });
        },
        editarCategoria: function (categoria) {
            alert('editando: ' + categoria.nombre)
        },
        editarHabilidad: function (habilidad) {
            alert('editando: ' + habilidad.nombre)
        }
    }
};

/* Componente del formulario para ingresar nuevas instituciones */
/* var FormingresarInstitucion = {
    template:
        '<form>\
            <div class="modal-card">\
                <header class="modal-card-head has-text-centered">\
                    <p class="modal-card-title">Ingresar Institución</p>\
                </header>\
                <section class="modal-card-body">\
                    <b-field :type="errores.nombre ? \'is-danger\':\'\'" :message="errores.nombre">\
                        <b-input type="text" v-model="form.nombre" placeholder="Nombre de la institucion" icon="format-color-text" maxlength="50"></b-input>\
                    </b-field>\
                    <b-field :type="errores.departamento ? \'is-danger\':\'\'" :message="errores.departamento">\
                        <b-input type="text" v-model="form.departamento" placeholder="Departamento" icon="format-color-text" maxlength="50"></b-input>\
                    </b-field>\
                    <b-field :type="errores.ciudad ? \'is-danger\':\'\'" :message="errores.ciudad">\
                        <b-input type="text" v-model="form.ciudad" placeholder="Ciudad" icon="format-color-text" maxlength="50"></b-input>\
                    </b-field>\
                </section>\
                <footer class="modal-card-foot">\
                    <button class="button" type="button" @click="$parent.close()">Cerrar</button>\
                    <button class="button is-success" :class="{\'is-loading\': cargando}" @click.prevent="crear">Crear</button>\
                </footer>\
            </div>\
        </form>',
    data: function () {
        return {
            state: Store.state,
            form: {
                nombre: '',
                funcion: -1
            },
            errores: {
                nombre: '',
                funcion: ''
            },
            cargando: false
        }
    },
    methods: {
        crear: function () {
            if (!this.validarCampos()) {
                return false;
            }
            this.cargando = true;
            var url = this.state.urls.ingresarInstitucion;
            var datos = {
                'nombre': this.form.nombre,
                'departamento': this.form.departamento,
                'ciudad': this.form.ciudad
            };
            datos[this.state.csrf.name.name] = this.state.csrf.name.value;
            datos[this.state.csrf.value.name] = this.state.csrf.value.value;
            var v = this;
            axios.post(url, datos)
                .then(function (res) {
                    if (res.data.respuesta) {
                        Store.addHabilidad({
                            id: res.data.respuesta.habilidad.id,
                            nombre: datos.nombre,
                            esFuncion: (datos.funcion == -1) ? false : true
                        });
                        v.reiniciarCampos();
                        v.$toast.open({
                            duration: 3000,
                            message: 'Habilidad creada con éxito',
                            position: 'is-top',
                            type: 'is-dark'
                        });
                    } else if (res.data.errores) {
                        var errores = res.data.errores;
                        if (errores.nombre) v.errores.nombre = errores.nombre[0];
                        if (errores.funcion) v.errores.funcion = errores.funcion[0];
                    }
                }).catch(function (err) {
                    Utilidades.mostrarMensajeErrorAjax();
                }).finally(function () {
                    v.cargando = false;
                });
        },
        validarCampos: function () {
            this.reiniciarErrores();
            if (!this.form.nombre) {
                this.errores.nombre = 'Este campo es obligatorio';
            }
            if (this.form.funcion != 1 && this.form.funcion != -1) {
                this.errores.funcion = 'Este campo tiene un valor inválido'
            }

            if (Utilidades.objetoTienePropiedadValida(this.errores)) {
                return false;
            }
            return true;
        },
        reiniciarCampos: function () {
            this.form = {
                nombre: '',
                funcion: -1
            };
        },
        reiniciarErrores: function () {
            this.errores = {
                nombre: '',
                funcion: ''
            }
        }
    }
}; */

/* Componente del menú de instituciones */
var MenuInstituciones = {
    template: '<div>\
    <div class="columns">\
        <div class="column">\
            <div class="level is-mobile">\
                <div class="level-left">\
                    <div class="level-item" v-show="state.cantidad.instituciones > 0">\
                        <p class="title">{{ state.cantidad.instituciones }} Institucion<span v-show="state.cantidad.instituciones > 1">es</span></p>\
                    </div>\
                </div>\
            </div>\
            <div v-if="state.cantidad.instituciones > 0">\
                <b-table :data="state.institucion" hoverable v-if="cargado">\
                    <template slot-scope="props">\
                        <b-table-column label="Nombre">{{ props.row.nombre }}</b-table-column>\
                        <b-table-column label="Departamento">{{ props.row.departamento }}</b-table-column>\
                        <b-table-column label="Ciudad">{{ props.row.ciudad }}</b-table-column>\
                    </template>\
                </b-table>\
            </div>\
            <div v-else>\
                <section class="section">\
                    <div class="content has-text-grey has-text-centered">\
                        <p><b-icon icon="alert-circle" size="is-large"></b-icon></p>\
                        <p class="subtitle">Aún no se han ingresado instituciones</p>\
                    </div>\
                </section>\
            </div>\
        </div>\
    </div>\
</div>',
    data: function () {
        return {
            state: Store.state,
            institucion: [],
            cargado: true,
        }
    },
    methods: {
        abrirModalInstitucion: function () {
            this.$modal.open({
                parent: this,
                component: FormingresarInstitucion,
                hasModalCard: true
            });
        },
        /* editarInstitucion: function (institucion) {
            alert('editando: ' + institucion.nombre)
        } */
    }
};


/* Componente de la vista de administración */
Vue.component('vista-administrar', {
    template:
        `<b-tabs type="is-boxed" position="is-centered" class="block" expanded>
            <b-tab-item label="Actividades" icon="shape-plus">
                <menu-actividades></menu-actividades>
            </b-tab-item>
            <b-tab-item label="Niveles" icon="cube-outline">
                <menu-niveles></menu-niveles>
            </b-tab-item>
            <b-tab-item label="Instituciones" icon="school">
                <menu-instituciones></menu-instituciones>
            </b-tab-item>
            <b-tab-item label="Administradores" icon="security">
            <p>Tab admins</p>
            </b-tab-item>
        </b-tabs>`,
    components: {
        'menu-actividades': MenuActividades,
        'menu-niveles': MenuNiveles,
        'menu-instituciones': MenuInstituciones
    }
});

/* Componente de la vista de reportes */
Vue.component('vista-reportes', {
    template: '<div>Vista de reportes</div>'
});

var EventBus = new Vue();

var vm = new Vue({
    el: '#app',
    data: function () {
        return {
            vistaActual: 'Inicio',
            vistas: [
                { nombre: 'Inicio', icono: 'application' },
                { nombre: 'Administrar', icono: 'settings' },
                { nombre: 'Reportes', icono: 'file-chart' }
            ],
            navMovilActivo: false,
            cargaInicial: false,
            componenteCargado: false
        }
    },
    computed: {
        componenteVistaActual: function () {
            return 'vista-' + this.vistaActual.toLowerCase();
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
        Store.setGrados(datos.grados);
        Store.setNiveles(datos.niveles);
        Store.setCantidades(datos.cantidad);
        Store.setUrls(datos.urls);
    },
    mounted: function () {
        Store.setCamposCsrf(this.$refs.csrfname, this.$refs.csrfvalue);
        this.cargaInicial = true;
        var v = this;
        EventBus.$on('cargando', function (estado) {
            v.cargandoComponente(estado);
        });
    }
});

/* 
    Funciones que procesan la información enviada por las actividades
*/
function completarActividadPrevia(mensaje) {
    swal({
        type: 'info',
        title: mensaje
    });
}

function enviarPuntaje(puntaje) {
    var num = (puntaje * 100).toFixed(2);
    swal({
        type: 'info',
        title: 'Puntaje: ' + num + '%'
    });
}

function enviarActividadManual(imagen, objetivo) {
    swal({
        imageUrl: imagen,
        imageHeight: 250,
        imageAlt: objetivo
    });
}