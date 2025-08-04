<?php


namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Plano extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['nome', 'descricao', 'valor'];

    public function planosAtivos()
    {
        return $this->hasMany(PlanoAtivo::class);
    }

    public function vencimentos()
    {
        return $this->hasMany(Vencimento::class);
    }
}
