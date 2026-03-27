<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('quiz_questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('quiz_id')->constrained('quizzes')->cascadeOnDelete();
            $table->enum('type', ['multiple_choice', 'drag_drop'])->default('multiple_choice');
            $table->text('question');
            $table->json('options'); // e.g. ["A","B","C","D"] or drag items
            $table->json('correct_answer'); // e.g. "B" or {"Dalton":"Bola Biliar",...}
            $table->unsignedSmallInteger('points')->default(10);
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->text('explanation')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quiz_questions');
    }
};
