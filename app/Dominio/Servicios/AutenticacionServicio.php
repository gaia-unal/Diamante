<?php

namespace App\Dominio\Servicios;

use App\Dominio\Repositorios\DocenteRepoInterface;
use App\Dominio\Repositorios\EstudianteRepoInterface;
use App\Dominio\Repositorios\AdministradorRepoInterface;
use App\Dominio\Modelos\Docente;
use App\Dominio\Modelos\Estudiante;
use App\Dominio\Modelos\Administrador;
use App\Utilidades\UtilidadesGenerales;

class AutenticacionServicio {
    
    private $docenteRepositorio;
    private $estudianteRepositorio;
    private $adminRepositorio;

    public function __construct(DocenteRepoInterface $docenteRepo, EstudianteRepoInterface $estudianteRepo, AdministradorRepoInterface $adminRepo){
        $this->docenteRepositorio = $docenteRepo;
        $this->estudianteRepositorio = $estudianteRepo;
        $this->adminRepositorio = $adminRepo;
    }

    public function verificarCuentaEstudiante($usuario){
        $resultado = 'ERROR';
        $datos = $this->estudianteRepositorio->consultarPorUsuario($usuario);
        if($datos){
            $estudiante = new Estudiante($datos);
            if(empty($estudiante->password)){
                $resultado = 'NUEVO'; // Primer inicio de sesión
                $this->prepararCompletarRegistroEstudiante($estudiante);
            }else{
                $resultado = 'EXISTE'; // Cuenta normal
            }
        }
        
        return $resultado;
    }

    private function prepararCompletarRegistroEstudiante($estudiante){
        unset($_SESSION['estudiante']);
        $usuario = [
            'id' => $estudiante->id,
            'nombre' => $estudiante->getNombreCompleto(),
            'usuario' => $estudiante->usuario,
            'estado' => $estudiante->estado,
            'completar_cuenta' => true
        ];
        $_SESSION['estudiante'] = $usuario;
    }

    public function verificarCompletarRegistroEstudiante(){
        if(isset($_SESSION['estudiante']) && !empty($_SESSION['estudiante']['completar_cuenta'])) return true;

        return false;
    }

    public function obtenerEstudianteACompletar(){
        return $_SESSION['estudiante'];
    }

    public function terminarCompletarRegistroEstudiante(){
        unset($_SESSION['estudiante']);
    }

    public function iniciarSesionEstudiante($usuario, $password){
        $datos = $this->estudianteRepositorio->consultarPorUsuario($usuario);
        if($datos){
            $estudiante = new Estudiante($datos);
            if(password_verify($password, $estudiante->password)){
                $usuario = [
                    'id' => $estudiante->id,
                    'nombre' => $estudiante->getNombreCompleto(),
                    'usuario' => $estudiante->usuario,
                    'grado' => $estudiante->gradoId,
                    'estado' => $estudiante->estado,
                    'tipo' => 'ESTUDIANTE'
                ];
                $_SESSION['usuario'] = $usuario;
                $this->estudianteRepositorio->actualizarUltimoAcceso($estudiante->id, UtilidadesGenerales::fechaActual());
                return true;
            }
        }
        
        return false;
    }
    
    public function iniciarSesionDocente($email, $password){
        $datos = $this->docenteRepositorio->consultarPorEmail($email);
        if($datos){
            $docente = new Docente($datos);
            if(password_verify($password, $docente->password)){
                $usuario = [
                    'id' => $docente->id,
                    'nombre' => $docente->nombre,
                    'apellido' => $docente->apellido,
                    'email' => $docente->email,
                    'tipo' => 'DOCENTE'
                ];
                $_SESSION['usuario'] = $usuario;
                return true;
            }
        }

        return false;
    }

    public function iniciarSesionAdmin($email, $password){
        $datos = $this->adminRepositorio->consultarPorEmail($email);
        if($datos){
            $admin = new Administrador($datos);
            if(password_verify($password, $admin->password)){
                $usuario = [
                    'id' => $admin->id,
                    'nombre' => $admin->nombre,
                    'apellido' => $admin->apellido,
                    'email' => $admin->email,
                    'tipo' => 'ADMIN'
                ];
                $_SESSION['usuario'] = $usuario;
                return true;
            }
        }

        return false;
    }

    public function verificarSesionEstudiante(){
        if(isset($_SESSION['usuario']['id']) && $_SESSION['usuario']['tipo'] == 'ESTUDIANTE'){
            return true;
        }
        return false;
    }

    public function verificarSesionDocente(){
        if(isset($_SESSION['usuario']['id']) && $_SESSION['usuario']['tipo'] == 'DOCENTE'){
            return true;
        }
        return false;
    }

    public function verificarSesionAdmin(){
        if(isset($_SESSION['usuario']['id']) && $_SESSION['usuario']['tipo'] == 'ADMIN'){
            return true;
        }
        return false;
    }

    public function obtenerUsuarioActual(){
        return $_SESSION['usuario'];
    }

    public function obtenerDocente(){
        $usuario = $this->docenteRepositorio->consultarPorId($this->obtenerIdUsuarioActual());
        $usuario['password'] = null;
        return new Docente($usuario);
    }

    public function obtenerIdUsuarioActual(){
        return (int)$_SESSION['usuario']['id'];
    }

    public function actualizarEstadoEstudianteActual($estado){
        $_SESSION['usuario']['estado'] = $estado;
    }

    public function cerrarSesion(){
        unset($_SESSION['usuario']);
    }
}