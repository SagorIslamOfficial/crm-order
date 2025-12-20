<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProductTypeRequest;
use App\Http\Requests\UpdateProductTypeRequest;
use App\Models\ProductType;
use App\Repositories\ProductTypeRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductTypeController extends Controller
{
    public function __construct(
        private readonly ProductTypeRepository $productTypeRepository,
    ) {}

    public function index(Request $request)
    {
        $search = $request->query('search');
        $productTypes = $this->productTypeRepository->allWithSizes();

        // Filter by search if provided
        if ($search) {
            $productTypes = $productTypes->filter(function ($productType) use ($search) {
                return str_contains(strtolower($productType->name), strtolower($search));
            });
        }

        return Inertia::render('product-types/index', [
            'productTypes' => $productTypes->map(function ($productType) {
                return [
                    'id' => $productType->id,
                    'name' => $productType->name,
                    'is_active' => $productType->is_active,
                    'sizes' => $productType->sizes,
                    'sizes_count' => $productType->sizes->count(),
                    'orders_count' => $productType->order_items_count,
                ];
            })->values(),
            'search' => $search,
        ]);
    }

    public function create()
    {
        return Inertia::render('product-types/create');
    }

    public function store(StoreProductTypeRequest $request)
    {
        $this->productTypeRepository->create($request->validated());

        return redirect()->route('product-types.index')
            ->with('message', 'Product type created successfully.');
    }

    public function show(ProductType $productType)
    {
        $productType->load(['sizes' => function ($query) {
            $query->where('is_active', true)
                ->orderBy('size_label');
        }]);

        return Inertia::render('product-types/show', [
            'productType' => [
                'id' => $productType->id,
                'name' => $productType->name,
                'is_active' => $productType->is_active,
                'created_at' => $productType->created_at->format('Y-m-d'),
                'sizes' => $productType->sizes->map(function ($size) {
                    return [
                        'id' => $size->id,
                        'size_label' => $size->size_label,
                        'is_active' => $size->is_active,
                    ];
                }),
                'sizes_count' => $productType->sizes->count(),
                'orders_count' => $productType->orderItems()->distinct('order_id')->count(),
            ],
        ]);
    }

    public function edit(ProductType $productType)
    {
        return Inertia::render('product-types/edit', [
            'productType' => [
                'id' => $productType->id,
                'name' => $productType->name,
                'is_active' => $productType->is_active,
            ],
        ]);
    }

    public function update(ProductType $productType, UpdateProductTypeRequest $request)
    {
        $this->productTypeRepository->update($productType, $request->validated());

        return redirect()->route('product-types.index')
            ->with('message', 'Product type updated successfully.');
    }

    public function destroy(ProductType $productType)
    {
        // Check if product type has associated orders
        if ($productType->orderItems()->exists()) {
            return redirect()->route('product-types.index')
                ->withErrors(['error' => 'Cannot delete product type with associated orders.']);
        }

        $this->productTypeRepository->delete($productType);

        return redirect()->route('product-types.index')
            ->with('message', 'Product type deleted successfully.');
    }
}
