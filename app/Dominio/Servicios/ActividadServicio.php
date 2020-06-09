<?php

namespace App\Dominio\Servicios;

use Psr\Http\Message\UploadedFileInterface;

use App\Dominio\Repositorios\ActividadRepoInterface;
use App\Dominio\Modelos\Actividad;
use App\Dominio\Modelos\ActividadPrevia;
use App\Dominio\Modelos\Grado;
use App\Dominio\Modelos\Nivel;
use App\Dominio\Modelos\Categoria;
use App\Dominio\Modelos\Habilidad;
use App\Utilidades\UtilidadesGenerales;

class ActividadServicio{
    
    private $repositorio;
    protected $grados;
    protected $niveles;

    /* Directorio donde se almacena las actividades */
    protected static $DIR_ACTIVIDADES = 'actividades/';

    /* Directorio donde se almacena las actividades previas */
    protected static $DIR_ACTIVIDADES_PREVIAS = 'actividades/previas/';

    public function __construct(ActividadRepoInterface $repositorio){
        $this->repositorio = $repositorio;
        $this->grados = $this->consultarGrados();
        $this->niveles = $this->consultarNiveles();
    }    

    public function consultarActividades($pagina = null, $cantPorPagina = null, $filtro = null, $grado = null, $nivel = null){
        if(!isset($pagina) || !is_numeric($pagina) || $pagina < 0) $pagina = 1;
        if(!isset($cantPorPagina) || !is_numeric($cantPorPagina) || $cantPorPagina < 0) $cantPorPagina = 15;
        $res = [
            'actividades' => [],
            'paginas' => 0,
            'porPagina' => $cantPorPagina
        ];
        $cantidadTotal = $this->repositorio->consultarCantidadActividades($filtro, $grado, $nivel);
        if($cantidadTotal <= 0) return $res;

        $totalPaginas = ceil($cantidadTotal/$cantPorPagina);

        if($pagina > $totalPaginas) $pagina = $totalPaginas;

        $offset = ($pagina - 1) * $cantPorPagina;

        $resultado = $this->repositorio->consultarActividades($cantPorPagina, $offset, $filtro, $grado, $nivel);
        $actividades = [];
        if(!empty($resultado)){
            foreach ($resultado as $actividad) {
                $objeto = new Actividad($actividad);
                $resultado2 = $this->repositorio->consultarHabilidadesDeActividad($objeto->id);
                $habilidades = [];
                if(!empty($resultado2)){
                    foreach($resultado2 as $hab){
                        array_push($habilidades, (int)$hab['id']);
                    }
                }
                $objeto->setHabilidades($habilidades);
                array_push($actividades, $objeto);
            }
        }

        $res['actividades'] = $actividades;
        $res['paginas']  = $totalPaginas;
        $res['porPagina'] = $cantPorPagina;

        return $res;
    }

    public function consultarActividadesPrevias($pagina = null, $cantPorPagina = null, $filtro = null){
        if(!isset($pagina) || !is_numeric($pagina) || $pagina < 0) $pagina = 1;
        if(!isset($cantPorPagina) || !is_numeric($cantPorPagina) || $cantPorPagina < 0) $cantPorPagina = 15;

        $cantidadTotal = $this->repositorio->consultarCantidadActividadesPrevias();

        $totalPaginas = ceil($cantidadTotal/$cantPorPagina);

        if($pagina > $totalPaginas) $pagina = $totalPaginas;

        $offset = ($pagina - 1) * $cantPorPagina;

        $resultado = $this->repositorio->consultarActividadesPrevias($cantPorPagina, $offset, $filtro);
        $actividades = [];
        if(!empty($resultado)){
            foreach ($resultado as $actividad) {
                $objeto = new ActividadPrevia($actividad);
                array_push($actividades, $objeto);
            }
        }

        return [
            'actividades' => $actividades,
            'paginas' => $totalPaginas,
            'porPagina' => $cantPorPagina
        ];
    }

    public function consultarActividadAleatoria(){
        $cantidad = 5;
        $resultado = $this->repositorio->consultarActividadAleatoria($cantidad);
        $actividades = [];
        if(!empty($resultado)){
            foreach($resultado as $res){
                $actividad = [
                    'instruccion' => $res['instruccion'],
                    'rutaArchivo' => $res['ruta_archivo']
                ];
                array_push($actividades, $actividad);
            }
        }

        return $actividades;
    }

