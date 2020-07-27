<?php
namespace App\Utilidad;

require 'vendor/pdf/fpdf.php';

class PDF extends FPDF {
    // Cabecera de página
    function Header() {
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
    function Footer() {
        // Posición: a 1,5 cm del final
        $this->SetY(-15);
        // Arial italic 8
        $this->SetFont('Arial','I',8);
        // Número de página
        $this->Cell(0,10,utf8_decode('Página '.$this->PageNo().'/{nb}'),0,0,'C');
    }
}

// Creación del objeto de la clase heredada
/* $pdf = new PDF();
$pdf->AliasNbPages(); //Genera los pie de página en cada reporte
$pdf->AddPage();
$pdf->SetFont('Times','',12);
for($i=1;$i<=40;$i++)
    $pdf->Cell(0,10, utf8_decode('Imprimiendo línea número '.$i),0,1);
$pdf->Output(); */
?>
