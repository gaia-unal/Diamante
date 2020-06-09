<?php

namespace App\Persistencia\Repositorios;

use PDO;
use App\Dominio\Repositorios\EstudianteRepoInterface;
use App\Dominio\Modelos\Estudiante;
use App\Dominio\Modelos\Prueba;

class EstudianteRepo extends Repositorio implements EstudianteRepoInterface{

    public function consultarTodos(){
        $sql = 'SELECT * FROM estudiante';
        $query = $this->db->query($sql);
        
        return $query->fetchAll();
    }
    
    public function consultarPorId($id){
        $sql = 'SELECT * FROM estudiante WHERE estudiante_id = :id';
        $query = $this->db->prepare($sql);

        $query->execute(['id' => $id]);

        return $query->fetch();
    }
    
    public function consultarPorUsuario($usuario){
        $sql = 'SELECT * FROM estudiante WHERE usuario = :usuario';
        $query = $this->db->prepare($sql);

        $query->execute(['usuario' => $usuario]);

        return $query->fetch();
    }

    public function consultarPorDocente($docenteId, $gradoId = null, $estado = null){
        $sql = 'SELECT * FROM estudiante WHERE docente_id = :id';
        $params = ['id' => $docenteId];
        if(!empty($gradoId)){
            $sql .= ' AND grado_id = :grado';
            $params['grado'] = $gradoId;
        }
        if(!empty($estado)){
            $sql .= ' AND estado = :estado';
            $params['estado'] = $estado;
        }
        $sql .= ' ORDER BY grado_id ASC';
        $query = $this->db->prepare($sql);
        $query->execute($params);

        return $query->fetchAll();
    }

    public function consultarCantidadEstudiantes(){
        $sql = 'SELECT COUNT(*) AS cantidad FROM estudiante';
        $query = $this->db->query($sql);
        $query = $query->fetch();

        if($query) return (int) $query['cantidad'];
        return 0;
    }
    
    public function crear(Estudiante $estudiante){
        $sql = 'INSERT INTO estudiante (docente_id, nombre, apellido, usuario, genero, fecha_nacimiento, grado_id, password, observacion, estado, fecha_creacion)';
        $sql .= ' VALUES (:docente_id, :nombre, :apellido, :usuario, :genero, :fecha_nacimiento, :grado_id, :password, :observacion, :estado, :fecha_creacion)';

        $query = $this->db->prepare($sql);
        $params = array(
            ':docente_id' => $estudiante->docenteId, ':nombre' => $estudiante->nombre, ':apellido' => $estudiante->apellido,
            ':usuario' => $estudiante->usuario, ':genero' => $estudiante->genero, ':fecha_nacimiento' => $estudiante->fechaNacimiento,
            ':grado_id' => $estudiante->gradoId, ':password' => $estudiante->password, ':observacion' => $estudiante->observacion,
            ':estado' => $estudiante->estado, ':fecha_creacion' => $estudiante->fechaCreacion
        );

        $query = $query->execute($params);

        if($query){
            return $this->db->lastInsertId();
        }

        return false;
    }

    public function actualizar(Estudiante $estudiante){

    }

    public function actualizarPassword($id, $password){
        $sql = 'UPDATE estudiante SET password = :password WHERE estudiante_id = :id';

        $query = $this->db->prepare($sql);
        $params = array(':id' => $id, ':password' => $password);

        return $query->execute($params);
    }

    public function actualizarUltimoAcceso($id, $fecha){
        $sql = 'UPDATE estudiante SET ultimo_acceso = :fecha WHERE estudiante_id = :id';

        $query = $this->db->prepare($sql);
        $params = array(':id' => $id, ':fecha' => $fecha);

        return $query->execute($params);
    }

    public function actualizarEstado($id, $estado){
        $sql = 'UPDATE estudiante SET estado = :estado WHERE estudiante_id = :id';

        $query = $this->db->prepare($sql);
        $params = array(':id' => $id, ':estado' => $estado);

        return $query->execute($params);
    }

    public function consultarCantidadEstudiantesDeDocente($docenteId, $estado = null){
        $sql = 'SELECT COUNT(*) AS cantidad FROM estudiante WHERE docente_id = :id';
        if(!empty($estado)) $sql .= ' AND estado = :estado';
        $query = $this->db->prepare($sql);
        $query->bindValue(':id', (int)$docenteId, PDO::PARAM_INT);
        if(!empty($estado)) $query->bindValue(':estado', $estado, PDO::PARAM_STR);
        
        $query->execute();

        $query = $query->fetch();
        if($query) return (int) $query['cantidad'];
        return 0;
    }

    public function consultarCantidadReportesDisponibles($docenteId){
        $sql = 'SELECT COUNT(DISTINCT p.estudiante_id) AS cantidad';
        $sql .= ' FROM prueba p INNER JOIN estudiante e ON p.estudiante_id = e.estudiante_id';
        $sql .= " WHERE e.docente_id = :id AND p.estado = :estado";
        $query = $this->db->prepare($sql);
        $query->bindValue(':id', (int)$docenteId, PDO::PARAM_INT);
        $query->bindValue(':estado', Prueba::$CALIFICADA, PDO::PARAM_STR);
        
        $query->execute();

        $query = $query->fetch();
        if($query) return (int) $query['cantidad'];
        return 0;
    }

    public function consultarEstudiantesParaReportes($docenteId){
        $sql = "SELECT DISTINCT p.estudiante_id, CONCAT(e.nombre, ' ', e.apellido) as nombre,";
        $sql .= ' e.usuario, e.grado_id';
        $sql .= ' FROM prueba p INNER JOIN estudiante e ON p.estudiante_id = e.estudiante_id';
        $sql .= " WHERE e.docente_id = :id AND p.estado = :estado";
        $params = [
            ':id' => (int)$docenteId,
            ':estado' => Prueba::$CALIFICADA
        ];

        $query = $this->db->prepare($sql);
        $query->execute($params);

        return $query->fetchAll();
    }
}