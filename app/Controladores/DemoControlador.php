<?php

namespace App\Controladores;

use App\Dominio\Servicios\ActividadServicio;

class DemoControlador extends Controlador{

    public function index($request, $response, ActividadServicio $actividadServicio){
        $actividades = $actividadServicio->consultarActividadAleatoria();
        
        return $this->view->render($response, 'demo.twig', ['actividades' => $actividades]);
    }
}