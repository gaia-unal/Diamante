<?php

namespace App\Dominio\Modelos;

class Habilidad implements \JsonSerializable{
    private $id;
    private $nombre;
    private $esFuncion;

    public function __construct($datos = null){
        if (is_array($datos)) {
            if (isset($datos['habilidad_id'])) $this->id = $datos['habilidad_id'];
            $this->nombre = $datos['nombre'];
            $this->esFuncion = $datos['es_funcion'];
        }
    }

    public function __get($propiedad){
        if (property_exists($this, $propiedad)) {
            return $this->$propiedad;
        }
    }

    public function __isset($propiedad){
        return isset($this->$propiedad);
    }

    public function jsonSerialize(){
        return [
            'id' => $this->id,
            'nombre' => $this->nombre,
            'esFuncion' => $this->esFuncion
        ];
    }
}
