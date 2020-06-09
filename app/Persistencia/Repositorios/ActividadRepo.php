<?php

namespace App\Persistencia\Repositorios;

use PDO;
use App\Dominio\Repositorios\ActividadRepoInterface;
use App\Dominio\Modelos\Actividad;
use App\Dominio\Modelos\ActividadPrevia;
use App\Dominio\Modelos\Categoria;
use App\Dominio\Modelos\Habilidad;

class ActividadRepo extends Repositorio implements ActividadRepoInterface{

    public function consultarTodos(){
        $sql = 'SELECT * FROM actividad';
        $query = $this->db->query($sql);
        
        return $query->fetchAll();
    }

    public function consultarActividades($limite, $offset, $filtro = null, $gradoId = null, $nivelId = null){
        $sql = 'SELECT * FROM actividad';
        if(!empty($filtro) || !empty($gradoId) || !empty($nivelId)){
            $sql .= ' WHERE';
            if(!empty($gradoId)){
                $sql .= ' grado_id = :grado';
            }
            if(!empty($nivelId)){
                if(!empty($gradoId)) $sql .= ' AND';
                $sql .= ' nivel_id = :nivel';
            }
            if(!empty($filtro)){
                if(!empty($gradoId) || !empty($nivelId)) $sql .= ' AND';
                $filtro = '%' . $filtro . '%';
                $sql .= ' nombre LIKE :quno OR instruccion LIKE :qdos';
            }
        }        
        $sql .= ' ORDER BY grado_id ASC, nivel_id ASC, actividad_id ASC LIMIT :limite OFFSET :offset';
        $query = $this->db->prepare($sql);
        if(!empty($gradoId)){
            $query->bindValue(':grado', (int)$gradoId, PDO::PARAM_INT);
        }
        if(!empty($nivelId)){
            $query->bindValue(':nivel', (int)$nivelId, PDO::PARAM_INT);
        }
        if(!empty($filtro)){
            $query->bindValue(':quno', $filtro, PDO::PARAM_STR);
            $query->bindValue(':qdos', $filtro, PDO::PARAM_STR);
        }
        $query->bindValue(':limite', (int)$limite, PDO::PARAM_INT);
        $query->bindValue(':offset', (int)$offset, PDO::PARAM_INT);
        $query->execute();

        return $query->fetchAll();
    }

    public function consultarActividadesPrevias($limite, $offset, $filtro){
        $sql = 'SELECT * FROM actividad_previa';
        if(!empty($filtro)){
            $filtro = '%' . $filtro . '%';
            $sql .= " WHERE nombre LIKE :qone OR instruccion LIKE :qtwo";
        }
        $sql .= ' ORDER BY actividad_previa_id ASC LIMIT :limite OFFSET :offset';
        $query = $this->db->prepare($sql);
        if(!empty($filtro)){
            $query->bindValue(':qone', $filtro, PDO::PARAM_STR);
            $query->bindValue(':qtwo', $filtro, PDO::PARAM_STR);
        }
        $query->bindValue(':limite', (int)$limite, PDO::PARAM_INT);
        $query->bindValue(':offset', (int)$offset, PDO::PARAM_INT);
        $query->execute();

        return $query->fetchAll();
    }
    
    public function consultarPorId($id){
        $sql = 'SELECT * FROM actividad WHERE actividad_id = :id';
        $query = $this->db->prepare($sql);

        $query->execute(['id' => $id]);

        return $query->fetch();
    }

    public function consultarActividadAleatoria($cantidad){
        $sql = 'SELECT * FROM actividad WHERE actividad_id IN';
        $sql .= ' ( SELECT actividad_id FROM ( SELECT actividad_id FROM actividad';
        $sql .= ' ORDER BY RAND() LIMIT :cantidad ) t)';
        $query = $this->db->prepare($sql);
        $query->bindValue(':cantidad', (int)$cantidad, PDO::PARAM_INT);
        $query->execute();

        return $query->fetchAll();
    }

