<?php

use Slim\Views\Twig;
use Slim\Views\TwigExtension;
use Slim\Csrf\Guard;
use Slim\Flash\Messages;
use Interop\Container\ContainerInterface;

// Middlewares
use App\Middlewares\CsrfExtension;

// Repositorios: interfaces
use App\Dominio\Repositorios\EstudianteRepoInterface;
use App\Dominio\Repositorios\DocenteRepoInterface;
use App\Dominio\Repositorios\AdministradorRepoInterface;
use App\Dominio\Repositorios\ActividadRepoInterface;
use App\Dominio\Repositorios\PruebaRepoInterface;

// Repositorios: implementaciones
use App\Persistencia\Repositorios\EstudianteRepo;
use App\Persistencia\Repositorios\DocenteRepo;
use App\Persistencia\Repositorios\AdministradorRepo;
use App\Persistencia\Repositorios\ActividadRepo;
use App\Persistencia\Repositorios\PruebaRepo;

return [
    PDO::class => function(ContainerInterface $c){
        $config = require __DIR__ . '/config/basedatos.php';
        $dsn = 'mysql:host=' . $config['host'] . ';dbname=' . $config['db'] . ';charset=' . $config['charset'];
        return new PDO($dsn, $config['user'], $config['password'], $config['opciones']);
    },
    Guard::class => function(ContainerInterface $c){
        // Se activa la persistencia de csrf tokens en la sesión 
        // para facilitar el manejo de formularios con AJAX
        $guard = new Guard();
        $guard->setPersistentTokenMode(true);
        return $guard;
    },
    Messages::class => function(ContainerInterface $c){
        return new Messages();
    },
    Twig::class => function(ContainerInterface $c){
        $twig = new Twig(__DIR__ . '/vistas', [
            'cache' => false
        ]);

        $twig->addExtension(new TwigExtension(
            $c->get('router'),
            $c->get('request')->getUri()
        ));

        $twig->addExtension(new CsrfExtension($c->get(Guard::class)));

        $twig->addExtension(new Knlv\Slim\Views\TwigMessages($c->get(Messages::class)));

        //$twig->getEnvironment()->addGlobal('APP_URL', APP_URL);

        return $twig;
    },
    // Definición de implementaciones para las interfaces de la aplicación
    EstudianteRepoInterface::class => DI\object(EstudianteRepo::class),
    DocenteRepoInterface::class => DI\object(DocenteRepo::class),
    AdministradorRepoInterface::class => DI\object(AdministradorRepo::class),
    ActividadRepoInterface::class => DI\object(ActividadRepo::class),
    PruebaRepoInterface::class => DI\object(PruebaRepo::class)
];