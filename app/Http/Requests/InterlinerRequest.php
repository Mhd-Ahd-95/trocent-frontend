<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class InterlinerRequest extends FormRequest
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
        $inId = $this->route('id');

        if ($this->isMethod('put')) {
            return [
                'name' => ['sometimes', 'string', Rule::unique('interliners', 'name')->ignore($inId)],
                'contact_name' => ['sometimes', 'nullable', 'string'],
                'phone' => ['sometimes', 'nullable', 'string'],
                'email' => ['sometimes', 'nullable', 'email'],
                'address' => ['sometimes', 'string'],
                'suite' => ['sometimes', 'nullable', 'string'],
                'city' => ['sometimes', 'string'],
                'province' => ['sometimes', 'string'],
                'postal_code' => ['sometimes', 'string']
            ];
        }
        return [
            'name' => ['required', 'string', 'unique:interliners,name'],
            'contact_name' => ['sometimes', 'nullable', 'string'],
            'phone' => ['sometimes', 'nullable', 'string'],
            'email' => ['sometimes', 'nullable', 'email'],
            'address' => ['sometimes', 'nullable', 'string'],
            'suite' => ['sometimes', 'nullable', 'string'],
            'city' => ['sometimes', 'nullable', 'string'],
            'province' => ['sometimes', 'nullable', 'string'],
            'postal_code' => ['sometimes', 'nullable', 'string']
        ];
    }
}
