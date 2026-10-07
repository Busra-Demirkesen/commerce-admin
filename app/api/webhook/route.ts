import Stripe from 'stripe';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

import { stripe } from '@/lib/stripe';
import prismadb from '@/lib/prismadb';

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
const signature = headersList.get('Stripe-Signature') as string;


  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: unknown) {
    return new NextResponse(`Webhook Error: ${error instanceof Error ? error.message : 'Unknown error'}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  const address = session.customer_details?.address;
  const addressComponents = [
    address?.line1,
    address?.line2,
    address?.city,
    address?.state,
    address?.postal_code,
    address?.country,
  ];
  const addressString = addressComponents.filter(Boolean).join(', ');

  console.log('[WEBHOOK] Received checkout.session.completed event.');
  console.log('[WEBHOOK] Order ID:', session.metadata?.orderId);
  console.log('[WEBHOOK] Customer Address:', addressString);
  console.log('[WEBHOOK] Customer Phone:', session.customer_details?.phone);

  if (event.type === 'checkout.session.completed') {
    if (!session.metadata?.orderId) {
      return new NextResponse('Order ID not found in session metadata.', { status: 400 });
    }

    const existingOrder = await prismadb.order.findUnique({
      where: {
        id: session.metadata.orderId,
      },
    });

    if (existingOrder?.isPaid) {
      return new NextResponse(null, { status: 200 });
    }

    const order = await prismadb.order.update({
      where: {
        id: session.metadata.orderId,
      },
      data: {
        isPaid: true,
        address: addressString,
        phone: session.customer_details?.phone || '',
      },
      include: {
        orderItems: true,
      },
    });

    const quantities = new Map<string, number>();
    for (const item of order.orderItems) {
      quantities.set(item.productId, (quantities.get(item.productId) ?? 0) + 1);
    }

    for (const [productId, quantity] of quantities) {
      await prismadb.product.updateMany({
        where: {
          id: productId,
        },
        data: {
          stock: {
            decrement: quantity,
          },
        },
      });
      await prismadb.product.updateMany({
        where: {
          id: productId,
          stock: {
            lt: 0,
          },
        },
        data: {
          stock: 0,
        },
      });
    }
  }

  return new NextResponse(null, { status: 200 });
}
