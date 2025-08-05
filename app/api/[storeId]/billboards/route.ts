import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse, NextRequest } from "next/server";

function extractStoreIdFromUrl(url: string) {
  const parts = url.split("/");
  // /api/[storeId]/billboards → storeId sondan 2 önceki eleman
  return parts[parts.length - 2];
}

export async function POST(req: NextRequest) {
  try {
    const storeId = extractStoreIdFromUrl(req.url);
    const { userId } = await auth();
    const body = await req.json();
    const { label, imageUrl } = body;

    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
    if (!label) return new NextResponse("Label is required", { status: 400 });
    if (!imageUrl) return new NextResponse("Image URL is required", { status: 400 });

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: storeId,
        userId,
      },
    });

    if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 });

    const billboard = await prismadb.billboard.create({
      data: {
        label,
        imageUrl,
        storeId,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.error("[BILLBOARDS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const storeId = extractStoreIdFromUrl(req.url);

    const billboards = await prismadb.billboard.findMany({
      where: {
        storeId,
      },
    });

    return NextResponse.json(billboards);
  } catch (error) {
    console.error("[BILLBOARDS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
