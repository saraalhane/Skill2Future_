<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\LessonCompletion;
use App\Models\QuizResult;
use App\Models\UserCourse;

class LeaderboardController extends Controller
{
    /**
     * GET /api/auth/leaderboard
     * Returns ranked users sorted by XP.
     * XP formula:
     *   - Each completed lesson  = 50 XP
     *   - Each quiz score point  = 10 XP  (e.g. score 80 → 800 XP)
     *   - Course completion bonus = 200 XP per finished course
     */
    public function index(Request $request)
    {
        $currentUser = $request->user();

        // Pre-fetch all relevant aggregates in bulk (N+1 safe)
        $lessonXp = LessonCompletion::selectRaw('user_id, COUNT(*) * 50 as xp')
            ->groupBy('user_id')
            ->pluck('xp', 'user_id');

        $quizXp = QuizResult::selectRaw('user_id, SUM(score) * 10 as xp')
            ->groupBy('user_id')
            ->pluck('xp', 'user_id');

        $courseBonus = UserCourse::selectRaw("user_id, COUNT(*) * 200 as xp")
            ->where('status', 'termine')
            ->groupBy('user_id')
            ->pluck('xp', 'user_id');

        $quizCounts = QuizResult::selectRaw('user_id, COUNT(*) as total')
            ->groupBy('user_id')
            ->pluck('total', 'user_id');

        $courseCounts = UserCourse::selectRaw('user_id, COUNT(*) as total')
            ->whereIn('status', ['en_cours', 'termine'])
            ->groupBy('user_id')
            ->pluck('total', 'user_id');

        // Build leaderboard entries for all users
        $users = User::all()->map(function (User $user) use (
            $lessonXp, $quizXp, $courseBonus, $quizCounts, $courseCounts, $currentUser
        ) {
            $xp = ($lessonXp[$user->id] ?? 0)
                + ($quizXp[$user->id] ?? 0)
                + ($courseBonus[$user->id] ?? 0);

            $badge = match(true) {
                $xp >= 4500 => 'Diamond',
                $xp >= 3500 => 'Platinum',
                $xp >= 2500 => 'Gold',
                $xp >= 1500 => 'Silver',
                $xp >= 500  => 'Bronze',
                default     => 'Member',
            };

            // Streak: consecutive days active (simplified: days since last quiz result)
            $streak = 0;
            $lastResult = QuizResult::where('user_id', $user->id)
                ->latest()
                ->first();
            if ($lastResult) {
                $daysDiff = now()->diffInDays($lastResult->created_at);
                $streak = max(0, 7 - $daysDiff); // rough streak estimate
            }

            // Build avatar initials from name
            $parts  = explode(' ', trim($user->name));
            $avatar = strtoupper(
                strlen($parts[0]) > 0 ? $parts[0][0] : 'U'
            );
            if (count($parts) > 1 && strlen($parts[1]) > 0) {
                $avatar .= strtoupper($parts[1][0]);
            }

            return [
                'id'         => $user->id,
                'name'       => $user->name,
                'prenom'     => $user->prenom ?? explode(' ', $user->name)[0],
                'avatar'     => $avatar,
                'xp'         => $xp,
                'quizzes'    => $quizCounts[$user->id]  ?? 0,
                'courses'    => $courseCounts[$user->id] ?? 0,
                'streak'     => $streak,
                'badge'      => $badge,
                'is_me'      => $user->id === $currentUser->id,
            ];
        });

        // Sort by XP descending and assign ranks
        $ranked = $users
            ->sortByDesc('xp')
            ->values()
            ->map(function ($entry, $index) {
                $entry['rank'] = $index + 1;
                return $entry;
            });

        return response()->json([
            'leaderboard'    => $ranked,
            'my_rank'        => $ranked->firstWhere('is_me')['rank'] ?? null,
            'my_xp'          => $ranked->firstWhere('is_me')['xp']  ?? 0,
        ]);
    }
}
