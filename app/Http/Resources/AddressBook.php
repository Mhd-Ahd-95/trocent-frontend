<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AddressBook extends JsonResource
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
            'name' => $this->name,
            'contact_name' => $this->contact_name,
            'phone_number' => $this->phone_number,
            'email' => $this->email,
            'address' => $this->address,
            'suite' => $this->suite,
            'city' => $this->city,
            'province' => $this->province,
            'postal_code' => $this->postal_code,
            'special_instructions' => $this->special_instructions,
            'op_time_from' => $this->op_time_from,
            'op_time_to' => $this->op_time_to,
            'requires_appointment' => $this->requires_appointment,
            'no_waiting_time' => $this->no_waiting_time,
        ];
    }
}
