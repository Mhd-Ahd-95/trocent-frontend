<?php

namespace App\Http\Controllers;

use App\Http\Requests\CustomerRequest;
use App\Http\Resources\CustomerResource;
use App\Models\Customer;
use App\Services\MemCache;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CustomerController extends Controller
{
    protected $cache;
    protected $rels = ['accessorials', 'vehicleTypes'];

    protected $cache_key = 'customers';

    public function __construct()
    {
        $this->cache = new MemCache();
    }

    public function index()
    {
        $customers = $this->cache->get_entities($this->cache_key, Customer::class, $this->rels);
        return CustomerResource::collection($customers);
    }

    public function show(int $cid)
    {
        $customer = $this->cache->get_entity_id($this->cache_key, $cid, Customer::class, $this->rels);
        if (!$customer)
            throw new ModelNotFoundException('Customer not found', 404);
        return new CustomerResource($customer);
    }

    public function store(CustomerRequest $request)
    {
        DB::beginTransaction();
        try {
            $data = $request->validated();
            if (isset($data['file']) && $data['file'] instanceof \Illuminate\Http\UploadedFile) {
                $folder = 'customers/' . $data['account_number'];
                $path_file = $data['file']->store($folder, 'public');
                $data['logo_path'] = $path_file;
            }
            $customer = Customer::create($data);
            if (isset($data['accessorials'])) {
                $customer->accessorials()->attach($data['accessorials']);
            }
            if (isset($data['vehicle_types'])) {
                $customer->vehicleTypes()->attach($data['vehicle_types']);
            }
            $scustomer = $customer->load($this->rels);
            $this->cache->save_entity($this->cache_key, $scustomer);
            DB::commit();
            return new CustomerResource($customer);
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
