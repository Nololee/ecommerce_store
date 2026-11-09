<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('activity_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('actor_type')->default('customer'); // 'customer', 'admin', 'system'
            $table->string('activity_type'); // 'customer_registered', 'login', 'logout', 'product_view', 'product_search', 'cart_add', 'cart_remove', 'checkout_attempt', 'order_placed', 'payment_status_changed', 'order_cancelled', 'product_created', 'product_updated', 'inventory_adjusted', etc.
            $table->string('subject_type')->nullable(); // Model class e.g. App\Models\Product, App\Models\Order
            $table->unsignedBigInteger('subject_id')->nullable();
            $table->text('description');
            $table->json('properties')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'created_at']);
            $table->index(['activity_type', 'created_at']);
            $table->index(['subject_type', 'subject_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activity_logs');
    }
};
