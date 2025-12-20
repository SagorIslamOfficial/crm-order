<?php

namespace App\Models;

use App\DiscountType;
use App\OrderStatus;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    /** @use HasFactory<\Database\Factories\OrderFactory> */
    use HasFactory, HasUuids;

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'order_number',
        'shop_id',
        'customer_id',
        'delivery_date',
        'delivery_address',
        'total_amount',
        'advance_paid',
        'discount_amount',
        'discount_type',
        'due_amount',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'delivery_date' => 'datetime:Y-m-d',
            'total_amount' => 'decimal:2',
            'advance_paid' => 'decimal:2',
            'discount_amount' => 'decimal:2',
            'due_amount' => 'decimal:2',
            'discount_type' => DiscountType::class,
            'status' => OrderStatus::class,
        ];
    }

    public function shop(): BelongsTo
    {
        return $this->belongsTo(Shop::class);
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }
}
