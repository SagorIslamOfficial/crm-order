<?php

namespace App\Modules\Customer\Repositories;

use App\Modules\Customer\Contracts\CustomerRepositoryInterface;
use App\Modules\Customer\Models\Customer;
use App\Repositories\BaseRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;

class CustomerRepository extends BaseRepository implements CustomerRepositoryInterface
{
    protected function model(): string
    {
        return Customer::class;
    }

    public function all(): Collection
    {
        return Customer::query()
            ->with(['orders'])
            ->latest()
            ->get();
    }

    public function find(string $id): ?Model
    {
        return Customer::query()
            ->with(['orders' => fn ($query) => $query->latest()->limit(10)])
            ->find($id);
    }

    public function getPaginated(?int $perPage = null, array $filters = []): LengthAwarePaginator
    {
        return $this->getPaginatedWithFilters($perPage, $filters);
    }

    public function getPaginatedWithFilters(?int $perPage = null, array $filters = []): LengthAwarePaginator
    {
        $perPage = $this->getPerPage($perPage);

        $query = Customer::query();

        if (! empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        if (! empty($filters['date_from'])) {
            $query->where('created_at', '>=', $filters['date_from']);
        }

        if (! empty($filters['date_to'])) {
            $query->where('created_at', '<=', $filters['date_to']);
        }

        return $query->withCount('orders')->orderBy('created_at', 'desc')->paginate($perPage);
    }

    public function getAllForDropdown(): array
    {
        return Customer::query()
            ->orderBy('name', 'asc')
            ->get(['id', 'name', 'phone'])
            ->map(fn ($customer) => [
                'id' => $customer->id,
                'name' => $customer->name,
                'phone' => $customer->phone,
            ])
            ->toArray();
    }

    public function findByPhone(string $phone): ?Customer
    {
        return Customer::query()
            ->where('phone', $phone)
            ->first();
    }

    public function create(array $data): Model
    {
        return Customer::create($data);
    }

    public function update(Model $model, array $data): Model
    {
        $model->update($data);

        return $model->fresh();
    }

    public function delete(Model $model): bool
    {
        return $model->delete();
    }

    public function firstOrCreate(array $attributes, array $values = []): Customer
    {
        return Customer::firstOrCreate($attributes, $values);
    }
}
