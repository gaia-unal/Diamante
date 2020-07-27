<?php

namespace App\Dominio\Servicios;

use App\Dominio\Modelos\Docente;
use App\Dominio\Modelos\Estudiante;
use App\Dominio\Modelos\Prueba;
use App\Dominio\Modelos\Institucion;
use App\Dominio\Repositorios\DocenteRepoInterface;
use App\Dominio\Repositorios\EstudianteRepoInterface;
use App\Dominio\Repositorios\PruebaRepoInterface;
use App\Dominio\Servicios\PruebaServicio;

class DocenteServicio{
    
    private $docenteRepositorio;
    private $estudianteRepositorio;
    private $pruebaRepositorio;
    private $pruebaServicio;

    public function __construct(
            DocenteRepoInterface $docenteRepo,
            EstudianteRepoInterface $estudianteRepo,
            PruebaRepoInterface $pruebaRepo,
            PruebaServicio $pruebaServicio
            ){
        $this->docenteRepositorio = $docenteRepo;
        $this->estudianteRepositorio = $estudianteRepo;
        $this->pruebaRepositorio = $pruebaRepo;
        $this->pruebaServicio = $pruebaServicio;
        $this->instituciones = $this->consultarInstituciones();
    }

    public function consultarDocentes(){
        $docentes = $this->docenteRepositorio->consultarTodos();
        $resultado = [];
        foreach ($docentes as $docente) {
            $objeto = new Docente($docente);
            array_push($resultado, $objeto);
        }
        return $resultado;
    }

    public function consultarPorEmail($email){
        $docente = $this->docenteRepositorio->consultarPorEmail($email);
        if(!empty($docente)){
            return new Docente($docente);
        }
        return false;
    }

    public function consultarCantidadDocentes(){
        return $this->docenteRepositorio->consultarCantidadDocentes();
    }

    public function consultarEstudiantesDeDocente($id, $grado = null, $estado = null){
        $resultado = $this->estudianteRepositorio->consultarPorDocente($id, $grado, $estado);
        $estudiantes = [];
        foreach ($resultado as $estudiante) {
            $objeto = new Estudiante($estudiante);
            array_push($estudiantes, $objeto);
        }
        return $estudiantes;
    }

    public function registrarDocente($datos){
        $datos['institucion_id'] = ($datos['institucion'] == 99999) ? 0 : $datos['institucion'];
        $datos['password'] = password_hash($datos['password'], PASSWORD_DEFAULT);
        $datos['fecha_creacion'] = date('Y-m-d');
        $docente = new Docente($datos);
        return $this->docenteRepositorio->crear($docente);
    }

    public function consultarInstituciones(){
        $instituciones = $this->docenteRepositorio->consultarInstituciones();
        $resultado = [];
        foreach ($instituciones as $inst){
            $objeto = new Institucion($inst);
            array_push($resultado, $objeto);
        }
        return $resultado;
    }

    public function getInstituciones(){
        return $this->instituciones;
    }

    public function consultarCantidadInstituciones(){
        return $this->docenteRepositorio->consultarCantidadInstituciones();
    }

    public function consultarCantidadEstudiantesDeDocente($docenteId){
        $respuesta = [
            'registrados' => $this->estudianteRepositorio->consultarCantidadEstudiantesDeDocente($docenteId),
            'califPendiente' => $this->estudianteRepositorio->consultarCantidadEstudiantesDeDocente($docenteId, Estudiante::$CALIF_PENDIENTE),
            'reportes' => $this->estudianteRepositorio->consultarCantidadReportesDisponibles($docenteId)
        ];

        return $respuesta;
    }

    public function consultarCalificacionesPendientes($docenteId){
        $resultado = $this->estudianteRepositorio->consultarPorDocente($docenteId, null, Estudiante::$CALIF_PENDIENTE);
        if(empty($resultado)){
            return [
                'pendientes' => false
            ];
        }
        $estudiantes = [];
        $ids = [];
        foreach ($resultado as $estudiante) {
            $objeto = new Estudiante($estudiante);
            array_push($estudiantes, $objeto);
            array_push($ids, $objeto->id);
        }
        $resultado = $this->pruebaRepositorio->consultarPruebasEstudiantes($ids, Prueba::$TERMINADA);
        $pruebas = [];
        foreach ($resultado as $pr) {
            $prueba = [
                'id' => (int) $pr['prueba_id'],
                'estudianteId' => (int) $pr['estudiante_id'],
                'fechaInicio' => $pr['fecha_inicio'],
                'fechaFin' => $pr['fecha_fin'],
                'estado' => $pr['estado'],
                'actividades'=> []
            ];
            $evidencias = $this->pruebaRepositorio->consultarActividadesParaCalificar($prueba['id']);
            foreach ($evidencias as $ev){
                $evidencia = [
                    'id' => (int) $ev['actividad_id'],
                    'nombre' => $ev['nombre'],
                    'imagen' => $ev['ruta_evidencia'],
                    'objetivo' => $ev['objetivo']
                ];
                array_push($prueba['actividades'], $evidencia);
            }
            array_push($pruebas, $prueba);
        }

        return [
            'pendientes' => true,
            'estudiantes' => $estudiantes,
            'pruebas' => $pruebas
        ];
    }

    public function consultarEstudiantesParaReportes($docenteId){
        $resultado = $this->estudianteRepositorio->consultarEstudiantesParaReportes($docenteId);
        $estudiantes = [];

        foreach($resultado as $res){
            $id = $res['estudiante_id'];
            $resultado2 = $this->pruebaRepositorio->consultarPorEstudiante($id);
            $pruebas = [];
            foreach($resultado2 as $res2){
                $prueba = new Prueba($res2);
                array_push($pruebas, $prueba);
            }
            $estudiante = [
                'id' => $id,
                'nombre' => $res['nombre'],
                'usuario' => $res['usuario'],
                'gradoId' => $res['grado_id'],
                'pruebas' => $pruebas
            ];

            array_push($estudiantes, $estudiante);
        }

        return $estudiantes;
    }
}