    /**
     * Retorna un arreglo con los ID de las actividades seleccionadas.
     */
    public function seleccionarActividadesAleatorias($gradoId){
        $actividades = [];
        foreach($this->niveles as $nivel) {
            $resultado = $this->repositorio->consultarActividadesAleatorias($gradoId, $nivel->id, $nivel->cantidadActividades);
            if(!empty($resultado)){
                foreach($resultado as $res){
                    array_push($actividades, $res['actividad_id']);
                }
            }
        }

        return $actividades;
    }

    /**
     * Retorna un arreglo con los ID de las actividades manuales seleccionadas.
     */
    public function seleccionarActividadesManualesAleatorias($gradoId){
        $actividades = [];
        foreach($this->niveles as $nivel) {
            $resultado = $this->repositorio->consultarActividadesManualesAleatorias($gradoId, $nivel->id, $nivel->cantidadActividadesManuales);
            if(!empty($resultado)){
                foreach($resultado as $res){
                    array_push($actividades, $res['actividad_id']);
                }
            }
        }

        return $actividades;
    }

    /**
     * Retorna un arreglo con actividades previas aleatorias.
     */
    public function consultarActividadesPreviasAleatorias($cantidad){
        $resultado = $this->repositorio->consultarActividadesPreviasAleatorias($cantidad);
        $actividades = [];
        if(!empty($resultado)){
            foreach ($resultado as $actividad) {
                $objeto = new ActividadPrevia($actividad);
                array_push($actividades, $objeto);
            }
        }

        return $actividades;
    }

    private function consultarGrados(){
        $grados = $this->repositorio->consultarGrados();
        $resultado = [];
        foreach ($grados as $grado) {
            $objeto = new Grado($grado);
            array_push($resultado, $objeto);
        }
        return $resultado;
    }

    private function consultarNiveles(){
        $niveles = $this->repositorio->consultarNiveles();
        $resultado = [];
        foreach ($niveles as $nivel) {
            $objeto = new Nivel($nivel);
            array_push($resultado, $objeto);
        }
        return $resultado;
    }    

    public function consultarCategorias(){
        $categorias = $this->repositorio->consultarCategorias();
        $resultado = [];
        foreach ($categorias as $categoria) {
            $objeto = new Categoria($categoria);
            array_push($resultado, $objeto);
        }
        return $resultado;
    }

    public function consultarCategoriaPorId($id){
        $categoria = $this->repositorio->consultarCategoriaPorId($id);
        if($categoria){
            return new Categoria($categoria);
        }
        return false;
    }

    public function crearCategoria($datos){
        $datos['nombre'] = trim($datos['nombre']);
        $datos['nivel_id'] = $datos['nivel'];

        $categoria = new Categoria($datos);

        $categoriaCreada = $this->repositorio->crearCategoria($categoria);
        if($categoriaCreada){
            return ['id' => $categoriaCreada];
        }
        
        return false;
    }

    public function consultarHabilidades(){
        $habilidades = $this->repositorio->consultarHabilidades();
        $resultado = [];
        foreach ($habilidades as $habilidad) {
            $objeto = new Habilidad($habilidad);
            array_push($resultado, $objeto);
        }
        return $resultado;
    }

    public function crearHabilidad($datos){
        $datos['nombre'] = trim($datos['nombre']);
        $datos['es_funcion'] = ($datos['funcion'] == -1) ? false : true;

        $habilidad = new Habilidad($datos);

        $habilidadCreada = $this->repositorio->crearHabilidad($habilidad);
        if($habilidadCreada){
            return ['id' => $habilidadCreada];
        }
        
        return false;
    }

    public function consultarCategoriasPorNivel($nivelId){
        $categorias = $this->repositorio->consultarCategoriasPorNivel($nivelId);
        $resultado = [];
        foreach ($categorias as $categoria) {
            $objeto = new Categoria($categoria);
            array_push($resultado, $objeto);
        }
        return $resultado;
    }

    public function consultarCantidadActividades(){
        return $this->repositorio->consultarCantidadActividades();
    }

