<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('admission_requests', function (Blueprint $table) {
            $table->string('photo')->nullable()->after('address');
            $table->string('aadhaar_card')->nullable()->after('photo');
            $table->string('matric_dmc')->nullable()->after('aadhaar_card');
        });
    }

    public function down(): void
    {
        Schema::table('admission_requests', function (Blueprint $table) {
            $table->dropColumn(['photo', 'aadhaar_card', 'matric_dmc']);
        });
    }
};
