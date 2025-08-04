<?php
// app/Models/Professor.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Professor extends Model
{
    protected $table = 'professores';

    use HasFactory, SoftDeletes;

    protected $fillable = ['nome', 'telefone'];

    public function atividades()
    {
        return $this->belongsToMany(Atividade::class, 'atividades_professores');
    }

    public function alunos()
    {
        return $this->hasMany(Aluno::class);
    }
}