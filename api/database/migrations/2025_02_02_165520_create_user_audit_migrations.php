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

    DB::unprepared('
        CREATE TRIGGER users_update
        AFTER UPDATE ON users
        FOR EACH ROW
        BEGIN
            INSERT INTO audit_users (id, name, email, email_verified_at, remember_token, created_at, updated_at, user_type)
            VALUES (OLD.id, OLD.name, OLD.email, OLD.email_verified_at, OLD.remember_token, OLD.created_at, OLD.updated_at, OLD.user_type);
        END;
    ');

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_audit_migrations');
    }
};
