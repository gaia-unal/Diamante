<?php

namespace App\Persistencia\Repositorios;

use PDO;
use App\Dominio\Repositorios\PruebaRepoInterface;
use App\Dominio\Modelos\Prueba;
use App\Dominio\Modelos\Evidencia;
use App\Dominio\Modelos\Actividad;

class PruebaRepo extends Repositorio implements PruebaRepoInterface{

    public function consultarPorId($id){
        $sql = 'SELECT * FROM prueba WHERE prueba_id = :id';
        $query = $this->db->prepare($sql);

        $query->execute(['id' => $id]);

        return $query->fetch();
    }

    public function consultarPorEstudiante($estudianteId){
        $sql = 'SELECT * FROM prueba WHERE estudiante_id = :id';
        $query = $this->db->prepare($sql);

        $query->execute(['id' => $estudianteId]);
        
        return $query->fetchAll();
    }

    public function consultarPruebasEstudiantes($estudiantes, $estado = null){
        $sql = 'SELECT * FROM prueba WHERE estudiante_id IN (';
        $cant = count($estudiantes);
        $params = [];
        for ($i = 0; $i < $cant; $i++){
            $sql .= ' ?,';
            array_push($params, $estudiantes[$i]);
        }
        $sql = rtrim($sql, ',');
        $sql .= ')';
        if(!empty($estado)){
            $sql .= ' AND estado = ?';
            array_push($params, $estado);
        }
        $sql .= ' ORDER BY prueba_id ASC';
        $query = $this->db->prepare($sql);
        $query->execute($params);

        return $query->fetchAll();
    }

    public function consultarPruebaPendiente($estudianteId){
        $estado = Prueba::$PENDIENTE;
        $sql = "SELECT * FROM prueba WHERE estudiante_id = :id AND estado = :estado ORDER BY prueba_id DESC LIMIT 1";
        
        $query = $this->db->prepare($sql);
        $query->execute(['id' => $estudianteId, 'estado' => $estado]);

        return $query->fetch();
    }

    public function consultarActividadesPendientes($pruebaId){
        $sql = 'SELECT a.actividad_id, a.instruccion, a.ruta_archivo, a.tipo_revision, pa.orden';
        $sql .= ' FROM actividad a LEFT JOIN prueba_actividad pa ON a.actividad_id = pa.actividad_id';
        $sql .= ' WHERE a.tipo_revision = :tipo AND pa.prueba_id = :prueba AND pa.puntaje_porcentual = -1';
        $sql .= ' ORDER BY pa.orden ASC';
        
        $query = $this->db->prepare($sql);
        $query->bindValue(':tipo', Actividad::$REV_AUTOMATICA, PDO::PARAM_STR);
        $query->bindValue(':prueba', (int)$pruebaId, PDO::PARAM_INT);
        $query->execute();

        return $query->fetchAll();
    }

    public function consultarActividadesManualesPendientes($pruebaId){
        $sql = 'SELECT a.actividad_id, a.instruccion, a.ruta_archivo, a.tipo_revision, pa.orden FROM actividad a';
        $sql .= ' LEFT JOIN prueba_actividad pa ON a.actividad_id = pa.actividad_id';
        $sql .= ' LEFT JOIN evidencia_actividad em ON pa.prueba_id = em.prueba_id';
        $sql .= ' WHERE a.tipo_revision = :tipo AND pa.prueba_id = :prueba';
        $sql .= " AND (em.ruta_evidencia IS NULL OR em.ruta_evidencia = '')";
        $sql .= ' ORDER BY pa.orden ASC';
        
        $query = $this->db->prepare($sql);
        $query->bindValue(':tipo', Actividad::$REV_MANUAL, PDO::PARAM_STR);
        $query->bindValue(':prueba', (int)$pruebaId, PDO::PARAM_INT);
        $query->execute();

        return $query->fetchAll();
    }

