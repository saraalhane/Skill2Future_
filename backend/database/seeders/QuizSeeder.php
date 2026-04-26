<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Quiz;
use App\Models\Question;
use App\Models\Option;
use App\Models\QuizResult;
use App\Models\UserSetting;
use App\Models\User;

class QuizSeeder extends Seeder
{
    public function run()
    {
        // Disable FK checks to truncate
        \Illuminate\Support\Facades\DB::statement('SET FOREIGN_KEY_CHECKS=0');
        QuizResult::truncate();
        Option::truncate();
        Question::truncate();
        Quiz::truncate();
        \Illuminate\Support\Facades\DB::statement('SET FOREIGN_KEY_CHECKS=1');

        $jsonPath = __DIR__ . '/quizzes_data.json';
        $quizzesData = json_decode(file_get_contents($jsonPath), true);

        foreach ($quizzesData as $data) {
            $questionsData = $data['questions'];
            unset($data['questions']);

            $quiz = Quiz::create($data);

            $order = 1;
            foreach ($questionsData as $qData) {
                $question = Question::create([
                    'quiz_id' => $quiz->id,
                    'text' => $qData['text'],
                    'order' => $order++,
                ]);

                // Shuffle options to make it varied
                $options = $qData['options'];
                shuffle($options);

                foreach ($options as $optData) {
                    Option::create([
                        'question_id' => $question->id,
                        'text' => $optData['text'],
                        'is_correct' => $optData['is_correct'],
                    ]);
                }
            }
        }

        // 3. Create dummy result and setting for the first user
        $user = User::first();
        if ($user) {
            $firstQuiz = Quiz::first();
            if ($firstQuiz) {
                QuizResult::updateOrCreate(
                    ['user_id' => $user->id, 'quiz_id' => $firstQuiz->id],
                    [
                        'score' => 78,
                        'total_questions' => 30,
                        'skill_analysis' => json_encode([
                            'HTML' => 90,
                            'CSS' => 75,
                            'JavaScript' => 40,
                            'PHP' => 60,
                            'Python' => 50,
                            'SQL' => 70,
                        ])
                    ]
                );
            }

            UserSetting::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'notifications_email' => true,
                    'notifications_quiz' => true,
                    'notifications_courses' => false,
                    'public_profile' => true,
                    'show_progress' => true,
                    'language' => 'fr',
                    'theme' => 'light',
                    'timezone' => 'Europe/Paris',
                ]
            );
        }
    }
}
