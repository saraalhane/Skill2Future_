<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Comment;

class CommentController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'course_id' => 'required|exists:courses,id'
        ]);

        $comments = Comment::where('course_id', $request->course_id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($comments);
    }

    public function store(Request $request)
    {
        $request->validate([
            'course_id' => 'required|exists:courses,id',
            'lesson_id' => 'nullable|exists:lessons,id',
            'content' => 'required|string|max:1000'
        ]);

        $comment = Comment::create([
            'user_id' => $request->user()->id,
            'course_id' => $request->course_id,
            'lesson_id' => $request->lesson_id,
            'content' => $request->content
        ]);

        // Eager load the user so the frontend immediately has user data
        $comment->load('user');

        return response()->json($comment, 201);
    }
}
