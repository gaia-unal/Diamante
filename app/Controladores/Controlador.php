<?php

namespace App\Controladores;

use Slim\Views\Twig;
use Slim\Router;
use Slim\Flash\Messages;

abstract class Controlador{

    protected $view;
    protected $router;
    protected $flash;

    public function __construct(Twig $view, Router $router, Messages $flash){
        $this->view = $view;
        $this->router = $router;
        $this->flash = $flash;
    }
}