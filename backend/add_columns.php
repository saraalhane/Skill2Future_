<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;

if (!Schema::hasColumn('users', 'nom')) {
    Schema::table('users', function(Blueprint $table) {
        $table->string('nom')->nullable();
    });
}
if (!Schema::hasColumn('users', 'bio')) {
    Schema::table('users', function(Blueprint $table) {
        $table->text('bio')->nullable();
    });
}
if (!Schema::hasColumn('users', 'objectif')) {
    Schema::table('users', function(Blueprint $table) {
        $table->string('objectif')->nullable();
    });
}

echo "Columns checked and added if missing.\n";
