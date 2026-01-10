<?php

namespace App\Services;

use App\Contracts\BaseRepositoryInterface;
use App\Contracts\BaseServiceInterface;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

abstract class BaseService implements BaseServiceInterface
{
    // Get the repository instance.
    abstract protected function repository(): BaseRepositoryInterface;

    // Create a new model.
    public function create(array $data): Model
    {
        return DB::transaction(function () use ($data) {
            return $this->repository()->create($data);
        });
    }

    // Update an existing model.
    public function update(Model $model, array $data): Model
    {
        return DB::transaction(function () use ($model, $data) {
            $this->repository()->update($model, $data);

            return $model->fresh();
        });
    }

    // Delete a model.
    public function delete(Model $model): bool
    {
        return $this->repository()->delete($model);
    }
}
