<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
    * Run the migrations.
    */
    public function up(): void
    {
        Schema::create('user_preferences', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id')->primary();
            $table->smallInteger('dark');
            $table->timestamps();
        });
        
        Schema::create('audit_user_preferences', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id');
            $table->smallInteger('dark');
            $table->timestamps();
        });
        
        DB::unprepared('
            CREATE TRIGGER user_preferences_update
            AFTER UPDATE ON user_preferences
            FOR EACH ROW
            BEGIN
                INSERT INTO audit_users (user_id, dark, created_at, updated_at)
                VALUES (OLD.user_id, OLD.dark, OLD.created_at, OLD.updated_at);
            END;
        ');
    }
    
    /**
    * Reverse the migrations.
    */
    public function down(): void
    {
        Schema::dropIfExists('user_preferences');
    }
};
