<?php

namespace App\Controladores;

use Slim\Views\Twig;
use App\Dominio\Servicios\AutenticacionServicio;

class InicioControlador{

    protected $view;

    public function __construct(Twig $view){
        $this->view = $view;
    }

    public function index($request, $response, AutenticacionServicio $autenticacion){
        $usuario = $autenticacion->obtenerUsuarioActual();
        return $this->view->render($response, 'inicio.twig', ['usuario' => $usuario]);
    }
}