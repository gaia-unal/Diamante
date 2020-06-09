<?php

namespace App\Middlewares\Autenticacion;

class DenegarNoEstudiante extends Autenticacion{

    public function __invoke($request, $response, $next){
        if(!$this->autenticacion->verificarSesionEstudiante()){
            return $response->withRedirect($this->router->pathFor('inicio'));
        }
        return $next($request, $response);
    }
}