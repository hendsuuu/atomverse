<?php

namespace Database\Factories;

use App\Models\Course;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/** @extends Factory<Course> */
class CourseFactory extends Factory
{
    protected $model = Course::class;

    private static array $courseTitles = [
        'Fundamental Web Development',
        'Advanced React Patterns',
        'Introduction to Machine Learning',
        'Database Design & Optimization',
        'UI/UX Design Principles',
        'Cloud Infrastructure with AWS',
        'Mobile App Development with Flutter',
        'DevOps & CI/CD Pipeline',
        'Python for Data Science',
        'Cybersecurity Essentials',
        'Microservices Architecture',
        'TypeScript Mastery',
    ];

    public function definition(): array
    {
        $title = fake()->unique()->randomElement(self::$courseTitles);

        return [
            'title' => $title,
            'slug' => Str::slug($title),
            'description' => fake()->paragraphs(3, true),
            'thumbnail' => null,
            'status' => fake()->randomElement(['draft', 'published', 'published', 'published']),
            'created_by' => User::factory(),
        ];
    }

    public function published(): static
    {
        return $this->state(fn () => [
            'status' => 'published',
        ]);
    }

    public function draft(): static
    {
        return $this->state(fn () => [
            'status' => 'draft',
        ]);
    }
}
