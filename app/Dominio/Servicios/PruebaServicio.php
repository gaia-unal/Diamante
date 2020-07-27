<?php

namespace App\Dominio\Servicios;

require 'vendor/pdf/fpdf.php';

use App\Dominio\Repositorios\PruebaRepoInterface;
use App\Dominio\Servicios\ActividadServicio;
use App\Dominio\Servicios\EstudianteServicio;
use App\Dominio\Servicios\AutenticacionServicio;
use App\Dominio\Servicios\PDF;
use App\Dominio\Modelos\Prueba;
use App\Dominio\Modelos\Evidencia;
use App\Dominio\Modelos\Estudiante;
use App\Utilidades\UtilidadesGenerales;

class PruebaServicio{
    
    protected $pruebaRepositorio;
    protected $actividadServicio;
    protected $estudianteServicio;
    protected $autenticacion;

    // Acciones asociadas a la realización de una prueba
    public static $INICIAR_PRUEBA = 'INICIAR';
    public static $CONTINUAR_PRUEBA = 'CONTINUAR';

    public function __construct(
        PruebaRepoInterface $pruebaRepo,
        ActividadServicio $actividadServicio,
        EstudianteServicio $estudianteServicio,
        AutenticacionServicio $autenticacion
        ){
            $this->pruebaRepositorio = $pruebaRepo;
            $this->actividadServicio = $actividadServicio;
            $this->estudianteServicio = $estudianteServicio;
            $this->autenticacion = $autenticacion;
        }

    /**
     * Retorna TRUE si el estudiante puede realizar la prueba. De lo contrario, FALSE.
     */
    public function realizarPruebaEstudiante($estudianteId, $gradoId, $estado){
        $respuesta = false;
        if($estado == Estudiante::$PRUEBA_NO_INICIADA){
            $pruebaId = $this->crearPrueba($estudianteId, $gradoId);
            if(!empty($pruebaId)){
                $this->almacenarPruebaEnSesion($pruebaId, self::$INICIAR_PRUEBA);
                $respuesta = true;
            }
        }else if($estado == Estudiante::$PRUEBA_PENDIENTE){
            $prueba = $this->consultarPruebaPendiente($estudianteId);
            if(!empty($prueba)){
                $this->almacenarPruebaEnSesion($prueba->id, self::$CONTINUAR_PRUEBA);
                $respuesta = true;
            }
        }

        return $respuesta;
    }

    /**
     * Crea una prueba para el estudiante indicado, y asocia aleatoriamente actividades.
     * Retorna el ID de la prueba creada sólo si todas las operaciones fueron realizadas,
     * de lo contrario retorna FALSE.
     */
    private function crearPrueba($estudianteId, $gradoId){
        $prueba = new Prueba();
        $prueba->setEstudianteId($estudianteId);
        $prueba->setFechaInicio(UtilidadesGenerales::fechaActual());
        $prueba->setEstado(Prueba::$PENDIENTE);
        
        $pruebaCreada = $this->pruebaRepositorio->crearPrueba($prueba);
        if(empty($pruebaCreada)) return false;

        $actividadesAsociadas = $this->asociarActividadesPrueba($pruebaCreada, $gradoId);
        if(empty($actividadesAsociadas)){
            $this->pruebaRepositorio->eliminarPrueba($pruebaCreada);
            return false;
        }
        
        return $pruebaCreada;
    }

    /**
     * Retorna TRUE si se asocian todas las actividades de la prueba indicada. De lo contrario se devuelve FALSE.
     */
    private function asociarActividadesPrueba($pruebaId, $gradoId){
        $actividadesManuales = $this->actividadServicio->seleccionarActividadesManualesAleatorias($gradoId);
        $actividades = $this->actividadServicio->seleccionarActividadesAleatorias($gradoId);
        
        return $this->pruebaRepositorio->asociarActividadesPrueba($pruebaId, $actividadesManuales, $actividades);
    }

    private function almacenarPruebaEnSesion($pruebaId, $accion){
        $_SESSION['prueba'] = [
            'id' => $pruebaId,
            'accion' => $accion,
            'actual' => 0,
            'total' => 0
        ];
    }

