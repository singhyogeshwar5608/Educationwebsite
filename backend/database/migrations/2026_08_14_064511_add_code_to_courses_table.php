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
        Schema::table('courses', function (Blueprint $table) {
            $table->string('code')->nullable()->after('slug');
        });

        // Backfill code from the existing slug (codes were previously the
        // uppercased slug, so existing records keep their current value).
        DB::table('courses')->whereNull('code')->update([
            'code' => DB::raw('UPPER(slug)'),
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('courses', function (Blueprint $table) {
            $table->dropColumn('code');
        });
    }
};
