<?php

namespace App\Modules\Customer\Contracts;

use App\Contracts\BaseRepositoryInterface;
use App\Modules\Customer\Models\Customer;
use Illuminate\Pagination\LengthAwarePaginator;

interface CustomerRepositoryInterface extends BaseRepositoryInterface
{
    public function findByPhone(string $phone): ?Customer;

    public function getAllForDropdown(): array;

    public function getPaginatedWithFilters(?int $perPage = null, array $filters = []): LengthAwarePaginator;

    public function firstOrCreate(array $attributes, array $values = []): Customer;
}
