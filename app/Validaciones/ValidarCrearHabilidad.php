<?php

namespace App\Validaciones;

use Respect\Validation\Validator as v;

class ValidarCrearHabilidad extends Validacion{

    public function validarDatos($datos){
        $reglas = [
            'nombre' => v::notEmpty(),
            'funcion' => v::notEmpty()->numeric()
        ];

        $this->verificarReglas($datos, $reglas);

        if(!empty($this->errores)){
            return $this->errores;
        }

        return false;
    }
}