<?php

namespace App\Dominio\Modelos;

class Prueba implements \JsonSerializable{
    private $id;
    private $estudianteId;
    private $fechaInicio;
    private $fechaFin;
    private $estado;

    // Estados de una prueba
    public static $PENDIENTE = 'P';
    public static $TERMINADA = 'T';
    public static $CALIFICADA = 'C';

    public function __construct($datos = null){
        if (is_array($datos)) {
            if (isset($datos['prueba_id'])) $this->id = $datos['prueba_id'];
            $this->estudianteId = $datos['estudiante_id'];
            $this->fechaInicio = $datos['fecha_inicio'];
            $this->fechaFin = $datos['fecha_fin'];
            $this->estado = $datos['estado'];
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

    public function setId($id){
        $this->id = $id;
    }

    public function setEstudianteId($id){
        $this->estudianteId = $id;
    }

    public function setFechaInicio($fecha){
        $this->fechaInicio = $fecha;
    }

    public function setFechaFin($fecha){
        $this->fechaFin = $fecha;
    }

    public function setEstado($estado){
        $this->estado = $estado;
    }

    public function jsonSerialize(){
        return [
            'id' => (int) $this->id,
            'estudianteId' => (int) $this->estudianteId,
            'fechaInicio' => $this->fechaInicio,
            'fechaFin' => $this->fechaFin,
            'estado' => $this->estado
        ];
    }
}