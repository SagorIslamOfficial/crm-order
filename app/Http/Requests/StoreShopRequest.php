<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreShopRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('shops.create');
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'code' => ['required', 'string', 'max:10', 'unique:shops,code'],
            'name' => ['required', 'string', 'max:255'],
            'address' => ['required', 'string'],
            'phone' => ['required', 'string', 'size:11', 'regex:/^01[0-9]{9}$/'],
            'website' => ['nullable', 'string', 'max:255'],
            'is_active' => ['boolean'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'code.required' => 'Shop code is required.',
            'code.max' => 'Shop code cannot exceed 10 characters.',
            'code.unique' => 'This shop code already exists.',
            'name.required' => 'Shop name is required.',
            'name.max' => 'Shop name cannot exceed 255 characters.',
            'address.required' => 'Shop address is required.',
            'phone.required' => 'Phone number is required.',
            'phone.size' => 'Phone number must be exactly 11 digits.',
            'phone.regex' => 'Phone number must be a valid Bangladeshi mobile number (e.g., 01711234567).',
            'website.max' => 'Website cannot exceed 255 characters.',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'is_active' => $this->boolean('is_active', true),
            'next_order_sequence' => 1,
        ]);
    }
}
