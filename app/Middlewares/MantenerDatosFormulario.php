<?php

namespace App\Middlewares;

use Slim\Views\Twig;

class MantenerDatosFormulario{

    protected $view;

    public function __construct(Twig $view){
        $this->view = $view;
    }

    public function __invoke($request, $response, $next){
        
        if(isset($_SESSION['datos_formulario'])){
            $this->view->getEnvironment()->addGlobal('datos', $_SESSION['datos_formulario']);
        }
        $_SESSION['datos_formulario'] = $request->getParams();

        return $next($request, $response);
    }
}