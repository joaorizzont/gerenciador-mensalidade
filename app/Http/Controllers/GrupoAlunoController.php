<?php

namespace App\Http\Controllers;

use App\Models\GrupoAluno;
use Illuminate\Http\Request;

class GrupoAlunoController extends Controller
{
    public function index()
    {
        return response()->json(GrupoAluno::all());
    }

    public function show($id)
    {
        return response()->json(GrupoAluno::findOrFail($id));
    }

    public function store(Request $request)
    {
        $grupo = GrupoAluno::create($request->all());
        return response()->json($grupo, 201);
    }

    public function update(Request $request, $id)
    {
        $grupo = GrupoAluno::findOrFail($id);
        $grupo->update($request->all());
        return response()->json($grupo);
    }

    public function destroy($id)
    {
        GrupoAluno::destroy($id);
        return response()->json(null, 204);
    }
}
