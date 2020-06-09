<?php

namespace App\Dominio\Modelos;

class Estudiante implements \JsonSerializable{

    private $id;
    private $docenteId;
    private $nombre;
    private $apellido;
    private $usuario;
    private $genero;
    private $fechaNacimiento;
    private $gradoId;
    private $password;
    private $observacion;
    private $estado;
    private $fechaCreacion;
    private $ultimoAcceso;

    // Estados de un estudiante
    public static $CUENTA_NO_ACTIVA = 'CN';
    public static $PRUEBA_NO_INICIADA = 'PN';
    public static $PRUEBA_PENDIENTE = 'PP';
    public static $CALIF_PENDIENTE = 'CP';
    public static $PRUEBA_FINALIZADA = 'PF';

    public function __construct($datos = null){
        if(is_array($datos)){
            if(isset($datos['estudiante_id'])) $this->id = $datos['estudiante_id'];
            $this->docenteId = $datos['docente_id'];
            $this->nombre = $datos['nombre'];
            $this->apellido = $datos['apellido'];
            $this->usuario = $datos['usuario'];
            $this->genero = $datos['genero'];
            $this->fechaNacimiento = $datos['fecha_nacimiento'];
            $this->gradoId = $datos['grado_id'];
            $this->password = $datos['password'];
            $this->observacion = $datos['observacion'];
            $this->estado = $datos['estado'];
            $this->fechaCreacion = $datos['fecha_creacion'];
            $this->ultimoAcceso = $datos['ultimo_acceso'];
        }
    }

    public function getNombreCompleto(){
        $nombre = $this->nombre . ' ' . $this->apellido;
        return $nombre;
    }

    public function __get($propiedad){
        if (property_exists($this, $propiedad)) return $this->$propiedad;
    }

    public function setPassword($password){
        $this->password = $password;
    }

    public function __isset($propiedad) {
        return isset($this->$propiedad);
    }

    public function jsonSerialize(){
        return [
            'id' => (int) $this->id,
            'docenteId' => (int) $this->docenteId,
            'nombre' => $this->nombre,
            'apellido' => $this->apellido,
            'usuario' => $this->usuario,
            'genero' => $this->genero,
            'fechaNacimiento' => $this->fechaNacimiento,
            'gradoId' => (int) $this->gradoId,
            'observacion' => $this->observacion,            
            'estado' => $this->estado,
            'fechaCreacion' => $this->fechaCreacion,
            'ultimoAcceso' => $this->ultimoAcceso,
        ];
    }
}