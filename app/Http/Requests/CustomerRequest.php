<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CustomerRequest extends FormRequest
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
        $cid = $this->route('id');
        $rules = [
            'account_number' => ['required', 'string'],
            'name' => ['required', 'string'],
            'address' => ['sometimes', 'string', 'nullable'],
            'suite' => ['sometimes', 'string', 'nullable'],
            'city' => ['sometimes', 'string', 'nullable'],
            'province' => ['sometimes', 'string', 'nullable'],
            'postal_code' => ['sometimes', 'string', 'nullable'],
            'account_contact' => ['sometimes', 'string', 'nullable'],
            'phone_number' => ['sometimes', 'string', 'nullable'],
            'fax_number' => ['sometimes', 'string', 'nullable'],
            'terms_of_payment' => ['sometimes', 'string', 'nullable'],
            'weight_pieces_rule' => ['sometimes', 'string', 'nullable'],
            'fuel_surcharge_rule' => ['sometimes', 'string', 'nullable'],
            'opening_date' => ['sometimes', 'date', 'nullable'],
            'last_invoice_date' => ['sometimes', 'date', 'nullable'],
            'last_payment_date' => ['sometimes', 'date', 'nullable'],
            'credit_limit' => ['sometimes', 'numeric', 'nullable'],
            'account_balance' => ['sometimes', 'numeric', 'nullable'],
            'language' => ['sometimes', 'string', 'nullable'],
            'invoicing' => ['sometimes', 'string', 'nullable'],
            'filename' => ['sometimes', 'string', 'nullable'],
            'filesize' => ['sometimes', 'numeric', 'nullable'],
            'account_active' => ['sometimes', 'boolean', 'nullable'],
            'mandatory_reference_number' => ['sometimes', 'boolean', 'nullable'],
            'summary_invoice' => ['sometimes', 'boolean', 'nullable'],
            'receive_status_update' => ['sometimes', 'boolean', 'nullable'],
            'include_pod_with_invoice' => ['sometimes', 'boolean', 'nullable'],
            'fuel_ltl' => ['required', 'numeric'],
            'fuel_ftl' => ['required', 'numeric'],
            'fuel_ltl_other' => ['sometimes', 'boolean', 'nullable'],
            'fuel_ftl_other' => ['sometimes', 'boolean', 'nullable'],
            'fuel_ltl_other_value' => ['sometimes', 'numeric', 'nullable'],
            'fuel_ftl_other_value' => ['sometimes', 'numeric', 'nullable'],
            'billing_emails' => ['sometimes', 'array', 'nullable'],
            'pod_emails' => ['sometimes', 'array', 'nullable'],
            'status_update_emails' => ['sometimes', 'array', 'nullable'],
            'notification_preferences' => ['sometimes', 'array', 'nullable'],
            'tax_options' => ['sometimes', 'string', 'nullable'],
            'file' => ['sometimes', 'file', 'nullable'],
            'accessorials' => ['sometimes', 'array', 'nullable'],
            'accessorials.*.access_id' => ['required_with:accessorials', 'numeric'],
            'accessorials.*.amount' => ['sometimes:accessorials', 'numeric', 'nullable'],
            'accessorials.*.base_amount' => ['sometimes:accessorials', 'numeric', 'nullable'],
            'accessorials.*.free_time' => ['sometimes:accessorials', 'numeric', 'nullable'],
            'accessorials.*.min' => ['sometimes:accessorials', 'numeric', 'nullable'],
            'accessorials.*.max' => ['sometimes:accessorials', 'numeric', 'nullable'],
            'vehicle_types' => ['sometimes', 'array', 'nullable'],
            'vehicle_types.*.vehicle_id' => ['required_with:vehicle_types', 'numeric'],
            'vehicle_types.*.rate' => ['sometimes:vehicle_types', 'numeric', 'nullable']
        ];

        if ($this->isMethod('put')) {
            $optionalFields = [
                'account_number',
                'name',
                'fuel_ltl',
                'fuel_ftl'
            ];
            foreach ($optionalFields as $of) {
                if (isset($rules[$of])) {
                    $rules[$of][0] = 'sometimes';
                }
            }
            $rules['account_number'][] = Rule::unique('customers', 'account_number')->ignore($cid);
        } else {
            $rules['account_number'][] = Rule::unique('customers', 'account_number');
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

            if ($key === 'phone_number' || $key === 'account_number' || $key === 'fax_number') {
                return $value;
            }

            if ($value === 'true') {
                return true;
            }
            if ($value === 'false') {
                return false;
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

        $booleanFields = [
            'account_active',
            'mandatory_reference_number',
            'summary_invoice',
            'receive_status_update',
            'include_pod_with_invoice',
            'fuel_ftl_other',
            'fuel_ltl_other'
        ];

        foreach ($booleanFields as $field) {
            if ($this->has($field)) {
                $cleaned[$field] = filter_var($this->$field, FILTER_VALIDATE_BOOLEAN);
            }
        }

        $this->replace($cleaned);
    }
}
