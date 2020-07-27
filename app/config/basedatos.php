<?php

return [
    'host' => 'localhost',
    'user' => 'root',
    'password' => '',
    'db' => 'diamante',
    'charset' => 'utf8',
    'opciones' => [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]
];/*
return [
    'host' => 'localhost',
    'user' => 'diamante',
    'password' => '%diamante$',
    'db' => 'diamante',
    'charset' => 'utf8',
    'opciones' => [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]
];*/