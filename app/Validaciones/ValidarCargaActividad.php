<?php

namespace App\Validaciones;

use Respect\Validation\Validator as v;

class ValidarCargaActividad extends Validacion{

    public function validarDatos($datos, $archivo){
        $reglas = [
            'nombre' => v::notEmpty(),
            'descripcion' => v::notEmpty(),
            'instruccion' => v::notEmpty(),
            'grado' => v::notEmpty(),
            'nivel' => v::notEmpty(),
            'categoria' => v::notEmpty(),
            'habilidades' => v::notEmpty(),
            'revision' => v::notEmpty(),
        ];

        $this->verificarReglas($datos, $reglas);

        $this->validarArchivoActividad($archivo);
        
        if(!empty($this->errores)){
            return $this->errores;
        }

        return false;
    }
}