<?php

$app->get('/', ['App\Controladores\InicioControlador', 'index'])->setName('inicio');

$app->group('/', function(){
    $this->get('login-admin', ['App\Controladores\AutenticacionControlador', 'getLoginAdmin'])->setName('auth.login.admin');
    $this->post('login-admin', ['App\Controladores\AutenticacionControlador', 'postLoginAdmin']);
    $this->get('login', ['App\Controladores\AutenticacionControlador', 'loginIndex'])->setName('auth.login');
    $this->post('login-docente', ['App\Controladores\AutenticacionControlador', 'iniciarSesionDocente'])->setName('auth.login.docente');
    $this->post('login-estudiante', ['App\Controladores\AutenticacionControlador', 'iniciarSesionEstudiante'])->setName('auth.login.estudiante');
    $this->get('registro', ['App\Controladores\AutenticacionControlador', 'getRegistroDocente'])->setName('auth.registro');
    $this->post('registro', ['App\Controladores\AutenticacionControlador', 'postRegistroDocente']);
    $this->get('completar-registro-estudiante', ['App\Controladores\AutenticacionControlador', 'getCompletarRegistroEstudiante'])->setName('auth.completar.estudiante');
    $this->post('completar-registro-estudiante', ['App\Controladores\AutenticacionControlador', 'postCompletarRegistroEstudiante']);
})->add('App\Middlewares\Autenticacion\DenegarAutenticado');

$app->get('/demo', ['App\Controladores\DemoControlador', 'index'])->setName('demo');

$app->get('/logout', ['App\Controladores\AutenticacionControlador', 'cerrarSesion'])->setName('auth.logout');

$app->group('/docente', function(){
    $this->get('', ['App\Controladores\DocenteControlador', 'index'])->setName('docente');
    $this->get('/estudiantes', ['App\Controladores\DocenteControlador', 'consultarEstudiantes'])->setName('docente.consultar.estudiantes');
    $this->post('/registro-estudiante', ['App\Controladores\DocenteControlador', 'postRegistroEstudiante'])->setName('docente.registro.estudiante');
    $this->post('/calificar-actividad', ['App\Controladores\DocenteControlador', 'postCalificacionActividad'])->setName('docente.calificar.actividad');
    $this->get('/reporte-estudiante', ['App\Controladores\DocenteControlador', 'consultarReporteDePrueba'])->setName('docente.consultar.reporte');
    $this->get('/descarga-reporte',['App\Controladores\DocenteControlador', 'descargarReporteDePrueba'])->setName('docente.descargar.reporte');
})->add('App\Middlewares\Autenticacion\DenegarNoDocente');

$app->group('/estudiante', function(){
    $this->get('', ['App\Controladores\EstudianteControlador', 'index'])->setName('estudiante');
    $this->get('/prueba', ['App\Controladores\EstudianteControlador', 'getPrueba'])->setName('estudiante.prueba');
    $this->post('/prueba', ['App\Controladores\EstudianteControlador', 'postPrueba']);
    $this->get('/prueba-actividades', ['App\Controladores\EstudianteControlador', 'getActividadesPrueba'])->setName('estudiante.prueba.actividades');
    
})->add('App\Middlewares\Autenticacion\DenegarNoEstudiante');

$app->group('/admin', function(){
    $this->get('', ['App\Controladores\AdminControlador', 'index'])->setName('admin');
    $this->get('/actividades[/{pagina}]', ['App\Controladores\AdminControlador', 'getActividades'])->setName('admin.actividades');
    $this->get('/actividades-previas[/{pagina}]', ['App\Controladores\AdminControlador', 'getActividadesPrevias'])->setName('admin.actividades.previas');
    $this->post('/cargar-actividad', ['App\Controladores\AdminControlador', 'cargarActividad'])->setName('admin.cargar.actividad');
    $this->post('/cargar-actividad-previa', ['App\Controladores\AdminControlador', 'cargarActividadPrevia'])->setName('admin.cargar.actividad.previa');
    $this->post('/editar-actividad', ['App\Controladores\AdminControlador', 'editarActividad'])->setName('admin.editar.actividad');
    $this->post('/editar-actividad-previa', ['App\Controladores\AdminControlador', 'editarActividadPrevia'])->setName('admin.editar.actividad.previa');
    $this->get('/categorias/[{id}]', ['App\Controladores\AdminControlador', 'getCategorias'])->setName('admin.get.categorias');
    $this->get('/categorias-habilidades', ['App\Controladores\AdminControlador', 'getCategoriasHabilidades'])->setName('admin.categorias.habilidades');
    $this->post('/crear-categoria', ['App\Controladores\AdminControlador', 'crearCategoria'])->setName('admin.crear.categoria');
    $this->post('/crear-habilidad', ['App\Controladores\AdminControlador', 'crearHabilidad'])->setName('admin.crear.habilidad');
})->add('App\Middlewares\Autenticacion\DenegarNoAdmin');