<?php

namespace App\Support;

use App\Models\Student;

class StudentNumbering
{
    public static function sessionShort(string $batch): string
    {
        if (preg_match('/^(\d{4})-(\d{4})/', $batch, $m)) {
            return substr($m[1], 2) . '-' . substr($m[2], 2);
        }

        if (preg_match('/^(\d{4})-(\d{2})/', $batch, $m)) {
            return substr($m[1], 2) . '-' . $m[2];
        }

        if (preg_match('/^(\d{2})-(\d{2})/', $batch, $m)) {
            return $m[1] . '-' . $m[2];
        }

        $year = (int) now()->format('y');

        return str_pad((string) ($year), 2, '0', STR_PAD_LEFT) . '-' . str_pad((string) ($year + 1), 2, '0', STR_PAD_LEFT);
    }

    public static function nextRegistrationNumber(string $batch): string
    {
        $prefix = 'REG-' . self::sessionShort($batch) . '-';

        $maxSeq = Student::query()
            ->where('registration_number', 'like', $prefix . '%')
            ->get()
            ->map(fn (Student $s) => (int) substr($s->registration_number, strlen($prefix)))
            ->max() ?? 0;

        return $prefix . str_pad((string) ($maxSeq + 1), 3, '0', STR_PAD_LEFT);
    }

    public static function nextEnrollmentNumber(string $batch): string
    {
        $prefix = 'ENR' . str_replace('-', '', self::sessionShort($batch)) . '-';

        $maxSeq = Student::query()
            ->where('enrollment_number', 'like', $prefix . '%')
            ->get()
            ->map(fn (Student $s) => (int) substr($s->enrollment_number, strlen($prefix)))
            ->max() ?? 0;

        return $prefix . str_pad((string) ($maxSeq + 1), 3, '0', STR_PAD_LEFT);
    }

    public static function nextRollNumber(string $code): string
    {
        $seq = (int) Student::query()->max('id') + 1;

        return strtoupper($code) . str_pad((string) $seq, 3, '0', STR_PAD_LEFT);
    }
}