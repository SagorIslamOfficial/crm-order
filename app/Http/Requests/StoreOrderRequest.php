<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrderRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Ensure payment is always validated as it's required
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'shop_id' => ['required', 'uuid', 'exists:shops,id'],
            'customer.phone' => ['required', 'string', 'size:11', 'regex:/^01[0-9]{9}$/'],
            'customer.name' => ['required', 'string', 'max:255'],
            'customer.address' => ['nullable', 'string'],
            'delivery_date' => ['required', 'date', 'after_or_equal:today'],
            'delivery_address' => ['nullable', 'string'],
            'discount_amount' => ['nullable', 'numeric', 'min:0'],
            'discount_type' => ['nullable', 'in:fixed,percentage'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_type_id' => ['required', 'uuid', 'exists:product_types,id'],
            'items.*.product_size_id' => ['required', 'uuid', 'exists:product_sizes,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
            'items.*.price' => ['required', 'numeric', 'min:0'],
            'items.*.notes' => ['nullable', 'string'],
            'payment' => ['required', 'array'],
            'payment.method' => ['required', 'in:cash,bkash,nagad,bank'],
            'payment.amount' => ['required', 'numeric', 'min:0'],
            'payment.transaction_id' => ['nullable', 'string', 'max:100'],
            'payment.bank_name' => ['nullable', 'string', 'max:100'],
            'payment.account_number' => ['nullable', 'string', 'max:50'],
            'payment.mfs_provider' => ['nullable', 'string'],
            'payment.mfs_number' => ['nullable', 'string', 'size:11', 'regex:/^01[0-9]{9}$/'],
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
            'customer.phone.required' => 'Customer phone number is required.',
            'customer.phone.size' => 'Phone number must be exactly 11 digits.',
            'customer.phone.regex' => 'Phone number must start with 01 and be 11 digits.',
            'customer.name.required' => 'Customer name is required.',
            'items.required' => 'At least one product item is required.',
            'items.min' => 'Order must contain at least one item.',
            'items.*.quantity.min' => 'Quantity must be at least 1.',
            'items.*.price.min' => 'Price cannot be negative.',
            'delivery_date.after_or_equal' => 'Delivery date cannot be in the past.',
            'payment.required' => 'Payment method is required.',
            'payment.method.required' => 'Payment method must be selected.',
            'payment.amount.required' => 'Advance payment amount is required.',
            'payment.bank_name.required_if' => 'Bank name is required for bank transfer.',
            'payment.account_number.required_if' => 'Account number is required for bank transfer.',
            'payment.mfs_provider.required_in' => 'MFS provider must be selected.',
            'payment.mfs_number.required_in' => 'MFS phone number is required.',
            'payment.mfs_number.size' => 'MFS phone number must be exactly 11 digits.',
            'payment.mfs_number.regex' => 'MFS phone number must start with 01 and be 11 digits.',
        ];
    }
}
