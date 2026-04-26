<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('user_settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->boolean('notifications_email')->default(true);
            $table->boolean('notifications_quiz')->default(true);
            $table->boolean('notifications_courses')->default(false);
            $table->boolean('public_profile')->default(true);
            $table->boolean('show_progress')->default(true);
            $table->string('language')->default('fr');
            $table->string('theme')->default('light');
            $table->string('timezone')->default('Europe/Paris');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_settings');
    }
};
