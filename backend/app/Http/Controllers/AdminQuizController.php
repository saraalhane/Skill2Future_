<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Quiz;

class AdminQuizController extends Controller
{
    private function checkAdmin(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            abort(403, 'Unauthorized action.');
        }
    }

    public function store(Request $request)
    {
        $this->checkAdmin($request);
        $validated = $request->validate([
            'title' => 'required|string',
            'category' => 'required|string',
            'questions' => 'nullable|array'
        ]);

        $quizData = [
            'title' => $validated['title'],
            'category' => $validated['category']
        ];

        $quiz = Quiz::create($quizData);

        if (isset($validated['questions']) && is_array($validated['questions'])) {
            foreach ($validated['questions'] as $index => $qData) {
                if (!isset($qData['text'])) continue;

                $question = \App\Models\Question::create([
                    'quiz_id' => $quiz->id,
                    'text' => $qData['text'],
                    'order' => $index + 1
                ]);

                if (isset($qData['options']) && is_array($qData['options'])) {
                    foreach ($qData['options'] as $optData) {
                        if (!isset($optData['text'])) continue;
                        \App\Models\Option::create([
                            'question_id' => $question->id,
                            'text' => $optData['text'],
                            'is_correct' => isset($optData['is_correct']) ? $optData['is_correct'] : false
                        ]);
                    }
                }
            }
        }

        return response()->json(['message' => 'Quiz created', 'quiz' => $quiz], 201);
    }

    public function update(Request $request, $id)
    {
        $this->checkAdmin($request);
        $quiz = Quiz::findOrFail($id);
        
        $validated = $request->validate([
            'title' => 'sometimes|required|string',
            'category' => 'sometimes|required|string',
            'questions' => 'nullable|array'
        ]);

        $quizData = [];
        if (isset($validated['title'])) $quizData['title'] = $validated['title'];
        if (isset($validated['category'])) $quizData['category'] = $validated['category'];

        $quiz->update($quizData);
        return response()->json(['message' => 'Quiz updated', 'quiz' => $quiz]);
    }

    public function destroy(Request $request, $id)
    {
        $this->checkAdmin($request);
        $quiz = Quiz::findOrFail($id);
        $quiz->delete();
        return response()->json(['message' => 'Quiz deleted']);
    }
}
