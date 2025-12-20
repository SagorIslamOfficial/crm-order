<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRoleRequest;
use App\Http\Requests\UpdateRoleRequest;
use App\Repositories\RoleRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    public function __construct(
        private readonly RoleRepository $roleRepository,
    ) {}

    public function index(Request $request)
    {
        $search = $request->query('search');

        $roles = $this->roleRepository->paginate(15)->through(function ($role) {
            return [
                'id' => $role->id,
                'name' => $role->name,
                'guard_name' => $role->guard_name,
                'permissions' => $role->permissions->pluck('name')->toArray(),
                'users_count' => $role->users_count ?? 0,
                'created_at' => $role->created_at->format('Y-m-d'),
            ];
        });

        $permissions = $this->roleRepository->getPermissions()->pluck('name')->toArray();

        return Inertia::render('roles/index', [
            'roles' => $roles,
            'search' => $search,
            'permissions' => $permissions,
        ]);
    }

    public function create()
    {
        $permissions = $this->roleRepository->getPermissions()->map(function ($permission) {
            return [
                'name' => $permission->name,
                'label' => ucwords(str_replace(['.', '-', '_'], ' ', $permission->name)),
            ];
        });

        return Inertia::render('roles/create', [
            'permissions' => $permissions,
        ]);
    }

    public function store(StoreRoleRequest $request)
    {
        $role = $this->roleRepository->create([
            'name' => $request->name,
            'guard_name' => $request->guard_name,
            'permissions' => $request->permissions ?? [],
        ]);

        return redirect()->route('roles.index')
            ->with('message', 'Role created successfully.');
    }

    public function show(Role $role)
    {
        return Inertia::render('roles/show', [
            'role' => [
                'id' => $role->id,
                'name' => $role->name,
                'guard_name' => $role->guard_name,
                'permissions' => $role->permissions->pluck('name')->toArray(),
                'users' => $role->users->map(function ($user) {
                    return [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                    ];
                }),
                'created_at' => $role->created_at->format('Y-m-d H:i:s'),
                'updated_at' => $role->updated_at->format('Y-m-d H:i:s'),
            ],
        ]);
    }

    public function edit(Role $role)
    {
        $permissions = $this->roleRepository->getPermissions()->map(function ($permission) {
            return [
                'name' => $permission->name,
                'label' => ucwords(str_replace(['.', '-', '_'], ' ', $permission->name)),
            ];
        });

        return Inertia::render('roles/edit', [
            'role' => [
                'id' => $role->id,
                'name' => $role->name,
                'guard_name' => $role->guard_name,
                'permissions' => $role->permissions->pluck('name')->toArray(),
            ],
            'permissions' => $permissions,
        ]);
    }

    public function update(Role $role, UpdateRoleRequest $request)
    {
        $this->roleRepository->update($role, [
            'name' => $request->name,
            'guard_name' => $request->guard_name,
            'permissions' => $request->permissions ?? [],
        ]);

        return redirect()->route('roles.index')
            ->with('message', 'Role updated successfully.');
    }

    public function destroy(Role $role)
    {
        // Prevent deletion of Administrator role
        if ($role->name === 'Administrator') {
            return redirect()->route('roles.index')
                ->withErrors(['error' => 'Cannot delete the Administrator role.']);
        }

        // Check if role has users assigned
        if ($role->users()->count() > 0) {
            return redirect()->route('roles.index')
                ->withErrors(['error' => 'Cannot delete role that has users assigned. Please reassign users first.']);
        }

        $this->roleRepository->delete($role);

        return redirect()->route('roles.index')
            ->with('message', 'Role deleted successfully.');
    }
}
