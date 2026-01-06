<?php

namespace App\Modules\Shop\Models;

use App\Modules\Order\Models\Order;
use App\Modules\Shop\Database\Factories\ShopFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Shop extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'code',
        'name',
        'address',
        'phone',
        'website',
        'location',
        'details',
        'is_active',
        'next_order_sequence',
    ];

    // Cast attributes to specific types.
    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'next_order_sequence' => 'integer',
        ];
    }

    // Get the orders for the shop.
    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    // Get the factory for the model.
    protected static function newFactory(): ShopFactory
    {
        return ShopFactory::new();
    }
}
