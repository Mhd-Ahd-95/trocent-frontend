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
use Illuminate\Support\Facades\Storage;

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
                $folder = 'customers/';
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

    public function update(int $cid, CustomerRequest $request)
    {
        DB::beginTransaction();
        try {
            $ocustomer = $this->cache->get_entity_id($this->cache_key, $cid, Customer::class, $this->rels);
            if (!$ocustomer)
                throw new ModelNotFoundException('Customer not found');
            $data = $request->validated();
            if (isset($ocustomer->logo_path) && !isset($data['logo_path'])) {
                $this->delete_file($ocustomer->logo_path);
            }
            if (isset($data['file']) && $data['file'] instanceof \Illuminate\Http\UploadedFile) {
                $folder = 'customers/';
                $path_file = $data['file']->store($folder, 'public');
                $data['logo_path'] = $path_file;
            }
            $ocustomer->fill($data);
            $ocustomer->save();
            if (!empty($data['accessorials'])) {
                $access = collect($data['accessorials'])->mapWithKeys(function ($acc) {
                    return [
                        $acc['access_id'] => [
                            'amount' => $acc['amount'] ?? null,
                            'min' => $acc['min'] ?? null,
                            'max' => $acc['max'] ?? null,
                            'base_amount' => $acc['base_amount'] ?? null,
                            'free_time' => $acc['free_time'] ?? null,
                        ]
                    ];
                })->toArray();
                $ocustomer->accessorials()->sync($access);
            } else {
                $ocustomer->accessorials()->detach();
            }
            if (!empty($data['vehicle_types'])) {
                $vtypes = collect($data['vehicle_types'])->mapWithKeys(function ($vtype) {
                    return [
                        $vtype['vehicle_id'] => [
                            'rate' => $vtype['rate'] ?? null
                        ]
                    ];
                })->toArray();
                $ocustomer->vehicleTypes()->sync($vtypes);
            } else {
                $ocustomer->vehicleTypes()->detach();
            }
            $this->cache->update_entity($this->cache_key, $cid, $ocustomer->load($this->rels));
            DB::commit();
            return new CustomerResource($ocustomer);
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function delete_file(string $path)
    {
        if (Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }
    }

    public function download_file(int $cid)
    {
        try {
            $customer = Customer::findOrFail($cid);
            if (!$customer)
                throw new ModelNotFoundException('Customer not found');
            $file_path = $customer->logo_path;
            if (!$file_path || !Storage::disk('public')->exists($file_path)) {
                throw new ModelNotFoundException('File path not found');
            }
            $fullPath = storage_path('app/public/' . $file_path);
            $mime = Storage::disk('public')->mimeType($file_path);
            $size = Storage::disk('public')->size($file_path);
            $name = $driver_doc->fname ?? basename($file_path);

            return response()->streamDownload(function () use ($fullPath) {
                $stream = fopen($fullPath, 'rb');
                fpassthru($stream);
                if (is_resource($stream)) {
                    fclose($stream);
                }
            }, $name, [
                'Content-Type' => $mime,
                'Content-Length' => $size,
            ]);


        } catch (Exception $e) {
            throw $e;
        }
    }

    public function destroy(int $cid)
    {
    }

    public function deleteCustomers(array $cids)
    {
    }
}
