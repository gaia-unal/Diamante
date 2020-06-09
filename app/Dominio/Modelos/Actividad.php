<?php

namespace App\Dominio\Modelos;

class Actividad implements \JsonSerializable{
    private $id;
    private $nombre;
    private $descripcion;
    private $instruccion;
    private $rutaArchivo;
    private $gradoId;
    private $nivelId;
    private $categoriaId;
    private $tipoRevision;
    private $estado;
    private $fechaCreacion;

    /* Propiedad opcional para relacionar una actividad con sus habilidades */
    private $habilidades;

    // Tipos de revisión de una actividad
    public static $REV_AUTOMATICA = 'A';
    public static $REV_MANUAL = 'M';

    // Estados de una actividad
    public static $ESTADO_ACTIVA = 'A';
    public static $ESTADO_INACTIVA = 'I';

    public function __construct($datos = null){
        if(is_array($datos)){
            if(isset($datos['actividad_id'])) $this->id = $datos['actividad_id'];
            $this->nombre = $datos['nombre'];
            $this->descripcion = $datos['descripcion'];
            $this->instruccion = $datos['instruccion'];
            $this->rutaArchivo = $datos['ruta_archivo'];
            $this->gradoId = $datos['grado_id'];
            $this->nivelId = $datos['nivel_id'];
            $this->categoriaId = $datos['categoria_id'];
            $this->tipoRevision = $datos['tipo_revision'];
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

    public function setHabilidades($habilidades) {
        $this->habilidades = $habilidades;
    }

    public function jsonSerialize(){
        return [
            'id' => (int) $this->id,
            'nombre' => $this->nombre,
            'descripcion' => $this->descripcion,
            'instruccion' => $this->instruccion,
            'rutaArchivo' => $this->rutaArchivo,
            'gradoId' => (int) $this->gradoId,
            'nivelId' => (int) $this->nivelId,
            'categoriaId' => (int) $this->categoriaId,
            'tipoRevision' => $this->tipoRevision,
            'estado' => $this->estado,
            'fechaCreacion' => $this->fechaCreacion,
            'habilidades' => $this->habilidades
        ];
    }
}
