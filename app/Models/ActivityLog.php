<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class ActivityLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'actor_type',
        'activity_type',
        'subject_type',
        'subject_id',
        'description',
        'properties',
        'ip_address',
        'user_agent',
    ];

    protected function casts(): array
    {
        return [
            'properties' => 'array',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function subject(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * Helper to log activities safely without passwords/tokens.
     */
    public static function record(
        string $activityType,
        string $description,
        ?Model $subject = null,
        ?User $user = null,
        array $properties = [],
        string $actorType = 'customer'
    ): self {
        $request = request();
        $currentUser = $user ?? auth()->user();

        // Sanitize properties to ensure POPIA compliance (never log sensitive secrets)
        $cleanProps = collect($properties)->except([
            'password',
            'password_confirmation',
            'token',
            'cvv',
            'card_number',
            'two_factor_secret',
            'two_factor_recovery_codes',
        ])->all();

        return self::create([
            'user_id' => $currentUser?->id,
            'actor_type' => $actorType,
            'activity_type' => $activityType,
            'subject_type' => $subject ? get_class($subject) : null,
            'subject_id' => $subject?->getKey(),
            'description' => $description,
            'properties' => $cleanProps,
            'ip_address' => $request->ip(),
            'user_agent' => substr((string) $request->userAgent(), 0, 255),
        ]);
    }
}
