<?php

$allowedOrigins = array_filter(array_map('trim', explode(',', (string) env('FRONTEND_URL', ''))));

$allowedOrigins = array_merge($allowedOrigins, [
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost',
    'https://ztcaedu.com',
    'https://www.ztcaedu.com',
    'http://ztcaedu.com',
    'http://www.ztcaedu.com',
]);

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => array_values(array_unique(array_filter($allowedOrigins))),
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];
