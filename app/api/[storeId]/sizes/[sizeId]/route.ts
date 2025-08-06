import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: { sizeId: string; storeId: string } }
) {
  try {
    const { sizeId, storeId } = context.params;

    if (!storeId) return new NextResponse("Store ID is required", { status: 400 });
    if (!sizeId) return new NextResponse("Size ID is required", { status: 400 });

    const size = await prismadb.size.findUnique({
      where: {
        id: sizeId,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.error("[SIZES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: { storeId: string; sizeId: string } }
) {
  try {
    const { sizeId, storeId } = context.params;
    const { userId } = await auth();
    const body = await req.json();
    const { name, value } = body;

    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
    if (!name) return new NextResponse("Name is required", { status: 400 });
    if (!value) return new NextResponse("Value is required", { status: 400 });

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: storeId,
        userId,
      },
    });

    if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 });

    const size = await prismadb.size.updateMany({
      where: {
        id: sizeId,
        storeId,
      },
      data: {
        name,
        value,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.error("[SIZES_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: { storeId: string; sizeId: string } }
) {
  try {
    const { sizeId, storeId } = context.params;
    const { userId } = await auth();

    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: storeId,
        userId,
      },
    });

    if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 });

    const size = await prismadb.size.deleteMany({
      where: {
        id: sizeId,
        storeId,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.error("[SIZES_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
