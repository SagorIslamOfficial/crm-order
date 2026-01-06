<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class StoreUserRequest extends FormRequest
{
    // Determine if the user is authorized to make this request.
    public function authorize(): bool
    {
        return $this->user()->can('users.create');
    }

    // Get the validation rules that apply to the request.
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:50'],
            'email' => ['required', 'string', 'email', 'max:50', 'unique:users,email'],
            'password' => ['required', 'string', Password::defaults()],
            'password_confirmation' => ['required', 'string', 'same:password'],
            'roles' => ['required', 'array', 'min:1'],
            'roles.*' => ['string', 'exists:roles,name'],
        ];
    }

    // Get custom messages for validator errors.
    public function messages(): array
    {
        return [
            'name.required' => 'User name is required.',
            'name.max' => 'User name cannot exceed 50 characters.',
            'email.required' => 'Email address is required.',
            'email.email' => 'Please enter a valid email address.',
            'email.unique' => 'This email address is already registered.',
            'password.required' => 'Password is required.',
            'password.min' => 'Password must be at least 8 characters.',
            'password_confirmation.required' => 'Password confirmation is required.',
            'password_confirmation.same' => 'Password confirmation must match the password.',
            'roles.required' => 'At least one role must be assigned.',
            'roles.*.exists' => 'Selected role does not exist.',
        ];
    }

    // Prepare the data for validation.
    protected function prepareForValidation(): void
    {
        //
    }
}
