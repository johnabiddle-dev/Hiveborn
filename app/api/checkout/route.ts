import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { calculateShippingCents, resolveCartItems, toStripeLineItems } from '@/lib/checkout';

export async function POST(request: NextRequest) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: 'Stripe secret key is not configured.' }, { status: 500 });
    }
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    const { items, shippingAddress, isPickup = false } = await request.json();

    // Resolve every cart line against the server catalog (prices/names come from
    // PRODUCTS, never from the client) so prices cannot be tampered with.
    const resolved = resolveCartItems(items);
    if (!resolved.ok) {
      return NextResponse.json({ error: resolved.error }, { status: 400 });
    }
    const { resolvedItems, hasHoneyItems } = resolved;

    // Validate honey shipping restriction (honey only to VA) — skipped for pickup
    const state = (shippingAddress?.state || '').toUpperCase().trim();
    if (!isPickup) {
      if (hasHoneyItems && state !== 'VA' && !state.includes('VIRGINIA')) {
        return NextResponse.json({ error: 'All honey products can only be shipped to Virginia addresses.' }, { status: 400 });
      }
      if (!hasHoneyItems && (state === 'AK' || state === 'HI' || state.includes('ALASKA') || state.includes('HAWAII'))) {
        return NextResponse.json({ error: 'We only ship to the continental United States for non-honey items (Summer Lotion and Dipper).' }, { status: 400 });
      }
    }

    // Calculate shipping (server authoritative). The client-provided shipping cost
    // is intentionally ignored so it cannot be reduced to zero via tampering.
    const shippingCost = isPickup ? 0 : calculateShippingCents(resolvedItems.length);

    // Convert resolved (server-priced) cart items to Stripe line items
    const lineItems = toStripeLineItems(resolvedItems);

    // Add shipping as a line item only for delivery (not pickup)
    if (!isPickup) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Shipping',
            description: hasHoneyItems ? 'Honey products - ships to Virginia only' : 'Standard shipping to continental US (Summer Lotion & Dipper)',
          },
          unit_amount: shippingCost,
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      // NEXT_PUBLIC_APP_URL should be https://www.hiveborn.com (to match the live domain
      // and the webhook destination registered in Stripe at https://www.hiveborn.com/api/webhook).
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/cart`,
      // We collect address on our form; still allow Stripe to confirm
      shipping_address_collection: {
        allowed_countries: ['US', 'CA'],
      },
      metadata: {
        shippingName: shippingAddress?.name || '',
        shippingAddress: JSON.stringify(shippingAddress || {}),
        hasHoneyItems: hasHoneyItems.toString(),
        isPickup: isPickup.toString(),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    console.error('Stripe Checkout Error:', error);
    const message = error instanceof Error ? error.message : 'Failed to create checkout session';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
