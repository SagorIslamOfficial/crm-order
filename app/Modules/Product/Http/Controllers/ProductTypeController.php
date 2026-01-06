<?php

namespace App\Modules\Product\Http\Controllers;

use App\Http\Controllers\Controller;
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
        protected ProductTypeRepositoryInterface $productTypeRepository
    ) {}

    public function index(): Response|JsonResponse
    {
        $productTypes = $this->productTypeRepository->all();

        if (request()->wantsJson()) {
            return response()->json($productTypes);
        }

        return Inertia::render('modules/product/type/index', [
            'productTypes' => $productTypes,
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
        $productType->load('sizes');

        return Inertia::render('modules/product/type/show', [
            'productType' => $productType,
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
