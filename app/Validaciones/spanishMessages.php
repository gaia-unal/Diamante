<?php

return function($mensaje){
    $mensajes = [
        '{{name}} must not be empty' => '{{name}} es obligatorio',
        '{{name}} must contain only letters (a-z)' => '{{name}} sólo puede contener letras',
        'The email is already taken' => 'El email ya está en uso'
    ];

    return $mensajes[$mensaje];
};