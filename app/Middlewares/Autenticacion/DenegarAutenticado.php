<?php

namespace App\Middlewares\Autenticacion;

use Slim\Router;
use App\Dominio\Servicios\AutenticacionServicio;

class DenegarAutenticado extends Autenticacion{

    public function __invoke($request, $response, $next){
        if($this->autenticacion->verificarSesionEstudiante()){
            return $response->withRedirect($this->router->pathFor('estudiante'));
        }
        if($this->autenticacion->verificarSesionDocente()){
            return $response->withRedirect($this->router->pathFor('docente'));
        }
        if($this->autenticacion->verificarSesionAdmin()){
            return $response->withRedirect($this->router->pathFor('admin'));
        }

        return $next($request, $response);
    }
}