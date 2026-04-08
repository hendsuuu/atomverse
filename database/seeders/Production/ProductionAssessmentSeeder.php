<?php

namespace Database\Seeders\Production;

use Illuminate\Database\Seeder;

class ProductionAssessmentSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            PracticeAssessmentSeeder::class,
            ExamAssessmentSeeder::class,
        ]);
    }
}
