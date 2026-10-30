import { planFulfillment, type FulfillmentPlan } from '@/lib/fulfillment';
import { PRODUCTS, Product, isPublished } from '@/lib/products';

export const MAX_QUANTITY_PER_ITEM = 99;

// Server-side catalog lookup so prices/names never depend on client input.
const PRODUCT_BY_ID = new Map<number, Product>(PRODUCTS.map((p) => [p.id, p]));

export interface ResolvedItem {
  id: number;
  quantity: number;
  name: string;
  description: string;
  price: number; // cents, from the server catalog
}

export interface StripeLineItem {
  price_data: {
    currency: 'usd';
    product_data: { name: string; description: string };
    unit_amount: number;
  };
  quantity: number;
}

export type ResolveResult =
  | {
      ok: true;
      resolvedItems: ResolvedItem[];
      hasHoneyItems: boolean;
      hasAccessoryItems: boolean;
      plan: (requestedPickup: boolean) => FulfillmentPlan;
    }
  | { ok: false; error: string };

// Resolve raw client cart lines against the server catalog. Only the product id
// and quantity are trusted from the client; price/name/description always come
// from PRODUCTS. This is what prevents price tampering (e.g. paying $0.01 for honey).
export function resolveCartItems(items: unknown): ResolveResult {
  if (!Array.isArray(items) || items.length === 0) {
    return { ok: false, error: 'Cart is empty' };
  }

  const resolvedItems: ResolvedItem[] = [];
  for (const raw of items) {
    const i = raw as { id?: unknown; quantity?: unknown };
    const id = Number(i?.id);
    const quantity = Number(i?.quantity);
    const product = Number.isInteger(id) ? PRODUCT_BY_ID.get(id) : undefined;
    if (!isPublished(product)) {
      return { ok: false, error: `Unknown product in cart (id: ${String(i?.id)}).` };
    }
    if (!product.inStock) {
      return { ok: false, error: `${product.name} is out of stock.` };
    }
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY_PER_ITEM) {
      return { ok: false, error: `Invalid quantity for ${product.name}.` };
    }
    resolvedItems.push({
      id: product.id,
      quantity,
      name: product.name,
      description: product.description,
      price: product.price,
    });
  }

  return {
    ok: true,
    resolvedItems,
    hasHoneyItems: resolvedItems.some((item) => PRODUCT_BY_ID.get(item.id)?.kind === 'honey'),
    hasAccessoryItems: resolvedItems.some((item) => PRODUCT_BY_ID.get(item.id)?.kind === 'accessory'),
    plan: (requestedPickup: boolean) => planFulfillment(resolvedItems, requestedPickup),
  };
}

// Hiveborn's own shipping (honey + house items) is priced by total jar count in
// lib/shipping.ts and charged through Stripe Checkout shipping_options.
//
// Kitchen add-ons (currently unpublished) are supplier-dropshipped and keep their
// legacy flat charge as a separate line item: $11 for the first distinct add-on,
// +$4 per additional distinct add-on.
export function calculateDropshipCents(accessoryLineCount: number): number {
  if (accessoryLineCount <= 0) return 0;
  return 1100 + (accessoryLineCount - 1) * 400;
}

export function subtotalCents(items: Array<{ price: number; quantity: number }>): number {
  return items.reduce((sum, i) => sum + i.price * i.quantity, 0);
}

export function toStripeLineItems(resolvedItems: ResolvedItem[]): StripeLineItem[] {
  return resolvedItems.map((i) => ({
    price_data: {
      currency: 'usd',
      product_data: { name: i.name, description: i.description },
      unit_amount: i.price,
    },
    quantity: i.quantity,
  }));
}
