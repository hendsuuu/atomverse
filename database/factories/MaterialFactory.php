<?php

namespace Database\Factories;

use App\Models\Course;
use App\Models\Material;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/** @extends Factory<Material> */
class MaterialFactory extends Factory
{
    protected $model = Material::class;

    public function definition(): array
    {
        $title = fake()->sentence(rand(3, 6));

        return [
            'class_id' => Course::factory(),
            'title' => rtrim($title, '.'),
            'slug' => Str::slug($title),
            'excerpt' => fake()->paragraph(2),
            'cover_image' => null,
            'status' => 'published',
            'estimated_read_time' => fake()->numberBetween(3, 25),
            'sort_order' => 0,
            'published_at' => now()->subDays(rand(1, 30)),
            'created_by' => User::factory(),
        ];
    }

    public function draft(): static
    {
        return $this->state(fn () => [
            'status' => 'draft',
            'published_at' => null,
        ]);
    }
}
