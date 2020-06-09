var Utilidades = Object.freeze({
    estados: {
        estudiante: {
            CUENTA_NO_ACTIVA: {codigo: 'CN', texto: 'Cuenta no activa'},
            PRUEBA_NO_INICIADA: {codigo: 'PN', texto: 'Prueba no iniciada'},
            PRUEBA_PENDIENTE: {codigo: 'PP', texto: 'Prueba en proceso'},
            CALIF_PENDIENTE: {codigo: 'CP', texto: 'Calificación pendiente'},
            PRUEBA_FINALIZADA: {codigo: 'PF', texto: 'Prueba finalizada'}
        }
    },
    actividades: {
        tipos: {
            AUTOMATICA: {codigo: 'A', texto: 'Automática'},
            MANUAL: {codigo: 'M', texto: 'Manual'}
        },
        estados: {
            ACTIVA: {codigo: 'A', texto: 'Activa'},
            INACTIVA: {codigo: 'I', texto: 'Inactiva'}
        }
    },
    /**
     * Retorna la url del origen actual (servidor)
     */
    baseUrl: function() {
        return (!window.location.origin) ? window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '') : window.location.origin;
    },
    
    /**
     * Retorna TRUE si el texto indicado posee sólo letras y espacios en blanco, de lo contrario FALSE.
     * @param {String} texto
     */
    validarSoloLetras: function(texto){
        var regex = new RegExp("^[A-zÀ-ú ]+$");
        return regex.test(texto);
    },

    /**
     * Retorna TRUE si el texto indicado tiene el formato válido de un email, de lo contrario FALSE.
     * @param {String} email
     */
    validarEmail: function(email){
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },

    /**
     * Determina si el tipo de archivo es válido.
     * @param {String} tipoArchivo
     */
    validarArchivoActividad: function(tipoArchivo){
        var tiposPermitidos = ['application/zip', 'multipart/x-zip', 'application/x-zip-compressed', 'application/x-compressed'];
        if(tiposPermitidos.indexOf(tipoArchivo) == -1){
            swal({
                type: 'warning',
                title: 'Archivo inválido',
                text: 'Por favor selecciona un archivo válido (.zip)'
            });
            return false;
        }
        return true;
    },

    /**
     * Retorna TRUE si el objeto indicado posee al menos una propiedad válida, de lo contrario FALSE.
     * @param {Object} objeto
     */
    objetoTienePropiedadValida: function(objeto){
        var errKeys = Object.keys(objeto);
        for(var i=0, n=errKeys.length; i<n; i++){
            if(objeto[errKeys[i]]){
                return true;
            }
        }
        return false;
    },

    /**
     * Muestra un mensaje de error cuando falla una solicitud AJAX.
     */
    mostrarMensajeErrorAjax: function(mensaje = null){
        if(!mensaje){
            mensaje = 'Ha ocurrido un error al procesar la solicitud. Por favor, vuelve a intentarlo más tarde';
        }
        swal({
            type: 'warning',
            text: mensaje
        });
    },

    /**
     * Redirecciona el navegador a la url indicada.
     * @param {String} url
     */
    redireccionar: function(url){
        window.location.replace(url);
    },

    /**
     * Retorna una cadena que representa la fecha indicada con formato AAAA-MM-DD.
     * @param {Date} fecha
     */
    formatearFecha: function(fecha){
        var minOffset = fecha.getTimezoneOffset();
        var millOffset = minOffset * 60 * 1000;
        var nuevaFecha = new Date(fecha - millOffset);
        return nuevaFecha.toISOString().split("T")[0];
    },
    /**
     * Retrasa la ejecución de una función dependiendo del tiempo en 
     * milisegundos asignado al setTimeout padre.
     * Obtenida de: https://davidwalsh.name/javascript-debounce-function
     */
    debounce: function(func, wait, immediate) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    },
    
    /**
     * Retorna el número con la cantidad de decimales indicada.
     * @param {Number} numero
     * @param {Number} decimales
     */
    calcularNumeroConDecimales: function(numero, decimales = 1){
        var fact = Math.pow(10, decimales);
        return Math.round((numero) * fact)/fact;
    }
});