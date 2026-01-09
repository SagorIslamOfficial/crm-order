<?php

namespace App\Modules\Product\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductSizeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    // Validation rules
    public function rules(): array
    {
        return [
            'product_type_id' => ['required', 'exists:product_types,id'],
            'size_label' => ['required', 'string', 'max:255', 'unique:product_sizes,size_label,NULL,id,product_type_id,'.$this->product_type_id],
            'is_active' => ['boolean'],
        ];
    }
}
