import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { usePermissions } from '@/hooks/usePermissions';
import modules, { type ModuleItem } from '@/lib/modules';
import { resolveUrl } from '@/lib/utils';
import { Link, usePage } from '@inertiajs/react';
import { useMemo } from 'react';

interface GroupedModules {
    name: string;
    items: ModuleItem[];
}

export function NavMain() {
    const page = usePage();
    const { hasPermission, isAdmin } = usePermissions();

    // Group and filter modules by permissions
    const groupedModules = useMemo(() => {
        const groups: Record<string, ModuleItem[]> = {};

        modules.forEach((module) => {
            // Always show external resources
            if (module.isExternal) {
                if (!groups['Resources']) {
                    groups['Resources'] = [];
                }
                groups['Resources'].push(module);
                return;
            }

            // Check permissions for non-external modules
            if (module.permission) {
                const permissions = Array.isArray(module.permission)
                    ? module.permission
                    : [module.permission];

                if (!permissions.some((p) => hasPermission(p)) && !isAdmin()) {
                    return; // Skip if user doesn't have permission
                }
            }

            // Group the module
            if (!groups[module.group]) {
                groups[module.group] = [];
            }
            groups[module.group].push(module);
        });

        // Sort groups by minimum order of their items, then sort items within groups
        return Object.entries(groups)
            .sort((a, b) => {
                const orderA = Math.min(...a[1].map((m) => m.order));
                const orderB = Math.min(...b[1].map((m) => m.order));
                return orderA - orderB;
            })
            .map(([groupName, items]) => ({
                name: groupName,
                items: items.sort((a, b) => a.order - b.order),
            })) as GroupedModules[];
    }, [hasPermission, isAdmin]);

    return (
        <>
            {groupedModules.map((group) => (
                <SidebarGroup key={group.name} className="px-2 py-0">
                    <SidebarGroupLabel>{group.name}</SidebarGroupLabel>
                    <SidebarMenu>
                        {group.items.map((item) => (
                            <SidebarMenuItem key={item.id}>
                                <SidebarMenuButton
                                    asChild
                                    isActive={page.url.startsWith(
                                        resolveUrl(item.route().url),
                                    )}
                                    tooltip={{ children: item.title }}
                                >
                                    {item.isExternal ? (
                                        <a
                                            href={item.route().url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {item.icon && <item.icon />}
                                            <span>{item.title}</span>
                                        </a>
                                    ) : (
                                        <Link href={item.route().url} prefetch>
                                            {item.icon && <item.icon />}
                                            <span>{item.title}</span>
                                        </Link>
                                    )}
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            ))}
        </>
    );
}
