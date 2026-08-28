import { HONEY_PRODUCT_IDS, PRODUCTS, Product } from '@/lib/products';

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
  | { ok: true; resolvedItems: ResolvedItem[]; hasHoneyItems: boolean }
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
    if (!product) {
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

  const hasHoneyItems = resolvedItems.some((item) => HONEY_PRODUCT_IDS.includes(item.id));
  return { ok: true, resolvedItems, hasHoneyItems };
}

// Server-authoritative shipping. Matches the client order-summary formula
// (per distinct line item) so the charged total equals what the customer saw.
export function calculateShippingCents(numLineItems: number): number {
  if (numLineItems === 0) return 0;
  const base = 1100; // minimum $11.00
  const perAdditional = 400; // +$4 per additional item (simple volume proxy)
  return base + (numLineItems - 1) * perAdditional;
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
