<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class AdminUserController extends Controller
{
    private function checkAdmin(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            abort(403, 'Unauthorized action.');
        }
    }

    public function index(Request $request)
    {
        $this->checkAdmin($request);
        $users = User::latest()->get();
        return response()->json($users);
    }

    public function store(Request $request)
    {
        $this->checkAdmin($request);

        $validated = $request->validate([
            'prenom' => 'required|string|max:255',
            'nom' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => ['required', Rule::in(['user', 'admin'])]
        ]);

        $user = User::create([
            'name' => trim($validated['prenom'] . ' ' . $validated['nom']),
            'prenom' => $validated['prenom'],
            'nom' => $validated['nom'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role']
        ]);

        return response()->json(['message' => 'User created successfully', 'user' => $user], 201);
    }

    public function updateRole(Request $request, $id)
    {
        $this->checkAdmin($request);

        $validated = $request->validate([
            'role' => ['required', Rule::in(['user', 'admin'])]
        ]);

        $user = User::findOrFail($id);
        
        // Prevent admin from downgrading themselves
        if ($user->id === $request->user()->id && $validated['role'] !== 'admin') {
            return response()->json(['message' => 'Cannot change your own admin role'], 403);
        }

        $user->role = $validated['role'];
        $user->save();

        return response()->json(['message' => 'User role updated successfully', 'user' => $user]);
    }

    public function destroy(Request $request, $id)
    {
        $this->checkAdmin($request);

        $user = User::findOrFail($id);

        // Prevent admin from deleting themselves
        if ($user->id === $request->user()->id) {
            return response()->json(['message' => 'Cannot delete yourself'], 403);
        }

        $user->delete();

        return response()->json(['message' => 'User deleted successfully']);
    }
}
