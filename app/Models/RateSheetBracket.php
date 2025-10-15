<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RateSheetBracket extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'rate_bracket',
        'rate',
        'rate_sheet_id'
    ];

    public function rateSheet()
    {
        return $this->belongsTo(RateSheet::class, 'rate_sheet_id');
    }
}
