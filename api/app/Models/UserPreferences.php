<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserPreferences extends Model
{
    public $connection = 'userdata';
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'dark',
    ];
}
