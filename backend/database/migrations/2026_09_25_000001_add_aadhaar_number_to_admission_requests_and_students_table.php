<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('admission_requests', function (Blueprint $table) {
            $table->string('aadhaar_number', 12)->nullable()->after('matric_dmc');
        });

        Schema::table('students', function (Blueprint $table) {
            $table->string('aadhaar_number', 12)->nullable()->after('matric_dmc');
        });
    }

    public function down(): void
    {
        Schema::table('admission_requests', function (Blueprint $table) {
            $table->dropColumn('aadhaar_number');
        });

        Schema::table('students', function (Blueprint $table) {
            $table->dropColumn('aadhaar_number');
        });
    }
};