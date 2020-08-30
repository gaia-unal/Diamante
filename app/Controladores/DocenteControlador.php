<?php

namespace App\Controladores;
require 'pdf/fpdf.php';

use Slim\Views\Twig;
use Slim\Router;
use App\Dominio\Servicios\AutenticacionServicio;
use App\Dominio\Servicios\DocenteServicio;
use App\Dominio\Servicios\EstudianteServicio;
use App\Dominio\Servicios\ActividadServicio;
use App\Dominio\Servicios\PruebaServicio;
use App\Dominio\Servicios\Reporte;

use App\Validaciones\ValidarRegistroEstudiante;
use App\Validaciones\ValidarCalificacionActividad;

class DocenteControlador{

    protected $view;
    protected $docenteServicio;
    
    public function __construct(Twig $view, DocenteServicio $docenteServicio){
        $this->view = $view;
        $this->docenteServicio = $docenteServicio;
    }

    public function index(
        $request,
        $response,
        Router $router,
        AutenticacionServicio $autenticacion,
        ActividadServicio $actividadServicio
        ){
        $usuario = $autenticacion->obtenerIdUsuarioActual();
        $grados = $actividadServicio->getGrados();
        $niveles = $actividadServicio->getNiveles();
        $cantidades = $this->docenteServicio->consultarCantidadEstudiantesDeDocente($usuario);
        
        $datos = [
            'usuario' => $usuario,
            'grados' => $grados,
            'niveles' => $niveles,
            'cantidades' => $cantidades,
            'urls' => [
                'estudiantes' => $router->pathFor('docente.consultar.estudiantes'),
                'registrarEstudiante' => $router->pathFor('docente.registro.estudiante'),
                'calificarActividad' => $router->pathFor('docente.calificar.actividad'),
                'consultarReporte' => $router->pathFor('docente.consultar.reporte'),
                'descargarReporte' => $router->pathFor('docente.descargar.reporte')
            ]
        ];

        return $this->view->render($response, 'docente/dashboard.twig', ['datos' => $datos]);
    }

    public function postRegistroEstudiante($request, $response, ValidarRegistroEstudiante $validador, EstudianteServicio $estudianteServicio){
        $datos = $request->getParams();

        $errores = $validador->validarAJAX($datos);
        if($errores) {
            return $response->withJson(['errores' => $errores], 200);
        }

        $resultado = $estudianteServicio->registrar($datos);
        $res = [];
        if($resultado){
            $res['registro'] = true;
            $res['estudiante'] = $resultado;
        }else{
            $res['registro'] = false;
        }
        
        return $response->withJson(['respuesta' => $res], 200);
    }

    public function consultarEstudiantes($request, $response, AutenticacionServicio $autenticacion){
        $tipo = $request->getQueryParam('tipo');
        $usuario = $autenticacion->obtenerIdUsuarioActual();
        $resultado = [];
        if(!empty($tipo)){
            switch($tipo){
                case 'estuds':
                    $grado = $request->getQueryParam('grado');
                    $estado = $request->getQueryParam('estado');
                    $resultado['estudiantes'] = $this->docenteServicio->consultarEstudiantesDeDocente($usuario, $grado, $estado);
                    break;
                case 'califs':
                    $resultado = $this->docenteServicio->consultarCalificacionesPendientes($usuario);
                    break;
                case 'reports':
                    $resultado['estudiantes'] = $this->docenteServicio->consultarEstudiantesParaReportes($usuario);
            }
        }else{
            $resultado['error'] = 'Consulta equivocada';
        }
        
        return $response->withJson($resultado, 200);
    }

    public function postCalificacionActividad(
        $request,
        $response,
        ValidarCalificacionActividad $validador,
        AutenticacionServicio $autenticacion,
        PruebaServicio $pruebaServicio){
        $datos = $request->getParams();
        
        $errores = $validador->validarAJAX($datos);
        $usuario = $autenticacion->obtenerIdUsuarioActual();
        if($usuario != $datos['docente']) $errores['acceso'] = 'Petición inválida';
        if($errores) {
            return $response->withJson(['errores' => $errores], 200);
        }

        $resultado = $pruebaServicio->calificarActividad($datos['estudiante'], $datos['prueba'], $datos['actividad'], $datos['calificacion']);

        return $response->withJson(['respuesta' => $resultado], 200);
    }

    public function consultarReporteDePrueba($request, $response, PruebaServicio $pruebaServicio){
        $pruebaId = $request->getQueryParam('prueba');
        $resultado = $pruebaServicio->consultarReporteDePrueba($pruebaId);
        return $response->withJson(['reporte' => $resultado], 200);
    }

    public function descargarReporteDePrueba($request, $response){
        $pdf = new FPDF();
        $pdf->AliasNbPages(); //Genera los pie de página en cada reporte
        $pdf->AddPage();
        $pdf->SetFont('Times','',12);
        for($i=1;$i<=40;$i++)
            $pdf->Cell(0,10, utf8_decode('Imprimiendo línea número '.$i),0,1);
        $pdf->Output();
    }
}