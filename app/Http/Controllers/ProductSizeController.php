<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProductSizeRequest;
use App\Http\Requests\UpdateProductSizeRequest;
use App\Models\ProductSize;
use App\Models\ProductType;
use App\Repositories\ProductSizeRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductSizeController extends Controller
{
    public function __construct(
        private readonly ProductSizeRepository $productSizeRepository,
    ) {}

    public function index(Request $request)
    {
        $search = $request->query('search');
        $productTypeId = $request->query('product_type_id');

        $query = ProductSize::with('productType')
            ->withCount('orderItems')
            ->orderBy('size_label');

        // Filter by search if provided
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('size_label', 'like', "%{$search}%")
                    ->orWhereHas('productType', function ($productTypeQuery) use ($search) {
                        $productTypeQuery->where('name', 'like', "%{$search}%");
                    });
            });
        }

        // Filter by product type if provided
        if ($productTypeId) {
            $query->where('product_type_id', $productTypeId);
        }

        $productSizes = $query->paginate(15)->through(function ($productSize) {
            return [
                'id' => $productSize->id,
                'size_label' => $productSize->size_label,
                'is_active' => $productSize->is_active,
                'product_type' => [
                    'id' => $productSize->productType->id,
                    'name' => $productSize->productType->name,
                ],
                'orders_count' => $productSize->order_items_count,
            ];
        });

        return Inertia::render('product-sizes/index', [
            'productSizes' => $productSizes,
            'productTypes' => ProductType::select('id', 'name')->get(),
            'search' => $search,
            'productTypeId' => $productTypeId,
        ]);
    }

    public function create()
    {
        return Inertia::render('product-sizes/create', [
            'productTypes' => ProductType::select('id', 'name')->get(),
        ]);
    }

    public function store(StoreProductSizeRequest $request)
    {
        $this->productSizeRepository->create($request->validated());

        return redirect()->route('product-sizes.index')
            ->with('message', 'Product size created successfully.');
    }

    public function show(ProductSize $productSize)
    {
        $productSize->load('productType');

        return Inertia::render('product-sizes/show', [
            'productSize' => [
                'id' => $productSize->id,
                'size_label' => $productSize->size_label,
                'is_active' => $productSize->is_active,
                'product_type' => [
                    'id' => $productSize->productType->id,
                    'name' => $productSize->productType->name,
                ],
                'created_at' => $productSize->created_at->format('Y-m-d'),
                'orders_count' => $productSize->orderItems()->distinct('order_id')->count(),
            ],
        ]);
    }

    public function edit(ProductSize $productSize)
    {
        return Inertia::render('product-sizes/edit', [
            'productSize' => [
                'id' => $productSize->id,
                'size_label' => $productSize->size_label,
                'is_active' => $productSize->is_active,
                'product_type_id' => $productSize->product_type_id,
            ],
            'productTypes' => ProductType::select('id', 'name')->get(),
        ]);
    }

    public function update(ProductSize $productSize, UpdateProductSizeRequest $request)
    {
        $this->productSizeRepository->update($productSize, $request->validated());

        return redirect()->route('product-sizes.index')
            ->with('message', 'Product size updated successfully.');
    }

    public function destroy(ProductSize $productSize)
    {
        // Check if product size has associated orders
        if ($productSize->orderItems()->exists()) {
            return redirect()->route('product-sizes.index')
                ->withErrors(['error' => 'Cannot delete product size with associated orders.']);
        }

        $this->productSizeRepository->delete($productSize);

        return redirect()->route('product-sizes.index')
            ->with('message', 'Product size deleted successfully.');
    }
}
