<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AddressBook extends FormRequest
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
        $abId = $this->route('id');

        if ($this->isMethod('put')) {
            return [
                'name' => ['sometimes', 'string', Rule::unique('address_books', 'name')->ignore($abId)],
                'contact_name' => ['sometimes', 'nullable', 'string'],
                'phone_number' => ['sometimes', 'nullable', 'string'],
                'email' => ['sometimes', 'nullable', 'email'],
                'address' => ['sometimes', 'string'],
                'suite' => ['sometimes', 'nullable', 'string'],
                'city' => ['sometimes', 'string'],
                'province' => ['sometimes', 'string'],
                'postal_code' => ['sometimes', 'string'],
                'special_instructions' => ['sometimes', 'nullable', 'string'],
                'op_time_from' => ['sometimes', 'nullable', 'date_format:h:i A'],
                'op_time_to' => ['sometimes', 'nullable', 'date_format:h:i A'],
                'requires_appointment' => ['sometimes', 'boolean'],
                'no_waiting_time' => ['sometimes', 'boolean']
            ];
        }
        return [
            'name' => ['required', 'string', 'unique:address_books,name'],
            'contact_name' => ['sometimes', 'nullable', 'string'],
            'phone_number' => ['sometimes', 'nullable', 'string'],
            'email' => ['sometimes', 'nullable', 'email'],
            'address' => ['required', 'string'],
            'suite' => ['sometimes', 'nullable', 'string'],
            'city' => ['required', 'string'],
            'province' => ['required', 'string'],
            'postal_code' => ['required', 'string'],
            'special_instructions' => ['sometimes', 'nullable', 'string'],
            'op_time_from' => ['sometimes', 'nullable', 'date_format:h:i A'],
            'op_time_to' => ['sometimes', 'nullable', 'date_format:h:i A'],
            'requires_appointment' => ['sometimes', 'boolean'],
            'no_waiting_time' => ['sometimes', 'boolean']
        ];
    }
}
