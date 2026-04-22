<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function show(Request $request)
    {
        return response()->json($request->user());
    }

    public function update(Request $request)
    {
        $request->validate([
            'prenom' => 'nullable|string|max:255',
            'nom' => 'nullable|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,'.$request->user()->id,
            'bio' => 'nullable|string',
            'objectif' => 'nullable|string|max:255',
        ]);

        $user = $request->user();
        $user->fill($request->only(['prenom', 'nom', 'email', 'bio', 'objectif']));
        $user->name = trim($request->prenom . ' ' . $request->nom);
        $user->save();

        return response()->json([
            'success' => true,
            'user' => $user,
            'message' => 'Profil mis à jour avec succès'
        ]);
    }
}
