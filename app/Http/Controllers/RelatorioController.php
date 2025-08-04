<?php

namespace App\Http\Controllers;

use App\Models\Aluno;
use App\Models\PlanoAtivo;
use App\Models\Vencimento;
use Carbon\Carbon;

class RelatorioController extends Controller
{
    public function dados()
    {
        $alunosCount = Aluno::count();

        $planosAtivosCount = PlanoAtivo::whereNull('deleted_at')->count();

        $vencimentosAbertosCount = Vencimento::whereNull('deleted_at')
            ->whereNull('data_pagamento')
            ->count();

        $pagamentosPorMes = [];

        for ($i = 5; $i >= 0; $i--) {
            $inicioMes = Carbon::now()->subMonths($i)->startOfMonth();
            $fimMes = Carbon::now()->subMonths($i)->endOfMonth();

            $totalMes = Vencimento::whereNotNull('data_pagamento')
                ->whereBetween('data_pagamento', [$inicioMes, $fimMes])
                ->sum('valor');

            $pagamentosPorMes[] = [
                'mes' => $inicioMes->format('m/Y'),
                'valor_pago' => $totalMes,
            ];
        }

        return response()->json([
            'alunos' => $alunosCount,
            'planos_ativos' => $planosAtivosCount,
            'vencimentos_abertos' => $vencimentosAbertosCount,
            'pagamentos_por_mes' => $pagamentosPorMes,
        ]);
    }
}
