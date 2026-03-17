'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMe } from '@/src/lib/hooks/auth';
import {
    User as UserIcon,
    Mail as MailIcon,
    Phone as PhoneIcon,
    MapPin as MapPinIcon,
    Shield as ShieldIcon,
    Calendar as CalendarIcon,
    CreditCardIcon,
} from 'lucide-react';

import { PageLoader } from '@/src/components/ui/page-loader';

import { Avatar, AvatarFallback, AvatarImage } from '@/src/components/ui/avatar';
import { Button } from '@/src/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { Label } from '@/src/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/tabs';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/src/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/src/components/ui/select';
import { useForm } from 'react-hook-form';
import {
    profileSchema,
    UserGender,
    type ProfileSchema,
    addressSchema,
    type AddressSchema,
    paymentMethodSchema,
    type PaymentMethodSchema,
} from './schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/src/components/ui/input';
import { Textarea } from '@/src/components/ui/textarea';
import { useUpdateUser, useProfile, useCreateAddress } from '@/src/lib/hooks/user/user';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from '@/src/components/ui/dialog';
import { Checkbox } from '@/src/components/ui/checkbox';
import {
    useCreatePaymentMethod,
    useUserPaymentMethods,
} from '@/src/lib/hooks/user/user-payment-method';
import { useBanks } from '@/src/lib/hooks/bank/bank';
import { usePaymentTypes } from '@/src/lib/hooks/payment-type/payment-type';

export default function ProfilePage() {
    return (
        <Suspense fallback={<PageLoader message="Memuat profil..." />}>
            <ProfilePageContent />
        </Suspense>
    );
}

