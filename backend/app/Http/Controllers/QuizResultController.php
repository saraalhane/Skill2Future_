<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\QuizResult;

class QuizResultController extends Controller
{
    public function index(Request $request)
    {
        $results = QuizResult::with('quiz')->where('user_id', $request->user()->id)->get();
        // Since we stored skill_analysis as a string (json encoded), we decode it to return json.
        $results->transform(function ($result) {
            $result->skill_analysis = json_decode($result->skill_analysis);
            return $result;
        });
        return response()->json($results);
    }

    public function show(Request $request, $quiz_id)
    {
        $result = QuizResult::with('quiz')->where('user_id', $request->user()->id)->where('quiz_id', $quiz_id)->firstOrFail();
        $result->skill_analysis = json_decode($result->skill_analysis);
        return response()->json($result);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'quiz_id' => 'required|exists:quizzes,id',
            'score' => 'required|integer',
            'total_questions' => 'required|integer',
            'skill_analysis' => 'nullable|array'
        ]);

        $result = QuizResult::updateOrCreate(
            ['user_id' => $request->user()->id, 'quiz_id' => $validated['quiz_id']],
            [
                'score' => $validated['score'],
                'total_questions' => $validated['total_questions'],
                'skill_analysis' => json_encode($validated['skill_analysis'])
            ]
        );

        $result->skill_analysis = json_decode($result->skill_analysis);

        return response()->json($result, 201);
    }
}
