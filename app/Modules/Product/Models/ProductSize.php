<?php

namespace App\Modules\Product\Models;

use App\Modules\Order\Models\OrderItem;
use App\Modules\Product\Database\Factories\ProductSizeFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProductSize extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'product_type_id',
        'size_label',
        'is_active',
    ];

    // Casts for attributes
    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    // Relationships with ProductType
    public function productType(): BelongsTo
    {
        return $this->belongsTo(ProductType::class);
    }

    // Relationships with OrderItem
    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    // Factory
    protected static function newFactory()
    {
        return ProductSizeFactory::new();
    }
}
