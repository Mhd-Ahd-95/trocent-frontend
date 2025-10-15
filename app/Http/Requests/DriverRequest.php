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
        $driverId = $this->route(param: 'id');
        $rules = [
            'driver_number' => ['required', 'string'],
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
            'tdg' => ['sometimes', 'boolean'],
            'tdg_expiry' => ['sometimes', 'date', 'nullable'],
            'criminal_expiry' => ['sometimes', 'date', 'nullable'],
            'criminal_note' => ['sometimes', 'string', 'nullable'],
            'contract_type' => ['sometimes', 'string', 'nullable'],
            'driver_description' => ['sometimes', 'string', 'nullable'],
            'company_id' => ['required', 'numeric'],
            'user_id' => ['sometimes', 'numeric', 'nullable'],
            'driver_documents' => ['sometimes', 'array', 'nullable'],
            'driver_documents.*.type' => ['required_with:driver_documents', 'string'],
            'driver_documents.*.expiry_date' => ['required_with:driver_documents', 'date'],
            'driver_documents.*.fname' => ['required_with:driver_documents', 'string'],
            'driver_documents.*.fsize' => ['required_with:driver_documents', 'numeric'],
            'driver_documents.*.id' => ['sometimes:driver_documents', 'numeric', 'nullable'],
            'driver_documents.*.file_path' => ['sometimes:driver_documents', 'string', 'nullable'],
            'driver_documents.*.file' => [
                function ($attribute, $value, $fail) {
                    $index = explode('.', $attribute)[1];
                    $documents = $this->input('driver_documents') ?? [];
                    $document = $documents[$index] ?? null;

                    if (!$document)
                        return;

                    // If file_path exists, it's an old file, skip
                    if (!empty($document['file_path']))
                        return;

                    // New file must exist
                    if (empty($document['file']) || !($document['file'] instanceof \Illuminate\Http\UploadedFile)) {
                        $fail('The file field is required for new documents.');
                    }
                },
                'file'
            ]
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
        } else {
            $rules['driver_number'][] = Rule::unique('drivers', 'driver_number');
        }


        return $rules;
    }

    protected function prepareForValidation()
    {
        $data = $this->all();

        $clean = function ($value, $key = null) use (&$clean) {

            if ($value === 'null') {
                return null;
            }

            if ($value === 'true') {
                return true;
            }

            if ($value === 'false') {
                return false;
            }

            if ($key === 'phone' || $key === 'driver_number') {
                return $value;
            }

            if (is_string($value) && is_numeric($value)) {
                return (int) $value;
            }

            if (is_array($value)) {
                $newArray = [];
                foreach ($value as $k => $v) {
                    $newArray[$k] = $clean($v, $k);
                }
                return $newArray;
            }

            return $value;
        };

        $cleaned = [];
        foreach ($data as $k => $v) {
            $cleaned[$k] = $clean($v, $k);
        }

        if ($this->has('tdg')) {
            $cleaned['tdg'] = filter_var($this->tdg, FILTER_VALIDATE_BOOLEAN);
        }

        $this->replace($cleaned);
    }

}
