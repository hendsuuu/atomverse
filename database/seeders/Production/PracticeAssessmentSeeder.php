<?php

namespace Database\Seeders\Production;

use App\Models\Course;
use App\Models\Material;
use App\Models\Quiz;
use App\Models\User;
use App\Support\AssessmentDocxImporter;
use Illuminate\Database\Seeder;

class PracticeAssessmentSeeder extends Seeder
{
    public function run(): void
    {
        $importer = new AssessmentDocxImporter();
        $payload = $importer->importPractice(
            base_path('LATIHAN SOAL.docx'),
            'images/assessment-seeds/practice'
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

        $material = Material::query()
            ->where('class_id', $course->id)
            ->published()
            ->orderByDesc('sort_order')
            ->first();

        if (! $material) {
            $material = Material::query()->firstOrCreate(
                ['slug' => 'latihan-struktur-atom'],
                [
                    'class_id' => $course->id,
                    'title' => 'Latihan Struktur Atom',
                    'excerpt' => 'Latihan komprehensif struktur atom dengan feedback langsung.',
                    'status' => 'published',
                    'estimated_read_time' => 10,
                    'sort_order' => 999,
                    'published_at' => now(),
                    'created_by' => $author->id,
                ]
            );
        }

        $quiz = Quiz::query()->updateOrCreate(
            [
                'material_id' => $material->id,
                'title' => $payload['title'],
            ],
            [
                'description' => $payload['description'],
                'passing_score' => 0,
                'time_limit_minutes' => null,
            ]
        );

        $quiz->questions()->delete();

        foreach ($payload['questions'] as $index => $question) {
            $quiz->questions()->create([
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
