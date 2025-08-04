<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

use App\Http\Controllers\AtividadeController;
use App\Http\Controllers\ProfessorController;
use App\Http\Controllers\AlunoController;
use App\Http\Controllers\GrupoAlunoController;
use App\Http\Controllers\PlanoController;
use App\Http\Controllers\PlanoAtivoController;
use App\Http\Controllers\RelatorioController;
use App\Http\Controllers\VencimentoController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:api')->get('/me', [AuthController::class, 'me']);

Route::middleware('auth:api')->group(function () {
    Route::get('/atividades/list', [AtividadeController::class, 'list']);
    Route::get('/atividades/{id}/professores', [AtividadeController::class, 'professores']);
    Route::delete('/atividades/{atividade}/professores/{professor}', [AtividadeController::class, 'desassociarProfessor']);
    Route::apiResource('/atividades', AtividadeController::class);

    Route::apiResource('/professores', ProfessorController::class);

    Route::apiResource('/alunos', AlunoController::class);

    Route::apiResource('/grupos', GrupoAlunoController::class);

    Route::apiResource('/planos', PlanoController::class);

    Route::apiResource('/planos-ativos', PlanoAtivoController::class);

    Route::post('/vencimentos/{id}/concluir', [VencimentoController::class, 'concluir']);

    Route::apiResource('/vencimentos', VencimentoController::class);

    Route::get('/relatorios/dados', [RelatorioController::class, 'dados']);
});
