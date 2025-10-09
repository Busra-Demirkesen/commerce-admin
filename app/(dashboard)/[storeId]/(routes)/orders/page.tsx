import prismadb from "@/lib/prismadb";
import OrderClient from "./components/client";
import { OrderColumn } from "./components/columns";
import { format } from "date-fns";
import { formatter } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server"; // Corrected import for auth

const OrdersPage = async ({ params }: { params: Promise<{ storeId: string }> }) => {
  const { storeId } = await params; // Await params to resolve the promise
  const { userId } = auth();

  if (!userId) {
    return null; // Kullanıcı oturum açmamışsa bir şey gösterme
  }

  const orders = await prismadb.order.findMany({
    where: {
      storeId: storeId,
      userId: userId, // Kullanıcıya göre filtreleme
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
      user: true, // Kullanıcı bilgilerini dahil et
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedOrders: OrderColumn[] = orders.map((item) => {
    return {
      id: item.id,
      userEmail: item.user.email, // Kullanıcı e-postasını ekle
      phone: item.phone || "",
      address: item.address || "",
      products: item.orderItems
        .map((orderItem) => orderItem.product.name)
        .join(", "),
      totalPrice: formatter.format(
        item.orderItems.reduce((total, item) => {
          return total + item.product.price.toNumber();
        }, 0)
      ),
      isPaid: item.isPaid,
      createdAt: format(item.createdAt, "MMMM do, yyyy"),
    };
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrderClient data={formattedOrders ?? []} />
      </div>
    </div>
  );
};

export default OrdersPage;
