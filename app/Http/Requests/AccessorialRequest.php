<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AccessorialRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $accId = $this->route('id');

        if ($this->isMethod('put')) {
            return [
                'name' => ['sometimes', 'string', Rule::unique('accessorials', 'name')->ignore($accId)],
                'type' => ['sometimes', 'string', 'in:fixed_price,fuel_based,time_based,transport_based,product_base,package_based'],
                'amount' => ['sometimes', 'nullable', 'numeric'],
                'is_driver' => ['sometimes', 'boolean'],
                'min' => ['sometimes', 'nullable', 'numeric'],
                'max' => ['sometimes', 'nullable', 'numeric'],
                'package_type' => ['sometimes', 'nullable', 'string'],
                'product_type' => ['sometimes', 'nullable', 'string'],
                'free_time' => ['sometimes', 'nullable', 'numeric'],
                'time_unit' => ['sometimes', 'nullable', 'string', 'in:minute,hour'],
                'base_amount' => ['sometimes', 'nullable', 'numeric']
            ];
        }
        return [
            'name' => ['required', 'string', 'unique:accessorials,name'],
            'type' => ['required', 'string', 'in:fixed_price,fuel_based,time_based,transport_based,product_base,package_based'],
            'amount' => ['sometimes', 'nullable', 'numeric'],
            'is_driver' => ['sometimes', 'boolean'],
            'min' => ['sometimes', 'nullable', 'numeric'],
            'max' => ['sometimes', 'nullable', 'numeric'],
            'package_type' => ['sometimes', 'nullable', 'string'],
            'product_type' => ['sometimes', 'nullable', 'string'],
            'free_time' => ['sometimes', 'nullable', 'numeric'],
            'time_unit' => ['sometimes', 'nullable', 'string', 'in:minute,hour'],
            'base_amount' => ['sometimes', 'nullable', 'numeric']
        ];
    }
}
