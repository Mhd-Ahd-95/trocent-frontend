<?php

namespace App\Http\Controllers;

use App\Http\Requests\CompanyRequest;
use App\Http\Resources\CompanyResource;
use App\Models\Company;
use App\Services\MemCache;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CompanyController extends Controller
{
    protected $cache;
    protected $cache_key = 'companies';

    public function __construct()
    {
        $this->cache = new MemCache();
    }

    public function index()
    {
        try {
            $companies = $this->cache->get_entities($this->cache_key, Company::class);
            return CompanyResource::collection($companies);
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function show(int $id)
    {
        try {
            $company = $this->cache->get_entity_id($this->cache_key, $id, Company::class);
            if (!$company)
                throw new ModelNotFoundException('Company not found.');
            return new CompanyResource($company);
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function store(CompanyRequest $request)
    {
        try {
            $data = $request->validated();
            $company = Company::create($data);
            $this->cache->save_entity($this->cache_key, $company);
            return new CompanyResource($company);
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function update(int $id, CompanyRequest $request)
    {
        DB::beginTransaction();
        try {
            $ocompany = $this->cache->get_entity_id($this->cache_key, $id, Company::class);
            if (!$ocompany)
                throw new ModelNotFoundException("Company with ID {$id} not found.");
            $ncomapny = $request->validated();
            $ocompany->fill($ncomapny);
            $ocompany->save();
            $this->cache->update_entity($this->cache_key, $id, $ocompany);
            DB::commit();
            return new CompanyResource($ocompany);
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function destroy(int $id)
    {
        DB::beginTransaction();
        try {
            $company = $this->cache->get_entity_id($this->cache_key, $id, Company::class);
            if (!$company)
                throw new ModelNotFoundException("Company with ID {$id} not found.");
            $company->delete();
            $this->cache->delete_entity($this->cache_key, $id);
            DB::commit();
            return true;
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function delete_companies(Request $request)
    {
        DB::beginTransaction();
        try {
            $ids = $request->input('ids');
            if (!is_array($ids) || empty($ids)) {
                throw new ModelNotFoundException("No companies IDs provided.");
            }
            $companies = Company::whereIn('id', $ids)->get();
            if (count($companies) !== count($ids)) {
                throw new ModelNotFoundException("Some companies not found.");
            }
            Company::whereIn('id', $ids)->delete();
            $this->cache->delete_entities($this->cache_key, $ids);
            DB::commit();
            return true;
        } catch (Exception $e) {
            throw $e;
        }
    }
}
