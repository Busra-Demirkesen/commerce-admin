// app/(dashboard)/[storeId]/(routes)/products/[productId]/page.tsx

import prismadb from "@/lib/prismadb";
import { ProductForm } from "./components/product-form";
import { notFound } from "next/navigation";

const ProductPage = async ({
  params,
}: { params: Promise<{ storeId: string; productId: string }> }) => {
  const { storeId, productId } = await params; // Destructure and await params
  let product = null;

  if (productId !== "new") {
    product = await prismadb.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        images: true,
        category: true,
        size: true,
        color: true,
      },
    });
  }

  if (productId !== "new" && !product) {
    return notFound();
  }

  const formattedProduct = product ? {
    id: product.id,
    name: product.name,
    price: product.price.toNumber(), // ✅ Decimal → number dönüşümü
    stock: product.stock, // Yeni eklendi
    isFeatured: product.isFeatured,
    isArchived: product.isArchived,
    categoryId: product.categoryId,
    sizeId: product.sizeId,
    colorId: product.colorId,
    images: product.images,
    category: product.category,
    size: product.size,
    color: product.color,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  } : null;

  const categories = await prismadb.category.findMany({
    where: {
      storeId: storeId,
    },
  });

  const sizes = await prismadb.size.findMany({
    where: {
      storeId: storeId,
    },
  });

  const colors = await prismadb.color.findMany({
    where: {
      storeId: storeId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm
          initialData={formattedProduct}
          categories={categories}
          sizes={sizes}
          colors={colors}
        />
      </div>
    </div>
  );
};

export default ProductPage;
