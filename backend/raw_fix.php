<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
use Illuminate\Support\Facades\DB;

try { DB::statement("ALTER TABLE users ADD COLUMN prenom VARCHAR(255) NULL"); } catch(\Exception $e) {}
try { DB::statement("ALTER TABLE users ADD COLUMN nom VARCHAR(255) NULL"); } catch(\Exception $e) {}
try { DB::statement("ALTER TABLE users ADD COLUMN bio TEXT NULL"); } catch(\Exception $e) {}
try { DB::statement("ALTER TABLE users ADD COLUMN objectif VARCHAR(255) NULL"); } catch(\Exception $e) {}

echo "Fix complete.";
