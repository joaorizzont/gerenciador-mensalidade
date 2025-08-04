<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Atividade extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['nome', 'descricao'];

    public function professores()
    {
        return $this->belongsToMany(Professor::class, 'atividades_professores');
    }

    public function alunos()
    {
        return $this->belongsToMany(Aluno::class, 'atividades_alunos');
    }
}
