<?php
// app/Models/Aluno.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Aluno extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'professor_id',
        'nome',
        'rg',
        'cpf',
        'data_nascimento',
        'endereco',
        'cidade',
        'celular',
        'email',
        'responsavel',
        'responsavel_telefone',
        'observacao'
    ];

    public function professor()
    {
        return $this->belongsTo(Professor::class);
    }

    public function atividades()
    {
        return $this->belongsToMany(Atividade::class, 'atividades_alunos');
    }

    public function planosAtivos()
    {
        return $this->hasMany(PlanoAtivo::class);
    }

    public function vencimentos()
    {
        return $this->hasMany(Vencimento::class);
    }
}
