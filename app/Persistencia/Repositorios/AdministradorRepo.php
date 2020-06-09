<?php

namespace App\Persistencia\Repositorios;

use PDO;
use App\Dominio\Repositorios\AdministradorRepoInterface;
use App\Dominio\Modelos\Administrador;

class AdministradorRepo extends Repositorio implements AdministradorRepoInterface{

    public function consultarTodos(){
        $resultados = $this->db->query('SELECT * FROM administrador');
        
        return $resultados->fetchAll();
    }
    
    public function consultarPorId($id){
        $resultado = $this->db->prepare('SELECT * FROM administrador WHERE administrador_id = :id');

        $resultado->execute(['id' => $id]);

        return $resultado->fetch();
    }

    public function consultarPorEmail($email){
        $sql = 'SELECT * FROM administrador WHERE email = :email';
        $resultado = $this->db->prepare($sql);

        $resultado->execute(['email' => $email]);

        return $resultado->fetch();
    }
    
    public function crear(Administrador $administrador){
        
    }

    public function actualizar(Administrador $administrador){}
}