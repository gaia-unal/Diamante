<?php

namespace App\Dominio\Modelos;

class Evidencia implements \JsonSerializable{
    private $pruebaId;
    private $actividadId;
    private $ruta;
    private $objetivo;    

    public function __construct($datos = null){
        if (is_array($datos)) {
            $this->pruebaId = $datos['prueba_id'];
            $this->actividadId = $datos['actividad_id'];
            $this->ruta = $datos['ruta_evidencia'];
            $this->objetivo = $datos['objetivo'];
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

    public function setPruebaId($id){
        $this->pruebaId = $id;
    }

    public function setActividadId($id){
        $this->actividadId = $id;
    }

    public function setRuta($ruta){
        $this->ruta = $ruta;
    }

    public function setObjetivo($objetivo){
        $this->objetivo = $objetivo;
    }

    public function jsonSerialize(){
        return [
            'pruebaId' => $this->pruebaId,
            'actividadId' => $this->actividadId,
            'ruta' => $this->ruta,
            'objetivo' => $this->objetivo
        ];
    }
}