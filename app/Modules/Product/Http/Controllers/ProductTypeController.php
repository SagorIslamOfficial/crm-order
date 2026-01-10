<?php

namespace App\Modules\Product\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Product\Contracts\ProductServiceInterface;
use App\Modules\Product\Contracts\ProductTypeRepositoryInterface;
use App\Modules\Product\Http\Requests\StoreProductTypeRequest;
use App\Modules\Product\Http\Requests\UpdateProductTypeRequest;
use App\Modules\Product\Models\ProductType;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ProductTypeController extends Controller
{
    public function __construct(
        protected ProductTypeRepositoryInterface $productTypeRepository,
        protected ProductServiceInterface $productService
    ) {}

    public function index(): Response|JsonResponse
    {
        $filters = request()->only(['search', 'is_active', 'date_from', 'date_to']);
        $productTypes = $this->productTypeRepository->getPaginatedWithFilters(null, $filters);

        if (request()->wantsJson()) {
            return response()->json([
                'data' => $productTypes->getCollection()->map(function ($productType) {
                    return $this->productService->transformProductTypeForResponse($productType);
                }),
                'current_page' => $productTypes->currentPage(),
                'last_page' => $productTypes->lastPage(),
                'per_page' => $productTypes->perPage(),
                'total' => $productTypes->total(),
            ]);
        }

        return Inertia::render('modules/product/type/index', [
            'productTypes' => $productTypes,
            'filters' => $filters,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('modules/product/type/create');
    }

    public function store(StoreProductTypeRequest $request): RedirectResponse
    {
        $this->productTypeRepository->create($request->validated());

        return redirect()->route('product-types.index')
            ->with('success', 'Product type created successfully.');
    }

    public function show(ProductType $productType): Response
    {
        $productType->loadCount('sizes');

        // Calculate orders_count
        $productType->orders_count = $productType->sizes()
            ->with(['orderItems' => function ($query) {
                $query->select('product_size_id', 'order_id');
            }])
            ->get()
            ->pluck('orderItems')
            ->flatten()
            ->pluck('order_id')
            ->unique()
            ->count();

        // Get paginated sizes
        $sizes = $productType->sizes()->orderBy('created_at', 'desc')->paginate(10)->withQueryString();

        return Inertia::render('modules/product/type/show', [
            'productType' => $productType,
            'sizes' => $sizes,
        ]);
    }

    public function edit(ProductType $productType): Response
    {
        return Inertia::render('modules/product/type/edit', [
            'productType' => $productType,
        ]);
    }

    public function update(UpdateProductTypeRequest $request, ProductType $productType): RedirectResponse
    {
        $this->productTypeRepository->update($productType, $request->validated());

        return redirect()->route('product-types.index')
            ->with('success', 'Product type updated successfully.');
    }

    public function destroy(ProductType $productType): RedirectResponse
    {
        if ($productType->orderItems()->exists()) {
            return redirect()->route('product-types.index')
                ->withErrors(['error' => 'Cannot delete product type with associated orders.']);
        }

        $this->productTypeRepository->delete($productType);

        return redirect()->route('product-types.index')
            ->with('success', 'Product type deleted successfully.');
    }
}
