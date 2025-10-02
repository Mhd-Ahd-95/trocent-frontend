<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class DriverRequest extends FormRequest
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
        $driverId = $this->route('id');

        $rules = [
            'driver_number' => ['required', 'string', Rule::unique('drivers', 'driver_number')],
            'fname' => ['required', 'string'],
            'mname' => ['sometimes', 'nullable', 'string'],
            'lname' => ['required', 'string'],
            'dob' => ['sometimes', 'date', 'nullable'],
            'gender' => ['sometimes', 'string', 'nullable'],
            'sin' => ['sometimes', 'string', 'nullable'],
            'phone' => ['sometimes', 'string', 'nullable'],
            'email' => ['sometimes', 'string', 'nullable'],
            'address' => ['sometimes', 'string', 'nullable'],
            'city' => ['sometimes', 'string', 'nullable'],
            'province' => ['sometimes', 'string', 'nullable'],
            'suite' => ['sometimes', 'string', 'nullable'],
            'postal_code' => ['sometimes', 'string', 'nullable'],
            'license_number' => ['sometimes', 'string', 'nullable'],
            'license_classes' => ['sometimes', 'string', 'nullable'],
            'license_expiry' => ['sometimes', 'date', 'nullable'],
            'tdg' => ['sometimes', 'boolean', 'nullable'],
            'tdg_expiry' => ['sometimes', 'date', 'nullable'],
            'criminal_expiry' => ['sometimes', 'date', 'nullable'],
            'criminal_note' => ['sometimes', 'string', 'nullable'],
            'contract_type' => ['sometimes', 'string', 'nullable'],
            'driver_description' => ['sometimes', 'string', 'nullable'],
            'company_id' => ['required', 'numeric'],
            'driver_documents' => ['sometimes', 'array', 'nullable'],
            'driver_documents.*.type' => ['required_with:driver_documents', 'string'],
            'driver_documents.*.file' => ['required_with:driver_documents', 'file', 'max:5120'],
            'driver_documents.*.expiry' => ['required_with:driver_documents', 'date'],
        ];

        if ($this->isMethod('put')) {
            $optionalFields = [
                'driver_number',
                'fname',
                'lname',
                'company_id'
            ];

            foreach ($optionalFields as $field) {
                if (isset($rules[$field])) {
                    $rules[$field][0] = 'sometimes';
                }
            }
            $rules['driver_number'][] = Rule::unique('drivers', 'driver_number')->ignore($driverId);
        }

        return $rules;
    }
}
