'use client';

import { Button } from '@/src/components/ui/button';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/src/components/ui/form';
import { Input } from '@/src/components/ui/input';
import { Textarea } from '@/src/components/ui/textarea';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/src/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { useProductDetails, useUpdateProduct } from '@/src/lib/hooks/product/product-manage';
import { Control, useFieldArray, useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import { createProductSchema, type CreateProductSchema } from '../../../schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useParams } from 'next/navigation';
import { Plus, Trash, X } from 'lucide-react';
import { useEffect } from 'react';
import { handleApiError } from '@/src/lib/api-utils';

export default function EditProductPage() {
    const router = useRouter();
    const params = useParams();
    const productId = params.id as string;

    const form = useForm<CreateProductSchema>({
        resolver: zodResolver(createProductSchema) as any,
        defaultValues: {
            name: '',
            description: '',
            product_category_id: '',
            is_active: true,
            images: [],
            variations: [],
            items: [],
        },
    });

    const { control, handleSubmit } = form;

    const {
        fields: variationFields,
        append: appendVariation,
        remove: removeVariation,
    } = useFieldArray({
        control,
        name: 'variations',
    });

    const { fields: itemFields, replace: replaceItems } = useFieldArray({
        control,
        name: 'items',
    });

    // Fetch product data
    const { data: product, isLoading: loadProduct } = useProductDetails(productId);

    // Populate form when data arrives
    useEffect(() => {
        if (product) {
            // Map variations: backend (variation_name) -> schema (name)
            const mappedVariations =
                product.variations?.map((v) => ({
                    name: v.variation_name,
                    options: v.options.map((o) => ({ value: o.value })),
                })) || [];

            // Map items: backend (nested configurations) -> schema (flat configurations)
            const mappedItems =
                product.items?.map((item) => ({
                    sku: item.sku,
                    price: item.price,
                    qty_in_stock: item.qty_in_stock,
                    configurations: item.configurations.map((c) => ({
                        variation_name: c.product_variation_option.variation.variation_name,
                        option_value: c.product_variation_option.value,
                    })),
                })) || [];

            form.reset({
                name: product.name,
                description: product.description,
                product_category_id: product.product_category_id,
                is_active: product.is_active,
                variations: mappedVariations,
                items: mappedItems,
                // Map images if necessary, currently assuming structure matches but verifying type
                images: product.images?.map((img) => img.image_url) || [],
            });
        }
    }, [product, form]);

    const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct(productId, {
        onSuccess: () => {
            toast.success('Product updated.');
            router.push(`/products/manage/${productId}`);
        },
        onError: (error: any) => {
            handleApiError(error, 'Failed to update product');
        },
    });

    const handleUpdate = (data: CreateProductSchema) => {
        updateProduct(data);
    };

    const variations = useWatch({
        control,
        name: 'variations',
    });

    // Logic to generate items from variations
    const handleGenerateItems = () => {
        if (!variations || variations.length === 0) return;

        // Filter out variations without name or options
        const validVariations = variations.filter(
            (v) => v.name && v.options && v.options.length > 0,
        );

        if (validVariations.length === 0) {
            toast.error('Please add valid variations with options');
            return;
        }

        // Generate cartesian product of options
        const cartesian = (args: any[]): any[][] => {
            const r: any[][] = [];
            const max = args.length - 1;
            function helper(arr: any[], i: number) {
                for (let j = 0, l = args[i].length; j < l; j++) {
                    const a = arr.slice(0); // clone arr
                    a.push(args[i][j]);
                    if (i === max) r.push(a);
                    else helper(a, i + 1);
                }
            }
            helper([], 0);
            return r;
        };

        const optionsLists = validVariations.map((v) =>
            v.options.map((o) => ({
                variation_name: v.name,
                option_value: o.value,
            })),
        );

        const combinations = cartesian(optionsLists);

        const newItems = combinations.map((combo) => {
            // combo is array of { variation_name, option_value }
            // Generate a SKU hint
            const skuHint = combo
                .map((c: any) => c.option_value.toUpperCase().substring(0, 3))
                .join('-');

            return {
                sku: skuHint,
                price: 0,
                qty_in_stock: 0,
                configurations: combo,
            };
        });

        replaceItems(newItems);
    };

    if (loadProduct) return <p>Loading...</p>;

    return (
        <main className="max-w-4xl mx-auto pb-20">
            <h1 className="text-2xl font-bold mb-6">Edit Product</h1>

            <Form {...form}>
                <form onSubmit={handleSubmit(handleUpdate)} className="flex flex-col gap-6">
                    {/* Basic Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            <FormField
                                control={control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Product Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. UltraBook Pro X1" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={control}
                                name="product_category_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Category ID</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Category UUID" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            UUID of the product category
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Product description..."
                                                className="resize-none h-24"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    {/* Variations */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Variations</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            {variationFields.map((field, index) => (
                                <VariationRow
                                    key={field.id}
                                    index={index}
                                    control={control}
                                    remove={() => removeVariation(index)}
                                />
                            ))}

                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="w-fit"
                                onClick={() => appendVariation({ name: '', options: [] })}
                            >
                                <Plus className="w-4 h-4 mr-2" /> Add Variation
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Items / Configurations */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Items & Configurations</CardTitle>
                            <Button type="button" size="sm" onClick={handleGenerateItems}>
                                Generate Items
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {itemFields.length > 0 ? (
                                <div className="border ">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Configuration</TableHead>
                                                <TableHead>SKU</TableHead>
                                                <TableHead>Price</TableHead>
                                                <TableHead>Stock</TableHead>
                                                <TableHead className="w-[50px]"></TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {itemFields.map((field, index) => {
                                                const description = form
                                                    .getValues(`items.${index}.configurations`)
                                                    ?.map(
                                                        (c) =>
                                                            `${c.variation_name}: ${c.option_value}`,
                                                    )
                                                    .join(', ');

                                                return (
                                                    <TableRow key={field.id}>
                                                        <TableCell className="text-sm text-neutral-500">
                                                            {description || 'Default'}
                                                        </TableCell>
                                                        <TableCell>
                                                            <FormField
                                                                control={control}
                                                                name={`items.${index}.sku`}
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormControl>
                                                                            <Input
                                                                                className="h-8 w-[150px]"
                                                                                {...field}
                                                                            />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <FormField
                                                                control={control}
                                                                name={`items.${index}.price`}
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormControl>
                                                                            <Input
                                                                                type="number"
                                                                                className="h-8 w-[120px]"
                                                                                {...field}
                                                                                onChange={(e) =>
                                                                                    field.onChange(
                                                                                        e.target
                                                                                            .valueAsNumber,
                                                                                    )
                                                                                }
                                                                            />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <FormField
                                                                control={control}
                                                                name={`items.${index}.qty_in_stock`}
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormControl>
                                                                            <Input
                                                                                type="number"
                                                                                className="h-8 w-[100px]"
                                                                                {...field}
                                                                                onChange={(e) =>
                                                                                    field.onChange(
                                                                                        e.target
                                                                                            .valueAsNumber,
                                                                                    )
                                                                                }
                                                                            />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            {/* Allow removing individual items? Maybe. */}
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </div>
                            ) : (
                                <div className="text-center py-8 text-neutral-500">
                                    No items generated. Add variations and click "Generate Items".
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <div className="flex justify-end">
                        <Button type="submit" size="lg" disabled={isUpdating}>
                            {isUpdating ? 'Updating...' : 'Update Product'}
                        </Button>
                    </div>
                </form>
            </Form>
        </main>
    );
}

function VariationRow({
    index,
    control,
    remove,
}: {
    index: number;
    control: Control<CreateProductSchema>;
    remove: () => void;
}) {
    const {
        fields,
        append,
        remove: removeOption,
    } = useFieldArray({
        control,
        name: `variations.${index}.options`,
    });

    return (
        <div className="border p-4  space-y-4 bg-gray-50/50">
            <div className="flex items-center justify-between">
                <FormField
                    control={control}
                    name={`variations.${index}.name`}
                    render={({ field }) => (
                        <FormItem className="flex-1 mr-4">
                            <FormLabel>Variation Name</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. Color, Size" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button variant="ghost" size="icon" onClick={remove} type="button">
                    <Trash className="w-4 h-4 text-red-500" />
                </Button>
            </div>

            <div className="space-y-2">
                <FormLabel>Options</FormLabel>
                <div className="flex flex-wrap gap-2">
                    {fields.map((optionField, optionIndex) => (
                        <div key={optionField.id} className="flex items-center gap-1">
                            <FormField
                                control={control}
                                name={`variations.${index}.options.${optionIndex}.value`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    className="h-8 w-[120px] pr-8"
                                                    placeholder="Value"
                                                    {...field}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeOption(optionIndex)}
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-red-500"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    ))}
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8"
                        onClick={() => append({ value: '' })}
                    >
                        <Plus className="w-3 h-3 mr-1" /> Add Option
                    </Button>
                </div>
            </div>
        </div>
    );
}
