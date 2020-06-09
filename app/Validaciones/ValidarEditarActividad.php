<?php

namespace App\Validaciones;

use Respect\Validation\Validator as v;

class ValidarEditarActividad extends Validacion{

    public function validarDatos($datos, $archivo){
        $reglas = [
            'id' => v::notEmpty(),
            'nombre' => v::notEmpty(),
            'descripcion' => v::notEmpty(),
            'instruccion' => v::notEmpty(),
            'categoria' => v::notEmpty(),
            'habilidades' => v::notEmpty(),
            'revision' => v::notEmpty(),
            'estado' => v::notEmpty(),
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