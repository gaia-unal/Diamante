<?php

namespace App\Middlewares\Autenticacion;

use Slim\Router;
use App\Dominio\Servicios\AutenticacionServicio;

abstract class Autenticacion{
    
    protected $router;
    protected $autenticacion;

    public function __construct(Router $router, AutenticacionServicio $autenticacion){
        $this->router = $router;
        $this->autenticacion = $autenticacion;
    }
}