<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Announcement;

class AnnouncementController extends Controller
{
    public function index()
    {
        return response()->json(Announcement::orderBy('created_at', 'desc')->get());
    }

    public function store(\Illuminate\Http\Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'message' => 'required|string',
            'type' => 'required|in:info,warning,success,urgent'
        ]);

        $announcement = Announcement::create($validated);
        return response()->json($announcement, 201);
    }

    public function update(\Illuminate\Http\Request $request, $id)
    {
        $announcement = Announcement::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'message' => 'required|string',
            'type' => 'required|in:info,warning,success,urgent'
        ]);

        $announcement->update($validated);
        return response()->json($announcement);
    }

    public function destroy($id)
    {
        $announcement = Announcement::findOrFail($id);
        $announcement->delete();
        return response()->json(['success' => true]);
    }
}
