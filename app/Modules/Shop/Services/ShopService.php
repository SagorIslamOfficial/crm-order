<?php

namespace App\Modules\Shop\Services;

use App\Contracts\BaseRepositoryInterface;
use App\Modules\Shop\Contracts\ShopRepositoryInterface;
use App\Modules\Shop\Contracts\ShopServiceInterface;
use App\Services\BaseService;

class ShopService extends BaseService implements ShopServiceInterface
{
    // Constructor.
    public function __construct(
        private ShopRepositoryInterface $shopRepository,
    ) {}

    // Get the repository.
    protected function repository(): BaseRepositoryInterface
    {
        return $this->shopRepository;
    }
}
