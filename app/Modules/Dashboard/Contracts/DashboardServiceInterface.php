<?php

namespace App\Modules\Dashboard\Contracts;

interface DashboardServiceInterface
{
    /**
     * Get dashboard statistics.
     *
     * @return array<string, mixed>
     */
    public function getStatistics(): array;
}
