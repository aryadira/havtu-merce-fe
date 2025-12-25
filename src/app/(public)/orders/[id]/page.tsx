"use client";

import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { useGetOrder } from "@/src/lib/api/orders/get-order";
import { Badge } from "@/src/components/ui/badge";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, ShoppingBag } from "lucide-react";
import { Skeleton } from "@/src/components/ui/skeleton";

export default function OrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const {
    data: order,
    isLoading,
    isError,
  } = useGetOrder({
    orderId: id as string,
  });

  if (isLoading) {
    return (
      <div className="container py-8 max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/3 mb-2" />
            <Skeleton className="h-4 w-1/4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-48 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="container py-16 flex flex-col items-center justify-center text-center">
        <div className="bg-red-100 p-4 rounded-full mb-4">
          <ShoppingBag className="h-8 w-8 text-red-600" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Order Not Found</h1>
        <p className="text-gray-500 mb-6">
          We couldn't find the order you're looking for.
        </p>
        <Button onClick={() => router.push("/")}>Back to Shop</Button>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="container py-8 max-w-4xl mx-auto slide-up">
      <Button
        variant="ghost"
        className="mb-6 pl-0 hover:pl-2 transition-all"
        onClick={() => router.push("/")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Shop
      </Button>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            Order Details
            <Badge
              variant={
                order.payment_status === "PAID"
                  ? "default"
                  : order.payment_status === "UNPAID"
                  ? "destructive"
                  : "secondary"
              }
              className="text-sm"
            >
              {order.payment_status}
            </Badge>
          </h1>
          <p className="text-muted-foreground mt-2">
            Order ID: <span className="text-sm">{order.id}</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Placed on</p>
          <p className="font-medium">{formatDate(order.created_at)}</p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
            <CardDescription>
              You have {order.order_items.length} items in this order
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50%]">Product</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-center">Qty</TableHead>
                  <TableHead className="text-right">Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.order_items.map((item) => (
                  <TableRow key={item.product_id}>
                    <TableCell>
                      <div className="font-medium">{item.product.name}</div>
                      <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                        {item.product.description}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(item.item_price)}
                    </TableCell>
                    <TableCell className="text-center">
                      {item.item_qty}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(item.subtotal)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total Amount</span>
              <span>{formatCurrency(order.total_amount)}</span>
            </div>
          </CardContent>
          <CardFooter className="bg-gray-50 p-6 flex justify-end rounded-b-lg">
            {order.payment_status === "UNPAID" && (
              <Button size="lg" className="w-full md:w-auto">
                Pay Now
              </Button>
            )}
            {order.payment_status === "PAID" && (
              <div className="flex items-center text-green-600 font-medium">
                <CheckCircle2 className="mr-2 h-5 w-5" />
                Payment Completed
              </div>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
