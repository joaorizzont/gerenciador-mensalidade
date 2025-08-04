<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PlanoAtivo extends Model
{
    protected $table = 'planos_ativos';


    use HasFactory, SoftDeletes;

    protected $fillable = ['aluno_id', 'plano_id', 'grupo_id', 'dia_vencimento'];

    public function aluno()
    {
        return $this->belongsTo(Aluno::class);
    }

    public function plano()
    {
        return $this->belongsTo(Plano::class);
    }

    public function grupo()
    {
        return $this->belongsTo(GrupoAluno::class, 'grupo_id');
    }
}
