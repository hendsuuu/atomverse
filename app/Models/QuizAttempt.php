<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QuizAttempt extends Model
{
    protected $fillable = [
        'quiz_id', 'user_id', 'score', 'total_points', 'answers', 'completed_at',
    ];

    protected function casts(): array
    {
        return [
            'answers' => 'array',
            'score' => 'integer',
            'total_points' => 'integer',
            'completed_at' => 'datetime',
        ];
    }

    public function quiz(): BelongsTo
    {
        return $this->belongsTo(Quiz::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function getPercentageAttribute(): float
    {
        return $this->total_points > 0
            ? round(($this->score / $this->total_points) * 100, 1)
            : 0;
    }

    public function getPassedAttribute(): bool
    {
        return $this->percentage >= ($this->quiz->passing_score ?? 60);
    }
}
