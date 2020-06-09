<?php

namespace App\Controladores;

use Slim\Views\Twig;
use Slim\Router;
use App\Dominio\Servicios\AutenticacionServicio;
use App\Dominio\Servicios\PruebaServicio;
use App\Dominio\Servicios\EstudianteServicio;
use App\Dominio\Servicios\ActividadServicio;

class EstudianteControlador{

    protected $view;
    protected $router;
    protected $estudianteServicio;
    protected $usuarioActual;

    public function __construct(Twig $view, Router $router, AutenticacionServicio $autenticacion){
        $this->view = $view;
        $this->router = $router;
        $this->estudianteServicio = $estudianteServicio;
        $this->usuarioActual = $autenticacion->obtenerUsuarioActual();
    }

    public function index($request, $response){
        return $this->view->render($response, 'estudiante/inicio.twig', ['usuario' => $this->usuarioActual]);
    }

    public function getPrueba($request, $response, PruebaServicio $pruebaServicio){
        $respuesta = $pruebaServicio->realizarPruebaEstudiante(
            $this->usuarioActual['id'],
            $this->usuarioActual['grado'],
            $this->usuarioActual['estado']
        );

        if($respuesta){
            return $this->view->render($response, 'estudiante/prueba.twig');
        }

        return $response->withRedirect($this->router->pathFor('estudiante'));
    }

    public function postPrueba($request, $response, PruebaServicio $pruebaServicio){
        $datos = $request->getParams();        
        $respuesta = $pruebaServicio->procesarActividad($datos, $this->usuarioActual['id']);

        if(!$respuesta){
            $mensaje = 'Ha ocurrido un error al actualizar la actividad, por favor vuelve a intentarlo';
            return $response->withJson(['error' => $mensaje], 200);
        }

        return $response->withJson(['respuesta' => $respuesta], 200);
    }

    public function getActividadesPrueba($request, $response, PruebaServicio $pruebaServicio){
        // Validar variables de sesión
        $respuesta = $pruebaServicio->obtenerActividadesPendientes($this->usuarioActual['id']);
        if($respuesta){
            $respuesta['urlEnviar'] = $this->router->pathFor('estudiante.prueba');
            $respuesta['urlBase'] = $this->router->pathFor('inicio');
            return $response->withJson(['datos' => $respuesta], 200);
        }

        return $response->withJson(['error' => 'Ha ocurrido un error al obtener las actividades'], 200);
    }
}