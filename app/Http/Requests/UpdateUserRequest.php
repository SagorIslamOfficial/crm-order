<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class UpdateUserRequest extends FormRequest
{
    // Determine if the user is authorized to make this request.
    public function authorize(): bool
    {
        return $this->user()->can('users.update');
    }

    // Get the validation rules that apply to the request.
    public function rules(): array
    {
        $userId = $this->route('user')->id;

        return [
            'name' => ['required', 'string', 'max:100'],
            'email' => ['required', 'string', 'email', 'max:50', 'unique:users,email,'.$userId],
            'password' => ['nullable', 'string', Password::defaults()],
            'password_confirmation' => ['nullable', 'string', 'same:password', 'required_with:password'],
            'roles' => ['required', 'array', 'min:1'],
            'roles.*' => ['string', 'exists:roles,name'],
        ];
    }

    // Get custom messages for validator errors.
    public function messages(): array
    {
        return [
            'name.required' => 'User name is required.',
            'name.max' => 'User name cannot exceed 100 characters.',
            'email.required' => 'Email address is required.',
            'email.email' => 'Please enter a valid email address.',
            'email.unique' => 'This email address is already registered.',
            'password.min' => 'Password must be at least 8 characters.',
            'password_confirmation.same' => 'Password confirmation must match the password.',
            'password_confirmation.required_with' => 'Password confirmation is required when changing password.',
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
