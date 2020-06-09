<?php

namespace App\Dominio\Modelos;

class Categoria implements \JsonSerializable{
    private $id;
    private $nivelId;
    private $nombre;

    public function __construct($datos = null){
        if (is_array($datos)) {
            if (isset($datos['categoria_id'])) $this->id = $datos['categoria_id'];
            $this->nivelId = $datos['nivel_id'];
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
            'id' => $this->id,
            'nivelId' => $this->nivelId,
            'nombre' => $this->nombre
        ];
    }
}