    public function consultarCantidadActividadesPrevias(){
        return $this->repositorio->consultarCantidadActividadesPrevias();
    }

    public function getGrados(){
        return $this->grados;
    }

    public function getNiveles(){
        return $this->niveles;
    }

    /**
     * Carga una actividad.
     * @param array arreglo con datos de la actividad
     * @param UploadedFileInterface de la actividad
     * @return array arreglo con id de la nueva actividad o mensaje en caso de error
     */
    public function cargarActividad($datos, UploadedFileInterface $archivo){
        $errores = [];
        $directorios = $this->determinarDirectoriosGradoNivel($datos['grado'], $datos['nivel']);
        $errores = $directorios['errores'];
        
        $directorioDestino = '';
        $actividadCreada = null;
        if(empty($errores)){
            $directorioDestino = $this->crearDirectorioActividad(
                'NORMAL',
                $datos['grado'], $datos['nivel'],
                $directorios['grado'], $directorios['nivel']
            );
            if(!$directorioDestino){
                $errores['archivo'] = 'Ha ocurrido un error durante el procesamiento del archivo';
            }else{
                $extraccion = $this->extraerActividadEnDirectorio($directorioDestino, $archivo);
                if(!empty($extraccion['error'])){
                    $errores['archivo'] = $extraccion['error'];
                }else{
                    // Si la actividad se extrajo correctamente, la guardo en la BD
                    $actividadCreada = $this->almacenarActividadEnBD($datos, $directorioDestino);
                    if(!empty($actividadCreada['error'])){
                        $errores['archivo'] = $actividadCreada['error'];
                    }
                }
            }
        }

        $res = [];
        if(!empty($errores) || empty($actividadCreada)){
            if(!empty($directorioDestino)){
                $dir = explode(self::$DIR_ACTIVIDADES, $directorioDestino);
                if(isset($dir[1]) && !empty($dir[1]) && strlen($dir[1]) > 1){
                    UtilidadesGenerales::eliminarDirectorio($directorioDestino);
                }
            }
            $res['errores'] = $errores;
        }else{
            $res['actividad'] = $actividadCreada;
        }

        return $res;
    }

    /**
     * Carga una actividad previa.
     * @param array arreglo con datos de la actividad
     * @param UploadedFileInterface de la actividad
     * @return array arreglo con id de la nueva actividad o mensaje en caso de error
     */
    public function cargarActividadPrevia($datos, UploadedFileInterface $archivo){
        $errores = [];
        
        $directorioDestino = '';
        $actividadCreada = null;
        if(empty($errores)){
            $directorioDestino = $this->crearDirectorioActividad(
                'PREVIA',
                $datos['grado'], $datos['nivel'],
                $directorios['grado'], $directorios['nivel']
            );
            if(!$directorioDestino){
                $errores['archivo'] = 'Ha ocurrido un error durante el procesamiento del archivo';
            }else{
                $extraccion = $this->extraerActividadEnDirectorio($directorioDestino, $archivo);
                if(!empty($extraccion['error'])){
                    $errores['archivo'] = $extraccion['error'];
                }else{
                    $actividadCreada = $this->almacenarActividadPreviaEnBD($datos, $directorioDestino);
                    if(!empty($actividadCreada['error'])){
                        $errores['archivo'] = $actividadCreada['error'];
                    }
                }
            }
        }

        $res = [];
        if(!empty($errores) || empty($actividadCreada)){
            if(!empty($directorioDestino)){
                $dir = explode(self::$DIR_ACTIVIDADES, $directorioDestino);
                if(isset($dir[1]) && !empty($dir[1]) && strlen($dir[1]) > 1){
                    UtilidadesGenerales::eliminarDirectorio($directorioDestino);
                }
            }
            $res['errores'] = $errores;
        }else{
            $res['actividad'] = $actividadCreada;
        }

        return $res;
    }

