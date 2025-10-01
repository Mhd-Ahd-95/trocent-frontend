<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CompanyRequest extends FormRequest
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
        $companyId = $this->route('id');

        if ($this->isMethod('put')) {
            return [
                'legal_name' => ['sometimes', 'string', Rule::unique('companies', 'legal_name')->ignore($companyId)],
                'operating_name' => ['sometimes', 'nullable', 'string'],
                'contact_person' => ['sometimes', 'nullable', 'string'],
                'email' => ['sometimes', 'nullable', 'email'],
                'phone' => ['sometimes', 'nullable', 'string'],

                'neq' => ['sometimes', 'nullable', 'string'],
                'nir' => ['sometimes', 'nullable', 'string'],
                'ifta' => ['sometimes', 'nullable', 'string'],

                'auto_insurance_company' => ['sometimes', 'nullable', 'string'],
                'auto_policy_number' => ['sometimes', 'nullable', 'string'],
                'auto_policy_expiry' => ['sometimes', 'nullable', 'date'],
                'auto_insurance_amount' => ['sometimes', 'nullable', 'numeric'],

                'auto_insurance_company_2' => ['sometimes', 'nullable', 'string'],
                'auto_policy_number_2' => ['sometimes', 'nullable', 'string'],
                'auto_policy_expiry_2' => ['sometimes', 'nullable', 'date'],
                'auto_insurance_amount_2' => ['sometimes', 'nullable', 'numeric'],

                'cargo_insurance_company' => ['sometimes', 'nullable', 'string'],
                'cargo_policy_number' => ['sometimes', 'nullable', 'string'],
                'cargo_policy_expiry' => ['sometimes', 'nullable', 'date'],
                'cargo_insurance_amount' => ['sometimes', 'nullable', 'numeric'],

                'cargo_insurance_company_2' => ['sometimes', 'nullable', 'string'],
                'cargo_policy_number_2' => ['sometimes', 'nullable', 'string'],
                'cargo_policy_expiry_2' => ['sometimes', 'nullable', 'date'],
                'cargo_insurance_amount_2' => ['sometimes', 'nullable', 'numeric']
            ];
        }
        return [
            'legal_name' => ['required', 'string', 'unique:companies,legal_name'],
            'operating_name' => ['sometimes', 'nullable', 'string'],
            'contact_person' => ['sometimes', 'nullable', 'string'],
            'email' => ['sometimes', 'nullable', 'email'],
            'phone' => ['sometimes', 'nullable', 'string'],

            'neq' => ['sometimes', 'nullable', 'string'],
            'nir' => ['sometimes', 'nullable', 'string'],
            'ifta' => ['sometimes', 'nullable', 'string'],

            'auto_insurance_company' => ['sometimes', 'nullable', 'string'],
            'auto_policy_number' => ['sometimes', 'nullable', 'string'],
            'auto_policy_expiry' => ['sometimes', 'nullable', 'date'],
            'auto_insurance_amount' => ['sometimes', 'nullable', 'numeric'],

            'auto_insurance_company_2' => ['sometimes', 'nullable', 'string'],
            'auto_policy_number_2' => ['sometimes', 'nullable', 'string'],
            'auto_policy_expiry_2' => ['sometimes', 'nullable', 'date'],
            'auto_insurance_amount_2' => ['sometimes', 'nullable', 'numeric'],

            'cargo_insurance_company' => ['sometimes', 'nullable', 'string'],
            'cargo_policy_number' => ['sometimes', 'nullable', 'string'],
            'cargo_policy_expiry' => ['sometimes', 'nullable', 'date'],
            'cargo_insurance_amount' => ['sometimes', 'nullable', 'numeric'],

            'cargo_insurance_company_2' => ['sometimes', 'nullable', 'string'],
            'cargo_policy_number_2' => ['sometimes', 'nullable', 'string'],
            'cargo_policy_expiry_2' => ['sometimes', 'nullable', 'date'],
            'cargo_insurance_amount_2' => ['sometimes', 'nullable', 'numeric']
        ];
    }
}