    public function obtenerPruebaEnSesion(){
        return $_SESSION['prueba'];
    }

    private function actualizarPruebaEnSesion($actividadActual = null, $totalActividades = null){
        if(isset($actividadActual)) $_SESSION['prueba']['actual'] = $actividadActual;
        if(isset($totalActividades)) $_SESSION['prueba']['total'] = $totalActividades;
    }

    /**
     * Incrementa el indice de la actividad actual. Retorna TRUE si el indice es igual al total de actividades.
     */
    private function incrementarActividadActualEnSesion(){
        $_SESSION['prueba']['actual'] += 1;
        if($_SESSION['prueba']['actual'] == $_SESSION['prueba']['total']) return true;
        return false;
    }

    private function destruirPruebaEnSesion(){
        unset($_SESSION['prueba']);
    }

    public function obtenerActividadesPendientes($estudianteId){
        $pruebaActual = $this->obtenerPruebaEnSesion();
        if(empty($pruebaActual)) return false;

        $pruebaPendiente = $this->consultarPruebaPendiente($estudianteId);
        if(empty($pruebaPendiente) || $pruebaPendiente->id != $pruebaActual['id']){
            /* TODO, eliminar la prueba pendiente de BD, y todos sus registros asociados,
                setear la cuenta del estudiante como PRUEBA_NO_INICIADA ?
            */
            return false;
        }
        
        $actividadesPendientes = [];
        
        $actividadesManuales = [];
        $actividades = [];
        $resultado1 = $this->pruebaRepositorio->consultarActividadesPendientes($pruebaPendiente->id);
        if(empty($resultado1)){
            /* TODO, no se pudieron recuperar actividades asociadas, eliminar prueba pendiente de BD? 
                setear la cuenta del estudiante como PRUEBA_NO_INICIADA ?
            */
            return false;
        }else{
            foreach($resultado1 as $res){
                $act = $this->formatearActividadRealizable($res);
                array_push($actividades, $act);
            }

            $resultado2 = $this->pruebaRepositorio->consultarActividadesManualesPendientes($pruebaPendiente->id);

            if(!empty($resultado2)){
                foreach($resultado2 as $res){
                    $act = $this->formatearActividadRealizable($res);
                    array_push($actividadesManuales, $act);
                }
                $actividadesPendientes = array_merge($actividadesManuales, $actividades);
            }else{
                $actividadesPendientes = $actividades;
            }
        }

        $total = (int)$this->pruebaRepositorio->contarActividadesPrueba($pruebaPendiente->id);
        if($pruebaActual['accion'] == self::$INICIAR_PRUEBA){
            $cantActividadesPrevias = 3; // TODO, traer de tabla configuración
            $actividadesPrevias = $this->actividadServicio->consultarActividadesPreviasAleatorias($cantActividadesPrevias);
            shuffle($actividadesPrevias);

            $this->estudianteServicio->actualizarEstado($estudianteId, Estudiante::$PRUEBA_PENDIENTE);
            $this->autenticacion->actualizarEstadoEstudianteActual(Estudiante::$PRUEBA_PENDIENTE);

            $actual = 0;
            $this->actualizarPruebaEnSesion($actual, $total);

            return [
                'actividades' => $actividadesPendientes,
                'actual' => $actual,
                'total' => $total,
                'actividadesPrevias' => $actividadesPrevias
            ];
        }else if($pruebaActual['accion'] == self::$CONTINUAR_PRUEBA) {
            $actual = $total - count($actividadesPendientes);
            if($actual < 0) $actual = 0;
            $this->actualizarPruebaEnSesion($actual, $total);
            
            return [
                'actividades' => $actividadesPendientes,
                'actual' => $actual,
                'total' => $total
            ];
        }

        return false;
    }

    public function consultarPruebaPendiente($estudianteId){
        $resultado = $this->pruebaRepositorio->consultarPruebaPendiente($estudianteId);
        $prueba = null;
        if(!empty($resultado)){
            $prueba = new Prueba($resultado);
        }

        return $prueba;
    }

    private function formatearActividadRealizable($datos){
        return [
            'id' => (int)$datos['actividad_id'],
            'instruccion' => $datos['instruccion'],
            'rutaArchivo' => $datos['ruta_archivo'],
            'tipo' => $datos['tipo_revision'],
            'orden' => (int)$datos['orden']
        ];
    }

