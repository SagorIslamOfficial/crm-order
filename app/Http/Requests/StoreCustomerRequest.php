<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCustomerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'phone' => ['required', 'string', 'size:11', 'regex:/^01[0-9]{9}$/', 'unique:customers'],
            'name' => ['required', 'string', 'max:255'],
            'address' => ['nullable', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'phone.required' => 'Phone number is required.',
            'phone.size' => 'Phone number must be exactly 11 digits.',
            'phone.regex' => 'Phone number must start with 01 followed by 9 digits.',
            'phone.unique' => 'This phone number is already registered.',
            'name.required' => 'Customer name is required.',
        ];
    }
}
