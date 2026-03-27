<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Material extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'class_id',
        'title',
        'slug',
        'excerpt',
        'cover_image',
        'status',
        'estimated_read_time',
        'sort_order',
        'published_at',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'published_at' => 'datetime',
            'sort_order' => 'integer',
            'estimated_read_time' => 'integer',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (Material $material) {
            if (empty($material->slug)) {
                $material->slug = Str::slug($material->title);
            }
        });
    }

    // ── Relationships ──

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class, 'class_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function sections(): HasMany
    {
        return $this->hasMany(MaterialSection::class)->orderBy('sort_order');
    }

    public function quizzes(): HasMany
    {
        return $this->hasMany(Quiz::class);
    }

    // ── Accessors ──

    public function getCoverImageUrlAttribute(): ?string
    {
        if ($this->cover_image) {
            return asset('storage/' . $this->cover_image);
        }
        return null;
    }

    // ── Scopes ──

    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    public function scopeSearch($query, ?string $search)
    {
        if ($search) {
            return $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('excerpt', 'like', "%{$search}%");
            });
        }
        return $query;
    }
}
