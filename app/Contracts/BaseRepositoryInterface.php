<?php

namespace App\Contracts;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;

interface BaseRepositoryInterface
{
    // Get all records.
    public function all(): Collection;

    // Get paginated records with filters.
    public function getPaginated(?int $perPage = null, array $filters = []): LengthAwarePaginator;

    // Find a record by ID.
    public function find(string $id): ?Model;

    // Find a record by ID or fail.
    public function findOrFail(string $id): Model;

    // Create a new record.
    public function create(array $data): Model;

    // Update a record.
    public function update(Model $model, array $data): Model;

    // Delete a record.
    public function delete(Model $model): bool;
}
