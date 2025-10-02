<?php

namespace App\Http\Controllers;

use App\Http\Requests\DriverRequest;
use App\Http\Resources\DriverResource;
use App\Models\Company;
use App\Models\Driver;
use App\Services\MemCache;
use DB;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;

class DriverController extends Controller
{
    protected $cache;
    protected $cache_key = 'drivers';

    public function __construct()
    {
        $this->cache = new MemCache();
    }

    public function index()
    {
        try {
            $drivers = $this->cache->get_entities($this->cache_key, Driver::class, ['driver_documents', 'company']);
            // logger($drivers);
            return DriverResource::collection($drivers);
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function show(int $id)
    {
        try {
            $driver = $this->cache->get_entity_id($this->cache_key, $id, Driver::class, ['driver_documents', 'company']);
            if (!$driver)
                throw new ModelNotFoundException('driver not found.');
            return new DriverResource($driver);
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function store(DriverRequest $request)
    {
        DB::beginTransaction();
        try {
            $data = $request->validated();
            $documents = $data['driver_documents'] ?? [];
            unset($data['driver_documents']);
            $company = $this->cache->get_entity_id('companies', $data['company_id'], Company::class);
            if (!$company)
                throw new ModelNotFoundException('Company not found');
            $driver = Driver::create($data);
            if (!empty($documents)) {
                $docs_insert = [];
                foreach ($documents as $doc) {
                    $folder = 'driver_documents/' . $driver->driver_number;
                    if (isset($doc['file'])) {
                        $path = $doc->file('file')->store($folder, 'public');
                        $docs_insert[] = [
                            'type' => $doc['type'],
                            'file_path' => $path,
                            'expiry_date' => $doc['expiry_date'],
                            'driver_id' => $driver->id
                        ];
                    }
                }
                $driver->driver_documents()->createMany($docs_insert);
            }
            $this->cache->save_entity($this->cache_key, $driver->load(['driver_documents', 'company']));
            DB::commit();
            return new DriverResource($driver);
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function update(int $id, DriverRequest $request)
    {
        DB::beginTransaction();
        try {
            $odriver = $this->cache->get_entity_id($this->cache_key, $id, Driver::class, ['driver_documents', 'company']);
            if (!$odriver)
                throw new ModelNotFoundException("Driver with ID {$id} not found.");
            $ndriver = $request->validated();
            $company = $this->cache->get_entity_id('companies', $ndriver['company_id'], Company::class);
            if (!$company)
                throw new ModelNotFoundException('Company not found');
            $documents = $ndriver['driver_documents'] ?? [];
            unset($ndriver['driver_documents']);
            $odriver->fill($ndriver);
            $odriver->save();
            $odriver->driver_documents()->delete();
            if (!empty($documents)) {
                $odriver->driver_documents()->createMany($documents);
            }
            $this->cache->update_entity($this->cache_key, $id, $odriver->load(['driver_documents', 'company']));
            DB::commit();
            return new DriverResource($odriver);
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function destroy(int $id)
    {
        DB::beginTransaction();
        try {
            $driver = $this->cache->get_entity_id($this->cache_key, $id, Driver::class);
            if (!$driver)
                throw new ModelNotFoundException("driver with ID {$id} not found.");
            $driver->delete();
            $this->cache->delete_entity($this->cache_key, $id);
            DB::commit();
            return true;
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function delete_drivers(Request $request)
    {
        DB::beginTransaction();
        try {
            $ids = $request->input('ids');
            if (!is_array($ids) || empty($ids)) {
                throw new ModelNotFoundException("No Drivers IDs provided.");
            }
            $drivers = Driver::whereIn('id', $ids)->get();
            if (count($drivers) !== count($ids)) {
                throw new ModelNotFoundException("Some drivers not found.");
            }
            Driver::whereIn('id', $ids)->delete();
            $this->cache->delete_entities($this->cache_key, $ids);
            DB::commit();
            return true;
        } catch (Exception $e) {
            throw $e;
        }
    }
}
