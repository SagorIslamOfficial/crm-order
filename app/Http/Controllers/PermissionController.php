<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePermissionRequest;
use App\Http\Requests\UpdatePermissionRequest;
use App\Repositories\PermissionRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;

class PermissionController extends Controller
{
    public function __construct(
        private readonly PermissionRepository $permissionRepository,
    ) {}

    public function index(Request $request)
    {
        $search = $request->query('search');

        $permissions = $this->permissionRepository->getPaginated(15)->through(function ($permission) {
            return $this->permissionRepository->getPermissionWithCounts($permission);
        });

        return Inertia::render('permissions/index', [
            'permissions' => $permissions,
            'search' => $search,
        ]);
    }

    public function create()
    {
        return Inertia::render('permissions/create');
    }

    public function store(StorePermissionRequest $request)
    {
        $permission = $this->permissionRepository->create([
            'name' => $request->name,
            'guard_name' => $request->guard_name,
        ]);

        return redirect()->route('permissions.index')
            ->with('message', 'Permission created successfully.');
    }

    public function show(Permission $permission)
    {
        return Inertia::render('permissions/show', [
            'permission' => $this->permissionRepository->getPermissionWithCounts($permission),
            'roles' => $permission->roles->map(function ($role) {
                return [
                    'id' => $role->id,
                    'name' => $role->name,
                ];
            }),
            'users' => $permission->users->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                ];
            }),
        ]);
    }

    public function edit(Permission $permission)
    {
        return Inertia::render('permissions/edit', [
            'permission' => [
                'id' => $permission->id,
                'name' => $permission->name,
                'guard_name' => $permission->guard_name,
            ],
        ]);
    }

    public function update(Permission $permission, UpdatePermissionRequest $request)
    {
        $this->permissionRepository->update($permission, [
            'name' => $request->name,
            'guard_name' => $request->guard_name,
        ]);

        return redirect()->route('permissions.index')
            ->with('message', 'Permission updated successfully.');
    }

    public function destroy(Permission $permission)
    {
        // Check if permission is assigned to any roles
        if ($permission->roles()->count() > 0) {
            return redirect()->route('permissions.index')
                ->withErrors(['error' => 'Cannot delete permission that is assigned to roles. Please remove from roles first.']);
        }

        // Check if permission is assigned to any users directly
        if ($permission->users()->count() > 0) {
            return redirect()->route('permissions.index')
                ->withErrors(['error' => 'Cannot delete permission that is assigned to users. Please remove from users first.']);
        }

        $this->permissionRepository->delete($permission);

        return redirect()->route('permissions.index')
            ->with('message', 'Permission deleted successfully.');
    }
}
