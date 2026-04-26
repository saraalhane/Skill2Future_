<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Course;
use App\Models\UserCourse;

class CourseController extends Controller
{
    public function index(Request $request)
    {
        $user_id = $request->user()->id;
        
        $courses = Course::with(['userCourses' => function($query) use ($user_id) {
            $query->where('user_id', $user_id);
        }])->get();

        // Transform collection to flat structure easier for frontend
        $transformed = $courses->map(function ($course) {
            $userCourse = $course->userCourses->first();
            return [
                'id' => $course->id,
                'title' => $course->title,
                'category' => $course->category,
                'level' => $course->level,
                'duration' => $course->duration,
                'lessons_count' => $course->lessons_count,
                'exercises_count' => $course->exercises_count,
                'icon' => $course->icon,
                'thumbnail_url' => $course->thumbnail_url,
                'color_bg' => $course->color_bg,
                'status' => $userCourse ? $userCourse->status : 'non_commence',
                'progress' => $userCourse ? $userCourse->progress : 0,
            ];
        });

        return response()->json($transformed);
    }
}
