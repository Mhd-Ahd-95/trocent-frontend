<?php

namespace App\Http\Controllers;

use App\Http\Requests\BatchRateSheetRequest;
use App\Http\Requests\RateSheetRequest;
use App\Http\Resources\RateSheetResource;
use App\Models\Customer;
use App\Models\RateSheet;
use App\Services\MemCache;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RateSheetController extends Controller
{
    protected $cache;

    protected $cache_key = 'rateSheets';

    public function __construct()
    {
        $this->cache = new MemCache();
    }

    public function index()
    {
        $rateSheets = $this->cache->get_entities($this->cache_key, RateSheet::class, ['brackets', 'customer']);
        return RateSheetResource::collection($rateSheets);
    }

    public function show(int $rid)
    {
        $rateSheet = $this->cache->get_entity_id($this->cache_key, $rid, RateSheet::class, ['brackets', 'customer']);
        if (!$rateSheet)
            throw new ModelNotFoundException('Rate Sheet not found');
        return new RateSheetResource($rateSheet);
    }

    public function store(RateSheetRequest $request)
    {
        DB::beginTransaction();
        try {
            $data = $request->validated();
            $customer = $this->cache->get_entity_id('customers', $data['customer_id'], Customer::class);
            if (!$customer)
                throw new ModelNotFoundException('Customer not found');
            $rateSheet = RateSheet::create($data);
            if (!empty($data['brackets'])) {
                $rateSheet->brackets()->createMany($data['brackets']);
            }
            $this->cache->save_entity($this->cache_key, $rateSheet->load(['brackets', 'customer']));
            DB::commit();
            return new RateSheetResource($rateSheet);
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function batchStore(BatchRateSheetRequest $request)
    {
        DB::beginTransaction();
        try {
            $data = $request->validated();
            $createdSheets = [];
            $customer = $this->cache->get_entity_id('customers', $data[0]['customer_id'], Customer::class);
            if (!$customer)
                throw new ModelNotFoundException('Customer not found');
            foreach ($data as $rate_sheet) {
                $brackets = $rate_sheet['brackets'] ?? [];
                unset($rate_sheet['brackets']);
                $rsheet = RateSheet::create($rate_sheet);
                if (!empty($brackets)) {
                    $rsheet->brackets()->createMany($brackets);
                }
                $createdSheets[] = $rsheet->load('brackets', 'customer');
            }
            $this->cache->save_entities($this->cache_key, $createdSheets);
            DB::commit();
            return RateSheetResource::collection($createdSheets);
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function update(int $rid, RateSheetRequest $request)
    {
        DB::beginTransaction();
        try {
            $orate_sheet = $this->cache->get_entity_id($this->cache_key, $rid, RateSheet::class, ['brackets', 'customer']);
            if (!$orate_sheet)
                throw new ModelNotFoundException('Rate Sheet not found');
            $data = $request->validated();
            $orate_sheet->fill($data);
            $orate_sheet->save();
            $orate_sheet->brackets()->delete();
            if (!empty($data['brackets']) && is_array($data['brackets'])) {
                $orate_sheet->brackets()->createMany($data['brackets']);
            }
            $this->cache->update_entity($this->cache_key, $rid, $orate_sheet->load(['brackets', 'customer']));
            DB::commit();
            return new RateSheetResource($orate_sheet);
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function delete_sheets_by_customer_id(int $cid){
        $customer = $this->cache->get_entity_id('customers', $cid, Customer::class);
        if (!$customer) throw new ModelNotFoundException('Customer not found');
        $rsheets = RateSheet::where('customer_id', $cid);
        $rsheets->delete();
        return true;
    }
}
