<?php

namespace App\Dominio\Servicios;

use App\Dominio\Repositorios\AdministradorRepoInterface;
use App\Dominio\Modelos\Administrador;

class AdministradorServicio{
    
    private $repositorio;

    public function __construct(AdministradorRepoInterface $repositorio){
        $this->repositorio = $repositorio;
    }

    public function consultarAdministradores(){
        $admins = $this->repositorio->consultarTodos();
        $resultado = [];
        foreach ($admins as $admin) {
            $res = new Administrador($admin);
            array_push($resultado, $res);
        }
        return $resultado;
    }

    public function consultarDepartamentos() {
        $archivo = file_get_contents(PUBLIC_DIR . 'assets/js/municipios_colombia.min.json');
        $municipios = json_decode($archivo, true);
    }
}