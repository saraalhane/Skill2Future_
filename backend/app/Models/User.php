<?php

namespace App\Models;

use Laravel\Sanctum\HasApiTokens; // 👈 AJOUTER
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable; // 👈 AJOUTER HasApiTokens

    protected $fillable = [
        'name',
        'prenom',
        'nom',
        'email',
        'password',
        'bio',
        'objectif'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}