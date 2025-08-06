import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ categoryId: string; storeId: string }> },
) {
  try {
    const { categoryId, storeId } = await context.params;

    if (!storeId) {
      return new NextResponse('Store ID is required', { status: 400 });
    }

    if (!categoryId) {
      return new NextResponse('Category ID is required', { status: 400 });
    }

    const category = await prismadb.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("[CATEGORY_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ categoryId: string; storeId: string }> },
) {
  try {
    const { categoryId, storeId } = await context.params;
    const { userId } = await auth();
    const body = await req.json();
    const { name, billboardId } = body;

    if (!userId) return new NextResponse('Unauthenticated', { status: 401 });
    if (!name) return new NextResponse('Name is required', { status: 400 });
    if (!billboardId) return new NextResponse('Billboard ID is required', { status: 400 });

    if (!storeId) {
      return new NextResponse('Store ID is required', { status: 400 });
    }

    if (!categoryId) {
      return new NextResponse('Category ID is required', { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: storeId,
        userId,
      },
    });

    if (!storeByUserId)
      return new NextResponse('Unauthorized', { status: 403 });

    const category = await prismadb.category.updateMany({
      where: {
        id: categoryId,
        storeId: storeId,
      },
      data: {
        name,
        billboardId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("[CATEGORY_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ categoryId: string; storeId: string }> },
) {
  try {
    const { categoryId, storeId } = await context.params;
    const { userId } = await auth();

    if (!userId) return new NextResponse('Unauthenticated', { status: 401 });

    if (!storeId) {
      return new NextResponse('Store ID is required', { status: 400 });
    }

    if (!categoryId) {
      return new NextResponse('Category ID is required', { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: storeId,
        userId,
      },
    });

    if (!storeByUserId)
      return new NextResponse('Unauthorized', { status: 403 });

    const category = await prismadb.category.deleteMany({
      where: {
        id: categoryId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error('[CATEGORY_DELETE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
