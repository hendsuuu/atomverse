<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ExamAttempt extends Model
{
    protected $fillable = [
        'exam_id', 'user_id', 'score', 'total_points', 'answers', 'completed_at',
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

    public function exam(): BelongsTo
    {
        return $this->belongsTo(Exam::class);
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
}
