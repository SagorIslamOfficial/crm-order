<?php

namespace App\Modules\Product\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Product\Contracts\ProductSizeRepositoryInterface;
use App\Modules\Product\Contracts\ProductTypeRepositoryInterface;
use App\Modules\Product\Http\Requests\StoreProductSizeRequest;
use App\Modules\Product\Http\Requests\UpdateProductSizeRequest;
use App\Modules\Product\Models\ProductSize;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductSizeController extends Controller
{
    public function __construct(
        protected ProductSizeRepositoryInterface $productSizeRepository,
        protected ProductTypeRepositoryInterface $productTypeRepository
    ) {}

    public function index(): Response|JsonResponse
    {
        $productSizes = $this->productSizeRepository->getPaginated(
            filters: request()->only(['search', 'product_type_id'])
        );

        $productTypes = $this->productTypeRepository->getAllForDropdown();

        if (request()->wantsJson()) {
            return response()->json($productSizes);
        }

        return Inertia::render('modules/product/size/index', [
            'productSizes' => $productSizes,
            'productTypes' => $productTypes,
            'filters' => request()->only(['search', 'product_type_id']),
        ]);
    }

    public function create(): Response
    {
        $productTypes = $this->productTypeRepository->getAllForDropdown();

        return Inertia::render('modules/product/size/create', [
            'productTypes' => $productTypes,
        ]);
    }

    public function store(StoreProductSizeRequest $request): RedirectResponse
    {
        $this->productSizeRepository->create($request->validated());

        return redirect()->route('product-sizes.index')
            ->with('success', 'Product size created successfully.');
    }

    public function show(ProductSize $productSize): Response
    {
        $productSize->load('productType');

        return Inertia::render('modules/product/size/show', [
            'productSize' => $productSize,
        ]);
    }

    public function edit(ProductSize $productSize): Response
    {
        $productTypes = $this->productTypeRepository->getAllForDropdown();

        return Inertia::render('modules/product/size/edit', [
            'productSize' => $productSize,
            'productTypes' => $productTypes,
        ]);
    }

    public function update(UpdateProductSizeRequest $request, ProductSize $productSize): RedirectResponse
    {
        $this->productSizeRepository->update($productSize, $request->validated());

        return redirect()->route('product-sizes.index')
            ->with('success', 'Product size updated successfully.');
    }

    public function destroy(ProductSize $productSize): RedirectResponse
    {
        // Check if product size has associated orders
        if ($productSize->orderItems()->exists()) {
            return redirect()->route('product-sizes.index')
                ->withErrors(['error' => 'Cannot delete product size with associated orders.']);
        }

        $this->productSizeRepository->delete($productSize);

        return redirect()->route('product-sizes.index')
            ->with('success', 'Product size deleted successfully.');
    }

    public function byType(Request $request): JsonResponse
    {
        $request->validate([
            'product_type_id' => 'required|exists:product_types,id',
        ]);

        $sizes = $this->productSizeRepository->getByProductType($request->product_type_id);

        return response()->json($sizes);
    }
}
