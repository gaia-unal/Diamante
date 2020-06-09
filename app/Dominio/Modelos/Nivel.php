<?php

namespace App\Dominio\Modelos;

class Nivel implements \JsonSerializable{
    private $id;
    private $nombre;
    private $cantidadActividades;
    private $cantidadActividadesManuales;

    public function __construct($datos = null){
        if (is_array($datos)) {
            if (isset($datos['nivel_id'])) $this->id = $datos['nivel_id'];
            $this->nombre = $datos['nombre'];
            $this->cantidadActividades = $datos['cant_actividades'];
            $this->cantidadActividadesManuales = $datos['cant_actividades_man'];
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
            'nombre' => $this->nombre,
            'cantActividades' => (int) $this->cantidadActividades,
            'cantActividadesManuales' => (int) $this->cantidadActividadesManuales
        ];
    }
}
