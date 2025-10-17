<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RateSheetResource extends JsonResource
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
            'destination' => $this->destination,
            'province' => $this->province,
            'postal_code' => $this->postal_code,
            'priority_sequence' => $this->priority_sequence,
            'rate_code' => $this->rate_code,
            'skid_by_weight' => $this->skid_by_weight,
            'external' => $this->external,
            'min_rate' => $this->min_rate,
            'ltl_rate' => $this->ltl_rate,
            'customer_id' => $this->customer_id,
            'brackets' => $this->whenLoaded('brackets', function () {
                return $this->brackets()->map(function ($bracket) {
                    return [
                        'id' => $bracket->id,
                        'bracket_rate' => $bracket->bracket_rate,
                        'rate' => $bracket->rate,
                        'rate_sheet_id' => $bracket->rate_sheet_id
                    ];
                });
            })
        ];
    }
}
