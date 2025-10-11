<?php

namespace App\Http\Controllers;

use App\Http\Requests\DriverRequest;
use App\Http\Requests\UserRequest;
use App\Http\Resources\DriverResource;
use App\Models\Company;
use App\Models\Driver;
use App\Models\User;
use App\Models\DriverDocument;
use App\Services\MemCache;
use DB;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

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
                $this->create_driver_docs($driver, $documents);
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
            if (empty($documents)) {
                $paths = $odriver->driver_documents()->pluck('file_path')->toArray();
                $this->remove_paths($paths);
                $odriver->driver_documents()->delete();
            } else {
                $this->update_driver_docs($odriver, $documents);
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
            $driver = $this->cache->get_entity_id($this->cache_key, $id, Driver::class, ['driver_documents', 'company']);
            if (!$driver)
                throw new ModelNotFoundException("driver with ID {$id} not found.");
            $paths = $driver->driver_documents()->pluck('file_path')->toArray();
            $this->remove_paths($paths);
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
            $drivers = $this->cache->get_entities_by_ids($this->cache_key, $ids, Driver::class, ['driver_documents', 'company']);
            if (count($drivers) !== count($ids)) {
                throw new ModelNotFoundException("Some drivers not found.");
            }
            $dd_paths = array_reduce($drivers->all(), function ($acc, $curr) {
                $ddps = $curr->driver_documents()->pluck('file_path')->toArray();
                if (!empty($ddps)) {
                    $acc = array_merge($acc, $ddps);
                }
                return $acc;
            }, []);
            Driver::whereIn('id', $ids)->delete();
            $this->remove_paths($dd_paths);
            $this->cache->delete_entities($this->cache_key, $ids);
            DB::commit();
            return true;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function download_file(int $id)
    {
        try {
            $driver_doc = DriverDocument::findOrFail($id);
            if (!$driver_doc)
                throw new ModelNotFoundException('Driver document not found');
            $file_path = $driver_doc->file_path;
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

    public function create_driver_docs($driver, array $documents)
    {
        $docs_insert = [];
        foreach ($documents as $doc) {
            $folder = 'driver_documents/' . $driver->id;
            if (isset($doc['file']) && $doc['file'] instanceof \Illuminate\Http\UploadedFile) {
                $path = $doc['file']->store($folder, 'public');
                $docs_insert[] = [
                    'type' => $doc['type'],
                    'file_path' => $path,
                    'expiry_date' => $doc['expiry_date'],
                    'fname' => $doc['fname'],
                    'fsize' => $doc['fsize'],
                    'driver_id' => $driver->id
                ];
            }
        }
        $driver->driver_documents()->createMany($docs_insert);
    }

    public function update_driver_docs($odriver, array $ndocs)
    {
        try {
            $odocIds = $odriver->driver_documents()->pluck('id');
            $doc_diff = $this->get_diff_old_new($odocIds, $ndocs);
            if (count($doc_diff) > 0) {
                $paths = $odriver->driver_documents()->whereIn('id', $doc_diff)->pluck('file_path')->toArray();
                $this->remove_paths($paths);
                $odriver->driver_documents()->whereIn('id', $doc_diff)->delete();
            }
            if (!empty($ndocs)) {
                foreach ($ndocs as $ndoc) {
                    if (isset($ndoc['id']) && isset($ndoc['file_path'])) {
                        $odriver->driver_documents()->updateOrCreate(
                            ['id' => $ndoc['id']],
                            [
                                'type' => $ndoc['type'],
                                'file_path' => $ndoc['file_path'],
                                'expiry_date' => $ndoc['expiry_date'],
                                'fname' => $ndoc['fname'],
                                'fsize' => $ndoc['fsize'],
                                'driver_id' => $odriver->id
                            ]
                        );
                    } else {
                        $folder = 'driver_documents/' . $odriver->id;
                        if (isset($ndoc['file']) && $ndoc['file'] instanceof \Illuminate\Http\UploadedFile) {
                            $path = $ndoc['file']->store($folder, 'public');
                            $odriver->driver_documents()->create(
                                [
                                    'type' => $ndoc['type'],
                                    'file_path' => $path,
                                    'expiry_date' => $ndoc['expiry_date'],
                                    'fname' => $ndoc['fname'],
                                    'fsize' => $ndoc['fsize'],
                                    'driver_id' => $odriver->id
                                ]
                            );
                        }
                    }
                }
            }
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function get_diff_old_new($odocs, $ndocs)
    {
        $ndocIds = collect($ndocs)->filter(function ($doc) {
            return isset($doc['id']);
        })
            ->map(function ($doc) {
                return (int) $doc['id'];
            });

        return array_diff($odocs->toArray(), $ndocIds->toArray());
    }

    public function remove_path($path)
    {
        if (Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }
    }

    public function remove_paths(array $paths)
    {
        $existing = array_filter($paths, fn($path) => Storage::disk('public')->exists($path));

        if (!empty($existing)) {
            Storage::disk('public')->delete($existing);
        }
    }

    public function create_login(int $did, UserRequest $request)
    {
        DB::beginTransaction();
        try {
            $driver = $this->cache->get_entity_id($this->cache_key, $did, Driver::class, ['driver_documents', 'company']);
            if (!$driver) {
                throw new ModelNotFoundException('Driver not found', 404);
            }
            $data = $request->validated();
            $user = User::create([
                'name' => $data['name'],
                'username' => $data['username'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
                'type' => $data['type'],
            ]);
            $driver->user_id = $user->id;
            $driver->save();
            DB::commit();
            $this->cache->update_entity($this->cache_key, $did, $driver);
            $this->cache->save_entity('users', $user->load(['roles.permissions', 'roles.widgets']));
            return new DriverResource($driver);
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
