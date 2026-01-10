<?php

namespace App\Modules\Product\Models;

use App\Modules\Order\Models\OrderItem;
use App\Modules\Product\Database\Factories\ProductTypeFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProductType extends Model
{
    use HasFactory, HasUuids;

    protected static function newFactory()
    {
        return ProductTypeFactory::new();
    }

    protected $fillable = [
        'name',
        'description',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    /**
     * @return HasMany<ProductSize, $this>
     */
    public function sizes(): HasMany
    {
        return $this->hasMany(ProductSize::class);
    }

    /**
     * @return HasMany<OrderItem, $this>
     */
    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * Get the count of unique orders containing this product type.
     */
    public function getOrdersCountAttribute(): int
    {
        return $this->sizes()
            ->with('orderItems')
            ->get()
            ->pluck('orderItems.*.order_id')
            ->flatten()
            ->unique()
            ->count();
    }
}
