<?php

namespace App\Validaciones;

use Respect\Validation\Validator as v;
use App\Dominio\Servicios\DocenteServicio;

class ValidarRegistroDocente extends Validacion{
    
    public function validar($datos, DocenteServicio $docenteServicio){
        $reglas = [
            'nombre' => v::notEmpty()->alpha(),
            'apellido' => v::notEmpty()->alpha(),
            'institucion' => v::notEmpty()->numeric()->intVal()->positive(),
            'email' => v::notEmpty()->email()->emailDisponible($docenteServicio),
            'password' => v::notEmpty(),
            'password_confirmar' => v::notEmpty()->equals($datos['password'])
        ];

        /*print_r($datos);
        echo '<hr>';
        print_r($reglas);
        die();*/

        $this->verificarReglas($datos, $reglas);

        return $this;
    }
}