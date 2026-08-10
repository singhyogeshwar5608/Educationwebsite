<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('subject_syllabus_topics', function (Blueprint $table) {
            $table->id();
            $table->string('topic');
            $table->text('description')->nullable();
            $table->integer('sort_order')->default(0);
            $table->foreignId('subject_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('subject_syllabus_topics');
    }
};
