import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";

function extractStoreIdFromUrl(url: string) {
  const parts = url.split("/");
  return parts[parts.length - 2];
}

export async function POST(req: NextRequest) {
  try {
    const storeId = extractStoreIdFromUrl(req.url);
    const { userId } = await auth();
    const body = await req.json();
    const { name, billboardId } = body;

    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
    if (!name) return new NextResponse("Name is required", { status: 400 });
    if (!billboardId) return new NextResponse("Billboard ID is required", { status: 400 });
    if (!storeId) return new NextResponse("StoreId is required", { status: 400 });

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: storeId,
        userId,
      },
    });

    if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 });

    const category = await prismadb.category.create({
      data: {
        name,
        billboardId,
        storeId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("[CATEGORIES_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const storeId = extractStoreIdFromUrl(req.url);

    if (!storeId) {
      return new NextResponse("StoreId is required", { status: 400 });
    }

    const categories = await prismadb.category.findMany({
      where: {
        storeId,
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("[CATEGORIES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
