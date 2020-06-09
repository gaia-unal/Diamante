<?php

namespace App\Dominio\Repositorios;

use App\Dominio\Modelos\Administrador;

interface AdministradorRepoInterface{
    public function consultarTodos();
    
    public function consultarPorId($id);

    public function consultarPorEmail($email);
    
    public function crear(Administrador $administrador);

    public function actualizar(Administrador $administrador);
}