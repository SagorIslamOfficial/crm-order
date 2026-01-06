<?php

namespace App\Modules\Order\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateOrderRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'shop_id' => ['sometimes', 'uuid', 'exists:shops,id'],
            'customer.phone' => ['sometimes', 'string', 'size:11', 'regex:/^01[0-9]{9}$/'],
            'customer.name' => ['sometimes', 'string', 'max:255'],
            'customer.address' => ['nullable', 'string'],
            'delivery_date' => ['sometimes', 'date', 'after_or_equal:today'],
            'delivery_address' => ['nullable', 'string'],
            'discount_amount' => ['sometimes', 'numeric', 'min:0'],
            'discount_type' => ['sometimes', 'in:fixed,percentage'],
            'status' => ['sometimes', 'in:pending,delivered,cancelled'],
            'items' => ['sometimes', 'array', 'min:1'],
            'items.*.product_type_id' => ['required', 'uuid', 'exists:product_types,id'],
            'items.*.product_size_id' => ['required', 'uuid', 'exists:product_sizes,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
            'items.*.price' => ['required', 'numeric', 'min:0'],
            'items.*.notes' => ['nullable', 'string'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'customer.phone.size' => 'Phone number must be exactly 11 digits.',
            'customer.phone.regex' => 'Phone number must start with 01 and be 11 digits.',
            'items.min' => 'Order must contain at least one item.',
            'items.*.quantity.min' => 'Quantity must be at least 1.',
            'items.*.price.min' => 'Price cannot be negative.',
        ];
    }
}