    public function consultarActividadesAleatorias($gradoId, $nivelId, $limite){
        $sql = 'SELECT actividad_id FROM actividad WHERE actividad_id IN';
        $sql .= ' (SELECT actividad_id FROM (SELECT actividad_id FROM actividad';
        $sql .= ' WHERE grado_id = :grado AND nivel_id = :nivel';
        $sql .= ' AND tipo_revision = :tipo AND estado = :estado';
        $sql .= ' ORDER BY RAND() LIMIT :limite ) t)';
        $query = $this->db->prepare($sql);
        $query->bindValue(':grado', (int)$gradoId, PDO::PARAM_INT);
        $query->bindValue(':nivel', (int)$nivelId, PDO::PARAM_INT);
        $query->bindValue(':tipo', Actividad::$REV_AUTOMATICA, PDO::PARAM_STR);
        $query->bindValue(':estado', Actividad::$ESTADO_ACTIVA, PDO::PARAM_STR);
        $query->bindValue(':limite', (int)$limite, PDO::PARAM_INT);
        $query->execute();

        return $query->fetchAll();
    }

    public function consultarActividadesManualesAleatorias($gradoId, $nivelId, $limite){
        $sql = 'SELECT actividad_id FROM actividad WHERE actividad_id IN';
        $sql .= ' (SELECT actividad_id FROM (SELECT actividad_id FROM actividad';
        $sql .= ' WHERE grado_id = :grado AND nivel_id = :nivel';
        $sql .= ' AND tipo_revision = :tipo AND estado = :estado';
        $sql .= ' ORDER BY RAND() LIMIT :limite ) t)';
        $query = $this->db->prepare($sql);
        $query->bindValue(':grado', (int)$gradoId, PDO::PARAM_INT);
        $query->bindValue(':nivel', (int)$nivelId, PDO::PARAM_INT);
        $query->bindValue(':tipo', Actividad::$REV_MANUAL, PDO::PARAM_STR);
        $query->bindValue(':estado', Actividad::$ESTADO_ACTIVA, PDO::PARAM_STR);
        $query->bindValue(':limite', (int)$limite, PDO::PARAM_INT);
        $query->execute();

        return $query->fetchAll();
    }

    public function consultarActividadesPreviasAleatorias($limite){
        $sql = 'SELECT * FROM actividad_previa WHERE actividad_previa_id IN';
        $sql .= ' (SELECT actividad_previa_id FROM (SELECT actividad_previa_id FROM actividad_previa';
        $sql .= ' WHERE estado = :estado';
        $sql .= ' ORDER BY RAND() LIMIT :limite ) t)';
        $query = $this->db->prepare($sql);
        $query->bindValue(':estado', ActividadPrevia::$ESTADO_ACTIVA, PDO::PARAM_STR);
        $query->bindValue(':limite', (int)$limite, PDO::PARAM_INT);
        $query->execute();

        return $query->fetchAll();
    }

    public function consultarCantidadActividades($filtro = null, $gradoId = null, $nivelId = null){
        $sql = 'SELECT COUNT(*) AS cantidad FROM actividad';
        if(!empty($filtro) || !empty($gradoId || !empty($nivelId))){
            $sql .= ' WHERE';
            if(!empty($gradoId)){
                $sql .= ' grado_id = :grado';
            }
            if(!empty($nivelId)){
                if(!empty($gradoId)) $sql .= ' AND';
                $sql .= ' nivel_id = :nivel';
            }
            if(!empty($filtro)){
                if(!empty($gradoId) || !empty($nivelId)) $sql .= ' AND';
                $filtro = '%' . $filtro . '%';
                $sql .= ' (nombre LIKE :quno OR instruccion LIKE :qdos)';
            }
        }
        $query = $this->db->prepare($sql);
        if(!empty($gradoId)){
            $query->bindValue(':grado', (int)$gradoId, PDO::PARAM_INT);
        }
        if(!empty($nivelId)){
            $query->bindValue(':nivel', (int)$nivelId, PDO::PARAM_INT);
        }
        if(!empty($filtro)){
            $query->bindValue(':quno', $filtro, PDO::PARAM_STR);
            $query->bindValue(':qdos', $filtro, PDO::PARAM_STR);
        }        
        $query->execute();

        $resultado = $query->fetch(PDO::FETCH_ASSOC);

        if($resultado['cantidad']) return (int)$resultado['cantidad'];
        return 0;
    }

