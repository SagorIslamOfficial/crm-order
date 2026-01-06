<?php

namespace App\Modules\Shop\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Shop\Contracts\ShopRepositoryInterface;
use App\Modules\Shop\Http\Requests\StoreShopRequest;
use App\Modules\Shop\Http\Requests\UpdateShopRequest;
use App\Modules\Shop\Models\Shop;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ShopController extends Controller
{
    // Constructor.
    public function __construct(
        protected ShopRepositoryInterface $shopRepository
    ) {}

    // Display a listing of the shops.
    public function index(): Response|JsonResponse
    {
        $shops = $this->shopRepository->getPaginated(
            filters: request()->only('search')
        );

        if (request()->wantsJson()) {
            return response()->json($shops);
        }

        return Inertia::render('modules/shop/index', [
            'shops' => $shops,
            'filters' => request()->only('search'),
        ]);
    }

    // Show the form for creating a new shop.
    public function create(): Response
    {
        return Inertia::render('modules/shop/create');
    }

    // Store a newly created shop in storage.
    public function store(StoreShopRequest $request): RedirectResponse
    {
        $this->shopRepository->create($request->validated());

        return redirect()->route('shops.index')
            ->with('success', 'Shop created successfully.');
    }

    // Display the specified shop.
    public function show(Shop $shop): Response|JsonResponse
    {
        if (request()->wantsJson()) {
            return response()->json($shop);
        }

        return Inertia::render('modules/shop/show', [
            'shop' => $shop,
        ]);
    }

    // Show the form for editing the specified shop.
    public function edit(Shop $shop): Response
    {
        return Inertia::render('modules/shop/edit', [
            'shop' => $shop,
        ]);
    }

    // Update the specified shop in storage.
    public function update(UpdateShopRequest $request, Shop $shop): RedirectResponse
    {
        $this->shopRepository->update($shop, $request->validated());

        return redirect()->route('shops.index')
            ->with('success', 'Shop updated successfully.');
    }

    // Remove the specified shop from storage.
    public function destroy(Shop $shop): RedirectResponse
    {
        if ($shop->orders()->exists()) {
            return redirect()->route('shops.index')
                ->withErrors(['error' => 'Cannot delete shop with associated orders.']);
        }

        $this->shopRepository->delete($shop);

        return redirect()->route('shops.index')
            ->with('success', 'Shop deleted successfully.');
    }
}
