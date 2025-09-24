<?php

namespace App\Http\Controllers;

use App\Http\Requests\AddressBook as AddressBookRequest;
use App\Services\MemCache;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use App\Models\AddressBook as AddressBookModel;
use App\Http\Resources\AddressBook as AddressBookResource;
use Illuminate\Support\Facades\DB;

class AddressBookController extends Controller
{
    protected $cache;
    protected $cache_key = 'addressBooks';

    public function __construct()
    {
        $this->cache = new MemCache();
    }

    public function index()
    {
        try {
            $abooks = $this->cache->get_entities($this->cache_key, AddressBookModel::class);
            return AddressBookResource::collection($abooks);
        } catch (Exception $e) {
            return response()->json(['message' => $e->getMessage()]);
        }
    }

    public function show(int $id)
    {
        try {
            $abook = $this->cache->get_entity_id($this->cache_key, $id, AddressBookModel::class);
            if (!$abook) throw new ModelNotFoundException('Address book not found.');
            return new AddressBookResource($abook);
        } catch (Exception $e) {
            return response()->json(['message' => $e->getMessage()]);
        }
    }

    public function store(AddressBookRequest $request)
    {
        try {
            $data = $request->validated();
            $addressBook = AddressBookModel::create($data);
            $this->cache->save_entity($this->cache_key, $addressBook);
            return new AddressBookResource($addressBook);
        } catch (Exception $e) {
            return response()->json(['message' => $e->getMessage()]);
        }
    }

    public function update(int $id, AddressBookRequest $request)
    {
        DB::beginTransaction();
        try {
            $oabook = $this->cache->get_entity_id($this->cache_key, $id, AddressBookModel::class);
            if (!$oabook)
                throw new ModelNotFoundException("AddressBook with ID {$id} not found.");
            $nabook = $request->validated();
            $oabook->fill($nabook);
            $oabook->save();
            $this->cache->update_entity($this->cache_key, $id, $oabook);
            DB::commit();
            return new AddressBookResource($oabook);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json(['message' => $e->getMessage()]);
        }
    }

    public function destroy(int $id)
    {
        DB::beginTransaction();
        try {
            $abook = $this->cache->get_entity_id($this->cache_key, $id, AddressBookModel::class);
            if (!$abook)
                throw new ModelNotFoundException("Address Book with ID {$id} not found.");
            $abook->delete();
            $this->cache->delete_entity($this->cache_key, $id);
            DB::commit();
            return true;
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json(['message' => $e->getMessage()]);
        }
    }

    public function delete_address_books(Request $request)
    {
        DB::beginTransaction();
        try {
            $ids = $request->input('ids');
            if (!is_array($ids) || empty($ids)) {
                throw new ModelNotFoundException("No Address Book IDs provided.");
            }
            $abooks = AddressBookModel::whereIn('id', $ids)->get();
            if (count($abooks) !== count($ids)) {
                throw new ModelNotFoundException("Some address books not found.");
            }
            AddressBookModel::whereIn('id', $ids)->delete();
            $this->cache->delete_entities($this->cache_key, $ids);
            DB::commit();
            return true;
        } catch (Exception $e) {
            return response()->json(['message' => $e->getMessage()]);
        }
    }
}
