<?php

namespace App\Repositories;

use App\Models\Customer;
use Illuminate\Database\Eloquent\Collection;

class CustomerRepository
{
    public function all(): Collection
    {
        return Customer::query()->get();
    }

    public function findById(string $id): ?Customer
    {
        return Customer::find($id);
    }

    public function findByPhone(string $phone): ?Customer
    {
        return Customer::query()
            ->where('phone', $phone)
            ->first();
    }

    public function create(array $data): Customer
    {
        return Customer::create($data);
    }

    public function update(string $id, array $data): bool
    {
        $customer = $this->findById($id);

        return $customer?->update($data) ?? false;
    }

    public function delete(string $id): bool
    {
        $customer = $this->findById($id);

        return $customer?->delete() ?? false;
    }

    public function firstOrCreate(array $attributes, array $values = []): Customer
    {
        return Customer::firstOrCreate($attributes, $values);
    }

    public function paginate(int $perPage = 15, ?string $search = null)
    {
        $query = Customer::query();

        if ($search) {
            $query->where('phone', 'like', "%$search%")
                ->orWhere('name', 'like', "%$search%");
        }

        return $query->orderBy('created_at', 'desc')->paginate($perPage);
    }
}
