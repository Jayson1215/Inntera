<?php

namespace App\Http\Traits;

/**
 * Shared trait for filtering validated update data.
 *
 * The previous `array_filter` with `$value !== null && $value !== ''`
 * silently dropped valid falsy values like `0`, `false`, and `'0'`.
 * This trait only strips actual null values, preserving intentional
 * zero/empty updates.
 */
trait FiltersFillableData
{
    protected function filterUpdateData(array $validated): array
    {
        return array_filter($validated, fn ($value) => $value !== null);
    }
}
