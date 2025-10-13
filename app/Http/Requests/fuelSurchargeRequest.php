<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class fuelSurchargeRequest extends FormRequest
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
        $fsId = $this->route('id');

        if ($this->isMethod('put')) {
            return [
                'ltl_surcharge' => ['sometimes', 'numeric'],
                'ftl_surcharge' => ['sometimes', 'numeric'],
                'from_date' => 'sometimes|date',
                'to_date' => 'sometimes|date|nullable'
            ];
        }

        return [
            'ltl_surcharge' => ['required', 'numeric'],
            'ftl_surcharge' => ['required', 'numeric'],
            'from_date' => 'required|date',
            'to_date' => 'sometimes|date|nullable'
        ];
    }
}
