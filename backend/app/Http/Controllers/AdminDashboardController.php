<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\QuizResult;
use App\Models\UserCourse;
use App\Models\LessonCompletion;

class AdminDashboardController extends Controller
{
    public function index(Request $request)
    {
        // ── Stats ──────────────────────────────────────────────────────────────
        $totalUsers        = User::where('role', 'user')->count();
        $newUsersThisMonth = User::where('role', 'user')
                                  ->whereMonth('created_at', now()->month)
                                  ->whereYear('created_at',  now()->year)
                                  ->count();
        $completedQuizzes  = QuizResult::count();
        $avgScore          = round(QuizResult::avg('score') ?? 0, 1);

        // ── Registrations chart — last 6 months ───────────────────────────────
        $registrations = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = now()->subMonths($i);
            $registrations[] = [
                'name'  => $month->locale('fr')->isoFormat('MMM'),
                'users' => User::where('role', 'user')
                               ->whereMonth('created_at', $month->month)
                               ->whereYear('created_at',  $month->year)
                               ->count(),
            ];
        }

        // ── Quiz status donut ─────────────────────────────────────────────────
        $passed  = QuizResult::where('score', '>=', 60)->count();
        $failed  = QuizResult::where('score', '<',  60)->count();
        $pending = max(0,
            User::where('role', 'user')->count()
            - QuizResult::distinct('user_id')->count('user_id')
        );

        $quizStatusChart = [
            ['name' => 'Réussis',    'value' => $passed,  'fill' => '#198754'],
            ['name' => 'Échoués',    'value' => $failed,  'fill' => '#dc3545'],
            ['name' => 'En attente', 'value' => $pending, 'fill' => '#ffc107'],
        ];

        // ── Recent users ──────────────────────────────────────────────────────
        $colors = ['#6366f1','#10b981','#f59e0b','#ec4899','#3b82f6','#8b5cf6'];

        $recentUsers = User::where('role', 'user')
            ->latest()
            ->take(10)
            ->get()
            ->map(function (User $user, int $idx) use ($colors) {
                $avgProgress = (int) (UserCourse::where('user_id', $user->id)->avg('progress') ?? 0);
                $hasResult   = QuizResult::where('user_id', $user->id)->exists();

                $parts    = explode(' ', trim($user->name));
                $initials = strtoupper(substr($parts[0] ?? 'U', 0, 1));
                if (isset($parts[1])) {
                    $initials .= strtoupper(substr($parts[1], 0, 1));
                }

                return [
                    'name'       => $user->name,
                    'email'      => $user->email,
                    'initials'   => $initials,
                    'color'      => $colors[$idx % count($colors)],
                    'status'     => $hasResult ? 'Actif' : 'Nouveau',
                    'progress'   => $avgProgress,
                    'last_login' => $user->updated_at->diffForHumans(),
                ];
            });

        return response()->json([
            'stats' => [
                'total_users'             => $totalUsers,
                'total_users_trend'       => '+' . $newUsersThisMonth . ' ce mois',
                'new_users'               => $newUsersThisMonth,
                'new_users_trend'         => '+' . $newUsersThisMonth . ' inscrits',
                'completed_quizzes'       => $completedQuizzes,
                'completed_quizzes_trend' => '+' . QuizResult::whereDate('created_at', today())->count() . " aujourd'hui",
                'average_time'            => $avgScore . '%',
                'average_time_trend'      => 'Score moyen général',
            ],
            'registrations_chart' => $registrations,
            'quiz_status_chart'   => $quizStatusChart,
            'recent_users'        => $recentUsers,
        ]);
    }
}
