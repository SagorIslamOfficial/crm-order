<?php

namespace App\Modules\Shop\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Shop\Contracts\ShopServiceInterface;
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
        protected ShopServiceInterface $shopService
    ) {}

    // Display a listing of the shops.
    public function index(): Response|JsonResponse
    {
        $shops = $this->shopService->getPaginatedShops(
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
    public function store(StoreShopRequest $request): RedirectResponse|JsonResponse
    {
        $shop = $this->shopService->createShop($request->validated());

        if (request()->wantsJson()) {
            return response()->json([
                'message' => 'Shop created successfully.',
                'shop' => $this->shopService->transformShopForResponse($shop),
            ]);
        }

        return redirect()->route('shops.index')
            ->with('success', 'Shop created successfully.');
    }

    // Display the specified shop.
    public function show(Shop $shop): Response|JsonResponse
    {
        $shopData = $this->shopService->transformShopForResponse($shop);

        if (request()->wantsJson()) {
            return response()->json($shopData);
        }

        return Inertia::render('modules/shop/show', [
            'shop' => $shopData,
        ]);
    }

    // Show the form for editing the specified shop.
    public function edit(Shop $shop): Response
    {
        return Inertia::render('modules/shop/edit', [
            'shop' => $this->shopService->transformShopForResponse($shop),
        ]);
    }

    // Update the specified shop in storage.
    public function update(UpdateShopRequest $request, Shop $shop): RedirectResponse|JsonResponse
    {
        $this->shopService->updateShop($shop, $request->validated());

        if (request()->wantsJson()) {
            return response()->json([
                'message' => 'Shop updated successfully.',
                'shop' => $this->shopService->transformShopForResponse($shop->fresh()),
            ]);
        }

        return redirect()->route('shops.index')
            ->with('success', 'Shop updated successfully.');
    }

    // Remove the specified shop from storage.
    public function destroy(Shop $shop): RedirectResponse|JsonResponse
    {
        if ($shop->orders()->exists()) {
            $message = 'Cannot delete shop with associated orders.';
            if (request()->wantsJson()) {
                return response()->json(['error' => $message], 422);
            }

            return redirect()->route('shops.index')
                ->withErrors(['error' => $message]);
        }

        $this->shopService->deleteShop($shop);

        if (request()->wantsJson()) {
            return response()->json(['message' => 'Shop deleted successfully.']);
        }

        return redirect()->route('shops.index')
            ->with('success', 'Shop deleted successfully.');
    }
}
