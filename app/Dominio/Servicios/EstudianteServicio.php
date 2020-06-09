<?php

namespace App\Dominio\Servicios;

use App\Dominio\Modelos\Estudiante;
use App\Dominio\Repositorios\EstudianteRepoInterface;
use App\Dominio\Servicios\AutenticacionServicio;
use App\Utilidades\UtilidadesGenerales;

class EstudianteServicio{
    
    private $repositorio;
    private $autenticacion;

    public function __construct(EstudianteRepoInterface $repositorio, AutenticacionServicio $autenticacion){
        $this->repositorio = $repositorio;
        $this->autenticacion = $autenticacion;
    }

    public function consultarEstudiantes(){
        $resultado = $this->repositorio->consultarTodos();
        $estudiantes = [];
        if(!empty($resultado)){
            foreach ($resultado as $estudiante) {
                $objeto = new Estudiante($estudiante);
                $objeto->setPassword(null);
                array_push($estudiantes, $objeto);
            }
        }

        return $estudiantes;
    }

    public function consultarPorUsuario($usuario){
        $usuario = $this->repositorio->consultarPorUsuario($usuario);
        if(!empty($usuario)){
            return new Estudiante($usuario);
        }
        return false;
    }

    public function consultarCantidadEstudiantes(){
        return $this->repositorio->consultarCantidadEstudiantes();
    }

    public function registrar($datos){
        
        $datos['nombre'] = trim($datos['nombre']);
        $datos['apellido'] = trim($datos['apellido']);

        $datos['docente_id'] = $this->autenticacion->obtenerIdUsuarioActual();
        
        $datos['usuario'] = $this->generarUsuarioEstudiante($datos);

        // TODO fecha nacimiento

        $datos['grado_id'] = $datos['grado'];

        if(empty($datos['observacion'])) $datos['observacion'] = 'Ninguna';

        // Cuenta recién creada, password se pone nulo para que el estudiante lo pueda establecer
        $datos['password'] = NULL;

        $datos['estado'] = Estudiante::$CUENTA_NO_ACTIVA;
        
        $datos['fecha_creacion'] = date('Y-m-d');
        
        $estudiante = new Estudiante($datos);

        $estudianteCreado = $this->repositorio->crear($estudiante);
        if($estudianteCreado){
            return [
                'id' => $estudianteCreado,
                'usuario' => $estudiante->usuario,
                'estado' => $estudiante->estado
            ];
        }
        
        return false;
    }

    /**
     * Función para generar un usuario único de estudiante.
     * Utiliza el primer y segundo nombre del estudiante, al igual que su primer y segundo apellido.
     * Si el usuario ya existe, se le agrega un sufijo numérico que incrementará hasta que se encuentre un usuario único.
     */
    private function generarUsuarioEstudiante($d){
        $nombre = UtilidadesGenerales::normalizarCadenas($d['nombre']);
        $apellido = UtilidadesGenerales::normalizarCadenas($d['apellido']);

        $nombres = preg_split('~\s+~', $nombre);
        $apellidos = preg_split('~\s+~', $apellido);
        $nombre_1 = $nombres[0];
        $nombre_2 = (count($nombres) > 1) ? $nombres[1] : null;
        $apellido_1 = $apellidos[0];
        $apellido_2 = (count($apellidos) > 1) ? $apellidos[1] : null;

        $usuario = strtolower($nombre_1) . strtolower(substr($apellido_1, 0, 1));

        if(!empty($apellido_2)){
            $usuario .= strtolower(substr($apellido_2, 0, 1));
        }

        $generandoUsuario = true;
        $num = 1;
        $nuevoUsuario = $usuario;

        while($generandoUsuario){
            if($this->repositorio->consultarPorUsuario($nuevoUsuario)){
                $nuevoUsuario = $usuario . $num;
                $num++;
            }else{
                $generandoUsuario = false;
            }
        }

        return $nuevoUsuario;
    }

    public function actualizarPassword($id, $password){
        $password = password_hash($password, PASSWORD_DEFAULT);

        $operacion = $this->repositorio->actualizarPassword($id, $password);

        if($operacion){
            return true;
        }

        return false;
    }

    public function actualizarEstado($id, $estado){
        return $this->repositorio->actualizarEstado($id, $estado);
    }
}