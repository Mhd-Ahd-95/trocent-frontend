<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class RoleRequest extends FormRequest
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
        $roleId = $this->route('id');

        if ($this->isMethod('put')) {
            return [
                'name' => ['sometimes', 'string', Rule::unique('roles', 'name')->ignore($roleId)],
                'guard_name' => 'sometimes|in:web,api',
                'permissions.*' => 'sometimes|exists:permissions,name',
                'permissions' => 'sometimes|array',
                'widgets.*' => 'sometimes|exists:widgets,id',
                'widgets' => 'sometimes|array'
            ];
        }

        return [
            'name' => ['required', 'string', 'unique:roles,name'],
            'permissions' => ['nullable', 'array'],
            'permissions.*' => ['string', 'exists:permissions,name'],
            'guard_name' => ['required', 'in:web,api'],
            'widgets' => ['nullable', 'array'],
            'widgets.*' => ['integer', 'exists:widgets,id']
        ];
    }
}
