<?php

namespace App\Modules\Shop\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateShopRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    // Define validation rules for updating a shop.
    public function rules(): array
    {
        return [
            'code' => ['sometimes', 'string', 'min:3', 'max:30', 'regex:/^[A-Z0-9]+$/', 'unique:shops,code,'.$this->route('shop')->id.',id'],
            'name' => ['sometimes', 'string', 'max:100', 'unique:shops,name,'.$this->route('shop')->id.',id'],
            'address' => ['sometimes', 'string', 'max:255'],
            'phone' => ['sometimes', 'string', 'size:11', 'regex:/^01[0-9]{9}$/'],
            'website' => ['nullable', 'string', 'regex:/^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/'],
            'details' => ['nullable', 'string'],
            'is_active' => ['boolean'],
            'next_order_sequence' => ['sometimes', 'integer', 'min:1'],
        ];
    }
}
