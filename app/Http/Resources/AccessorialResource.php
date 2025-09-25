<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AccessorialResource extends JsonResource
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
            'amount' => $this->amount,
            'type' => $this->type,
            'min' => $this->min,
            'max' => $this->max,
            'free_time' => $this->free_time,
            'unit_time' => $this->unit_time,
            'package_type' => $this->package_type,
            'product_type' => $this->product_type,
            'base_amount' => $this->base_amount,
            'is_driver' => $this->is_driver
        ];
    }
}
