<?php

namespace App\Middlewares\Autenticacion;

class DenegarNoAdmin extends Autenticacion{

    public function __invoke($request, $response, $next){
        if(!$this->autenticacion->verificarSesionAdmin()){
            return $response->withRedirect($this->router->pathFor('inicio'));
        }
        return $next($request, $response);
    }
}