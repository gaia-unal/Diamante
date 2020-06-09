<?php

namespace App\Dominio\Modelos;

class ActividadPrevia implements \JsonSerializable{
    private $id;
    private $nombre;
    private $descripcion;
    private $instruccion;
    private $rutaArchivo;
    private $estado;
    private $fechaCreacion;

    // Estados de una actividad previa
    public static $ESTADO_ACTIVA = 'A';
    public static $ESTADO_INACTIVA = 'I';

    public function __construct($datos = null){
        if(is_array($datos)){
            if(isset($datos['actividad_previa_id'])) $this->id = $datos['actividad_previa_id'];
            $this->nombre = $datos['nombre'];
            $this->descripcion = $datos['descripcion'];
            $this->instruccion = $datos['instruccion'];
            $this->rutaArchivo = $datos['ruta_archivo'];
            $this->estado = $datos['estado'];
            $this->fechaCreacion = $datos['fecha_creacion'];
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
            'descripcion' => $this->descripcion,
            'instruccion' => $this->instruccion,
            'rutaArchivo' => $this->rutaArchivo,
            'estado' => $this->estado,
            'fechaCreacion' => $this->fechaCreacion
        ];
    }
}
