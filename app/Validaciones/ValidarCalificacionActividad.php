<?php

namespace App\Validaciones;

use Respect\Validation\Validator as v;

class ValidarCalificacionActividad extends Validacion{
    
    public function validarAJAX($datos){
        $reglas = [
            'docente' => v::notEmpty()->numeric()->intVal()->positive(),
            'estudiante' => v::notEmpty()->numeric()->intVal()->positive(),
            'prueba' => v::notEmpty()->numeric()->intVal()->positive(),
            'actividad' => v::notEmpty()->numeric()->intVal()->positive(),
            'calificacion' => v::numeric()->intVal()
        ];

        $this->verificarReglas($datos, $reglas);

        if(!empty($this->errores)){
            return $this->errores;
        }

        return false;
    }
}