<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('vencimentos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('plano_id')->constrained('planos')->onDelete('cascade');
            $table->foreignId('aluno_id')->nullable()->constrained('alunos')->onDelete('set null');
            $table->foreignId('grupo_id')->nullable()->constrained('grupo_alunos')->onDelete('set null');
            $table->integer('valor');
            $table->integer('desconto')->default(0);
            $table->date('data_pagamento')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vencimentos');
    }
};
