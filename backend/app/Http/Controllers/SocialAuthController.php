<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class SocialAuthController extends Controller
{
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->stateless()->redirect();
    }

    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();
            
            // Check if user already exists
            $user = User::where('email', $googleUser->getEmail())->first();

            if (!$user) {
                // Determine names
                $nameParts = explode(' ', $googleUser->getName());
                $prenom = $nameParts[0];
                $nom = count($nameParts) > 1 ? end($nameParts) : '';

                // Create new user
                $user = User::create([
                    'name' => $googleUser->getName(),
                    'prenom' => $prenom,
                    'nom' => $nom,
                    'email' => $googleUser->getEmail(),
                    'password' => Hash::make(Str::random(24)),
                    'role' => 'user'
                ]);
            }

            // Create token
            $token = $user->createToken('auth_token')->plainTextToken;

            // Redirect back to frontend with the token
            return redirect('http://localhost:5173/login?token=' . $token);

        } catch (\Exception $e) {
            return redirect('http://localhost:5173/login?error=Google auth failed');
        }
    }
}
