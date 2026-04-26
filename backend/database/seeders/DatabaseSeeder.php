<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        if (User::count() == 0) {
            User::factory()->create([
                'name' => 'Test User',
                'prenom' => 'Test',
                'nom' => 'User',
                'email' => 'test@example.com',
                'role' => 'user',
            ]);
               User::factory()->create([
                'name' => 'reda',
                'prenom' => 'admin',
                'nom' => 'User4',
                'email' => 'test25@example.com',
                'role' => 'admin',
            ]);
        }
        
        $this->call([
            QuizSeeder::class,
            CourseSeeder::class,
        ]);
    }
}