    public function contarActividadesPrueba($pruebaId){
        $sql = 'SELECT COUNT(*) AS cantidad FROM prueba_actividad WHERE prueba_id = :prueba';
        $query = $this->db->prepare($sql);
        $query->bindValue(':prueba', (int)$pruebaId, PDO::PARAM_INT);
        
        $query->execute();

        $query = $query->fetch();
        if($query) return $query['cantidad'];
        return 0;
    }

    public function crearPrueba(Prueba $prueba){
        $sql = 'INSERT INTO prueba (estudiante_id, fecha_inicio, estado)';
        $sql .= ' VALUES (:estudiante, :fecha_inicio, :estado)';
        $query = $this->db->prepare($sql);
        $params = [
            ':estudiante' => $prueba->estudianteId,
            ':fecha_inicio' => $prueba->fechaInicio,
            ':estado' => $prueba->estado
        ];

        $query = $query->execute($params);

        if($query){
            return $this->db->lastInsertId();
        }

        return false;
    }

    public function actualizarPrueba(Prueba $prueba){
        $sql = 'UPDATE prueba SET';
        $sql .= ' fecha_fin = :fechaFin , estado = :estado';
        $sql .= ' WHERE prueba_id = :prueba AND estudiante_id = :estudiante';
        
        $query = $this->db->prepare($sql);
        $params = [
            ':fechaFin' => $prueba->fechaFin,
            ':estado' => $prueba->estado,
            ':prueba' => $prueba->id,
            ':estudiante' => $prueba->estudianteId
        ];

        return $query->execute($params);
    }

    public function actualizarEstado($pruebaId, $estado){
        $sql = 'UPDATE prueba SET estado = :estado WHERE prueba_id = :id';

        $query = $this->db->prepare($sql);
        $params = array(':id' => $pruebaId, ':estado' => $estado);

        return $query->execute($params);
    }

    public function eliminarPrueba($pruebaId){
        $sql = 'DELETE FROM prueba WHERE prueba_id = :id';
        $query = $this->db->prepare($sql);

        return $query->execute(['id' => $pruebaId]);
    }

    /**
     * Inserta en BD las actividades asociadas a una prueba
     * * @param int pruebaId ID de la prueba
     * * @param Array actividadesManuales [id]
     * * @param Array actividades [id]
     */
    public function asociarActividadesPrueba($pruebaId, $actividadesManuales, $actividades){
        $sql = 'INSERT INTO prueba_actividad (prueba_id, actividad_id, orden) VALUES';

        $cantM = count($actividadesManuales);
        $cant = count($actividades);

        for ($i = 0; $i < $cantM; $i++){
            $sql .= ' (?,?,?),';
        }

        for ($i = 0; $i < $cant; $i++){
            $sql .= ' (?,?,?),';
        }

        $sql = rtrim($sql, ',');

        $query = $this->db->prepare($sql);
        
        $orden = 0;
        $params = [];
        for ($i = 0; $i < $cantM; $i++){
            $orden++;
            array_push($params, $pruebaId, $actividadesManuales[$i], $orden);
        }
        for ($i = 0; $i < $cant; $i++){
            $orden++;
            array_push($params, $pruebaId, $actividades[$i], $orden);
        }
        
        $operacion = $query->execute($params);
        if($operacion){
            $op = $this->asociarEvidenciasPrueba($pruebaId, $actividadesManuales);
            if($op) return true;
        }

        return false;
    }

    /**
     * Inserta en BD las evidencias asociadas a las actividades manuales de una prueba
     * * @param int pruebaId ID de la prueba
     * * @param Array actividadesManuales [id]
     */
    public function asociarEvidenciasPrueba($pruebaId, $actividadesManuales){
        $sql = 'INSERT INTO evidencia_actividad (prueba_id, actividad_id) VALUES';

        $cant = count($actividadesManuales);
        for ($i = 0; $i < $cant; $i++){
            $sql .= ' (?,?),';
        }

        $sql = rtrim($sql, ',');

        $query = $this->db->prepare($sql);

        $params = [];
        for ($i = 0; $i < $cant; $i++){
            array_push($params, $pruebaId, $actividadesManuales[$i]);
        }
        
        return $query->execute($params);
    }

