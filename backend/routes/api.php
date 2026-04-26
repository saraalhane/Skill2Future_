<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProfileController;

Route::post('/test', function () {
    return response()->json(['message' => 'Test route works']);
});

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);

    // Google Auth
    Route::get('/google', [\App\Http\Controllers\SocialAuthController::class, 'redirectToGoogle']);
    Route::get('/google/callback', [\App\Http\Controllers\SocialAuthController::class, 'handleGoogleCallback']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/user', [AuthController::class, 'user']);

        Route::get('/profile', [ProfileController::class, 'show']);
        Route::put('/profile', [ProfileController::class, 'update']);

        // Quizzes
        Route::get('/quizzes', [\App\Http\Controllers\QuizController::class, 'index']);
        Route::get('/quizzes/{id}', [\App\Http\Controllers\QuizController::class, 'show']);

        // Quiz Results
        Route::get('/quiz-results', [\App\Http\Controllers\QuizResultController::class, 'index']);
        Route::get('/quiz-results/{quiz_id}', [\App\Http\Controllers\QuizResultController::class, 'show']);
        Route::post('/quiz-results', [\App\Http\Controllers\QuizResultController::class, 'store']);

        // Settings
        Route::get('/settings', [\App\Http\Controllers\UserSettingController::class, 'show']);
        Route::put('/settings', [\App\Http\Controllers\UserSettingController::class, 'update']);

        // Courses list (Learning page)
        Route::get('/courses', [\App\Http\Controllers\CourseController::class, 'index']);

        // Course Player
        Route::get('/courses/{id}/player', [\App\Http\Controllers\CoursePlayerController::class, 'show']);
        Route::post('/courses/{id}/complete-lesson', [\App\Http\Controllers\CoursePlayerController::class, 'completeLesson']);

        // Student Dashboard
        Route::get('/dashboard', [\App\Http\Controllers\DashboardController::class, 'index']);

        // Leaderboard
        Route::get('/leaderboard', [\App\Http\Controllers\LeaderboardController::class, 'index']);

        // Admin Dashboard
        Route::get('/admin/dashboard', [\App\Http\Controllers\AdminDashboardController::class, 'index']);
        
        // Admin Users Management
        Route::get('/admin/users', [\App\Http\Controllers\AdminUserController::class, 'index']);
        Route::post('/admin/users', [\App\Http\Controllers\AdminUserController::class, 'store']);
        Route::put('/admin/users/{id}/role', [\App\Http\Controllers\AdminUserController::class, 'updateRole']);
        Route::delete('/admin/users/{id}', [\App\Http\Controllers\AdminUserController::class, 'destroy']);
        // Admin Courses Management
        Route::post('/admin/courses', [\App\Http\Controllers\AdminCourseController::class, 'store']);
        Route::put('/admin/courses/{id}', [\App\Http\Controllers\AdminCourseController::class, 'update']);
        Route::delete('/admin/courses/{id}', [\App\Http\Controllers\AdminCourseController::class, 'destroy']);
        
        // Admin Quizzes Management
        Route::post('/admin/quizzes', [\App\Http\Controllers\AdminQuizController::class, 'store']);
        Route::put('/admin/quizzes/{id}', [\App\Http\Controllers\AdminQuizController::class, 'update']);
        Route::delete('/admin/quizzes/{id}', [\App\Http\Controllers\AdminQuizController::class, 'destroy']);
        
        // N8N Proxy Route
        Route::post('/n8n/webhook', function (\Illuminate\Http\Request $request) {
            $n8nUrl = 'https://lixcap-dashboard.app.n8n.cloud/webhook-test/http://local';
            
            $response = \Illuminate\Support\Facades\Http::post($n8nUrl, $request->all());
            
            if ($response->successful()) {
                return response()->json(['success' => true]);
            }
            
            return response()->json(['success' => false, 'error' => $response->body()], $response->status());
        });
    });
});
