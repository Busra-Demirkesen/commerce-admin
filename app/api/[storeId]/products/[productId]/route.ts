import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";
import { stripe } from "@/lib/stripe";
import { Prisma } from "@prisma/client";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ productId: string; storeId: string }> },
) {
  try {
    const { productId, storeId } = await context.params;

    if (!storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
    }

    if (!productId) {
      return new NextResponse("Product ID is required", { status: 400 });
    }

    const product = await prismadb.product.findUnique({
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

    return NextResponse.json(product);
  } catch (error) {
    console.error("[PRODUCTS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ storeId: string; productId: string }> },
) {
  try {
    const { productId, storeId } = await context.params;
    const { userId } = await auth();
    const body = await req.json();
    const {
      name,
      price,
      categoryId,
      colorId,
      sizeId,
      images,
      isFeatured,
      isArchived,
    } = body;

    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
    if (!name) return new NextResponse("Name is required", { status: 400 });
    if (!price) return new NextResponse("Price is required", { status: 400 });
    if (!categoryId) return new NextResponse("Category ID is required", { status: 400 });
    if (!colorId) return new NextResponse("Color ID is required", { status: 400 });
    if (!sizeId) return new NextResponse("Size ID is required", { status: 400 });
    if (!images || !images.length) return new NextResponse("Images are required", { status: 400 });

    if (!storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
    }

    if (!productId) {
      return new NextResponse("Product ID is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: storeId,
        userId,
      },
    });

    if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 });

    const productToUpdate = await prismadb.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!productToUpdate) {
      return new NextResponse("Product not found", { status: 404 });
    }

    // Update Stripe Product
    if (productToUpdate.stripeProductId) {
      await stripe.products.update(productToUpdate.stripeProductId, {
        name: name,
        images: images.map((image: { url: string }) => image.url),
      });
    }

    // If price changed, deactivate old price and create new one
    if (new Prisma.Decimal(price).toNumber() !== productToUpdate.price.toNumber()) {
      if (productToUpdate.stripePriceId) {
        await stripe.prices.update(productToUpdate.stripePriceId, {
          active: false,
        });
      }

      const newStripePrice = await stripe.prices.create({
        product: productToUpdate.stripeProductId || "", // Use existing Stripe Product or throw error
        unit_amount: new Prisma.Decimal(price).toNumber() * 100,
        currency: "usd",
      });
      // Update the product with the new Stripe price ID
      await prismadb.product.update({
        where: {
          id: productId,
        },
        data: {
          stripePriceId: newStripePrice.id,
        },
      });
    }

    // Önce eski tüm görselleri sil
    await prismadb.product.update({
      where: {
        id: productId,
      },
      data: {
        name,
        price,
        categoryId,
        colorId,
        sizeId,
        images: {
          deleteMany: {},
        },
        isFeatured,
        isArchived,
      },
    });

    // Yeni görselleri ekle
    const updatedProduct = await prismadb.product.update({
      where: {
        id: productId,
      },
      data: {
        images: {
          createMany: {
            data: images.map((image: { url: string }) => ({
              url: image.url,
            })),
          },
        },
      },
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("[PRODUCTS_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ storeId: string; productId: string }> },
) {
  try {
    const { productId, storeId } = await context.params;
    const { userId } = await auth();

    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

    if (!storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
    }

    if (!productId) {
      return new NextResponse("Product ID is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: storeId,
        userId,
      },
    });

    if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 });

    const productToDelete = await prismadb.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!productToDelete) {
      return new NextResponse("Product not found", { status: 404 });
    }

    // Delete Stripe Product
    if (productToDelete.stripeProductId) {
      await stripe.products.del(productToDelete.stripeProductId);
    }

    const deletedProduct = await prismadb.product.deleteMany({
      where: {
        id: productId,
      },
    });

    return NextResponse.json(deletedProduct);
  } catch (error) {
    console.error("[PRODUCT_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
