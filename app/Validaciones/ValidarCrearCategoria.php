<?php

namespace App\Validaciones;

use Respect\Validation\Validator as v;

class ValidarCrearCategoria extends Validacion{

    public function validarDatos($datos){
        $reglas = [
            'nivel' => v::notEmpty(),
            'nombre' => v::notEmpty()
        ];

        $this->verificarReglas($datos, $reglas);

        if(!empty($this->errores)){
            return $this->errores;
        }

        return false;
    }
}