    public function actualizarActividad($datos){
        $datos['actividad_id'] = $datos['id'];
        $datos['categoria_id'] = $datos['categoria'];
        $datos['tipo_revision'] = ($datos['revision'] == 2) ? Actividad::$REV_MANUAL : Actividad::$REV_AUTOMATICA;
        $datos['estado'] = ($datos['estado'] == 2) ? Actividad::$ESTADO_INACTIVA : Actividad::$ESTADO_ACTIVA;
        $actividad = new Actividad($datos);
        $res = ['actualizado' => false];
        $actualizada = $this->repositorio->actualizarActividad($actividad);
        if($actualizada){
            $habilidadesId = explode(',', $datos['habilidades']);
            $this->repositorio->eliminarHabilidadesActividad($actividad->id);
            $this->repositorio->asociarHabilidadesActividad($actividad->id, $habilidadesId);
            $res['actualizado'] = true;
            $res['actividad'] = [
                'tipoRevision' => $actividad->tipoRevision,
                'estado' => $actividad->estado
            ];
        }
        
        return $res;
    }

    public function actualizarActividadPrevia($datos){
        $datos['actividad_previa_id'] = $datos['id'];
        $datos['estado'] = ($datos['estado'] == 2) ? ActividadPrevia::$ESTADO_INACTIVA : ActividadPrevia::$ESTADO_ACTIVA;
        $actividad = new ActividadPrevia($datos);
        $res = ['actualizado' => false];
        $actualizada = $this->repositorio->actualizarActividadPrevia($actividad);
        if($actualizada){
            $res['actualizado'] = true;
            $res['actividad'] = [
                'estado' => $actividad->estado
            ];
        }
        
        return $res;
    }

    /**
     * Determina los directorios según el grado y nivel.
     * @param string ID del grado
     * @param string ID del nivel
     * @return array con directorios de grado y nivel. Si no coinciden, retorna errores
     */
    private function determinarDirectoriosGradoNivel($grado, $nivel){
        $res = [
            'errores' => [],
            'grado' => '',
            'nivel' => ''
        ];
        foreach($this->grados as $item){
            if($grado == $item->id){
                $res['grado'] = strtolower($item->nombre);
                break;
            }
        }
        foreach($this->niveles as $item){
            if($nivel == $item->id){
                $res['nivel'] = strtolower($item->nombre);
                break;
            }
        }
        if(empty($res['grado'])){
            $res['errores']['grado'] = 'Por favor selecciona un grado válido';
        }
        if(empty($res['nivel'])){
            $res['errores']['nivel'] = 'Por favor selecciona un nivel válido';
        }
        
        return $res;
    }

    /**
     * Crear el directorio que almacenará la actividad, según el grado y nivel.
     * @param int ID del grado
     * @param int ID del nivel
     * @param string nombre del grado
     * @param string nombre del nivel
     * @return string con la ruta completa del directorio creado. En caso de no crearse, retorna false
     */
    private function crearDirectorioActividad($tipo, $grado = null, $nivel = null, $dirGrado = null, $dirNivel = null){
        $numCarpeta = 0;
        $destinoInicial = UPLOADS_DIR;
        if($tipo == 'NORMAL'){
            $numCarpeta = (int)$this->repositorio->consultarCantidadActividadesPorGradoNivel($grado, $nivel);
            $destinoInicial .= self::$DIR_ACTIVIDADES . $dirGrado . '/' . $dirNivel . '/';
        }else{
            $numCarpeta = (int)$this->repositorio->consultarCantidadActividadesPrevias();
            $destinoInicial .= self::$DIR_ACTIVIDADES_PREVIAS;
        }
        $numCarpeta++;

        $destinoFinal = '';
        $creado = false;
        $intentos = 0;
        while(!$creado){
            $destinoFinal = $destinoInicial . $numCarpeta . '/';
            if(!file_exists($destinoFinal)){
                if(mkdir($destinoFinal, 0777, true)){
                    $creado = true;
                }else{
                    if($intentos < 5){
                        ++$intentos;
                    }else{
                        return false;
                    }
                }
            }else{
                $numCarpeta++;
            }
        }
        return $destinoFinal;
    }

