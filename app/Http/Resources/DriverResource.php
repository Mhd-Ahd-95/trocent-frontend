<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DriverResource extends JsonResource
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
            'driver_number' => $this->driver_number,
            'fname' => $this->fname,
            'mname' => $this->mname,
            'lname' => $this->lname,
            'dob' => $this->dob,
            'gender' => $this->gender,
            'sin' => $this->sin,
            'phone' => $this->phone,
            'email' => $this->email,
            'address' => $this->address,
            'city' => $this->city,
            'province' => $this->province,
            'suite' => $this->suite,
            'postal_code' => $this->postal_code,
            'license_number' => $this->license_number,
            'license_classes' => $this->license_classes,
            'license_expiry' => $this->license_expiry,
            'tdg' => $this->tdg,
            'tdg_expiry' => $this->tdg_expiry,
            'criminal_expiry' => $this->crimanal_expiry,
            'criminal_note' => $this->criminal_note,
            'contract_type' => $this->contract_type,
            'driver_description' => $this->driver_description,
            'company_id' => $this->company_id,
            'user_id' => $this->user_id,
            'company_name' => $this->whenLoaded('company', function(){
                return $this->company->operating_name;
            }),
            'driver_documents' => $this->whenLoaded('driver_documents', function () {
                return $this->driver_documents->map(function($doc){
                    return [
                        'id' => $doc->id,
                        'type' => $doc->type,
                        'file_path' => $doc->file_path,
                        'expiry_date' => $doc->expiry_date,
                        'fname' => $doc->fname,
                        'fsize' => $doc->fsize
                    ];
                });
            }),
        ];
    }
}
