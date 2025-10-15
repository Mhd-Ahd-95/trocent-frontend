<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FuelSurchargeResource extends JsonResource
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
            'ltl_surcharge' => $this->ltl_surcharge,
            'ftl_surcharge' => $this->ftl_surcharge,
            'from_date' => $this->from_date,
            'to_date' => $this->to_date,
            'created_at' => $this->created_at
        ];
    }
}
