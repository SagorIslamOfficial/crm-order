<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePermissionRequest extends FormRequest
{
    // Determine if the user is authorized to make this request.
    public function authorize(): bool
    {
        return $this->user()->can('permissions.create');
    }

    // Get the validation rules that apply to the request.
    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'max:50',
                'regex:/^[a-zA-Z0-9_\-\.]+$/',
                Rule::unique('permissions', 'name'),
            ],
            'guard_name' => 'sometimes|string|max:50',
        ];
    }

    // Get custom messages for validator errors.
    public function messages(): array
    {
        return [
            'name.required' => 'Permission name is required.',
            'name.unique' => 'A permission with this name already exists.',
            'name.regex' => 'Permission name can only contain letters, numbers, dots, hyphens, and underscores.',
        ];
    }
}