    public function consultarCantidadActividadesPorGradoNivel($gradoId, $nivelId){
        $sql = 'SELECT COUNT(*) AS cantidad FROM actividad WHERE grado_id = :grado AND nivel_id = :nivel';
        $query = $this->db->prepare($sql);
        $query->bindValue(':grado', (int)$gradoId, PDO::PARAM_INT);
        $query->bindValue(':nivel', (int)$nivelId, PDO::PARAM_INT);
        
        $query->execute();

        $query = $query->fetch();
        if($query) return (int) $query['cantidad'];
        return 0;
    }

    public function consultarCantidadActividadesPrevias(){
        $sql = 'SELECT COUNT(*) AS cantidad FROM actividad_previa';
        $query = $this->db->query($sql);
        $query = $query->fetch();

        if($query) return (int) $query['cantidad'];
        return 0;
    }

    public function crearActividad(Actividad $actividad){
        $sql = 'INSERT INTO actividad (nombre, descripcion, instruccion, ruta_archivo,';
        $sql .= ' grado_id, nivel_id, categoria_id, tipo_revision, estado, fecha_creacion)';
        $sql .= ' VALUES (:nombre, :descripcion, :instruccion, :ruta,';
        $sql .= ' :grado, :nivel, :categoria, :tipo, :estado, :fecha)';

        $query = $this->db->prepare($sql);
        
        $params = [
            ':nombre' => $actividad->nombre, ':descripcion' => $actividad->descripcion,
            ':instruccion' => $actividad->instruccion, ':ruta' => $actividad->rutaArchivo,
            ':grado' => $actividad->gradoId, ':nivel' => $actividad->nivelId,
            ':categoria' => $actividad->categoriaId, ':tipo' => $actividad->tipoRevision,
            ':estado' => $actividad->estado, ':fecha' => $actividad->fechaCreacion
        ];
        
        $query = $query->execute($params);

        if($query){
            return $this->db->lastInsertId();
        }

        return false;
    }

    public function crearActividadPrevia(ActividadPrevia $actividad){
        $sql = 'INSERT INTO actividad_previa (nombre, descripcion, instruccion, ruta_archivo, estado, fecha_creacion)';
        $sql .= ' VALUES (:nombre, :descripcion, :instruccion, :ruta, :estado, :fecha)';

        $query = $this->db->prepare($sql);
        
        $params = [
            ':nombre' => $actividad->nombre, ':descripcion' => $actividad->descripcion,
            ':instruccion' => $actividad->instruccion, ':ruta' => $actividad->rutaArchivo,
            ':estado' => $actividad->estado, ':fecha' => $actividad->fechaCreacion
        ];
        
        $query = $query->execute($params);

        if($query){
            return $this->db->lastInsertId();
        }

        return false;
    }

    public function actualizarActividad(Actividad $actividad){
        $sql = 'UPDATE actividad SET';
        $sql .= ' nombre = :nombre, descripcion = :descripcion, instruccion = :instruccion,';
        $sql .= ' categoria_id = :categoria, tipo_revision = :tipo, estado = :estado';
        $sql .= ' WHERE actividad_id = :id';

        $query = $this->db->prepare($sql);
        $params = [
            ':id' => $actividad->id,
            ':nombre' => $actividad->nombre,
            ':descripcion' => $actividad->descripcion,
            ':instruccion' => $actividad->instruccion,
            ':categoria' => $actividad->categoriaId,
            ':tipo' => $actividad->tipoRevision,
            ':estado' => $actividad->estado
        ];

        return $query->execute($params);
    }

    public function actualizarActividadPrevia(ActividadPrevia $actividad){
        $sql = 'UPDATE actividad_previa SET';
        $sql .= ' nombre = :nombre, descripcion = :descripcion, instruccion = :instruccion, estado = :estado';
        $sql .= ' WHERE actividad_previa_id = :id';

        $query = $this->db->prepare($sql);
        $params = [
            ':id' => $actividad->id,
            ':nombre' => $actividad->nombre,
            ':descripcion' => $actividad->descripcion,
            ':instruccion' => $actividad->instruccion,
            ':estado' => $actividad->estado
        ];

        return $query->execute($params);
    }

    public function consultarGrados(){
        $sql = 'SELECT * FROM grado ORDER BY grado_id ASC';
        $query = $this->db->prepare($sql);
        $query->execute();
    
        return $query->fetchAll();
    }

