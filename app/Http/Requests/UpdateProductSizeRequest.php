<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProductSizeRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('product-sizes.update');
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'product_type_id' => ['required', 'uuid', 'exists:product_types,id'],
            'size_label' => [
                'required',
                'string',
                'max:20',
                Rule::unique('product_sizes')->where(function ($query) {
                    return $query->where('product_type_id', $this->product_type_id);
                })->ignore($this->route('productSize')->id),
            ],
            'is_active' => ['boolean'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'product_type_id.required' => 'Product type is required.',
            'product_type_id.exists' => 'Selected product type does not exist.',
            'size_label.required' => 'Size label is required.',
            'size_label.max' => 'Size label cannot exceed 20 characters.',
            'size_label.unique' => 'This size label already exists for the selected product type.',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'is_active' => $this->boolean('is_active', true),
        ]);
    }
}
