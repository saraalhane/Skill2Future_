<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UserSetting;

class UserSettingController extends Controller
{
    public function show(Request $request)
    {
        $settings = UserSetting::firstOrCreate(
            ['user_id' => $request->user()->id],
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

        return response()->json($settings);
    }

    public function update(Request $request)
    {
        $settings = UserSetting::where('user_id', $request->user()->id)->firstOrFail();
        
        $settings->update($request->all());

        return response()->json($settings);
    }
}
