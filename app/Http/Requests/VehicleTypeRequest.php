<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class VehicleTypeRequest extends FormRequest
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
        $vtId = $this->route('id');

        if ($this->isMethod('put')) {
            return [
                'name' => ['sometimes', 'string', Rule::unique('vehicleTypes', 'name')->ignore($vtId)],
                'rate' => 'sometimes|float'
            ];
        }

        return [
            'name' => ['required', 'string', 'unique:vehicleTypes,name'],
            'rate' => ['required', 'numeric']
        ];
    }
}
