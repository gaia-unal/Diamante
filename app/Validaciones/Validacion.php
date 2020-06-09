<?php

namespace App\Validaciones;

use Respect\Validation\Validator as v;
use Respect\Validation\Exceptions\NestedValidationException;
use Psr\Http\Message\UploadedFileInterface;

abstract class Validacion{

    protected $errores;
    protected $mensajes;

    public function __construct(){
        $this->mensajes = require __DIR__ . '/spanishMessages.php';
    }

    protected function verificarReglas($datos, $reglas){
        foreach ($reglas as $campo => $regla) {
            try{
                $regla->setName('El campo')->assert($datos[$campo]);
            }catch(NestedValidationException $e){
                $e->setParam('translator', $this->mensajes);
                $this->errores[$campo] = $e->getMessages();
            }
        }
    }

    protected function validarArchivoActividad(UploadedFileInterface $archivo){
        $error = '';
        if(empty($archivo->file)){
            $error = 'Por favor selecciona un archivo válido (.zip)';
        }
        if($archivo->getError() === UPLOAD_ERR_OK){
            $extensionesValidas = ['zip'];
            $tiposPermitidos = ['application/zip', 'multipart/x-zip', 'application/x-zip-compressed', 'application/x-compressed'];
            $nombreArchivoActividad = $archivo->getClientFilename();
            //$tam = $archivo->getSize();
            $temporal = explode('.', $nombreArchivoActividad);
            $extension = end($temporal);
            if(!in_array($archivo->getClientMediaType(), $tiposPermitidos) ||
            !in_array($extension, $extensionesValidas)){
                $error = 'Por favor selecciona un archivo válido (.zip)';
            }
        }else{
            $error = 'Ha ocurrido un error durante la carga del archivo, por favor vuelve a intentar';
        }
        if(!empty($error)){
            $this->errores['archivo'] = $error;
        }
    }

    public function fallido(){
        if(!empty($this->errores)){
            /*$_SESSION['errores_validacion'] = $this->errores;
            return true;*/
            return $this->errores;
        }
        return false;
    }
}