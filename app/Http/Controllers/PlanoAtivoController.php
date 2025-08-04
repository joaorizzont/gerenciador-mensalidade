<?php

namespace App\Http\Controllers;

use App\Models\PlanoAtivo;
use Illuminate\Http\Request;

class PlanoAtivoController extends Controller
{
    public function index()
    {
        return response()->json(PlanoAtivo::all());
    }

    public function show($id)
    {
        return response()->json(PlanoAtivo::findOrFail($id));
    }

    public function store(Request $request)
    {
        $ativo = PlanoAtivo::create($request->all());
        return response()->json($ativo, 201);
    }

    public function update(Request $request, $id)
    {
        $ativo = PlanoAtivo::findOrFail($id);
        $ativo->update($request->all());
        return response()->json($ativo);
    }

    public function destroy($id)
    {
        PlanoAtivo::destroy($id);
        return response()->json(null, 204);
    }
}
