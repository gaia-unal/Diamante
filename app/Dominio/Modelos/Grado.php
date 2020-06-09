<?php

namespace App\Dominio\Modelos;

class Grado implements \JsonSerializable{
    private $id;
    private $nombre;

    public function __construct($datos = null){
        if (is_array($datos)) {
            if (isset($datos['grado_id'])) $this->id = $datos['grado_id'];
            $this->nombre = $datos['nombre'];
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
            'id' => (int) $this->id,
            'nombre' => $this->nombre
        ];
    }
}
