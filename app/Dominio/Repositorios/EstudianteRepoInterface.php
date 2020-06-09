<?php

namespace App\Dominio\Repositorios;

use App\Dominio\Modelos\Estudiante;

interface EstudianteRepoInterface{
    public function consultarTodos();
    
    public function consultarPorId($id);

    public function consultarPorUsuario($usuario);

    public function consultarPorDocente($docenteId, $gradoId, $estado);

    public function consultarCantidadEstudiantes();
    
    public function crear(Estudiante $estudiante);

    public function actualizar(Estudiante $estudiante);

    public function actualizarPassword($id, $password);

    public function actualizarUltimoAcceso($id, $fecha);

    public function actualizarEstado($id, $estado);

    public function consultarCantidadEstudiantesDeDocente($docenteId, $estado = null);

    public function consultarCantidadReportesDisponibles($docenteId);

    public function consultarEstudiantesParaReportes($docenteId);
}