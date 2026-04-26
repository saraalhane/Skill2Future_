<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Quiz;
use App\Models\Question;

class QuizController extends Controller
{
    public function index()
    {
        $quizzes = Quiz::withCount('questions')->get();
        return response()->json($quizzes);
    }

    public function show($id)
    {
        $quiz = Quiz::with(['questions.options'])->findOrFail($id);
        
        // The frontend needs is_correct to calculate the score accurately
        // In a strict production environment, this should be calculated on the backend instead

        return response()->json($quiz);
    }
}
