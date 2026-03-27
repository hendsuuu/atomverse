<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class MaterialSection extends Model
{
    use HasFactory;

    protected $fillable = [
        'material_id',
        'title',
        'slug',
        'blocks',
        'image',
        'image_caption',
        'layout_variant',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'blocks' => 'array',
            'sort_order' => 'integer',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (MaterialSection $section) {
            if (empty($section->slug)) {
                $section->slug = Str::slug($section->title);
            }
        });
    }

    // ── Relationships ──

    public function material(): BelongsTo
    {
        return $this->belongsTo(Material::class);
    }

    // ── Accessors ──

    public function getImageUrlAttribute(): ?string
    {
        if ($this->image) {
            return asset('storage/' . $this->image);
        }
        return null;
    }

    public function getAnchorAttribute(): string
    {
        return $this->slug ?: Str::slug($this->title);
    }
}
