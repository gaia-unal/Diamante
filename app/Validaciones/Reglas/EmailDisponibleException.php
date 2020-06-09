<?php

namespace App\Validaciones\Reglas;

use Respect\Validation\Exceptions\ValidationException;

class EmailDisponibleException extends ValidationException{
    
    public static $defaultTemplates = [
        self::MODE_DEFAULT => [
            self::STANDARD => 'The email is already taken',
        ]
    ];
}