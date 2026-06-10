import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  try {
    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json({ error: 'Missing session ID', verified: false }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items'],
    });

    // Only consider it successful if payment is complete
    if (session.payment_status !== 'paid' && session.status !== 'complete') {
      return NextResponse.json(
        { error: 'Payment not completed', verified: false, status: session.payment_status },
        { status: 400 }
      );
    }

    const metadata = session.metadata || {};
    const isPickup = metadata.isPickup === 'true';
    let shippingAddress = null;

    try {
      if (metadata.shippingAddress) {
        shippingAddress = JSON.parse(metadata.shippingAddress);
      }
    } catch {
      // ignore parse error
    }

    // Build a simple order summary from line items
    const items = (session.line_items?.data || []).map((li: unknown) => {
      const l = li as { description?: string; price?: { product?: { name?: string } }; amount_total?: number; quantity?: number };
      return {
        name: l.description || l.price?.product?.name || 'Item',
        amount: l.amount_total || 0,
        quantity: l.quantity || 1,
      };
    });

    return NextResponse.json({
      verified: true,
      amountTotal: session.amount_total,
      currency: session.currency,
      isPickup,
      shippingAddress,
      items,
      customerEmail: session.customer_details?.email || null,
      customerName: session.customer_details?.name || metadata.shippingName || null,
    });
  } catch (error: unknown) {
    console.error('Stripe session verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify payment', verified: false },
      { status: 500 }
    );
  }
}