    public function eliminarActividad($id){
        $sql = 'DELETE FROM actividad WHERE actividad_id = :id';
        $query = $this->db->prepare($sql);

        return $query->execute(['id' => $id]);
    }

    public function eliminarActividadPrevia($id){
        $sql = 'DELETE FROM actividad_previa WHERE actividad_previa_id = :id';
        $query = $this->db->prepare($sql);

        return $query->execute(['id' => $id]);
    }

    public function consultarNiveles(){
        $sql = 'SELECT * FROM nivel ORDER BY nivel_id ASC';
        $query = $this->db->prepare($sql);
        $query->execute();

        return $query->fetchAll();
    }
    
    public function consultarCategorias(){
        $sql = 'SELECT * FROM categoria ORDER BY categoria_id ASC';
        
        $query = $this->db->query($sql);
        return $query->fetchAll();
    }

    public function consultarCategoriaPorId($categoriaId){
        $sql = 'SELECT * FROM categoria WHERE categoria_id = :id';
        $query = $this->db->prepare($sql);
        $query->execute([':id' => $categoriaId]);

        return $query->fetch();
    }

    public function consultarCategoriasPorNivel($nivelId){
        $sql = 'SELECT * FROM categoria WHERE nivel_id = :nivel ORDER BY categoria_id ASC';
        $query = $this->db->prepare($sql);

        $query->execute(['nivel' => $nivelId]);

        return $query->fetchAll();
    }

    public function crearCategoria(Categoria $categoria){
        $sql = 'INSERT INTO categoria (nivel_id, nombre) VALUES (:nivel, :nombre)';

        $query = $this->db->prepare($sql);        
        $params = [
            ':nivel' => $categoria->nivelId,
            ':nombre' => $categoria->nombre
        ];
        $query = $query->execute($params);

        if($query){
            return $this->db->lastInsertId();
        }
        return false;
    }

    public function consultarHabilidades(){
        $sql = 'SELECT * FROM habilidad ORDER BY habilidad_id ASC';
        $query = $this->db->prepare($sql);
        $query->execute();
    
        return $query->fetchAll();
    }

    public function consultarHabilidadesDeActividad($actividadId){
        $sql = 'SELECT habilidad_id AS id FROM actividad_habilidad WHERE actividad_id = :id';
        $query = $this->db->prepare($sql);
        $query->execute([':id' => (int)$actividadId]);
    
        return $query->fetchAll();
    }

    public function crearHabilidad(Habilidad $habilidad){
        $sql = 'INSERT INTO habilidad (nombre, es_funcion) VALUES (:nombre, :funcion)';

        $query = $this->db->prepare($sql);        
        $params = [
            ':nombre' => $habilidad->nombre,
            ':funcion' => $habilidad->esFuncion
        ];
        $query = $query->execute($params);

        if($query){
            return $this->db->lastInsertId();
        }
        return false;
    }
    
    public function asociarHabilidadesActividad($actividadId, $arregloId){
        $sql = 'INSERT INTO actividad_habilidad (actividad_id, habilidad_id) VALUES';

        $cant = count($arregloId);
        for ($i = 0; $i < $cant; $i++){
            $sql .= ' (?,?),';
        }

        $sql = rtrim($sql, ',');

        $query = $this->db->prepare($sql);
        
        $params = [];
        for ($i = 0; $i < $cant; $i++){
            array_push($params, $actividadId, $arregloId[$i]);
        }
        
        return $query->execute($params);
    }

    public function eliminarHabilidadesActividad($actividadId){
        $sql = 'DELETE FROM actividad_habilidad WHERE actividad_id = :id';
        $query = $this->db->prepare($sql);
        $params = [
            ':id' => (int)$actividadId
        ];

        return $query->execute($params);
    }

    public function consultarConfiguracion(){
        $sql = 'SELECT cant_actividades_por_nivel AS cantidad_por_nivel,';
        $sql .= ' cant_actividades_previas AS cantidad_previas FROM configuracion';
        
        $query = $this->db->query($sql);
        return $query->fetch();
    }

    public function actualizarConfiguracion($cantidadPorNivel, $cantidadPrevias){
        
    }
}