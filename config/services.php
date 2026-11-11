<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Resend, Postmark, AWS, and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'payfast' => [
        'merchant_id' => env('PAYFAST_MERCHANT_ID', '10000100'), // Default PayFast sandbox test merchant ID
        'merchant_key' => env('PAYFAST_MERCHANT_KEY', '46f0cd694581a'), // Default PayFast sandbox test merchant key
        'passphrase' => env('PAYFAST_PASSPHRASE', null),
        'sandbox' => env('PAYFAST_SANDBOX', true),
        'url' => env('PAYFAST_SANDBOX', true)
            ? 'https://sandbox.payfast.co.za/eng/process'
            : 'https://www.payfast.co.za/eng/process',
        'validate_url' => env('PAYFAST_SANDBOX', true)
            ? 'https://sandbox.payfast.co.za/eng/query/validate'
            : 'https://www.payfast.co.za/eng/query/validate',
    ],

];
