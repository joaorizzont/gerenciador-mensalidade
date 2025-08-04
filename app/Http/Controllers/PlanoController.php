<?php

namespace App\Http\Controllers;

use App\Models\Plano;
use Illuminate\Http\Request;

class PlanoController extends Controller
{
    public function index(Request $request)
    {
        $query = Plano::query()->whereNull('deleted_at');

        if ($request->filled('nome')) {
            $query->where('nome', 'LIKE', '%' . $request->nome . '%');
        }

        return response()->json($query->paginate(10));
    }

    public function show($id)
    {
        $plano = Plano::with('alunos')->findOrFail($id);
        return response()->json($plano);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nome' => 'required|string|max:255',
            'descricao' => 'nullable|string|max:1000',
            'valor' => 'required|integer|min:0|max:1000000',
        ]);

        $plano = Plano::create($data);

        return response()->json($plano, 201);
    }

    public function update(Request $request, $id)
    {
        $plano = Plano::findOrFail($id);

        $data = $request->validate([
            'nome' => 'required|string|max:255',
            'descricao' => 'nullable|string|max:1000',
            'valor' => 'required|integer|min:0|max:1000000',
        ]);

        $plano->update($data);

        return response()->json($plano);
    }

    public function destroy($id)
    {
        //Testar
        $plano = Plano::withCount('planosAtivos')->findOrFail($id);

        if ($plano->planosAtivos_count > 0) {
            return response()->json(['error' => 'Não é possível excluir: existem planos ativos vinculados.'], 400);
        }

        $plano->delete();

        return response()->json(null, 204);
    }

    public function planosAtivos($id)
    {
        $plano = Plano::with(['planosAtivos' => function ($q) {
            $q->whereNull('deleted_at');
        }])->findOrFail($id);

        return response()->json($plano->alunos);
    }
}
