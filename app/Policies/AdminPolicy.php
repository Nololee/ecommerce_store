<?php

namespace App\Policies;

use App\Models\User;

class AdminPolicy
{
    /**
     * Determine whether the user can access the admin dashboard and management controls.
     */
    public function viewAdmin(User $user): bool
    {
        return (bool) ($user->is_admin && $user->is_active);
    }

    /**
     * Determine whether the user can manage customer accounts.
     */
    public function manageUsers(User $user): bool
    {
        return (bool) ($user->is_admin && $user->is_active);
    }

    /**
     * Determine whether the user can manage catalog products and inventory.
     */
    public function manageProducts(User $user): bool
    {
        return (bool) ($user->is_admin && $user->is_active);
    }

    /**
     * Determine whether the user can manage orders and fulfillment.
     */
    public function manageOrders(User $user): bool
    {
        return (bool) ($user->is_admin && $user->is_active);
    }

    /**
     * Determine whether the user can export business and sales reports.
     */
    public function exportReports(User $user): bool
    {
        return (bool) ($user->is_admin && $user->is_active);
    }
}
