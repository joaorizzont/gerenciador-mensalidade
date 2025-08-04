<?php

namespace App\Http\Controllers;

use App\Models\Atividade;
use Illuminate\Http\Request;

class AtividadeController extends Controller
{
    public function index()
    {
        return response()->json(Atividade::all());
    }

    public function show($id)
    {
        return response()->json(Atividade::findOrFail($id));
    }

    public function store(Request $request)
    {
        $atividade = Atividade::create($request->all());
        return response()->json($atividade, 201);
    }

    public function update(Request $request, $id)
    {
        $atividade = Atividade::findOrFail($id);
        $atividade->update($request->all());
        return response()->json($atividade);
    }

    public function destroy($id)
    {
        $atividade = Atividade::withCount('professores')->findOrFail($id);

        if ($atividade->professores_count > 0) {
            return response()->json(['error' => 'Não é possível excluir: existem professores vinculados.'], 400);
        }

        $atividade->delete();
        return response()->json(null, 204);
    }

    public function professores($id)
    {
        $atividade = Atividade::with('professores')->findOrFail($id);
        return response()->json($atividade->professores);
    }

    public function desassociarProfessor($atividadeId, $professorId)
    {
        $atividade = Atividade::findOrFail($atividadeId);
        $atividade->professores()->detach($professorId);

        return response()->json(['message' => 'Professor desassociado com sucesso']);
    }
}
