<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class MakeAdminUserCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'admin:promote {email : The email address of the user to promote}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Grant administrator privileges to a specific user account';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        /** @var string $email */
        $email = $this->argument('email');

        $user = User::where('email', $email)->first();

        if (! $user) {
            $this->error("User with email [{$email}] was not found.");

            return self::FAILURE;
        }

        $user->update([
            'is_admin' => true,
            'is_active' => true,
        ]);

        $this->info("User [{$user->name}] ({$user->email}) is now an administrator.");

        return self::SUCCESS;
    }
}
