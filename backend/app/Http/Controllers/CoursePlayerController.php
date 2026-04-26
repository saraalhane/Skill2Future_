<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Course;
use App\Models\Module;
use App\Models\Lesson;
use App\Models\UserCourse;
use App\Models\LessonCompletion;

class CoursePlayerController extends Controller
{
    /**
     * GET /api/auth/courses/{id}/player
     * Returns the course with its modules and lessons from DB,
     * each tagged with the current user's completion status.
     */
    public function show(Request $request, int $id)
    {
        $user   = $request->user();
        $course = Course::findOrFail($id);

        // All lesson IDs already completed by this user in this course
        $completedIds = LessonCompletion::where('user_id', $user->id)
            ->where('course_id', $id)
            ->pluck('lesson_id')
            ->toArray();

        // Load modules → lessons from DB (ordered)
        $modules = Module::where('course_id', $id)
            ->orderBy('order')
            ->with(['lessons' => fn($q) => $q->orderBy('order')])
            ->get()
            ->map(function (Module $module) use ($completedIds) {
                return [
                    'id'      => $module->id,
                    'title'   => $module->title,
                    'lessons' => $module->lessons->map(function (Lesson $lesson) use ($completedIds) {
                        return [
                            'id'        => $lesson->id,
                            'title'     => $lesson->title,
                            'duration'  => $lesson->duration,
                            'type'      => $lesson->type,
                            'video_url' => $lesson->video_url,
                            'order'     => $lesson->order,
                            'completed' => in_array($lesson->id, $completedIds),
                        ];
                    })->values(),
                ];
            });

        $totalLessons = Lesson::where('course_id', $id)->count();

        $userCourse = UserCourse::where('user_id', $user->id)
            ->where('course_id', $id)
            ->first();

        return response()->json([
            'id'              => $course->id,
            'title'           => $course->title,
            'instructor'      => 'Prof. Skill2Future',
            'total_lessons'   => $totalLessons,
            'completed_count' => count($completedIds),
            'progress'        => $userCourse?->progress ?? 0,
            'status'          => $userCourse?->status   ?? 'non_commence',
            'modules'         => $modules,
            'completed_ids'   => $completedIds,
        ]);
    }

    /**
     * POST /api/auth/courses/{id}/complete-lesson
     * Body: { lesson_id: int }
     * Marks a lesson done, recalculates progress from DB, updates user_courses.
     */
    public function completeLesson(Request $request, int $id)
    {
        $request->validate(['lesson_id' => 'required|integer']);

        $user     = $request->user();
        $lessonId = $request->lesson_id;

        // Verify lesson belongs to this course
        Lesson::where('id', $lessonId)->where('course_id', $id)->firstOrFail();

        // Idempotent insert
        LessonCompletion::firstOrCreate([
            'user_id'   => $user->id,
            'course_id' => $id,
            'lesson_id' => $lessonId,
        ]);

        // Recalculate progress entirely from DB
        $totalLessons   = Lesson::where('course_id', $id)->count();
        $completedCount = LessonCompletion::where('user_id', $user->id)
            ->where('course_id', $id)
            ->count();

        $progress = $totalLessons > 0
            ? (int) round(($completedCount / $totalLessons) * 100)
            : 0;

        $status = match(true) {
            $progress >= 100 => 'termine',
            $progress > 0    => 'en_cours',
            default          => 'non_commence',
        };

        UserCourse::updateOrCreate(
            ['user_id' => $user->id, 'course_id' => $id],
            ['progress' => $progress, 'status' => $status]
        );

        return response()->json([
            'message'         => 'Leçon marquée comme terminée.',
            'progress'        => $progress,
            'status'          => $status,
            'completed_count' => $completedCount,
            'total_lessons'   => $totalLessons,
        ]);
    }
}
