/**
 * Hiveborn shipping rates, by total jar count (sum of quantities of every
 * Hiveborn item that ships — not the number of distinct products).
 *
 * Rates are USPS-based estimates at real packed weight (jar + honey + padding
 * + box). Pickup in New Market stays free and is the default. Honey still ships
 * to Virginia addresses only (gated in lib/fulfillment.ts).
 *
 * Prices are set here in code and sent to Stripe Checkout as inline
 * `shipping_rate_data`, so nothing has to be configured in the Stripe Dashboard.
 */

/** Free USPS Ground Advantage when the product subtotal is at least $100. */
export const FREE_GROUND_THRESHOLD_CENTS = 10000;

/** Largest jar count covered by one box/tier. Bigger orders are priced per box. */
export const JARS_PER_BOX = 8;

export type ShippingMethod = 'pickup' | 'usps_ground_advantage' | 'usps_priority_mail';

export interface ShippingQuote {
  method: ShippingMethod;
  /** Shown to the customer in Stripe Checkout and the confirmation email. */
  displayName: string;
  amountCents: number;
  /** Business days. */
  deliveryEstimate?: { min: number; max: number };
}

/** USPS Ground Advantage tiers: 1–2 jars $12, 3–4 jars $14, 5–8 jars $18. */
export function groundAdvantageTierCents(jars: number): number {
  if (jars <= 0) return 0;
  if (jars <= 2) return 1200;
  if (jars <= 4) return 1400;
  if (jars <= JARS_PER_BOX) return 1800;
  // 9+ jars: price as multiple boxes (one 5–8 box each, plus the remainder's tier).
  // NOTE: 9+ jar pricing needs review against real packed weights.
  const fullBoxes = Math.floor(jars / JARS_PER_BOX);
  const remainder = jars % JARS_PER_BOX;
  return fullBoxes * 1800 + groundAdvantageTierCents(remainder);
}

/** USPS Priority Mail tiers: 1–2 jars $16, 3–4 jars $19, 5–8 jars $22. Never free. */
export function priorityMailTierCents(jars: number): number {
  if (jars <= 0) return 0;
  if (jars <= 2) return 1600;
  if (jars <= 4) return 1900;
  if (jars <= JARS_PER_BOX) return 2200;
  // 9+ jars: price as multiple boxes. NOTE: needs review against real packed weights.
  const fullBoxes = Math.floor(jars / JARS_PER_BOX);
  const remainder = jars % JARS_PER_BOX;
  return fullBoxes * 2200 + priorityMailTierCents(remainder);
}

/** Ground Advantage price after the $100 free-shipping threshold. */
export function groundAdvantageCents(jars: number, subtotalCents: number): number {
  if (jars <= 0) return 0;
  if (subtotalCents >= FREE_GROUND_THRESHOLD_CENTS) return 0;
  return groundAdvantageTierCents(jars);
}

/** Priority Mail is always full price (free threshold does not apply). */
export function priorityMailCents(jars: number): number {
  return priorityMailTierCents(jars);
}

export const PICKUP_QUOTE: ShippingQuote = {
  method: 'pickup',
  displayName: 'Free pickup in New Market, VA',
  amountCents: 0,
};

/** Shipping choices for Hiveborn items that ship. Cheapest (Ground Advantage) first. */
export function shippingQuotes(jars: number, subtotalCents: number): ShippingQuote[] {
  if (jars <= 0) return [];
  const groundCents = groundAdvantageCents(jars, subtotalCents);
  return [
    {
      method: 'usps_ground_advantage',
      displayName: groundCents === 0
        ? 'USPS Ground Advantage — free on orders $100+'
        : 'USPS Ground Advantage',
      amountCents: groundCents,
      deliveryEstimate: { min: 2, max: 5 },
    },
    {
      method: 'usps_priority_mail',
      displayName: 'USPS Priority Mail',
      amountCents: priorityMailCents(jars),
      deliveryEstimate: { min: 1, max: 3 },
    },
  ];
}

export interface StripeShippingOption {
  shipping_rate_data: {
    type: 'fixed_amount';
    fixed_amount: { amount: number; currency: 'usd' };
    display_name: string;
    delivery_estimate?: {
      minimum: { unit: 'business_day'; value: number };
      maximum: { unit: 'business_day'; value: number };
    };
    metadata: Record<string, string>;
  };
}

export function toStripeShippingOption(quote: ShippingQuote, jars: number): StripeShippingOption {
  return {
    shipping_rate_data: {
      type: 'fixed_amount',
      fixed_amount: { amount: quote.amountCents, currency: 'usd' },
      display_name: quote.displayName,
      ...(quote.deliveryEstimate
        ? {
            delivery_estimate: {
              minimum: { unit: 'business_day' as const, value: quote.deliveryEstimate.min },
              maximum: { unit: 'business_day' as const, value: quote.deliveryEstimate.max },
            },
          }
        : {}),
      metadata: { method: quote.method, jarCount: String(jars) },
    },
  };
}

/**
 * Stripe Checkout `shipping_options` for an order. Pickup orders get a single
 * free pickup option; shipped orders get Ground Advantage (default) and Priority.
 */
export function buildStripeShippingOptions(args: {
  pickup: boolean;
  jars: number;
  subtotalCents: number;
}): StripeShippingOption[] {
  if (args.pickup || args.jars <= 0) {
    return [toStripeShippingOption(PICKUP_QUOTE, 0)];
  }
  return shippingQuotes(args.jars, args.subtotalCents).map((q) => toStripeShippingOption(q, args.jars));
}

export function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}
