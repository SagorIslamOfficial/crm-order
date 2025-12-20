<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreShopRequest;
use App\Http\Requests\UpdateShopRequest;
use App\Models\Shop;
use App\Repositories\ShopRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ShopController extends Controller
{
    public function __construct(
        private readonly ShopRepository $shopRepository,
    ) {}

    public function index(Request $request)
    {
        $search = $request->query('search');
        $isActive = $request->query('is_active');

        $query = Shop::withCount('orders')
            ->orderBy('name');

        // Filter by search if provided
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%")
                    ->orWhere('address', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        // Filter by active status if provided
        if ($isActive !== null) {
            $query->where('is_active', $isActive === '1');
        }

        $shops = $query->paginate(15)->through(function ($shop) {
            return [
                'id' => $shop->id,
                'code' => $shop->code,
                'name' => $shop->name,
                'address' => $shop->address,
                'phone' => $shop->phone,
                'website' => $shop->website,
                'is_active' => $shop->is_active,
                'orders_count' => $shop->orders_count,
                'next_order_sequence' => $shop->next_order_sequence,
            ];
        });

        return Inertia::render('shops/index', [
            'shops' => $shops,
            'search' => $search,
            'isActive' => $isActive,
        ]);
    }

    public function create()
    {
        return Inertia::render('shops/create');
    }

    public function store(StoreShopRequest $request)
    {
        $this->shopRepository->create($request->validated());

        return redirect()->route('shops.index')
            ->with('message', 'Shop created successfully.');
    }

    public function show(Shop $shop)
    {
        return Inertia::render('shops/show', [
            'shop' => [
                'id' => $shop->id,
                'code' => $shop->code,
                'name' => $shop->name,
                'address' => $shop->address,
                'phone' => $shop->phone,
                'website' => $shop->website,
                'is_active' => $shop->is_active,
                'next_order_sequence' => $shop->next_order_sequence,
                'created_at' => $shop->created_at->format('Y-m-d'),
                'orders_count' => $shop->orders()->count(),
            ],
        ]);
    }

    public function edit(Shop $shop)
    {
        return Inertia::render('shops/edit', [
            'shop' => [
                'id' => $shop->id,
                'code' => $shop->code,
                'name' => $shop->name,
                'address' => $shop->address,
                'phone' => $shop->phone,
                'website' => $shop->website,
                'is_active' => $shop->is_active,
            ],
        ]);
    }

    public function update(Shop $shop, UpdateShopRequest $request)
    {
        $this->shopRepository->update($shop, $request->validated());

        return redirect()->route('shops.index')
            ->with('message', 'Shop updated successfully.');
    }

    public function destroy(Shop $shop)
    {
        // Check if shop has associated orders
        if ($shop->orders()->exists()) {
            return redirect()->route('shops.index')
                ->withErrors(['error' => 'Cannot delete shop with associated orders.']);
        }

        $this->shopRepository->delete($shop);

        return redirect()->route('shops.index')
            ->with('message', 'Shop deleted successfully.');
    }
}
