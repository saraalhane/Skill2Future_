<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;

$toAdd = [];
if (!Schema::hasColumn('users', 'prenom')) $toAdd[] = 'prenom';
if (!Schema::hasColumn('users', 'nom')) $toAdd[] = 'nom';
if (!Schema::hasColumn('users', 'bio')) $toAdd[] = 'bio';
if (!Schema::hasColumn('users', 'objectif')) $toAdd[] = 'objectif';

if (count($toAdd) > 0) {
    Schema::table('users', function(Blueprint $table) use ($toAdd) {
        foreach($toAdd as $col) {
            if ($col == 'bio') {
                $table->text($col)->nullable();
            } else {
                $table->string($col)->nullable();
            }
        }
    });
}
echo "Done";
