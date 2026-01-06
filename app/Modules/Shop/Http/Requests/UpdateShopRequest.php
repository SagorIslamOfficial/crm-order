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
            'code' => ['sometimes', 'string', 'size:3', 'regex:/^[A-Z]{3}$/', 'unique:shops,code,'.$this->route('shop')->id.',id'],
            'name' => ['sometimes', 'string', 'max:100', 'unique:shops,name,'.$this->route('shop')->id.',id'],
            'address' => ['sometimes', 'string', 'max:255'],
            'phone' => ['sometimes', 'string', 'size:11', 'regex:/^01[0-9]{9}$/'],
            'website' => ['nullable', 'string', 'regex:/^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/'],
            'location' => ['nullable', 'string', 'max:255'],
            'details' => ['nullable', 'string'],
            'is_active' => ['boolean'],
        ];
    }
}
