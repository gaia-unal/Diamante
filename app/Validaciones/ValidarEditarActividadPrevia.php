<?php

namespace App\Validaciones;

use Respect\Validation\Validator as v;

class ValidarEditarActividadPrevia extends Validacion{

    public function validarDatos($datos, $archivo){
        $reglas = [
            'nombre' => v::notEmpty(),
            'descripcion' => v::notEmpty(),
            'instruccion' => v::notEmpty(),
        ];

        $this->verificarReglas($datos, $reglas);

        if(!empty($archivo)){
            $this->validarArchivoActividad($archivo);
        }
        
        if(!empty($this->errores)){
            return $this->errores;
        }

        return false;
    }
}