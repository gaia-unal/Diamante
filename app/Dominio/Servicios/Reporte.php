<?php

namespace App\Dominio\Servicios;

require 'pdf/fpdf.php';

class Reporte extends FPDF {
    function Header() {
        $this->Image('public/assets/img/logo-oscuro.png',10,8,33);
        $this->SetFont('Arial','B',15); //Fuente,Negrita, Tamaño
        $this->Cell(50);
        $this->Cell(80,10,'Reporte de estudiante',0,0,'C'); //Titulo
        $this->Ln(20); //Salto de línea
    }

    function Footer() {
        $this->SetY(-15); // Posición: a 1,5 cm del final
        $this->SetFont('Arial','I',8); // Arial italic 8
        $this->Cell(0,10,utf8_decode('Página '.$this->PageNo().'/{nb}'),0,0,'C'); // Número de página
    }
}
?>
