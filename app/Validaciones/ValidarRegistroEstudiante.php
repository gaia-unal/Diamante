<?php

namespace App\Validaciones;

use Respect\Validation\Validator as v;

class ValidarRegistroEstudiante extends Validacion{
    
    public function validarAJAX($datos){
        $reglas = [
            'nombre' => v::notEmpty()->alpha('áÁéÉíÍóÓúÚüñÑ'),
            'apellido' => v::notEmpty()->alpha('áÁéÉíÍóÓúÚüñÑ'),
            'genero' => v::notEmpty()->stringType()->length(null, 1)->regex('/M|F/'),
            'fecha_nacimiento' => v::notEmpty()->date('Y-m-d'),
            'grado' => v::notEmpty()->intVal()
        ];

        $this->verificarReglas($datos, $reglas);

        if(!empty($this->errores)){
            return $this->errores;
        }

        return false;
    }
}