    public function procesarActividad($datos, $estudianteId){
        $pruebaActual = $this->obtenerPruebaEnSesion();
        if(empty($pruebaActual)) return false;

        if($pruebaActual['actual'] == $pruebaActual['total']){
            $op = $this->finalizarPrueba($pruebaActual['id'], $estudianteId);
            if($op) return ['accion' => 'FINALIZAR'];
            return false;
        }

        $operacion = null;
        if(isset($datos['puntaje'])){
            // Actividad de calificación automática
            $operacion = $this->guardarPuntajeActividad(
                $pruebaActual['id'],
                $datos['actividad_id'],
                $datos['puntaje'],
                $datos['tiempo']
            );
        }else if(isset($datos['imagen']) && isset($datos['objetivo'])){
            // Actividad manual, almacenar imagen en disco y BD
            $operacion = $this->guardarEvidenciaActividadManual(
                $estudianteId,
                $pruebaActual['id'],
                $datos['actividad_id'],
                $datos['imagen'],
                $datos['objetivo'],
                $datos['tiempo']
            );
        }

        if(!empty($operacion)){
            $actual = $this->incrementarActividadActualEnSesion();
            if($actual){
                $op = $this->finalizarPrueba($pruebaActual['id'], $estudianteId);
                if($op) return ['accion' => 'FINALIZAR'];
            }

            return [
                'accion' => 'CONTINUAR',
                'actual' => $this->obtenerPruebaEnSesion()['actual']
            ];
        }

        return false;
    }

    private function guardarPuntajeActividad($pruebaId, $actividadId, $puntaje, $tiempo){
        $puntaje = $this->validarPuntaje($puntaje);
        $tiempo = $this->validarTiempo($tiempo);

        return $this->pruebaRepositorio->actualizarActividadPrueba($pruebaId, $actividadId, $puntaje, $tiempo);
    }
    
    private function guardarEvidenciaActividadManual($estudianteId, $pruebaId, $actividadId, $imagen, $objetivo, $tiempo){
        $ruta = $this->almacenarEvidenciaActividad($estudianteId, $pruebaId, $imagen);
        if(!$ruta) return false;
        $ruta = explode('diamante/', $ruta);
        $rutaImagen = end($ruta);

        $evidencia = new Evidencia();
        $evidencia->setPruebaId($pruebaId);
        $evidencia->setActividadId($actividadId);
        $evidencia->setRuta($rutaImagen);
        $evidencia->setObjetivo($objetivo);

        $operacion = $this->pruebaRepositorio->actualizarEvidencia($evidencia);

        if(!$operacion){
            UtilidadesGenerales::eliminarArchivo($rutaImagen);
            return false;
        }

        $tiempo = $this->validarTiempo($tiempo);
        $operacion = $this->pruebaRepositorio->actualizarActividadPrueba($pruebaId, $actividadId, null, $tiempo);
        if(!$operacion){
            $evidencia->setRuta('');
            $evidencia->setObjetivo('');
            $this->pruebaRepositorio->actualizarEvidencia($evidencia);
            UtilidadesGenerales::eliminarArchivo($rutaImagen);
            return false;
        }

        return true;
    }

    private function validarPuntaje($puntaje){
        if(!is_numeric($puntaje) || $puntaje < 0) return 0;
        $puntaje = round($puntaje, 2);
        if($puntaje > 1) $puntaje = 1;
        return $puntaje;
    }

    private function validarTiempo($tiempo){
        if(!is_numeric($tiempo) || $tiempo < 0) return 0;
        return (int)$tiempo;
    }

    private function finalizarPrueba($pruebaId, $estudianteId){
        $prueba = new Prueba();
        $prueba->setId($pruebaId);
        $prueba->setEstudianteId($estudianteId);
        $prueba->setFechaFin(UtilidadesGenerales::fechaActual());
        $prueba->setEstado(Prueba::$TERMINADA);

        $operacion = $this->pruebaRepositorio->actualizarPrueba($prueba);
        if($operacion){
            $this->estudianteServicio->actualizarEstado($estudianteId, Estudiante::$CALIF_PENDIENTE);
            $this->autenticacion->actualizarEstadoEstudianteActual(Estudiante::$CALIF_PENDIENTE);
            $this->destruirPruebaEnSesion();
            return true;
        }

        return false;
    }

