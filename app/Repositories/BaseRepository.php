<?php

namespace App\Repositories;

use App\Contracts\BaseRepositoryInterface;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;

abstract class BaseRepository implements BaseRepositoryInterface
{
    // Default items per page for pagination.
    const DEFAULT_PER_PAGE = 10;

    // Get the model class name.
    abstract protected function model(): string;

    // Get a new query builder instance.
    protected function query(): Builder
    {
        return $this->model()::query();
    }

    // Get the default per page value, can be overridden by parameter.
    protected function getPerPage(?int $perPage = null): int
    {
        return $perPage ?? self::DEFAULT_PER_PAGE;
    }

    public function all(): Collection
    {
        return $this->query()->get();
    }

    // Get paginated records with filters.
    public function getPaginated(?int $perPage = null, array $filters = []): LengthAwarePaginator
    {
        $perPage = $this->getPerPage($perPage);

        $query = $this->query();

        // Basic search filter - can be overridden in child classes for specific logic
        if (! empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                // Get fillable attributes for basic search
                $model = $this->model()::make();
                $searchableFields = $model->getFillable();

                foreach ($searchableFields as $field) {
                    $q->orWhere($field, 'like', "%{$search}%");
                }
            });
        }

        return $query->paginate($perPage);
    }

    // Find a record by ID.
    public function find(string $id): ?Model
    {
        return $this->query()->find($id);
    }

    // Find a record by ID or fail.
    public function findOrFail(string $id): Model
    {
        return $this->query()->findOrFail($id);
    }

    // Create a new record.
    public function create(array $data): Model
    {
        return $this->model()::create($data);
    }

    // Update a record.
    public function update(Model $model, array $data): Model
    {
        $model->update($data);

        return $model->fresh();
    }

    // Delete a record.
    public function delete(Model $model): bool
    {
        return $model->delete();
    }
}
