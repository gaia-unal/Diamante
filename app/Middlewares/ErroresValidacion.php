<?php

namespace App\Middlewares;

use Slim\Views\Twig;

class ErroresValidacion{

    protected $view;

    public function __construct(Twig $view){
        $this->view = $view;
    }

    public function __invoke($request, $response, $next){
        
        if(isset($_SESSION['errores_validacion'])){
            $this->view->getEnvironment()->addGlobal('errores', $_SESSION['errores_validacion']);
            unset($_SESSION['errores_validacion']);
        }

        return $next($request, $response);
    }
}