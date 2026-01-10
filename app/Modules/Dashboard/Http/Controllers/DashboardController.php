<?php

namespace App\Modules\Dashboard\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Dashboard\Contracts\DashboardServiceInterface;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(
        private DashboardServiceInterface $dashboardService,
    ) {}

    /**
     * Display the dashboard.
     */
    public function index(): Response
    {
        return Inertia::render('modules/dashboard/dashboard', [
            'statistics' => $this->dashboardService->getStatistics(),

        ]);
    }
}
