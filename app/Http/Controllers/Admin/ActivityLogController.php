<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ActivityLogController extends Controller
{
    public function index(Request $request): Response
    {
        $actorType = $request->input('actor_type'); // 'customer', 'admin'
        $activityType = $request->input('activity_type');
        $search = $request->input('search');

        $logs = ActivityLog::with('user')
            ->when($actorType, fn ($q) => $q->where('actor_type', $actorType))
            ->when($activityType, fn ($q) => $q->where('activity_type', $activityType))
            ->when($search, function ($q) use ($search) {
                $q->where(function ($sub) use ($search) {
                    $sub->where('description', 'like', "%{$search}%")
                        ->orWhere('ip_address', 'like', "%{$search}%")
                        ->orWhereHas('user', function ($u) use ($search) {
                            $u->where('name', 'like', "%{$search}%")
                                ->orWhere('email', 'like', "%{$search}%");
                        });
                });
            })
            ->latest()
            ->paginate(25)
            ->withQueryString();

        return Inertia::render('admin/activity-logs/index', [
            'logs' => $logs,
            'filters' => [
                'actor_type' => $actorType ?? '',
                'activity_type' => $activityType ?? '',
                'search' => $search ?? '',
            ],
        ]);
    }
}