    public function actualizarActividadPrueba($pruebaId, $actividadId, $puntaje = null, $tiempo = null){
        $set = false;
        $params = [];

        $sql = 'UPDATE prueba_actividad SET';
        if(isset($puntaje)){
            $sql .= ' puntaje_porcentual = :puntaje';
            $set = true;
            $params[':puntaje'] = $puntaje;
        }
        if(isset($tiempo)){
            if($set) $sql .= ' ,';
            $sql .= ' tiempo_segundos = :tiempo';
            $params[':tiempo'] = $tiempo;
        }
        $sql .= ' WHERE prueba_id = :prueba AND actividad_id = :actividad';
        $query = $this->db->prepare($sql);
        $params[':prueba'] = $pruebaId;
        $params[':actividad'] = $actividadId;

        return $query->execute($params);
    }

    public function actualizarEvidencia(Evidencia $evidencia){
        $sql = 'UPDATE evidencia_actividad SET';
        $sql .= ' ruta_evidencia = :ruta , objetivo = :objetivo';
        $sql .= ' WHERE prueba_id = :prueba AND actividad_id = :actividad';
        
        $query = $this->db->prepare($sql);
        $params = [
            ':ruta' => $evidencia->ruta,
            ':objetivo' => $evidencia->objetivo,
            ':prueba' => $evidencia->pruebaId,
            ':actividad' => $evidencia->actividadId
        ];

        return $query->execute($params);
    }

    public function consultarActividadesParaCalificar($pruebaId){
        $sql = 'SELECT ev.actividad_id, a.nombre, ev.ruta_evidencia, ev.objetivo FROM actividad a';
        $sql .= ' LEFT JOIN prueba_actividad pa ON a.actividad_id = pa.actividad_id';
        $sql .= ' LEFT JOIN evidencia_actividad ev ON pa.prueba_id = ev.prueba_id AND pa.actividad_id = ev.actividad_id';
        $sql .= ' WHERE pa.prueba_id = :id AND pa.puntaje_porcentual = -1 AND ev.ruta_evidencia IS NOT NULL';
        $sql .= ' ORDER BY pa.orden ASC';

        $query = $this->db->prepare($sql);
        $query->execute(['id' => $pruebaId]);

        return $query->fetchAll();
    }

    public function contarActividadesSinPuntaje($pruebaId){
        $sql = 'SELECT COUNT(*) AS cantidad FROM prueba_actividad';
        $sql .= " WHERE prueba_id = :id AND puntaje_porcentual = -1";
        $query = $this->db->prepare($sql);
        $query->bindValue(':id', (int)$pruebaId, PDO::PARAM_INT);
        $query->execute();

        $query = $query->fetch();
        if($query) return $query['cantidad'];
        return 0;
    }

    public function consultarPuntajesParaReporte($pruebaId){
        $sql = 'SELECT a.actividad_id, a.nivel_id, a.nombre AS actividad, c.nombre AS categoria, pa.puntaje_porcentual, pa.tiempo_segundos';
        $sql .= ' FROM actividad a';
        $sql .= ' LEFT JOIN categoria c ON a.categoria_id = c.categoria_id';
        $sql .= ' LEFT JOIN prueba_actividad pa ON a.actividad_id = pa.actividad_id';
        $sql .= ' WHERE pa.prueba_id = :prueba';
        $sql .= ' ORDER BY a.nivel_id ASC, pa.orden ASC';
        
        $query = $this->db->prepare($sql);
        $query->bindValue(':prueba', (int)$pruebaId, PDO::PARAM_INT);
        $query->execute();

        return $query->fetchAll();
    }
}