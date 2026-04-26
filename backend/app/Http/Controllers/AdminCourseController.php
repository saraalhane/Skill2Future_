<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Course;

class AdminCourseController extends Controller
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
            'level' => 'required|string',
            'duration' => 'required|string',
            'description' => 'required|string',
            'tags' => 'required|array',
            'modules' => 'nullable|array',
            'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048'
        ]);

        $courseData = [
            'title' => $validated['title'],
            'category' => $validated['category'],
            'level' => $validated['level'],
            'duration' => $validated['duration'],
            'description' => $validated['description'],
            'tags' => $validated['tags']
        ];

        // Compute counts
        $lessonsCount = 0;
        $exercisesCount = 0;

        if (isset($validated['modules']) && is_array($validated['modules'])) {
            foreach ($validated['modules'] as $moduleData) {
                if (isset($moduleData['lessons']) && is_array($moduleData['lessons'])) {
                    $lessonsCount += count($moduleData['lessons']);
                    foreach ($moduleData['lessons'] as $lessonData) {
                        if (isset($lessonData['type']) && $lessonData['type'] === 'exercise') {
                            $exercisesCount++;
                        }
                    }
                }
            }
        }

        $courseData['lessons_count'] = $lessonsCount;
        $courseData['exercises_count'] = $exercisesCount;

        if ($request->hasFile('thumbnail')) {
            $path = $request->file('thumbnail')->store('course_thumbnails', 'public');
            $courseData['thumbnail'] = $path;
        }

        // Optionally add defaults for missing UI fields
        $courseData['icon'] = 'fas fa-graduation-cap';
        $courseData['color_bg'] = '#3b82f6';

        $course = Course::create($courseData);

        if (isset($validated['modules']) && is_array($validated['modules'])) {
            foreach ($validated['modules'] as $mIndex => $moduleData) {
                if (!isset($moduleData['title'])) continue;

                $module = \App\Models\Module::create([
                    'course_id' => $course->id,
                    'title' => $moduleData['title'],
                    'order' => $mIndex + 1
                ]);

                if (isset($moduleData['lessons']) && is_array($moduleData['lessons'])) {
                    foreach ($moduleData['lessons'] as $lIndex => $lessonData) {
                        if (!isset($lessonData['title'])) continue;
                        
                        \App\Models\Lesson::create([
                            'module_id' => $module->id,
                            'course_id' => $course->id,
                            'title' => $lessonData['title'],
                            'duration' => $lessonData['duration'] ?? '10 min',
                            'type' => $lessonData['type'] ?? 'article',
                            'video_url' => $lessonData['video_url'] ?? null,
                            'order' => $lIndex + 1
                        ]);
                    }
                }
            }
        }

        return response()->json(['message' => 'Course created', 'course' => $course], 201);
    }

    public function update(Request $request, $id)
    {
        $this->checkAdmin($request);
        $course = Course::findOrFail($id);
        
        $validated = $request->validate([
            'title' => 'sometimes|required|string',
            'category' => 'sometimes|required|string',
            'level' => 'sometimes|required|string',
            'duration' => 'sometimes|required|string',
            'description' => 'sometimes|required|string',
            'tags' => 'sometimes|required|array'
        ]);

        $course->update($validated);
        return response()->json(['message' => 'Course updated', 'course' => $course]);
    }

    public function destroy(Request $request, $id)
    {
        $this->checkAdmin($request);
        $course = Course::findOrFail($id);
        $course->delete();
        return response()->json(['message' => 'Course deleted']);
    }
}
