<?php

namespace App\Dominio\Repositorios;

use App\Dominio\Modelos\Prueba;
use App\Dominio\Modelos\Evidencia;

interface PruebaRepoInterface{
    public function consultarPorId($pruebaId);

    public function consultarPorEstudiante($estudianteId);

    public function consultarPruebasEstudiantes($estudiantes, $estado);
    
    public function consultarPruebaPendiente($estudianteId);

    public function consultarActividadesPendientes($pruebaId);

    public function consultarActividadesManualesPendientes($pruebaId);

    public function contarActividadesPrueba($pruebaId);

    public function crearPrueba(Prueba $prueba);
    
    public function actualizarPrueba(Prueba $prueba);

    public function actualizarEstado($pruebaId, $estado);

    public function eliminarPrueba($pruebaId);

    public function asociarActividadesPrueba($pruebaId, $actividadesManuales, $actividades);

    public function asociarEvidenciasPrueba($pruebaId, $actividadesManuales);

    public function actualizarActividadPrueba($pruebaId, $actividadId, $puntaje, $tiempo);

    public function actualizarEvidencia(Evidencia $evidencia);

    public function consultarActividadesParaCalificar($pruebaId);

    public function contarActividadesSinPuntaje($pruebaId);

    public function consultarPuntajesParaReporte($pruebaId);
}