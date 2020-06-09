<?php

namespace App\Validaciones\Reglas;

use Respect\Validation\Rules\AbstractRule;
use App\Dominio\Servicios\DocenteServicio;

class EmailDisponible extends AbstractRule{
    
    protected $docenteServicio;

    public function __construct(DocenteServicio $docenteServicio){
        $this->docenteServicio = $docenteServicio;
    }

    public function validate($input){
        if(empty($this->docenteServicio->consultarPorEmail($input))){
            return true;
        }

        return false;
    }
}