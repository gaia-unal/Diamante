<?php

namespace App\Utilidades;

require 'vendor/pdf/fpdf.php';

class UtilidadesGenerales {

    /**
     * Retorna la fecha actual en formato AAAA-MM-DD
     */
    public static function fechaActual(){
        return date('Y-m-d');
    }
    
    /**
     * Reemplaza los carácteres especiales de una cadena con su forma normal
     */
    public static function normalizarCadenas($cadena){
        $caracteres = array(
            'Š'=>'S', 'š'=>'s', 'Đ'=>'Dj', 'đ'=>'dj', 'Ž'=>'Z', 'ž'=>'z', 'Č'=>'C', 'č'=>'c', 'Ć'=>'C', 'ć'=>'c',
            'À'=>'A', 'Á'=>'A', 'Â'=>'A', 'Ã'=>'A', 'Ä'=>'A', 'Å'=>'A', 'Æ'=>'A', 'Ç'=>'C', 'È'=>'E', 'É'=>'E',
            'Ê'=>'E', 'Ë'=>'E', 'Ì'=>'I', 'Í'=>'I', 'Î'=>'I', 'Ï'=>'I', 'Ñ'=>'N', 'Ò'=>'O', 'Ó'=>'O', 'Ô'=>'O',
            'Õ'=>'O', 'Ö'=>'O', 'Ø'=>'O', 'Ù'=>'U', 'Ú'=>'U', 'Û'=>'U', 'Ü'=>'U', 'Ý'=>'Y', 'Þ'=>'B', 'ß'=>'Ss',
            'à'=>'a', 'á'=>'a', 'â'=>'a', 'ã'=>'a', 'ä'=>'a', 'å'=>'a', 'æ'=>'a', 'ç'=>'c', 'è'=>'e', 'é'=>'e',
            'ê'=>'e', 'ë'=>'e', 'ì'=>'i', 'í'=>'i', 'î'=>'i', 'ï'=>'i', 'ð'=>'o', 'ñ'=>'n', 'ò'=>'o', 'ó'=>'o',
            'ô'=>'o', 'õ'=>'o', 'ö'=>'o', 'ø'=>'o', 'ù'=>'u', 'ú'=>'u', 'û'=>'u', 'ý'=>'y', 'ý'=>'y', 'þ'=>'b',
            'ÿ'=>'y', 'Ŕ'=>'R', 'ŕ'=>'r',
        );
    
        return strtr($cadena, $caracteres);
    }

    /**
     * Elimina el archivo indicado por la ruta
     */
    public static function eliminarArchivo($rutaArchivo){
        if(file_exists($rutaArchivo)){
            chmod($rutaArchivo, 0777);
            return unlink($rutaArchivo);
        }
    }

    /**
     * Elimina todo el contenido de un directorio y finalmente, el directorio en cuestión
     */
    public static function eliminarDirectorio($directorio) {
        $dir = rtrim($directorio, '/');
        if (!file_exists($dir)) return true;
        if (!is_dir($dir) || is_link($dir)) {
            return unlink($dir);
        }
        foreach (scandir($dir) as $item) { 
            if ($item == '.' || $item == '..') continue;
            if (!self::eliminarDirectorio($dir . "/" . $item, false)) { 
                chmod($dir . "/" . $item, 0777); 
                if (!self::eliminarDirectorio($dir . "/" . $item, false)) return false; 
            }; 
        } 
        return rmdir($dir);
    }
}


class PDF extends FPDF{
    // Cabecera de página
    function Header()
    {
        // Logo
        $this->Image('public/assets/img/logo-oscuro.png',10,8,33);
        // Arial bold 15
        $this->SetFont('Arial','B',15); //Fuente,Negrita, Tamaño
        // Movernos a la derecha
        $this->Cell(50);
        // Título
        $this->Cell(80,10,'Reporte de estudiante',0,0,'C');
        // Salto de línea
        $this->Ln(20);
    }

    // Pie de página
    function Footer()
    {
        // Posición: a 1,5 cm del final
        $this->SetY(-15);
        // Arial italic 8
        $this->SetFont('Arial','I',8);
        // Número de página
        $this->Cell(0,10,utf8_decode('Página '.$this->PageNo().'/{nb}'),0,0,'C');
    }
}
