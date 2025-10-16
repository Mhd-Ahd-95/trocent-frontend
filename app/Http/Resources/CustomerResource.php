<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CustomerResource extends JsonResource
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
            'account_number' => $this->account_number,
            'name' => $this->name,
            'address' => $this->address,
            'suite' => $this->suite,
            'city' => $this->city,
            'province' => $this->province,
            'postal_code' => $this->postal_code,
            'account_contact' => $this->account_contact,
            'phone_number' => $this->phone_number,
            'fax_number' => $this->fax_number,
            'terms_of_payment' => $this->terms_of_payment,
            'weight_pieces_rule' => $this->weight_pieces_rule,
            'fuel_surcharge_rule' => $this->fuel_surcharge_rule,
            'opening_date' => $this->opening_date,
            'last_invoice_date' => $this->last_invoice_date,
            'last_payment_date' => $this->last_payment_date,
            'credit_limit' => $this->credit_limit,
            'account_balance' => $this->account_balance,
            'language' => $this->language,
            'invoicing' => $this->invoicing,
            'logo_path' => $this->logo_path,
            'filename' => $this->filename,
            'filesize' => $this->filesize,
            'account_active' => $this->account_active,
            'mandatory_reference_number' => $this->mandatory_reference_number,
            'summary_invoice' => $this->summary_invoice,
            'receive_status_update' => $this->receive_status_update,
            'include_pod_with_invoice' => $this->include_pod_with_invoice,
            'fuel_ltl' => $this->fuel_ltl,
            'fuel_ftl' => $this->fuel_ftl,
            'fuel_ltl_other' => $this->fuel_ltl_other,
            'fuel_ftl_other' => $this->fuel_ftl_other,
            'fuel_ltl_other_value' => $this->fuel_ltl_other_value,
            'fuel_ftl_other_value' => $this->fuel_ftl_other_value,
            'billing_emails' => $this->billing_emails,
            'pod_emails' => $this->pod_emails,
            'status_update_emails' => $this->status_update_emails,
            'notification_preferences' => $this->notification_preferences,
            'tax_options' => $this->tax_options,
            'accessorials' => $this->whenLoaded('accessorials', function () {
                return $this->accessorials->map(function ($acc) {
                    return [
                        'id' => $acc->pivot->id,
                        'access_id' => $acc->pivot->access_id,
                        'customer_id' => $acc->pivot->customer_id,
                        'amount' => $acc->pivot->amount,
                        'base_amount' => $acc->pivot->base_amount,
                        'free_time' => $acc->pivot->free_time,
                        'min' => $acc->pivot->min,
                        'max' => $acc->pivot->max
                    ];
                });
            }),
            'vehicle_types' => $this->whenLoaded('vehicleTypes', function () {
                return $this->vehicleTypes->map(function ($vtype) {
                    return [
                        'id' => $vtype->pivot->id,
                        'vehicle_id' => $vtype->pivot->vehicle_id,
                        'customer_id' => $vtype->pivot->customer_id,
                        'rate' => $vtype->pivot->rate
                    ];
                });
            })
        ];
    }

}
