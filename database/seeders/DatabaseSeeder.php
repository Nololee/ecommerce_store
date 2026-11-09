<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            CategorySeeder::class,
            ProductSeeder::class,
        ]);

        User::updateOrCreate(
            ['email' => 'admin@arenolostore.com'],
            [
                'name' => 'Store Administrator',
                'password' => bcrypt('admin123'),
                'is_admin' => true,
            ]
        );

        User::firstOrCreate(
            ['email' => 'customer@example.com'],
            [
                'name' => 'Sample Customer',
                'password' => bcrypt('password'),
                'is_admin' => false,
            ]
        );
    }
}
