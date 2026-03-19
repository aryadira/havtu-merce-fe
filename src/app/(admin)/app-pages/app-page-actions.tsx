import { Fragment, useState } from 'react';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/src/components/ui/dropdown-menu';
import { useDeleteAppPage, useUpdateAppPage } from '@/src/lib/hooks/app-page/app-page';
import { toast } from 'sonner';
import { AppPage } from '@/src/types/app-page';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/src/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/src/components/ui/form';
import { Input } from '@/src/components/ui/input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const formSchema = z.object({
    path: z.string().min(1, 'Path is required'),
    name: z.string().min(1, 'Name is required'),
    description: z.string().optional(),
});

export const AppPageActions = ({ page }: { page: AppPage }) => {
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);

    const { mutate: deletePage, isPending: isDeleting } = useDeleteAppPage({
        onSuccess: () => {
            toast.success('App page deleted successfully');
        },
        onError: (e: any) => {
            toast.error(e.response?.data?.message || 'Failed to delete app page');
        },
    });

    const { mutate: updatePage, isPending: isUpdating } = useUpdateAppPage({
        onSuccess: () => {
            toast.success('App page updated successfully');
            setIsEditOpen(false);
        },
        onError: (e: any) => {
            toast.error(e.response?.data?.message || 'Failed to update app page');
        },
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            path: page.path,
            name: page.name,
            description: page.description || '',
        },
    });

    const onEditSubmit = (values: z.infer<typeof formSchema>) => {
        updatePage({ id: page.id, data: values });
    };

    return (
        <Fragment>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem
                        onClick={() => navigator.clipboard.writeText(page.id)}
                    >
                        Copy ID
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
                        Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="text-red-600 focus:bg-red-50"
                        onClick={() => setIsDeleteOpen(true)}
                    >
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit App Page</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onEditSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="path"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Path (URL Endpoint)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="/dashboard" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Page Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Dashboard" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description (Optional)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Main dashboard for admin" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex justify-end gap-2 pt-4">
                                <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isUpdating}>
                                    {isUpdating ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            {isDeleteOpen && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-md w-[400px]">
                        <h3 className="text-lg font-bold mb-2">Are you sure?</h3>
                        <p className="mb-4">This action cannot be undone.</p>
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
                                Cancel
                            </Button>
                            <Button 
                                variant="destructive" 
                                onClick={() => {
                                    deletePage(page.id);
                                    setIsDeleteOpen(false);
                                }}
                                disabled={isDeleting}
                            >
                                {isDeleting ? 'Deleting...' : 'Delete'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </Fragment>
    );
};
