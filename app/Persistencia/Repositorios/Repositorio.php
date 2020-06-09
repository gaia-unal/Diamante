<?php

namespace App\Persistencia\Repositorios;

use PDO;

abstract class Repositorio{
    
    protected $db;

    public function __construct(PDO $db){
        $this->db = $db;
    }
}