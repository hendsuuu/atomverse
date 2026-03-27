<?php

namespace Database\Factories;

use App\Models\Material;
use App\Models\MaterialSection;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/** @extends Factory<MaterialSection> */
class MaterialSectionFactory extends Factory
{
    protected $model = MaterialSection::class;

    private static array $sectionTitles = [
        'Introduction',
        'Getting Started',
        'Core Concepts',
        'Setting Up the Environment',
        'Basic Syntax & Structure',
        'Advanced Techniques',
        'Working with Data',
        'Error Handling',
        'Best Practices',
        'Performance Optimization',
        'Testing Strategies',
        'Deployment & Production',
        'Real-World Examples',
        'Common Patterns',
        'Security Considerations',
        'Summary & Next Steps',
    ];

    public function definition(): array
    {
        $title = fake()->randomElement(self::$sectionTitles);

        return [
            'material_id' => Material::factory(),
            'title' => $title,
            'slug' => Str::slug($title),
            'blocks' => $this->generateBlocks(),
            'image' => null,
            'image_caption' => fake()->optional(0.3)->sentence(),
            'layout_variant' => 'default',
            'sort_order' => 0,
        ];
    }

    private function generateBlocks(): array
    {
        $blocks = [];

        // Always start with rich text
        $blocks[] = [
            'type' => 'rich_text',
            'content' => $this->generateRichHtml(),
        ];

        // Randomly add more blocks
        $blockCount = rand(1, 4);
        for ($i = 0; $i < $blockCount; $i++) {
            $type = fake()->randomElement(['rich_text', 'callout', 'quote', 'rich_text']);
            switch ($type) {
                case 'rich_text':
                    $blocks[] = [
                        'type' => 'rich_text',
                        'content' => $this->generateRichHtml(),
                    ];
                    break;
                case 'callout':
                    $blocks[] = [
                        'type' => 'callout',
                        'variant' => fake()->randomElement(['info', 'warning', 'tip', 'note']),
                        'content' => fake()->paragraph(),
                    ];
                    break;
                case 'quote':
                    $blocks[] = [
                        'type' => 'quote',
                        'content' => fake()->sentence(12),
                        'author' => fake()->name(),
                    ];
                    break;
            }
        }

        return $blocks;
    }

    private function generateRichHtml(): string
    {
        $paragraphs = rand(2, 4);
        $html = '';

        for ($i = 0; $i < $paragraphs; $i++) {
            $content = fake()->paragraph(rand(3, 6));
            if ($i === 0 && rand(0, 1)) {
                // Sometimes add a sub-heading
                $html .= '<h3>' . fake()->sentence(4) . '</h3>';
            }
            $html .= '<p>' . $content . '</p>';
        }

        // Occasionally add a list
        if (rand(0, 1)) {
            $html .= '<ul>';
            $listItems = rand(3, 6);
            for ($i = 0; $i < $listItems; $i++) {
                $html .= '<li>' . fake()->sentence() . '</li>';
            }
            $html .= '</ul>';
        }

        return $html;
    }
}
