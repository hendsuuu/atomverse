<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('quiz_questions', function (Blueprint $table) {
            $table->string('image_path')->nullable()->after('question');
        });

        Schema::table('exam_questions', function (Blueprint $table) {
            $table->string('image_path')->nullable()->after('question');
        });

        DB::statement("
            ALTER TABLE quiz_questions
            MODIFY type ENUM('multiple_choice', 'drag_drop', 'essay')
            NOT NULL DEFAULT 'multiple_choice'
        ");

        DB::statement("
            ALTER TABLE exam_questions
            MODIFY type ENUM('multiple_choice', 'drag_drop', 'essay')
            NOT NULL DEFAULT 'multiple_choice'
        ");
    }

    public function down(): void
    {
        DB::statement("
            ALTER TABLE quiz_questions
            MODIFY type ENUM('multiple_choice', 'drag_drop')
            NOT NULL DEFAULT 'multiple_choice'
        ");

        DB::statement("
            ALTER TABLE exam_questions
            MODIFY type ENUM('multiple_choice', 'drag_drop')
            NOT NULL DEFAULT 'multiple_choice'
        ");

        Schema::table('quiz_questions', function (Blueprint $table) {
            $table->dropColumn('image_path');
        });

        Schema::table('exam_questions', function (Blueprint $table) {
            $table->dropColumn('image_path');
        });
    }
};
