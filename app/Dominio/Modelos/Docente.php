<?php

namespace App\Dominio\Modelos;

class Docente{
    private $id;
    private $nombre;
    private $apellido;
    private $institucionId;
    private $email;
    private $password;
    private $fechaCreacion;

    public function __construct($datos = null){
        if(is_array($datos)){
            if(isset($datos['docente_id'])) $this->id = $datos['docente_id'];
            $this->nombre = $datos['nombre'];
            $this->apellido = $datos['apellido'];
            $this->institucionId = $datos['institucion_id'];
            $this->email = $datos['email'];
            $this->password = $datos['password'];
            $this->fechaCreacion = $datos['fecha_creacion'];
        }
    }

    public function getNombreCompleto(){
        return $this->nombre . ' ' . $this->apellido;
    }

    public function __get($propiedad){
        if (property_exists($this, $propiedad)) return $this->$propiedad;
    }

    public function __isset($propiedad) {
        return isset($this->$propiedad);
    }
}