    /**
     * Extrae el archivo ZIP de actividad en el directorio indicado.
     * @param string directorio destino
     * @param UploadedFileInterface archivo de la actividad
     * @return true en caso de éxito, de lo contrario un mensaje de error
     */
    private function extraerActividadEnDirectorio($destinoFinal, UploadedFileInterface $archivo){
        $res = [];
        $rutaArchivo = '';
        $nombre = $archivo->getClientFilename();
        $rutaArchivo = $destinoFinal . $nombre;
        $archivo->moveTo($rutaArchivo);
        if(file_exists($destinoFinal)){
            $zip = new \ZipArchive;
            if($zip->open($rutaArchivo) === true){
                $zip->extractTo($destinoFinal);
                $zip->close();
                UtilidadesGenerales::eliminarArchivo($rutaArchivo);
                if(file_exists($destinoFinal . 'index.html')){
                    return true;
                }else{
                    $res['error'] = 'La actividad cargada es inválida, asegúrate de que posea el archivo index.html';
                    UtilidadesGenerales::eliminarDirectorio($destinoFinal);
                }
            }else{
                $res['error'] = 'Ha ocurrido un error durante el procesamiento del archivo';
            }
        }else{
            $res['error'] = 'Ha ocurrido un error durante el procesamiento del archivo';
        }

        return $res;
    }

    /**
     * Almacena los datos de la actividad en la BD.
     * @param array arreglo con datos de la actividad
     * @param string directorio donde se cargaron los archivos de la actividad
     * @return array ID y ruta de la nueva actividad en caso de exito, de lo contrario mensaje de error
     */
    private function almacenarActividadEnBD($datos, $dirDestino){
        $res = [];
        $error = true;
        $datos['grado_id'] = $datos['grado'];
        $datos['nivel_id'] = $datos['nivel'];
        $datos['categoria_id'] = $datos['categoria'];
        $cadena = explode(APP_DIR, $dirDestino);
        $datos['ruta_archivo'] = end($cadena) . 'index.html';
        $datos['tipo_revision'] = ($datos['revision'] == 2) ? Actividad::$REV_MANUAL : Actividad::$REV_AUTOMATICA;
        $datos['estado'] = Actividad::$ESTADO_ACTIVA;
        $datos['fecha_creacion'] = UtilidadesGenerales::fechaActual();
        $actividad = new Actividad($datos);
        $actividadCreada = $this->repositorio->crearActividad($actividad);
        if($actividadCreada){
            $habilidadesId = explode(',', $datos['habilidades']);
            $asociado = $this->repositorio->asociarHabilidadesActividad($actividadCreada, $habilidadesId);
            if($asociado) $error = false;
        }

        if(!$error){
            $res = [
                'id' => $actividadCreada,
                'rutaArchivo' => $actividad->rutaArchivo,
                'tipoRevision' => $actividad->tipoRevision,
                'estado' => $actividad->estado,
                'fechaCreacion' => $actividad->fechaCreacion
            ];
        }else{
            $this->repositorio->eliminarActividad($actividadCreada);
            $res['error'] = 'Ha ocurrido un error al procesar la información de la nueva actividad en la base de datos';
        }
        
        return $res;
    }

    /**
     * Almacena los datos de la actividad previa en la BD.
     * @param array arreglo con datos de la actividad
     * @param string directorio donde se cargaron los archivos de la actividad
     * @return array ID y ruta de la nueva actividad en caso de exito, de lo contrario mensaje de error
     */
    private function almacenarActividadPreviaEnBD($datos, $dirDestino){
        $res = [];
        $error = true;
        $cadena = explode(APP_DIR, $dirDestino);
        $datos['ruta_archivo'] = end($cadena) . 'index.html';
        $datos['estado'] = ActividadPrevia::$ESTADO_ACTIVA;
        $datos['fecha_creacion'] = UtilidadesGenerales::fechaActual();
        $actividad = new ActividadPrevia($datos);
        $actividadCreada = $this->repositorio->crearActividadPrevia($actividad);
        if($actividadCreada){
            $error = false;
        }

        if(!$error){
            $res = [
                'id' => $actividadCreada,
                'rutaArchivo' => $actividad->rutaArchivo,
                'estado' => $actividad->estado,
                'fechaCreacion' => $actividad->fechaCreacion
            ];
        }else{
            $this->repositorio->eliminarActividadPrevia($actividadCreada);
            $res['error'] = 'Ha ocurrido un error al procesar la información de la nueva actividad en la base de datos';
        }
        
        return $res;
    }
}