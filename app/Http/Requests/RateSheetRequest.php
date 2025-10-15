<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RateSheetRequest extends FormRequest
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
        $rules = [
            'destination' => ['required', 'string'],
            'type' => ['required', 'string', 'in:skid,weight'],
            'province' => ['sometimes', 'string', 'nullable'],
            'postal_code' => ['sometimes', 'string', 'nullable'],
            'rate_code' => ['sometimes', 'string', 'nullable'],
            'priority_sequence' => ['sometimes', 'string', 'nullable'],
            'external' => ['sometimes', 'string', 'in:internal,external', 'nullable'],
            'min_rate' => ['sometimes', 'numeric', 'nullable'],
            'skid_by_weight' => ['sometimes', 'boolean', 'nullable'],
            'ltl_rate' => ['sometimes', 'numeric', 'nullable'],
            'customer_id' => ['required', 'numeric'],
            'brackets' => ['sometimes', 'array', 'nullable'],
            'brackets.*.rate_bracket' => ['required_with:brackets', 'numeric'],
            'brackets.*.rate' => ['sometimes:brackets', 'numeric', 'nullable']
        ];

        if ($this->isMethod('put')){
            $ofs = ['destination', 'type'];
            foreach($ofs as $of){
                $rules[$of][0] = 'sometimes';
            }
        }
        return $rules;
    }
}
