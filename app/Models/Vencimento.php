<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Vencimento extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['plano_id', 'aluno_id', 'grupo_id', 'valor', 'desconto', 'data_pagamento'];

    public function aluno()
    {
        return $this->belongsTo(Aluno::class);
    }

    public function grupo()
    {
        return $this->belongsTo(GrupoAluno::class, 'grupo_id');
    }

    public function plano()
    {
        return $this->belongsTo(Plano::class);
    }
}