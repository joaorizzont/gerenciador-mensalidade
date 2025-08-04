<?php

namespace App\Http\Controllers;

use App\Models\Vencimento;
use Carbon\Carbon;
use Illuminate\Http\Request;

class VencimentoController extends Controller
{
    public function index(Request $request)
    {
        $query = Vencimento::with(['plano', 'aluno']);

        if (!$request->filled('todos')) {
            if ($request->filled('cancelados') && $request->filled('pago')) {
                $query->withTrashed()->where(function ($q) {
                    $q->whereNotNull('data_pagamento')
                        ->orWhereNotNull('deleted_at');
                });
            } else {

                if ($request->filled('cancelados')) {
                    $query->withTrashed()->whereNotNull('deleted_at');
                } else {
                    $query->whereNull('deleted_at');
                }

                if ($request->filled('pago')) {
                    if ($request->pago === '1') {
                        $query->whereNotNull('data_pagamento');
                    } elseif ($request->pago === '0') {
                        $query->whereNull('data_pagamento');
                    }
                }
            }

            if ($request->filled('aluno_id')) {
                $query->where('aluno_id', $request->aluno_id);
            }
        } else {
            $query->withTrashed();
        }

        return response()->json($query->get());
    }



    public function show($id)
    {
        return response()->json(Vencimento::findOrFail($id));
    }

    public function store(Request $request)
    {
        $vencimento = Vencimento::create($request->all());
        return response()->json($vencimento, 201);
    }

    public function update(Request $request, $id)
    {
        $vencimento = Vencimento::findOrFail($id);
        $vencimento->update($request->all());
        return response()->json($vencimento);
    }

    public function destroy($id)
    {
        Vencimento::destroy($id);
        return response()->json(null, 204);
    }

    public function concluir($id)
    {
        $vencimento = Vencimento::findOrFail($id);
        $vencimento->data_pagamento = Carbon::now();
        $vencimento->save();

        return response()->json([
            'message' => 'Vencimento concluído com sucesso.',
            'vencimento' => $vencimento
        ]);
    }
}
