'use client';

import { Suspense, useState, useEffect } from 'react';
import { useAppPages } from '@/src/lib/hooks/app-page';
import { useUserRoles, useUpdateUserRolePermissions } from '@/src/lib/hooks/user-role';
import { Skeleton } from '@/src/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/src/components/ui/table';
import { Checkbox } from '@/src/components/ui/checkbox';
import { Button } from '@/src/components/ui/button';
import { toast } from 'sonner';
import { Save, RefreshCw } from 'lucide-react';
import { UserRole } from '@/src/types/user-role';

export const dynamic = 'force-dynamic';

export default function PermissionsPage() {
    return (
        <Suspense fallback={<Skeleton className="w-full h-96" />}>
            <PermissionsContent />
        </Suspense>
    );
}

function PermissionsContent() {
    const { data: pages, isLoading: isLoadingPages } = useAppPages();
    const { data: roles, isLoading: isLoadingRoles, refetch } = useUserRoles();
    const [localRoles, setLocalRoles] = useState<Record<string, UserRole>>({});
    const [hasChanges, setHasChanges] = useState(false);

    const { mutateAsync: updatePermissions, isPending } = useUpdateUserRolePermissions();

    useEffect(() => {
        if (roles) {
            const roleMap: Record<string, UserRole> = {};
            roles.forEach((r) => {
                roleMap[r.id] = { ...r, allowed_paths: [...(r.allowed_paths || [])] };
            });
            setLocalRoles(roleMap);
            setHasChanges(false);
        }
    }, [roles]);

    const handleCheckChange = (roleId: string, path: string, checked: boolean) => {
        setLocalRoles((prev) => {
            const currentRole = prev[roleId];
            if (!currentRole) return prev;

            let updatedPaths = [...(currentRole.allowed_paths || [])];
            if (checked && !updatedPaths.includes(path)) {
                updatedPaths.push(path);
            } else if (!checked && updatedPaths.includes(path)) {
                updatedPaths = updatedPaths.filter((p) => p !== path);
            }

            return {
                ...prev,
                [roleId]: {
                    ...currentRole,
                    allowed_paths: updatedPaths,
                },
            };
        });
        setHasChanges(true);
    };

    const handleSave = async () => {
        try {
            const updatePromises = Object.values(localRoles).map((role) => {
                const originalRole = roles?.find((r) => r.id === role.id);
                // Only send update if paths have actually changed
                const originalPaths = [...(originalRole?.allowed_paths || [])].sort().join(',');
                const newPaths = [...(role.allowed_paths || [])].sort().join(',');

                if (originalPaths !== newPaths) {
                    return updatePermissions({
                        id: role.id,
                        data: { allowed_paths: role.allowed_paths },
                    });
                }
                return Promise.resolve();
            });

            await Promise.all(updatePromises);
            toast.success('Permissions saved successfully');
            setHasChanges(false);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to save permissions');
        }
    };

    if (isLoadingPages || isLoadingRoles) {
        return (
            <div className="w-full flex flex-col gap-4">
                <Skeleton className="w-64 h-8" />
                <Skeleton className="w-full h-96" />
            </div>
        );
    }

    const roleList = Object.values(localRoles).sort((a, b) => a.role_name.localeCompare(b.role_name));

    return (
        <div className="w-full flex gap-4 flex-col">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl mb-2">Role Permissions</h1>
                    <p className="text-gray-500 text-sm">
                        Manage which roles have access to specific application pages. Changes take effect on the user's next login or token refresh.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={() => refetch()} title="Refresh Data">
                        <RefreshCw className="h-4 w-4" />
                    </Button>
                    <Button 
                        onClick={handleSave} 
                        disabled={!hasChanges || isPending}
                        className="gap-2"
                    >
                        <Save className="h-4 w-4" />
                        {isPending ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </div>

            <div className="overflow-hidden border bg-white">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead className="w-[300px] border-r">Application Page</TableHead>
                            {roleList.map((role) => (
                                <TableHead key={role.id} className="text-center border-r min-w-[120px]">
                                    <div className="text-slate-900">{role.role_name}</div>
                                    <div className="text-xs font-normal text-muted-foreground capitalize">
                                        Role
                                    </div>
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {pages?.map((page) => (
                            <TableRow key={page.id} className="hover:bg-slate-50/50">
                                <TableCell className="border-r">
                                    <div className="font-medium">{page.name}</div>
                                    <div className="text-xs text-muted-foreground font-mono mt-1">
                                        {page.path}
                                    </div>
                                    {page.description && (
                                        <div className="text-xs text-muted-foreground mt-1">
                                            {page.description}
                                        </div>
                                    )}
                                </TableCell>
                                {roleList.map((role) => {
                                    const isChecked = role.allowed_paths?.includes(page.path) || false;
                                    // Admins generally shouldn't have permissions unchecked for themselves,
                                    // but we allow it for the sake of standard UI unless heavily restricted.
                                    return (
                                        <TableCell key={`${page.id}-${role.id}`} className="text-center border-r align-middle">
                                            <div className="flex justify-center items-center py-2 h-full w-full">
                                                <Checkbox 
                                                    checked={isChecked}
                                                    onCheckedChange={(checked) => 
                                                        handleCheckChange(role.id, page.path, !!checked)
                                                    }
                                                    aria-label={`Allow ${role.role_name} to access ${page.name}`}
                                                    className="w-5 h-5"
                                                />
                                            </div>
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        ))}
                        {(!pages || pages.length === 0) && (
                            <TableRow>
                                <TableCell colSpan={roleList.length + 1} className="text-center h-24">
                                    No app pages found. Please create app pages first.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