function ProfilePageContent() {
    const { data: user, isLoading } = useProfile();
    const { data: payment_methods } = useUserPaymentMethods();
    const { data: banks } = useBanks();
    const { data: paymentTypes } = usePaymentTypes();

    const { mutate: updateUser, isPending } = useUpdateUser();

    const [isEditing, setIsEditing] = useState(false);

    console.log(paymentTypes);
    console.log(banks);

    const form = useForm<ProfileSchema>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            fullname: '',
            username: '',
            phone_number: '',
            email: '',
            gender: UserGender.PREFER_NOT_TO_SAY,
            birthdate: '',
            avatar: '',
        },
    });

    useEffect(() => {
        if (user) {
            const userGender = user.profile?.gender as string | undefined;
            let normalizedGender = UserGender.PREFER_NOT_TO_SAY;

            if (userGender) {
                const lowerUserId = userGender.toLowerCase();
                if (lowerUserId === 'prefer not to say' || lowerUserId === 'prefer-not-to-say') {
                    normalizedGender = UserGender.PREFER_NOT_TO_SAY;
                } else if (Object.values(UserGender).includes(lowerUserId as UserGender)) {
                    normalizedGender = lowerUserId as UserGender;
                }
            }

            form.reset({
                fullname: user.profile?.fullname || '',
                username: user.username || '',
                phone_number: user.profile?.phone_number || '',
                email: user.email || '',
                gender: normalizedGender,
                birthdate: user.profile?.birthdate
                    ? new Date(user.profile.birthdate).toISOString().split('T')[0]
                    : '',
                avatar: user.profile?.avatar || '',
            });
        }
    }, [user, form]);

    const getInitials = (name?: string) => {
        return (name || 'User')
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const { mutate: createAddress, isPending: isAddingAddress } = useCreateAddress({
        onSuccess: () => {
            toast.success('Address added successfully');
            setIsAddAddressOpen(false);
            addressForm.reset();
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to add address');
        },
    });

    const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
    const addressForm = useForm<AddressSchema>({
        resolver: zodResolver(addressSchema),
        defaultValues: {
            address: '',
            city: '',
            province: '',
            postal_code: '',
            country: 'Indonesia',
            is_default: false,
        },
    });

    const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);
    const paymentForm = useForm<PaymentMethodSchema>({
        resolver: zodResolver(paymentMethodSchema),
        defaultValues: {
            payment_type_id: '',
            bank_id: '',
            provider: '',
            account_number: '',
            account_holder: '',
            description: '',
        },
    });

    const { mutate: createPaymentMethod, isPending: isAddingPayment } = useCreatePaymentMethod({
        onSuccess: () => {
            toast.success('Payment method added successfully');
            setIsAddPaymentOpen(false);
            paymentForm.reset();
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to add payment method');
        },
    });

    const handleUpdateProfile = async () => {
        if (!user) return;
        try {
            const formData = form.getValues();
            updateUser({ id: user.id, data: formData });
            setIsEditing(false);
            toast.success('Profile updated successfully');
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    const handleAddAddress = (data: AddressSchema) => {
        createAddress(data);
    };

    const handleAddPayment = (data: PaymentMethodSchema) => {
        createPaymentMethod(data);
    };

    if (isLoading) {
        return <PageLoader message="Memuat profil..." />;
    }

    if (!user) {
        return (
            <div className="container mx-auto py-20 text-center">
                <p className="text-muted-foreground">User profile not found. Please log in.</p>
                <Button className="mt-4" variant="outline">
                    Back to Home
                </Button>
            </div>
        );
    }

    const profile = user.profile || {};
    const addresses = (profile as any).addresses || [];
    const paymentMethods = payment_methods || [];
    const createdAt = (user as any).createdAt;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: 'spring',
                stiffness: 100,
                damping: 20,
            } as const,
        },
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="max-w-5xl min-h-screen pb-20"
        >
            {/* Header Section */}
            <motion.div
                variants={itemVariants}
                className="bg-background border-b border-border/40 pb-8 pt-10"
            >
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
                        <div className="relative group">
                            <Avatar className="w-32 h-32 border-4 border-background ring-2 ring-border/20">
                                <AvatarImage src={(profile as any).avatar} alt={profile.fullname} />
                                <AvatarFallback className="text-3xl font-bold bg-primary/10 text-primary">
                                    {getInitials(profile.fullname)}
                                </AvatarFallback>
                            </Avatar>
                            <div
                                className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 rounded-full border-2 border-white ring-1 ring-green-200"
                                title="Active"
                            />
                        </div>

                        <div className="flex-1 text-center md:text-left space-y-2 mb-2">
                            <div className="flex items-center justify-center md:justify-start gap-3">
                                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                                    {profile.fullname}
                                </h1>
                            </div>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2 capitalize">
                                    <UserIcon className="w-4 h-4" />
                                    {user.role_slug || 'User'}
                                </div>
                                <span className="flex items-center gap-1.5">
                                    <MailIcon className="w-4 h-4" />
                                    {user.email}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <PhoneIcon className="w-4 h-4" />
                                    {profile.phone_number || 'No phone'}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <CalendarIcon className="w-4 h-4" />
                                    Joined {formatDate(createdAt)}
                                </span>
                            </div>
                        </div>

                        <div className="flex gap-2 mt-4 md:mt-0 relative min-w-[120px] justify-end">
                            <AnimatePresence mode="wait">
                                {!isEditing ? (
                                    <motion.div
                                        key="edit-btn"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Button
                                            onClick={() => setIsEditing(true)}
                                            variant="outline"
                                        >
                                            Edit Profile
                                        </Button>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="actions-btn"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.2 }}
                                        className="flex gap-2"
                                    >
                                        <Button
                                            onClick={() => setIsEditing(false)}
                                            variant="outline"
                                        >
                                            Cancel
                                        </Button>
                                        <Button onClick={handleUpdateProfile} disabled={isPending}>
                                            {isPending ? 'Saving...' : 'Save'}
                                        </Button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Main Content */}
            <motion.div variants={itemVariants} className="container mx-auto px-4 max-w-6xl mt-8">
                <Tabs defaultValue="overview" className="flex flex-col md:flex-row gap-8">
                    <aside className="w-full md:w-64  space-y-2">
                        <TabsList className="flex flex-row md:flex-col h-auto w-full bg-transparent p-0 gap-1 text-left items-stretch overflow-x-auto md:overflow-visible">
                            <TabsTrigger
                                value="overview"
                                className="justify-start cursor-pointer px-4 py-2.5 h-auto text-sm font-medium data-[state=active]:bg-background data-[state=active]:text-primary transition-all ease-in-out border border-transparent data-[state=active]:border-border"
                            >
                                <UserIcon className="w-4 h-4 mr-2" />
                                Overview
                            </TabsTrigger>
                            <TabsTrigger
                                value="addresses"
                                className="justify-start cursor-pointer px-4 py-2.5 h-auto text-sm font-medium data-[state=active]:bg-background data-[state=active]:text-primary transition-all ease-in-out border border-transparent data-[state=active]:border-border"
                            >
                                <MapPinIcon className="w-4 h-4 mr-2" />
                                Address Book
                            </TabsTrigger>
                            <TabsTrigger
                                value="payment-method"
                                className="justify-start cursor-pointer px-4 py-2.5 h-auto text-sm font-medium data-[state=active]:bg-background data-[state=active]:text-primary transition-all ease-in-out border border-transparent data-[state=active]:border-border"
                            >
                                <CreditCardIcon className="w-4 h-4 mr-2" />
                                Payment Method
                            </TabsTrigger>
                            <TabsTrigger
                                value="security"
                                className="justify-start cursor-pointer px-4 py-2.5 h-auto text-sm font-medium data-[state=active]:bg-background data-[state=active]:text-primary transition-all ease-in-out border border-transparent data-[state=active]:border-border"
                            >
                                <ShieldIcon className="w-4 h-4 mr-2" />
                                Security
                            </TabsTrigger>
                        </TabsList>
                    </aside>

                    <div className="w-5xl flex-1 space-y-6">
                        <TabsContent value="overview" className="mt-0 space-y-6">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, ease: 'easeOut' }}
                                className="space-y-6"
                            >
                                <Card className="border-border/60 overflow-hidden">
                                    <CardHeader>
                                        <CardTitle>Personal Information</CardTitle>
                                        <CardDescription>
                                            Manage your personal details and public profile info.
                                        </CardDescription>
                                    </CardHeader>
                                    <Form {...form}>
                                        <form>
                                            <CardContent className="space-y-6">
                                                <motion.div
                                                    animate={{
                                                        backgroundColor: isEditing
                                                            ? 'var(--muted-foreground-opacity-5)'
                                                            : 'transparent',
                                                        opacity: isEditing ? 1 : 0.9,
                                                    }}
                                                    transition={{ duration: 0.3 }}
                                                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                                                >
                                                    <div className="space-y-2">
                                                        <FormField
                                                            control={form.control}
                                                            name="fullname"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>Full Name</FormLabel>
                                                                    <FormControl>
                                                                        <Input
                                                                            {...field}
                                                                            type="text"
                                                                            placeholder="Ubah nama lengkap"
                                                                            disabled={!isEditing}
                                                                            className="transition-all duration-300"
                                                                        />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <FormField
                                                            control={form.control}
                                                            name="username"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>Username</FormLabel>
                                                                    <FormControl>
                                                                        <Input
                                                                            {...field}
                                                                            type="text"
                                                                            placeholder="Ubah username"
                                                                            disabled={!isEditing}
                                                                            className="transition-all duration-300"
                                                                        />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <FormField
                                                            control={form.control}
                                                            name="email"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>
                                                                        Email Address
                                                                    </FormLabel>
                                                                    <FormControl>
                                                                        <Input
                                                                            {...field}
                                                                            type="email"
                                                                            placeholder="Ubah email"
                                                                            disabled={!isEditing}
                                                                            className="transition-all duration-300"
                                                                        />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <FormField
                                                            control={form.control}
                                                            name="phone_number"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>
                                                                        Phone Number
                                                                    </FormLabel>
                                                                    <FormControl>
                                                                        <Input
                                                                            {...field}
                                                                            type="tel"
                                                                            placeholder="Ubah nomor telepon"
                                                                            disabled={!isEditing}
                                                                            className="transition-all duration-300"
                                                                        />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <FormField
                                                            control={form.control}
                                                            name="birthdate"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>Birthdate</FormLabel>
                                                                    <FormControl>
                                                                        <Input
                                                                            {...field}
                                                                            type="date"
                                                                            placeholder="Ubah tanggal lahir"
                                                                            disabled={!isEditing}
                                                                            className="transition-all duration-300"
                                                                        />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <FormField
                                                            control={form.control}
                                                            name="gender"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>Gender</FormLabel>
                                                                    <Select
                                                                        disabled={!isEditing}
                                                                        onValueChange={
                                                                            field.onChange
                                                                        }
                                                                        value={
                                                                            isEditing
                                                                                ? field.value
                                                                                : user.profile
                                                                                      .gender
                                                                        }
                                                                    >
                                                                        <FormControl>
                                                                            <SelectTrigger className="transition-all duration-300">
                                                                                <SelectValue placeholder="Select gender" />
                                                                            </SelectTrigger>
                                                                        </FormControl>
                                                                        <SelectContent>
                                                                            <SelectItem
                                                                                value={
                                                                                    UserGender.MALE
                                                                                }
                                                                            >
                                                                                Male
                                                                            </SelectItem>
                                                                            <SelectItem
                                                                                value={
                                                                                    UserGender.FEMALE
                                                                                }
                                                                            >
                                                                                Female
                                                                            </SelectItem>
                                                                            <SelectItem
                                                                                value={
                                                                                    UserGender.PREFER_NOT_TO_SAY
                                                                                }
                                                                            >
                                                                                Prefer not to say
                                                                            </SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </div>
                                                </motion.div>
                                            </CardContent>
                                        </form>
                                    </Form>
                                </Card>

                                <Card className="border-border/60">
                                    <CardHeader>
                                        <CardTitle>Account Information</CardTitle>
                                        <CardDescription>
                                            Manage your account details
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-1">
                                            <span className="text-sm text-muted-foreground">
                                                Role
                                            </span>
                                            <p className="text-sm font-medium capitalize">
                                                {user.role_slug}
                                            </p>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-sm text-muted-foreground">
                                                Created At
                                            </span>
                                            <p className="text-sm font-medium">
                                                {formatDate(createdAt)}
                                            </p>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-sm text-muted-foreground">
                                                Last Updated
                                            </span>
                                            <p className="text-sm font-medium">
                                                {formatDate((user as any).updatedAt)}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </TabsContent>

                        <TabsContent value="addresses" className="mt-0">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, ease: 'easeOut' }}
                            >
                                <Card className="border-border/60">
                                    <CardHeader className="flex flex-row items-center justify-between">
                                        <div>
                                            <CardTitle>Address Book</CardTitle>
                                            <CardDescription>
                                                Manage your shipping and billing addresses.
                                            </CardDescription>
                                        </div>
                                        <Dialog
                                            open={isAddAddressOpen}
                                            onOpenChange={setIsAddAddressOpen}
                                        >
                                            <DialogTrigger asChild>
                                                <Button size="sm">Add New Address</Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-[500px]">
                                                <DialogHeader>
                                                    <DialogTitle>Add New Address</DialogTitle>
                                                </DialogHeader>
                                                <Form {...addressForm}>
                                                    <form
                                                        onSubmit={addressForm.handleSubmit(
                                                            handleAddAddress,
                                                        )}
                                                        className="space-y-4 py-4"
                                                    >
                                                        <FormField
                                                            control={addressForm.control}
                                                            name="address"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>
                                                                        Detailed Address
                                                                    </FormLabel>
                                                                    <FormControl>
                                                                        <Textarea
                                                                            {...field}
                                                                            value={
                                                                                field.value as string
                                                                            }
                                                                            placeholder="Street name, building number, etc."
                                                                            className="min-h-[80px]"
                                                                        />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <FormField
                                                                control={addressForm.control}
                                                                name="city"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>City</FormLabel>
                                                                        <FormControl>
                                                                            <Input
                                                                                {...field}
                                                                                value={
                                                                                    field.value as string
                                                                                }
                                                                                placeholder="City"
                                                                            />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <FormField
                                                                control={addressForm.control}
                                                                name="province"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>
                                                                            Province
                                                                        </FormLabel>
                                                                        <FormControl>
                                                                            <Input
                                                                                {...field}
                                                                                value={
                                                                                    field.value as string
                                                                                }
                                                                                placeholder="Province"
                                                                            />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <FormField
                                                                control={addressForm.control}
                                                                name="postal_code"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>
                                                                            Postal Code
                                                                        </FormLabel>
                                                                        <FormControl>
                                                                            <Input
                                                                                {...field}
                                                                                value={
                                                                                    field.value as string
                                                                                }
                                                                                placeholder="Postal Code"
                                                                            />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <FormField
                                                                control={addressForm.control}
                                                                name="country"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>
                                                                            Country
                                                                        </FormLabel>
                                                                        <FormControl>
                                                                            <Input
                                                                                {...field}
                                                                                value={
                                                                                    field.value as string
                                                                                }
                                                                                placeholder="Country"
                                                                            />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </div>
                                                        <FormField
                                                            control={addressForm.control}
                                                            name="is_default"
                                                            render={({ field }) => (
                                                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 border p-4">
                                                                    <FormControl>
                                                                        <Checkbox
                                                                            checked={!!field.value}
                                                                            onCheckedChange={
                                                                                field.onChange
                                                                            }
                                                                        />
                                                                    </FormControl>
                                                                    <div className="space-y-1 leading-none">
                                                                        <FormLabel>
                                                                            Set as default address
                                                                        </FormLabel>
                                                                        <FormDescription>
                                                                            This address will be
                                                                            used for your future
                                                                            checkouts.
                                                                        </FormDescription>
                                                                    </div>
                                                                </FormItem>
                                                            )}
                                                        />
                                                        <DialogFooter>
                                                            <Button
                                                                type="submit"
                                                                disabled={isAddingAddress}
                                                                className="w-full sm:w-auto"
                                                            >
                                                                {isAddingAddress
                                                                    ? 'Adding...'
                                                                    : 'Add Address'}
                                                            </Button>
                                                        </DialogFooter>
                                                    </form>
                                                </Form>
                                            </DialogContent>
                                        </Dialog>
                                    </CardHeader>
                                    <CardContent>
                                        {addresses.length === 0 ? (
                                            <div className="text-center py-12 flex flex-col items-center justify-center text-muted-foreground bg-muted/20  border border-dashed border-border">
                                                <MapPinIcon className="w-10 h-10 mb-3 opacity-20" />
                                                <p className="text-sm font-medium">
                                                    No addresses found
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    Add an address to speed up checkout.
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="grid gap-4">
                                                {addresses.map((addr: any, idx: number) => (
                                                    <div
                                                        key={addr.id || idx}
                                                        className="flex items-start justify-between p-4 border bg-card hover:bg-muted/10 transition-colors"
                                                    >
                                                        <div className="flex items-start gap-4">
                                                            <div className="mt-1 p-2 bg-primary/10 rounded-full">
                                                                <MapPinIcon className="size-4 text-primary" />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="font-semibold text-sm">
                                                                        {addr.is_default
                                                                            ? 'Default Address'
                                                                            : `Address ${idx + 1}`}
                                                                    </span>
                                                                    {addr.is_default && (
                                                                        <Badge
                                                                            variant="secondary"
                                                                            className="text-[10px] h-4 bg-emerald-100 text-emerald-700 border-emerald-200"
                                                                        >
                                                                            Primary
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                                <p className="text-sm text-foreground/80">
                                                                    {addr.address}
                                                                </p>
                                                                <p className="text-xs text-muted-foreground">
                                                                    {addr.city}, {addr.province},{' '}
                                                                    {addr.postal_code},{' '}
                                                                    {addr.country}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <Button variant="ghost" size="sm">
                                                            Edit
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </TabsContent>

                        <TabsContent value="payment-method" className="mt-0">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, ease: 'easeOut' }}
                            >
                                <Card className="border-border/60">
                                    <CardHeader className="flex flex-row items-center justify-between">
                                        <div>
                                            <CardTitle>Payment Methods</CardTitle>
                                            <CardDescription>
                                                Manage your saved payment methods.
                                            </CardDescription>
                                        </div>
                                        <Dialog
                                            open={isAddPaymentOpen}
                                            onOpenChange={setIsAddPaymentOpen}
                                        >
                                            <DialogTrigger asChild>
                                                <Button size="sm">Add New Payment</Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-[500px]">
                                                <DialogHeader>
                                                    <DialogTitle>
                                                        Add New Payment Method
                                                    </DialogTitle>
                                                </DialogHeader>
                                                <Form {...paymentForm}>
                                                    <form
                                                        onSubmit={paymentForm.handleSubmit(
                                                            handleAddPayment,
                                                        )}
                                                        className="space-y-4 py-4"
                                                    >
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <FormField
                                                                control={paymentForm.control}
                                                                name="payment_type_id"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>
                                                                            Payment Type
                                                                        </FormLabel>
                                                                        <Select
                                                                            onValueChange={
                                                                                field.onChange
                                                                            }
                                                                            defaultValue={
                                                                                field.value
                                                                            }
                                                                        >
                                                                            <FormControl>
                                                                                <SelectTrigger>
                                                                                    <SelectValue placeholder="Select type" />
                                                                                </SelectTrigger>
                                                                            </FormControl>
                                                                            <SelectContent>
                                                                                {paymentTypes?.length ? (
                                                                                    paymentTypes.map(
                                                                                        (type) => (
                                                                                            <SelectItem
                                                                                                key={
                                                                                                    type.id
                                                                                                }
                                                                                                value={
                                                                                                    type.id
                                                                                                }
                                                                                            >
                                                                                                {
                                                                                                    type.value
                                                                                                }
                                                                                            </SelectItem>
                                                                                        ),
                                                                                    )
                                                                                ) : (
                                                                                    <SelectItem
                                                                                        value="none"
                                                                                        disabled
                                                                                    >
                                                                                        No types
                                                                                        found
                                                                                    </SelectItem>
                                                                                )}
                                                                            </SelectContent>
                                                                        </Select>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <FormField
                                                                control={paymentForm.control}
                                                                name="bank_id"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>Bank</FormLabel>
                                                                        <Select
                                                                            onValueChange={
                                                                                field.onChange
                                                                            }
                                                                            defaultValue={
                                                                                field.value
                                                                            }
                                                                        >
                                                                            <FormControl>
                                                                                <SelectTrigger>
                                                                                    <SelectValue placeholder="Select bank" />
                                                                                </SelectTrigger>
                                                                            </FormControl>
                                                                            <SelectContent>
                                                                                {banks?.length ? (
                                                                                    banks.map(
                                                                                        (bank) => (
                                                                                            <SelectItem
                                                                                                key={
                                                                                                    bank.id
                                                                                                }
                                                                                                value={
                                                                                                    bank.id
                                                                                                }
                                                                                            >
                                                                                                {
                                                                                                    bank.abbreviation
                                                                                                }{' '}
                                                                                                -{' '}
                                                                                                {
                                                                                                    bank.name
                                                                                                }
                                                                                            </SelectItem>
                                                                                        ),
                                                                                    )
                                                                                ) : (
                                                                                    <SelectItem
                                                                                        value="none"
                                                                                        disabled
                                                                                    >
                                                                                        No banks
                                                                                        found
                                                                                    </SelectItem>
                                                                                )}
                                                                            </SelectContent>
                                                                        </Select>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </div>
                                                        <FormField
                                                            control={paymentForm.control}
                                                            name="provider"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>
                                                                        Provider (Bank Name)
                                                                    </FormLabel>
                                                                    <FormControl>
                                                                        <Input
                                                                            {...field}
                                                                            placeholder="e.g. BCA, Mandiri"
                                                                        />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                        <FormField
                                                            control={paymentForm.control}
                                                            name="account_number"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>
                                                                        Account Number
                                                                    </FormLabel>
                                                                    <FormControl>
                                                                        <Input
                                                                            {...field}
                                                                            placeholder="Number"
                                                                        />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                        <FormField
                                                            control={paymentForm.control}
                                                            name="account_holder"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>
                                                                        Account Holder
                                                                    </FormLabel>
                                                                    <FormControl>
                                                                        <Input
                                                                            {...field}
                                                                            placeholder="Name"
                                                                        />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                        <FormField
                                                            control={paymentForm.control}
                                                            name="description"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>
                                                                        Description
                                                                    </FormLabel>
                                                                    <FormControl>
                                                                        <Input
                                                                            {...field}
                                                                            placeholder="e.g. Main account"
                                                                        />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                        <DialogFooter>
                                                            <Button
                                                                type="submit"
                                                                disabled={isAddingPayment}
                                                                className="w-full sm:w-auto"
                                                            >
                                                                {isAddingPayment
                                                                    ? 'Adding...'
                                                                    : 'Add Payment'}
                                                            </Button>
                                                        </DialogFooter>
                                                    </form>
                                                </Form>
                                            </DialogContent>
                                        </Dialog>
                                    </CardHeader>
                                    <CardContent>
                                        {paymentMethods.length === 0 ? (
                                            <div className="text-center py-12 flex flex-col items-center justify-center text-muted-foreground bg-muted/20 border border-dashed border-border">
                                                <CreditCardIcon className="w-10 h-10 mb-3 opacity-20" />
                                                <p className="text-sm font-medium">
                                                    No payment methods found
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    Add a payment method for easier checkout.
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="grid gap-4">
                                                {paymentMethods.map((pm: any, idx: number) => (
                                                    <div
                                                        key={pm.id || idx}
                                                        className="flex items-start justify-between p-4 border bg-card hover:bg-muted/10 transition-colors"
                                                    >
                                                        <div className="flex items-start gap-4">
                                                            <div className="mt-1 p-2 bg-primary/10 rounded-full">
                                                                <CreditCardIcon className="size-4 text-primary" />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="font-semibold text-sm">
                                                                        {pm.provider}
                                                                    </span>
                                                                </div>
                                                                <p className="text-sm text-foreground/80">
                                                                    {pm.account_number}
                                                                </p>
                                                                <p className="text-xs text-muted-foreground">
                                                                    {pm.account_holder} -{' '}
                                                                    {pm.description ||
                                                                        'No description'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <Button variant="ghost" size="sm">
                                                            Edit
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </TabsContent>

                        <TabsContent value="security" className="mt-0">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, ease: 'easeOut' }}
                            >
                                <Card className="border-border/60">
                                    <CardHeader>
                                        <CardTitle>Security Settings</CardTitle>
                                        <CardDescription>
                                            Update your password and security preferences.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center justify-between p-4 border bg-card hover:bg-muted/10 transition-colors">
                                            <div>
                                                <p className="font-medium">Password</p>
                                                <p className="text-sm text-muted-foreground">
                                                    Last updated recently
                                                </p>
                                            </div>
                                            <Button variant="outline" size="sm">
                                                Update
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </TabsContent>
                    </div>
                </Tabs>
            </motion.div>
        </motion.div>
    );
}
