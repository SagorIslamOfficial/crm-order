<?php

namespace App\Contracts;

use Illuminate\Database\Eloquent\Model;

/**
 * @template TModel of Model
 */
interface BaseServiceInterface
{
    // Create a new model.
    public function create(array $data): Model;

    // Update an existing model.
    public function update(Model $model, array $data): Model;

    // Delete a model.
    public function delete(Model $model): bool;
}
