<?php

use App\Models\User;

test('client can log in and is redirected smoothly to intended store page', function () {
    $client = User::factory()->create([
        'is_admin' => false,
        'is_active' => true,
        'password' => 'password123',
    ]);

    // Client visits checkout while unauthenticated
    $this->get('/checkout')->assertRedirect('/login');

    // Client authenticates
    $response = $this->post('/login', [
        'email' => $client->email,
        'password' => 'password123',
    ]);

    $this->assertAuthenticatedAs($client);
    // Should smoothly redirect back to the intended page (/checkout)
    $response->assertRedirect('/checkout');
});

test('client logging in without prior intended URL is redirected to the shop catalogue', function () {
    $client = User::factory()->create([
        'is_admin' => false,
        'is_active' => true,
        'password' => 'password123',
    ]);

    $response = $this->post('/login', [
        'email' => $client->email,
        'password' => 'password123',
    ]);

    $this->assertAuthenticatedAs($client);
    $response->assertRedirect('/shop');
});

test('admin logging in is redirected to the admin dashboard', function () {
    $admin = User::factory()->admin()->create([
        'password' => 'adminpassword',
    ]);

    $response = $this->post('/login', [
        'email' => $admin->email,
        'password' => 'adminpassword',
    ]);

    $this->assertAuthenticatedAs($admin);
    $response->assertRedirect('/admin');
});
