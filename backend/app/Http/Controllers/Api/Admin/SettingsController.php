<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;

class SettingsController extends Controller
{
    private const INSTITUTE_KEYS = [
        'instituteName' => 'institute_name',
        'instituteWebsite' => 'institute_website',
        'instituteAddress' => 'institute_address',
        'institutePhone' => 'institute_phone',
        'instituteEmail' => 'institute_email',
        'academicYear' => 'academic_year',
        'timezone' => 'timezone',
    ];

    private const NOTIFICATION_KEYS = [
        'emailNotif' => 'notifications.email',
        'smsNotif' => 'notifications.sms',
        'newAdmissionNotif' => 'notifications.new_admission',
        'resultNotif' => 'notifications.result',
    ];

    public function index(): JsonResponse
    {
        return response()->json([
            'institute' => $this->readSettings(self::INSTITUTE_KEYS),
            'notifications' => $this->readSettings(self::NOTIFICATION_KEYS),
        ]);
    }

    public function updateInstitute(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'instituteName' => ['nullable', 'string', 'max:255'],
            'instituteWebsite' => ['nullable', 'string', 'max:255'],
            'instituteAddress' => ['nullable', 'string'],
            'institutePhone' => ['nullable', 'string', 'max:50'],
            'instituteEmail' => ['nullable', 'email', 'max:255'],
            'academicYear' => ['nullable', 'string', 'max:50'],
            'timezone' => ['nullable', 'string', 'max:100'],
        ]);

        foreach (self::INSTITUTE_KEYS as $inputKey => $dbKey) {
            if (array_key_exists($inputKey, $validated)) {
                $this->writeSetting($dbKey, $validated[$inputKey]);
            }
        }

        return response()->json(['message' => 'Institute settings updated', 'institute' => $this->readSettings(self::INSTITUTE_KEYS)]);
    }

    public function updateNotifications(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'emailNotif' => ['nullable', 'boolean'],
            'smsNotif' => ['nullable', 'boolean'],
            'newAdmissionNotif' => ['nullable', 'boolean'],
            'resultNotif' => ['nullable', 'boolean'],
        ]);

        foreach (self::NOTIFICATION_KEYS as $inputKey => $dbKey) {
            if (array_key_exists($inputKey, $validated)) {
                $this->writeSetting($dbKey, $validated[$inputKey] ? '1' : '0');
            }
        }

        return response()->json(['message' => 'Notification settings updated', 'notifications' => $this->readSettings(self::NOTIFICATION_KEYS)]);
    }

    public function backup(): JsonResponse
    {
        $file = 'backup-' . now()->format('Ymd-His') . '.sql';
        $path = storage_path('app/backups/' . $file);

        if (!is_dir(dirname($path))) {
            mkdir(dirname($path), 0755, true);
        }

        $db = config('database.connections.mysql');
        $command = sprintf(
            'mysqldump --user=%s --password=%s --host=%s %s > %s',
            escapeshellarg($db['username']),
            escapeshellarg($db['password'] ?? ''),
            escapeshellarg($db['host']),
            escapeshellarg($db['database']),
            escapeshellarg($path)
        );

        exec($command, $output, $exitCode);

        if ($exitCode !== 0 && !file_exists($path)) {
            return response()->json(['message' => 'Backup could not be created (mysqldump unavailable)', 'file' => null], 500);
        }

        return response()->json(['message' => 'Backup created successfully', 'file' => $file]);
    }

    public function clearCache(): JsonResponse
    {
        Artisan::call('config:clear');
        Artisan::call('route:clear');
        Artisan::call('cache:clear');
        Artisan::call('view:clear');

        return response()->json(['message' => 'Application cache cleared successfully']);
    }

    private function readSettings(array $map): array
    {
        $result = [];
        foreach ($map as $inputKey => $dbKey) {
            $value = Setting::where('key', $dbKey)->value('value');
            if (str_starts_with($dbKey, 'notifications.')) {
                $result[$inputKey] = $value === null ? null : (bool) $value;
            } else {
                $result[$inputKey] = $value;
            }
        }

        return $result;
    }

    private function writeSetting(string $key, mixed $value): void
    {
        Setting::updateOrCreate(['key' => $key], ['value' => is_bool($value) ? ($value ? '1' : '0') : $value]);
    }
}
