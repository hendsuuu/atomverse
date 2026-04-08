<?php

namespace Database\Seeders\Production;

use App\Models\Course;
use App\Models\Exam;
use App\Models\User;
use App\Support\AssessmentDocxImporter;
use Illuminate\Database\Seeder;

class ExamAssessmentSeeder extends Seeder
{
    public function run(): void
    {
        $importer = new AssessmentDocxImporter();
        $payload = $importer->importExam(
            base_path('SOAL TES.docx'),
            'images/assessment-seeds/exam'
        );

        $author = User::query()
            ->where('role', User::ROLE_SUPERADMIN)
            ->first()
            ?? User::query()->first()
            ?? User::factory()->create([
                'name' => 'Seeder Admin',
                'email' => 'seeder-admin@atomverse.local',
                'role' => User::ROLE_SUPERADMIN,
                'is_active' => true,
            ]);

        $course = Course::query()->firstOrCreate(
            ['slug' => 'struktur-atom'],
            [
                'title' => 'Struktur Atom',
                'description' => 'Kumpulan materi, latihan, dan evaluasi topik struktur atom.',
                'status' => 'published',
                'created_by' => $author->id,
            ]
        );

        $exam = Exam::query()->updateOrCreate(
            [
                'course_id' => $course->id,
                'title' => $payload['title'],
            ],
            [
                'description' => $payload['description'],
                'passing_score' => 60,
                'time_limit_minutes' => null,
            ]
        );

        $exam->questions()->delete();

        foreach ($payload['questions'] as $index => $question) {
            $exam->questions()->create([
                'type' => $question['type'],
                'question' => $question['question'],
                'image_path' => $question['image_path'],
                'options' => $question['options'],
                'correct_answer' => $question['correct_answer'],
                'points' => $question['points'],
                'sort_order' => $index + 1,
                'explanation' => $question['explanation'],
            ]);
        }
    }
}
