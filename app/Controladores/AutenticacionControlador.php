<?php

namespace App\Controladores;

use App\Dominio\Servicios\AutenticacionServicio;
use App\Dominio\Servicios\EstudianteServicio;
use App\Dominio\Servicios\DocenteServicio;
use App\Validaciones\ValidarRegistroDocente;
use App\Dominio\Modelos\Estudiante;

class AutenticacionControlador extends Controlador {

    public function loginIndex($request, $response){
        return $this->view->render($response, 'login.twig');
    }
    
    public function getRegistroDocente($request, $response, DocenteServicio $docenteServicio){
        $instituciones = $docenteServicio->consultarInstituciones();

        return $this->view->render($response, 'registro.twig', ['instituciones' => $instituciones]);
    }
    
    public function postRegistroDocente($request, $response, DocenteServicio $docenteServicio, ValidarRegistroDocente $validador){
        $datos = $request->getParams();
        $validador->validar($datos, $docenteServicio);
        $errores = $validador->fallido();
        if($errores){
            return $response->withJson(['errores' => $errores], 200);
        }
        
        $resultado = $docenteServicio->registrarDocente($datos);
        $res = [];
        if($resultado){
            $res['registro'] = true;
            $res['url'] = $this->router->pathFor('auth.login');
        }else{
            $res['registro'] = false;
        }

        return $response->withJson(['respuesta' => $res], 200);
    }

    public function cerrarSesion($request, $response, AutenticacionServicio $autenticacion){
        $autenticacion->cerrarSesion();

        return $response->withRedirect($this->router->pathFor('inicio'));
    }

    public function iniciarSesionDocente($request, $response, AutenticacionServicio $autenticacion){
        $datos = $request->getParams();
        $login = $autenticacion->iniciarSesionDocente($datos['email'], $datos['password']);
        $res = [];
        if($login){
            $res['login'] = true;
            $res['url'] = $this->router->pathFor('docente');
        }else{
            $res['login'] = false;
        }

        return $response->withJson($res, 200);
    }

    public function iniciarSesionEstudiante($request, $response, AutenticacionServicio $autenticacion){
        $datos = $request->getParams();
        $respuesta = [
            'accion' => ''
        ];
        $verificar = $autenticacion->verificarCuentaEstudiante($datos['usuario']);
        if($verificar == 'EXISTE'){
            $respuesta['accion'] = 'existe';
            if(!empty($datos['password'])){
                if($autenticacion->iniciarSesionEstudiante($datos['usuario'], $datos['password'])){
                    $respuesta['url'] = $this->router->pathFor('estudiante');
                }else{
                    $respuesta['accion'] = 'error';
                    $respuesta['texto'] = 'La contraseña es incorrecta';
                }
            }
        }elseif($verificar == 'NUEVO'){
            $respuesta['accion'] = 'nuevo';
            $respuesta['url'] = $this->router->pathFor('auth.completar.estudiante');
        }else{
            $respuesta['accion'] = 'error';
            $respuesta['texto'] = 'El usuario es incorrecto';
        }

        return $response->withJson($respuesta, 200);
    }

    public function getCompletarRegistroEstudiante($request, $response, AutenticacionServicio $autenticacion){
        if($autenticacion->verificarCompletarRegistroEstudiante()){
            $estudiante = $autenticacion->obtenerEstudianteACompletar();
            $est = [
                'nombre' => $estudiante['nombre'],
                'usuario' => $estudiante['usuario']
            ];
            return $this->view->render($response, 'estudiante/completar-registro.twig', ['estudiante' => $est]);
        }
        return $response->withRedirect($this->router->pathFor('inicio'));
    }

    public function postCompletarRegistroEstudiante($request, $response, AutenticacionServicio $autenticacion, EstudianteServicio $estudianteServicio){
        if($autenticacion->verificarCompletarRegistroEstudiante()){
            $datos = $request->getParams();
            if(empty($datos['password'])){
                $errores = [
                    'password' => 'Por favor ingresa tu contraseña'
                ];
                return $response->withJson(['errores' => $errores], 200);
            }else{
                $res = [];
                $estudiante = $autenticacion->obtenerEstudianteACompletar();
                if($estudianteServicio->actualizarPassword($estudiante['id'], $datos['password'])){
                    if($estudiante['estado'] == Estudiante::$CUENTA_NO_ACTIVA){
                        $estudianteServicio->actualizarEstado($estudiante['id'], Estudiante::$PRUEBA_NO_INICIADA);
                    }
                    $autenticacion->terminarCompletarRegistroEstudiante();
                    $autenticacion->iniciarSesionEstudiante($estudiante['usuario'], $datos['password']);
                    $res = [
                        'completado' => true,
                        'url' => $this->router->pathFor('estudiante')
                    ];
                }else{
                    $res = [
                        'completado' => false,
                        'texto' => 'Ha ocurrido un error al procesar la información, por favor vuelve a intentarlo'
                    ];
                }

                return $response->withJson(['respuesta' => $res], 200);
            }
        }
    }

    public function getLoginAdmin($request, $response){
        return $this->view->render($response, 'login-admin.twig');
    }
    
    public function postLoginAdmin($request, $response, AutenticacionServicio $autenticacion){
        $datos = $request->getParams();
        $login = $autenticacion->iniciarSesionAdmin($datos['email'], $datos['password']);
        $res = [];
        if($login){
            $res['login'] = true;
            $res['url'] = $this->router->pathFor('admin');
        }else{
            $res['login'] = false;
        }

        return $response->withJson($res, 200);
    }
}