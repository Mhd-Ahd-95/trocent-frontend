<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CompanyResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'legal_name' => $this->legal_name,
            'operating_name' => $this->operating_name,
            'contact_person' => $this->contact_person,
            'phone' => $this->phone,
            'email' => $this->email,

            'neq' => $this->neq,
            'nir' => $this->nir,
            'ifta' => $this->ifta,

            'auto_insurance_company' => $this->auto_insurance_company,
            'auto_policy_number' => $this->auto_policy_number,
            'auto_policy_expiry' => $this->auto_policy_expiry,
            'auto_insurance_amount' => $this->auto_insurance_amount,

            'auto_insurance_company_2' => $this->auto_insurance_company_2,
            'auto_policy_number_2' => $this->auto_policy_number_2,
            'auto_policy_expiry_2' => $this->auto_policy_expiry_2,
            'auto_insurance_amount_2' => $this->auto_insurance_amount_2,

            'cargo_insurance_company' => $this->cargo_insurance_company,
            'cargo_policy_number' => $this->cargo_policy_number,
            'cargo_policy_expiry' => $this->cargo_policy_expiry,
            'cargo_insurance_amount' => $this->cargo_insurance_amount,

            'cargo_insurance_company_2' => $this->cargo_insurance_company_2,
            'cargo_policy_number_2' => $this->cargo_policy_number_2,
            'cargo_policy_expiry_2' => $this->cargo_policy_expiry_2,
            'cargo_insurance_amount_2' => $this->cargo_insurance_amount_2
        ];
    }
}
