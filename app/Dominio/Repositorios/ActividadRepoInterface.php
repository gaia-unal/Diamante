<?php

namespace App\Dominio\Repositorios;

use App\Dominio\Modelos\Actividad;
use App\Dominio\Modelos\ActividadPrevia;
use App\Dominio\Modelos\Grado;
use App\Dominio\Modelos\Nivel;
use App\Dominio\Modelos\Categoria;
use App\Dominio\Modelos\Habilidad;

interface ActividadRepoInterface{
    public function consultarTodos();

    public function consultarActividades($limite, $offset, $filtro, $gradoId, $nivelId);

    public function consultarActividadesPrevias($limite, $offset, $busqueda);
    
    public function consultarPorId($id);
    
    public function consultarActividadAleatoria($cantidad);

    public function consultarActividadesAleatorias($gradoId, $nivelId, $limite);

    public function consultarActividadesManualesAleatorias($gradoId, $nivelId, $limite);

    public function consultarActividadesPreviasAleatorias($limite);

    public function consultarCantidadActividades($filtro, $gradoId, $nivelId);

    public function consultarCantidadActividadesPorGradoNivel($gradoId, $nivelId);

    public function consultarCantidadActividadesPrevias();

    public function crearActividad(Actividad $actividad);
    
    public function crearActividadPrevia(ActividadPrevia $actividad);

    public function actualizarActividad(Actividad $actividad);

    public function actualizarActividadPrevia(ActividadPrevia $actividad);

    public function eliminarActividad($id);

    public function eliminarActividadPrevia($id);
    
    public function consultarGrados();
    
    public function consultarNiveles();

    public function consultarCategorias();

    public function consultarCategoriaPorId($categoriaId);

    public function consultarCategoriasPorNivel($nivelId);

    public function crearCategoria(Categoria $categoria);

    public function consultarHabilidades();

    public function consultarHabilidadesDeActividad($actividadId);

    public function crearHabilidad(Habilidad $habilidad);
    
    public function asociarHabilidadesActividad($actividadId, $habilidadesId);

    public function eliminarHabilidadesActividad($actividadId);

    public function consultarConfiguracion();

    public function actualizarConfiguracion($cantidadPorNivel, $cantidadPrevias);
}