<?php

namespace App\Controladores;

use Slim\Views\Twig;
use Slim\Router;
use App\Dominio\Servicios\AutenticacionServicio;
use App\Dominio\Servicios\AdministradorServicio;
use App\Dominio\Servicios\ActividadServicio;
use App\Dominio\Servicios\EstudianteServicio;
use App\Dominio\Servicios\DocenteServicio;
use App\Validaciones\ValidarCargaActividad;
use App\Validaciones\ValidarCargaActividadPrevia;
use App\Validaciones\ValidarEditarActividad;
use App\Validaciones\ValidarEditarActividadPrevia;
use App\Validaciones\ValidarCrearCategoria;
use App\Validaciones\ValidarCrearHabilidad;

class AdminControlador{

    protected $view;
    protected $autenticacion;
    protected $adminServicio;
    protected $actividadServicio;
    
    public function __construct(
        Twig $view,
        AutenticacionServicio $autenticacion,
        AdministradorServicio $adminServicio,
        ActividadServicio $actividadServicio){
        $this->view = $view;
        $this->autenticacion = $autenticacion;
        $this->adminServicio = $adminServicio;
        $this->actividadServicio = $actividadServicio;
    }

    public function index(
        $request,
        $response,
        Router $router,
        EstudianteServicio $estudianteServicio,
        DocenteServicio $docenteServicio
    ){
        $datos = [
            'usuario' => $this->autenticacion->obtenerUsuarioActual(),
            'grados' => $this->actividadServicio->getGrados(),
            'niveles' => $this->actividadServicio->getNiveles(),
            'cantidad' => [
                'actividades' => $this->actividadServicio->consultarCantidadActividades(),
                'actividadesPrevias' => $this->actividadServicio->consultarCantidadActividadesPrevias(),
                'estudiantes' => $estudianteServicio->consultarCantidadEstudiantes(),
                'docentes' => $docenteServicio->consultarCantidadDocentes(),
                'instituciones' => $docenteServicio->consultarCantidadInstituciones()
            ],
            'urls' => [
                'actividades' => $router->pathFor('admin.actividades'),
                'actividadesPrevias' => $router->pathFor('admin.actividades.previas'),
                'cargarActividad' => $router->pathFor('admin.cargar.actividad'),
                'cargarActividadPrevia' => $router->pathFor('admin.cargar.actividad.previa'),
                'editarActividad' => $router->pathFor('admin.editar.actividad'),
                'editarActividadPrevia' => $router->pathFor('admin.editar.actividad.previa'),
                'categoriasHabilidades' => $router->pathFor('admin.categorias.habilidades'),
                'crearCategoria' => $router->pathFor('admin.crear.categoria'),
                'crearHabilidad' => $router->pathFor('admin.crear.habilidad')
            ]
        ];
        
        return $this->view->render($response, 'admin/dashboard.twig', ['datos' => $datos]);
    }

    public function getCategorias($request, $response){
        $nivelId = $request->getQueryParam('id');
        if(empty($nivelId) || !is_numeric($nivelId)){
            $error = 'Por favor selecciona un nivel válido';
            return $response->withJson(['error' => $error], 200);
        }

        $categorias = $this->actividadServicio->consultarCategoriasPorNivel($nivelId);

        return $response->withJson(['categorias' => $categorias], 200);
    }

    public function getActividades($request, $response){
        $pagina = $request->getQueryParam('pagina');
        $porPagina = $request->getQueryParam('porPagina');
        $buscar = $request->getQueryParam('buscar');
        $grado = $request->getQueryParam('grado');
        $nivel = $request->getQueryParam('nivel');
        $actividades = $this->actividadServicio->consultarActividades($pagina, $porPagina, $buscar, $grado, $nivel);

        return $response->withJson($actividades, 200);
    }

    public function getActividadesPrevias($request, $response){
        $pagina = $request->getQueryParam('pagina');
        $porPagina = $request->getQueryParam('porPagina');
        $buscar = $request->getQueryParam('buscar');
        $actividades = $this->actividadServicio->consultarActividadesPrevias($pagina, $porPagina, $buscar);

        return $response->withJson($actividades, 200);
    }

    public function cargarActividad($request, $response, ValidarCargaActividad $validador){
        $datos = $request->getParams();
        $archivos = $request->getUploadedFiles();
        $errores = $validador->validarDatos($datos, $archivos['archivo']);
        if($errores) {
            return $response->withJson(['errores' => $errores], 200);
        }

        $resultado = $this->actividadServicio->cargarActividad($datos, $archivos['archivo']);

        return $response->withJson(['respuesta' => $resultado], 200);
    }

    public function cargarActividadPrevia($request, $response, ValidarCargaActividadPrevia $validador){
        $datos = $request->getParams();
        $archivos = $request->getUploadedFiles();
        $errores = $validador->validarDatos($datos, $archivos['archivo']);
        if($errores) {
            return $response->withJson(['errores' => $errores], 200);
        }

        $resultado = $this->actividadServicio->cargarActividadPrevia($datos, $archivos['archivo']);

        return $response->withJson(['respuesta' => $resultado], 200);
    }

    public function editarActividad($request, $response, ValidarEditarActividad $validador){
        $datos = $request->getParams();
        //$archivos = $request->getUploadedFiles();
        $errores = $validador->validarDatos($datos, $archivos['archivo']);
        if($errores) {
            return $response->withJson(['errores' => $errores], 200);
        }

        $resultado = $this->actividadServicio->actualizarActividad($datos, $archivos['archivo']);

        return $response->withJson(['respuesta' => $resultado], 200);
    }

    public function editarActividadPrevia($request, $response, ValidarEditarActividadPrevia $validador){
        $datos = $request->getParams();
        //$archivos = $request->getUploadedFiles();
        $errores = $validador->validarDatos($datos, $archivos['archivo']);
        if($errores) {
            return $response->withJson(['errores' => $errores], 200);
        }

        $resultado = $this->actividadServicio->actualizarActividadPrevia($datos, $archivos['archivo']);

        return $response->withJson(['respuesta' => $resultado], 200);
    }

    public function getCategoriasHabilidades($request, $response){
        $actividades = $this->actividadServicio->consultarActividades(1, 15, null);
        $categorias = $this->actividadServicio->consultarCategorias();
        $habilidades = $this->actividadServicio->consultarHabilidades();

        $datos = [
            'actividades' => $actividades,
            'categorias' => $categorias,
            'habilidades' => $habilidades
        ];

        return $response->withJson($datos, 200);
    }

    public function crearCategoria($request, $response, ValidarCrearCategoria $validador){
        $datos = $request->getParams();
        $errores = $validador->validarDatos($datos);
        if($errores){
            return $response->withJson(['errores' => $errores], 200);
        }

        $resultado = $this->actividadServicio->crearCategoria($datos);
        $res = [];
        if($resultado){
            $res['creado'] = true;
            $res['categoria'] = $resultado;
        }else{
            $res['creado'] = false;
        }

        return $response->withJson(['respuesta' => $res], 200);
    }

    public function crearHabilidad($request, $response, ValidarCrearHabilidad $validador){
        $datos = $request->getParams();
        $errores = $validador->validarDatos($datos);
        if($errores){
            return $response->withJson(['errores' => $errores], 200);
        }

        $resultado = $this->actividadServicio->crearHabilidad($datos);
        $res = [];
        if($resultado){
            $res['creado'] = true;
            $res['habilidad'] = $resultado;
        }else{
            $res['creado'] = false;
        }

        return $response->withJson(['respuesta' => $res], 200);
    }
}