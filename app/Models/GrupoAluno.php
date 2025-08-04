<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class GrupoAluno extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['aluno_id'];

    public function aluno()
    {
        return $this->belongsTo(Aluno::class);
    }

    public function planosAtivos()
    {
        return $this->hasMany(PlanoAtivo::class, 'grupo_id');
    }

    public function vencimentos()
    {
        return $this->hasMany(Vencimento::class, 'grupo_id');
    }
}
