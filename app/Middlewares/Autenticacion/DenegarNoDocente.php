<?php

namespace App\Middlewares\Autenticacion;

class DenegarNoDocente extends Autenticacion{

    public function __invoke($request, $response, $next){
        if(!$this->autenticacion->verificarSesionDocente()){
            return $response->withRedirect($this->router->pathFor('inicio'));
        }
        return $next($request, $response);
    }
}