<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $userId = $this->route('id');

        if ($this->isMethod('put')) {
            return [
                'name' => ['sometimes', 'string'],
                'username' => [
                    'sometimes',
                    'string',
                    Rule::unique('users', 'username')->ignore($userId),
                ],
                'email' => [
                    'sometimes',
                    'email',
                    Rule::unique('users', 'email')->ignore($userId),
                ],
                'type' => ['sometimes', 'string', 'in:customer,staff,admin,driver'],
                'password' => ['sometimes', 'string', 'min:6'],
                'role' => ['sometimes', 'exists:roles,name'],
            ];
        }
        return [
            'name' => 'required|string|max:255',
            'username' => 'required|string|unique:users,username',
            'email' => 'required|email|unique:users,email',
            'type' => 'required|string|in:admin,staff,customer,driver',
            'password' => 'required|string|min:6',
            'role' => 'required|exists:roles,name'
        ];
    }
}
