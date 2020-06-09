<?php

namespace App\Dominio\Modelos;

class Institucion implements \JsonSerializable{
    private $id;
    private $nombre;
    private $departamento;
    private $ciudad;

    public function __construct($datos = null){
        if(is_array($datos)){
            if(isset($datos['institucion_id'])) $this->id = $datos['institucion_id'];
            $this->nombre = $datos['nombre'];
            $this->departamento = $datos['departamento'];
            $this->ciudad = $datos['ciudad'];
        }
    }

    public function __get($propiedad){
        if (property_exists($this, $propiedad)) return $this->$propiedad;
    }

    public function __isset($propiedad) {
        return isset($this->$propiedad);
    }

    public function jsonSerialize(){
        return [
            'id' => $this->id,
            'nombre' => $this->nombre,
            'departamento' => $this->departamento,
            'ciudad' => $this->ciudad
        ];
    }
}