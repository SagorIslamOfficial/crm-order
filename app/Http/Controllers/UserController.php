<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\User;
use App\Repositories\UserRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class UserController extends Controller
{
    public function __construct(
        private readonly UserRepository $userRepository,
    ) {}

    public function index(Request $request)
    {
        $search = $request->query('search');

        $users = $this->userRepository->searchAndPaginate($search, 15)->through(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'roles' => $user->roles->pluck('name')->toArray(),
                'created_at' => $user->created_at->format('Y-m-d'),
                'email_verified_at' => $user->email_verified_at?->format('Y-m-d'),
            ];
        });

        $roles = $this->userRepository->getRoles()->pluck('name')->toArray();

        return Inertia::render('users/index', [
            'users' => $users,
            'search' => $search,
            'roles' => $roles,
        ]);
    }

    public function create()
    {
        $roles = $this->userRepository->getRoles()
            ->where('name', '!=', 'administrator')
            ->map(function ($role) {
                return [
                    'name' => $role->name,
                    'label' => ucwords(str_replace('_', ' ', $role->name)),
                ];
            });

        return Inertia::render('users/create', [
            'roles' => $roles,
        ]);
    }

    public function store(StoreUserRequest $request)
    {
        $user = $this->userRepository->create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
        ]);

        // Filter out administrator role to prevent assignment
        $roles = array_filter($request->roles, fn ($role) => $role !== 'administrator');
        $this->userRepository->syncRoles($user, $roles);

        return redirect()->route('users.index')
            ->with('message', 'User created successfully.');
    }

    public function show(User $user)
    {
        $roles = $this->userRepository->getRoles()
            ->where('name', '!=', 'administrator')
            ->map(function ($role) {
                return [
                    'name' => $role->name,
                    'label' => ucwords(str_replace('_', ' ', $role->name)),
                    'permissions_count' => $role->permissions->count(),
                ];
            });

        return Inertia::render('users/show', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'roles' => $user->roles->pluck('name')->toArray(),
                'created_at' => $user->created_at->format('Y-m-d H:i:s'),
                'updated_at' => $user->updated_at->format('Y-m-d H:i:s'),
                'email_verified_at' => $user->email_verified_at?->format('Y-m-d H:i:s'),
            ],
            'available_roles' => $roles,
        ]);
    }

    public function edit(User $user)
    {
        $roles = $this->userRepository->getRoles()
            ->where('name', '!=', 'administrator')
            ->map(function ($role) {
                return [
                    'name' => $role->name,
                    'label' => ucwords(str_replace('_', ' ', $role->name)),
                    'permissions' => $role->permissions->pluck('name')->toArray(),
                ];
            });

        return Inertia::render('users/edit', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'roles' => $user->roles->pluck('name')->toArray(),
            ],
            'roles' => $roles,
        ]);
    }

    public function update(User $user, UpdateUserRequest $request)
    {
        $updateData = [
            'name' => $request->name,
            'email' => $request->email,
        ];

        // Only update password if provided
        if ($request->filled('password')) {
            $updateData['password'] = bcrypt($request->password);
        }

        $this->userRepository->update($user, $updateData);

        // Filter out administrator role to prevent assignment
        $roles = array_filter($request->roles, fn ($role) => $role !== 'administrator');
        $this->userRepository->syncRoles($user, $roles);

        return redirect()->route('users.index')
            ->with('message', 'User updated successfully.');
    }

    public function destroy(User $user)
    {
        // Prevent deleting own account
        if ($user->id === Auth::id()) {
            return redirect()->route('users.index')
                ->withErrors(['error' => 'You cannot delete your own account.']);
        }

        $this->userRepository->delete($user);

        return redirect()->route('users.index')
            ->with('message', 'User deleted successfully.');
    }

    public function assignRole(User $user, string $roleName)
    {
        // Prevent assigning Administrator role to anyone
        if ($roleName === 'administrator') {
            return back()->withErrors(['error' => 'Cannot assign the Administrator role.']);
        }

        if (! $user->hasRole($roleName)) {
            $user->assignRole($roleName);
        }

        return back()->with('message', 'Role assigned successfully.');
    }

    public function removeRole(User $user, string $roleName)
    {
        // Prevent removing Administrator role from anyone
        if ($roleName === 'administrator') {
            return back()->withErrors(['error' => 'Cannot remove the Administrator role.']);
        }

        if ($user->hasRole($roleName)) {
            $user->removeRole($roleName);
        }

        return redirect()->back()
            ->with('message', 'Role removed successfully.');
    }
}
