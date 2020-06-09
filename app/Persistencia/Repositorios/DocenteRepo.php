<?php

namespace App\Persistencia\Repositorios;

use PDO;
use App\Dominio\Repositorios\DocenteRepoInterface;
use App\Dominio\Modelos\Docente;
use App\Dominio\Modelos\Institucion;

class DocenteRepo extends Repositorio implements DocenteRepoInterface{

    public function consultarTodos(){
        $sql = 'SELECT * FROM docente ORDER BY apellido ASC';
        $query = $this->db->query($sql);
        
        return $query->fetchAll();
    }
    
    public function consultarPorId($id){
        $sql = 'SELECT * FROM docente WHERE docente_id = :id';
        $query = $this->db->prepare($sql);

        $query->execute(['id' => $id]);

        return $query->fetch();
    }
    
    public function consultarPorEmail($email){
        $sql = 'SELECT * FROM docente WHERE email = :email';
        $query = $this->db->prepare($sql);

        $query->execute(['email' => $email]);

        return $query->fetch();
    }

    public function consultarCantidadDocentes(){
        $sql = 'SELECT COUNT(*) AS cantidad FROM docente';
        $query = $this->db->query($sql);
        $query = $query->fetch();

        if($query) return (int) $query['cantidad'];
        return 0;
    }

    public function crear(Docente $docente){
        $sql = 'INSERT INTO docente (nombre, apellido, institucion_id, email, password, fecha_creacion)';
        $sql .= ' VALUES (:nombre, :apellido, :institucion, :email, :password, :fecha_creacion)';

        $query = $this->db->prepare($sql);
        $params = [
            ':nombre' => $docente->nombre, ':apellido' => $docente->apellido,
            ':institucion' => $docente->institucionId, ':email' => $docente->email,
            ':password' => $docente->password, ':fecha_creacion' => $docente->fechaCreacion
        ];
        
        return $query->execute($params);
    }

    public function actualizar(Docente $docente){

    }

    public function consultarInstituciones(){
        $sql = 'SELECT * FROM institucion WHERE institucion_id <> 0 ORDER BY nombre ASC';

        $query = $this->db->query($sql);
        
        return $query->fetchAll();
    }

    public function consultarCantidadInstituciones(){
        $sql = 'SELECT COUNT(*) AS cantidad FROM institucion';
        $query = $this->db->query($sql);
        $query = $query->fetch();

        if($query) return (int) $query['cantidad'];
        return 0;
    }
        
    public function crearInstitucion(Institucion $institucion){
    
    }
}