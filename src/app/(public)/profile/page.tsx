"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMe } from "@/src/lib/api/auth";
import {
  User as UserIcon,
  Mail as MailIcon,
  Phone as PhoneIcon,
  MapPin as MapPinIcon,
  Shield as ShieldIcon,
  Calendar as CalendarIcon,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Label } from "@/src/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { useForm } from "react-hook-form";
import { profileSchema, UserGender, type ProfileSchema } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/src/components/ui/input";
import { useUpdateUser } from "@/src/lib/api/users";
import { toast } from "sonner";

export default function ProfilePage() {
  const { data: user, isLoading } = useMe();
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullname: "",
      username: "",
      phone_number: "",
      email: "",
      gender: UserGender.PREFER_NOT_TO_SAY,
      birthdate: "",
      avatar: "",
    },
  });

  const { mutate: updateUser, isPending } = useUpdateUser();

  useEffect(() => {
    if (user) {
      const userGender = user.profile?.gender as string | undefined;
      let normalizedGender = UserGender.PREFER_NOT_TO_SAY;

      if (userGender) {
        const lowerUserId = userGender.toLowerCase();
        if (
          lowerUserId === "prefer not to say" ||
          lowerUserId === "prefer-not-to-say"
        ) {
          normalizedGender = UserGender.PREFER_NOT_TO_SAY;
        } else if (
          Object.values(UserGender).includes(lowerUserId as UserGender)
        ) {
          normalizedGender = lowerUserId as UserGender;
        }
      }

      form.reset({
        fullname: user.profile?.fullname || "",
        username: user.username || "",
        phone_number: user.profile?.phone_number || "",
        email: user.email || "",
        gender: normalizedGender,
        birthdate: user.profile?.birthdate
          ? new Date(user.profile.birthdate).toISOString().split("T")[0]
          : "",
        avatar: user.profile?.avatar || "",
      });
    }
  }, [user, form]);

  const getInitials = (name?: string) => {
    return (name || "User")
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleUpdateProfile = async () => {
    if (!user) return;
    try {
      const formData = form.getValues();
      updateUser({ id: user.id, data: formData });
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 px-4 space-y-8 animate-pulse max-w-6xl">
        <div className="h-48 bg-muted rounded-xl w-full" />
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-64 h-64 bg-muted rounded-xl" />
          <div className="flex-1 h-96 bg-muted rounded-xl" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto py-20 text-center">
        <p className="text-muted-foreground">
          User profile not found. Please log in.
        </p>
        <Button className="mt-4" variant="outline">
          Back to Home
        </Button>
      </div>
    );
  }

  const profile = user.profile || {};
  const addresses = (profile as any).addresses || [];
  const createdAt = (user as any).createdAt;

  return (
    <div className="max-w-5xl min-h-screen pb-20">
      {/* Header Section */}
      <div className="bg-background border-b border-border/40 pb-8 pt-10">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
            <div className="relative group">
              <Avatar className="w-32 h-32 border-4 border-background shadow-xl ring-2 ring-border/20">
                <AvatarImage
                  src={(profile as any).avatar}
                  alt={profile.fullname}
                />
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
                <Badge
                  variant="secondary"
                  className="uppercase text-xs font-semibold tracking-wider bg-primary/10 text-primary border-primary/20"
                >
                  {user.role_slug || "User"}
                </Badge>
              </div>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <MailIcon className="w-4 h-4" />
                  {user.email}
                </span>
                <span className="flex items-center gap-1.5">
                  <PhoneIcon className="w-4 h-4" />
                  {profile.phone_number || "No phone"}
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
                      {isPending ? "Saving..." : "Save"}
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 max-w-6xl mt-8">
        <Tabs
          defaultValue="overview"
          className="flex flex-col md:flex-row gap-8"
        >
          <aside className="w-full md:w-64  space-y-2">
            <TabsList className="flex flex-row md:flex-col h-auto w-full bg-transparent p-0 gap-1 text-left items-stretch overflow-x-auto md:overflow-visible">
              <TabsTrigger
                value="overview"
                className="justify-start cursor-pointer px-4 py-2.5 h-auto text-sm font-medium data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-md transition-all ease-in-out border border-transparent data-[state=active]:border-border"
              >
                <UserIcon className="w-4 h-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="addresses"
                className="justify-start cursor-pointer px-4 py-2.5 h-auto text-sm font-medium data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-md transition-all ease-in-out border border-transparent data-[state=active]:border-border"
              >
                <MapPinIcon className="w-4 h-4 mr-2" />
                Address Book
              </TabsTrigger>
              <TabsTrigger
                value="security"
                className="justify-start cursor-pointer px-4 py-2.5 h-auto text-sm font-medium data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-md transition-all ease-in-out border border-transparent data-[state=active]:border-border"
              >
                <ShieldIcon className="w-4 h-4 mr-2" />
                Security
              </TabsTrigger>
            </TabsList>
          </aside>

          <div className="w-5xl flex-1 space-y-6">
            <TabsContent value="overview" className="mt-0 space-y-6">
              <Card className="border-border/60 shadow-sm overflow-hidden">
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
                            ? "var(--muted-foreground-opacity-5)" // Subtle highlight
                            : "transparent",
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
                                <FormLabel>Email Address</FormLabel>
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
                                <FormLabel>Phone Number</FormLabel>
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
                                  onValueChange={field.onChange}
                                  value={
                                    isEditing
                                      ? field.value
                                      : user.profile.gender
                                  }
                                >
                                  <FormControl>
                                    <SelectTrigger className="transition-all duration-300">
                                      <SelectValue placeholder="Select gender" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value={UserGender.MALE}>
                                      Male
                                    </SelectItem>
                                    <SelectItem value={UserGender.FEMALE}>
                                      Female
                                    </SelectItem>
                                    <SelectItem
                                      value={UserGender.PREFER_NOT_TO_SAY}
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

              <Card className="border-border/60 shadow-sm">
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground">
                      User ID
                    </span>
                    <p className="font-mono text-xs text-foreground/80 truncate bg-muted/30 p-1.5 rounded w-fit max-w-full">
                      {user.id}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground">Role</span>
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
            </TabsContent>

            <TabsContent value="addresses" className="mt-0">
              <Card className="border-border/60 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Address Book</CardTitle>
                    <CardDescription>
                      Manage your shipping and billing addresses.
                    </CardDescription>
                  </div>
                  <Button size="sm">Add New Address</Button>
                </CardHeader>
                <CardContent>
                  {addresses.length === 0 ? (
                    <div className="text-center py-12 flex flex-col items-center justify-center text-muted-foreground bg-muted/20 rounded-lg border border-dashed border-border">
                      <MapPinIcon className="w-10 h-10 mb-3 opacity-20" />
                      <p className="text-sm font-medium">No addresses found</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Add an address to speed up checkout.
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {/* Placeholder for address list item */}
                      <p>Addresses functionality needed</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="mt-0">
              <Card className="border-border/60 shadow-sm">
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>
                    Update your password and security preferences.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-muted/10 transition-colors">
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
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
