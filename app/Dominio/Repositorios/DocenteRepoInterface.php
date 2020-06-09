<?php

namespace App\Dominio\Repositorios;

use App\Dominio\Modelos\Docente;
use App\Dominio\Modelos\Institucion;

interface DocenteRepoInterface{
    public function consultarTodos();
    
    public function consultarPorId($id);
    
    public function consultarPorEmail($email);

    public function consultarCantidadDocentes();

    public function crear(Docente $docente);

    public function actualizar(Docente $docente);

    public function consultarInstituciones();

    public function consultarCantidadInstituciones();

    public function crearInstitucion(Institucion $institucion);    
}