<?php

namespace App\Http\Controllers;

use App\Models\Professor;
use Illuminate\Http\Request;

class ProfessorController extends Controller
{
    public function index(Request $request)
    {
        $query = Professor::with('atividades')
            ->whereNull('deleted_at');

        if ($request->filled('nome')) {
            $query->where('nome', 'LIKE', '%' . $request->nome . '%');
        }

        if ($request->filled('atividades_ids')) {
            $query->whereHas('atividades', function ($q) use ($request) {
                $q->where('atividades.id', $request->atividades_ids);
            });
        }

        return response()->json($query->paginate(10));
    }



    public function show($id)
    {
        return response()->json(Professor::findOrFail($id));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nome' => 'required|string|max:255',
            'telefone' => 'nullable|string|max:20',
            'atividades_ids' => 'array',
            'atividades_ids.*' => 'integer|exists:atividades,id',
        ]);

        $professor = Professor::create([
            'nome' => $data['nome'],
            'telefone' => $data['telefone'] ?? null,
        ]);

        if (!empty($data['atividades_ids'])) {
            $professor->atividades()->sync($data['atividades_ids']);
        }

        return response()->json($professor, 201);
    }

    public function update(Request $request, $id)
    {
        $data = $request->validate([
            'nome' => 'required|string|max:255',
            'telefone' => 'nullable|string|max:20',
            'atividades_ids' => 'array',
            'atividades_ids.*' => 'integer|exists:atividades,id',
        ]);

        $professor = Professor::findOrFail($id);
        $professor->update([
            'nome' => $data['nome'],
            'telefone' => $data['telefone'] ?? null,
        ]);

        if (!empty($data['atividades_ids'])) {
            $professor->atividades()->sync($data['atividades_ids']);
        }

        return response()->json($professor);
    }


    public function destroy($id)
    {
        Professor::destroy($id);
        return response()->json(null, 204);
    }
}
