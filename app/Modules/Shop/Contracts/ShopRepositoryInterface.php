<?php

namespace App\Modules\Shop\Contracts;

use App\Contracts\BaseRepositoryInterface;
use App\Modules\Shop\Models\Shop;

interface ShopRepositoryInterface extends BaseRepositoryInterface
{
    // Get all shops for dropdown selection.
    public function getAllForDropdown(): array;

    // Lock a shop for order number generation.
    public function lockForOrderNumber(string $shopId): Shop;

    // Increment the shop's next order sequence.
    public function incrementOrderSequence(Shop $shop): void;
}
