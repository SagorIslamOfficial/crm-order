<?php

namespace Tests\Traits;

use App\Models\User;

trait MakesAuthenticatedRequests
{
    /**
     * Helper function to make authenticated requests with CSRF token
     */
    protected function makeRequest(string $method, string $uri, array $data = [], ?User $user = null)
    {
        if ($user) {
            // Get CSRF token from a page visit
            $this->actingAs($user)->get('/users');
            $csrfToken = session()->token();

            return $this->actingAs($user)
                ->withHeaders([
                    'X-CSRF-TOKEN' => $csrfToken,
                    'X-Inertia' => 'true',
                    'X-Requested-With' => 'XMLHttpRequest',
                ])
                ->{$method}($uri, array_merge($data, ['_token' => $csrfToken]));
        }

        return $this->{$method}($uri, $data);
    }
}