    public function calificarActividad($estudianteId, $pruebaId, $actividadId, $calificacion){
        if($calificacion > 5) {
            $calificacion = 5;
        }else if($calificacion < 0){
            $calificacion = 0;
        }
        $puntaje = $calificacion / 5;
        
        $operacion = $this->pruebaRepositorio->actualizarActividadPrueba($pruebaId, $actividadId, $puntaje, null);
        $resultado = [
            'calificado' => false,
            'pruebaTerminada' => false
        ];
        if($operacion){
            $resultado['calificado'] = true;
            $cantidad = $this->pruebaRepositorio->contarActividadesSinPuntaje($pruebaId);
            if($cantidad == 0){
                $this->pruebaRepositorio->actualizarEstado($pruebaId, Prueba::$CALIFICADA);
                $this->estudianteServicio->actualizarEstado($estudianteId, Estudiante::$PRUEBA_FINALIZADA);
                $resultado['pruebaTerminada'] = true;
            }
        }

        return $resultado;
    }

    /**
     * Almacena en disco la evidencia como imagen, asociada a una prueba especifica.
     * Retorna la ruta absoluta del archivo en el disco. Si la imagen es inválida, retorna FALSE.
     */
    public function almacenarEvidenciaActividad($estudianteId, $pruebaId, $imagen){
        $tipoBase64 = 'data:image/jpeg;base64,';
        if(strpos($imagen, $tipoBase64) !== false){
            $imagen = str_replace(' ', '+', $imagen);
            $imagen = str_replace($tipoBase64, '', $imagen);
            $archivo = base64_decode($imagen);
            if($archivo){
                $ruta = UPLOADS_DIR . 'usuarios/estudiantes/evidencias/';
                $ruta .= 'e' . $estudianteId . '_p' . $pruebaId . '_' . UtilidadesGenerales::fechaActual() . '_';
                $ruta .= uniqid() . '.jpg';

                $operacion = file_put_contents($ruta, $archivo);
                if($operacion !== false){
                    return $ruta;
                }
            }
        }
        return false;
    }

    public function consultarReporteDePrueba($pruebaId){
        $resultado = $this->pruebaRepositorio->consultarPuntajesParaReporte($pruebaId);
        $reporte = [];
        foreach ($resultado as $res) {
            $rep = [
                'actividad_id' => (int) $res['actividad_id'],
                'nivel_id' => (int) $res['nivel_id'],
                'actividad' => $res['actividad'],
                'categoria' => $res['categoria'],
                'puntaje' => (float) $res['puntaje_porcentual'],
                'tiempo' => (int) $res['tiempo_segundos']
            ];
            array_push($reporte, $rep);
        }
        return $reporte;
    }

    public function descargarReporteDePrueba($pruebaId){
        $resultado = $this->pruebaRepositorio->consultarPuntajesParaReporte($pruebaId);
        $reporte = [];
        foreach($resultado as $rslt){
            $rep = [
                'actividad_id' => (int) $res['actividad_id'],
                'nivel_id' => (int) $res['nivel_id'],
                'actividad' => $res['actividad'],
                'categoria' => $res['categoria'],
                'puntaje' => (float) $res['puntaje_porcentual'],
                'tiempo' => (int) $res['tiempo_segundos']
            ];
            array_push($reporte, $rep);
        }
        /* $pdf = new PDF();
        $pdf->AliasNbPages();//Generar los pie de página en cada reporte
        $pdf->AddPage();
        $pdf->SetFont('Time','',12);
        foreach($reporte as $rep){
            $pdf->Cell(0,10, utf8_decode($rep),0,1);
        }
        $pdf->OutPut(); */
        $pdf = new FPDF();
        $pdf->AddPage();
        $pdf->SetFont('Arial','B',16);
        $pdf->Cell(40,10,'¡Hola, Mundo!');
        $pdf->Output();
        return $pdf->OutPut();
    }
}
