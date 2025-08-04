<?php

namespace App\Http\Controllers;

use App\Models\Aluno;
use Illuminate\Http\Request;

class AlunoController extends Controller
{
    public function index(Request $request)
    {
        $query = Aluno::query();

        if ($request->has('nome')) {
            $nome = $request->input('nome');
            $query->where('nome', 'LIKE', '%' . $nome . '%');
        }

        return response()->json($query->with('planosAtivos')->paginate(10));
    }

    public function show($id)
    {
        return response()->json(
            Aluno::with('planosAtivos.plano')->findOrFail($id)
        );
    }

    public function store(Request $request)
    {
        $aluno = Aluno::create($request->all());
        return response()->json($aluno, 201);
    }

    public function update(Request $request, $id)
    {
        $aluno = Aluno::findOrFail($id);
        $aluno->update($request->all());
        return response()->json($aluno);
    }

    public function destroy($id)
    {
        Aluno::destroy($id);
        return response()->json(null, 204);
    }
}
