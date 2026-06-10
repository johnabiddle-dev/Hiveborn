import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { HONEY_PRODUCT_IDS } from '@/lib/products';

export async function POST(request: NextRequest) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: 'Stripe secret key is not configured.' }, { status: 500 });
    }
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    const { items, shippingAddress, shippingCost: clientShippingCost, isPickup = false } = await request.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // Validate honey shipping restriction (honey only to VA) — skipped for pickup
    const hasHoneyItems = items.some((item: unknown) => {
      const i = item as { id: number };
      return HONEY_PRODUCT_IDS.includes(i.id);
    });
    const state = (shippingAddress?.state || '').toUpperCase().trim();
    if (!isPickup) {
      if (hasHoneyItems && state !== 'VA' && !state.includes('VIRGINIA')) {
        return NextResponse.json({ error: 'All honey products can only be shipped to Virginia addresses.' }, { status: 400 });
      }
      if (!hasHoneyItems && (state === 'AK' || state === 'HI' || state.includes('ALASKA') || state.includes('HAWAII'))) {
        return NextResponse.json({ error: 'We only ship to the continental United States for non-honey items (Summer Lotion and Dipper).' }, { status: 400 });
      }
    }

    // Calculate shipping (server authoritative)
    const calculateShippingCents = (numItems: number) => {
      if (numItems === 0) return 0;
      const base = 1100; // minimum $11.00
      const perAdditional = 400; // +$4 per additional item (simple volume proxy)
      return base + (numItems - 1) * perAdditional;
    };
    const shippingCost = isPickup ? 0 : (clientShippingCost || calculateShippingCents(items.length));

    // Convert cart items to Stripe line items
    const lineItems = items.map((item: unknown) => {
      const i = item as { name: string; description: string; price: number; quantity: number };
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: i.name,
            description: i.description,
          },
          unit_amount: i.price,
        },
        quantity: i.quantity,
      };
    });

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
