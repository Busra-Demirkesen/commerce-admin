import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ colorId: string; storeId: string }> },
) {
  try {
    const { colorId, storeId } = await context.params;

    if (!storeId) {
      return new NextResponse('Store ID is required', { status: 400 });
    }

    if (!colorId) {
      return new NextResponse('Color ID is required', { status: 400 });
    }

    const color = await prismadb.color.findUnique({
      where: {
        id: colorId,
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.error("[COLORS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ storeId: string; colorId: string }> },
) {
  try {
    const { colorId, storeId } = await context.params;
    const { userId } = await auth();
    const body = await req.json();
    const { name, value } = body;

    if (!userId) return new NextResponse('Unauthenticated', { status: 401 });
    if (!name) return new NextResponse('Name is required', { status: 400 });
    if (!value) return new NextResponse('Value is required', { status: 400 });

    if (!storeId) {
      return new NextResponse('Store ID is required', { status: 400 });
    }

    if (!colorId) {
      return new NextResponse('Color ID is required', { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: storeId,
        userId,
      },
    });

    if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 });

    const color = await prismadb.color.updateMany({
      where: {
        id: colorId,
        storeId: storeId,
      },
      data: {
        name,
        value,
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.error("[COLORS_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ storeId: string; colorId: string }> },
) {
  try {
    const { colorId, storeId } = await context.params;
    const { userId } = await auth();

    if (!userId) return new NextResponse('Unauthenticated', { status: 401 });

    if (!storeId) {
      return new NextResponse('Store ID is required', { status: 400 });
    }

    if (!colorId) {
      return new NextResponse('Color ID is required', { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: storeId,
        userId,
      },
    });

    if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 });

    const color = await prismadb.color.deleteMany({
      where: {
        id: colorId,
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.error("[COLORS_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
