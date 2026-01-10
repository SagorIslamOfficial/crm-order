<?php

namespace App\Modules\Shop\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreShopRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    // Define validation rules for storing a new shop.
    public function rules(): array
    {
        return [
            'code' => ['required', 'string', 'min:3', 'max:30', 'unique:shops,code', 'regex:/^[A-Z0-9]+$/'],
            'name' => ['required', 'string', 'max:100', 'unique:shops,name'],
            'address' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'size:11', 'regex:/^01[0-9]{9}$/'],
            'website' => ['nullable', 'string', 'regex:/^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/'],
            'details' => ['nullable', 'string'],
            'is_active' => ['boolean'],
            'next_order_sequence' => ['required', 'integer', 'min:1'],
        ];
    }
}
