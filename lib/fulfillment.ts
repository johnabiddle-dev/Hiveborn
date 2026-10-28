import { COPY } from '@/lib/copy';
import {
  getProductById,
  isAccessoryProduct,
  isHoneyProduct,
  isHouseProduct,
} from '@/lib/products';

export function isVirginia(state: string): boolean {
  const a = state.toUpperCase().trim();
  return a === 'VA' || a.includes('VIRGINIA');
}

export function isNonContinental(state: string): boolean {
  const a = state.toUpperCase().trim();
  return a === 'AK' || a === 'HI' || a.includes('ALASKA') || a.includes('HAWAII');
}

export interface FulfillmentPlan {
  hasHoneyItems: boolean;
  hasHouseItems: boolean;
  hasAccessoryItems: boolean;
  pickupEligible: boolean;
  /** Honey stays pickup whenever kitchen add-ons are also in the cart. */
  honeyForcedPickup: boolean;
  /** Pickup applies only to honey/house line items. Accessories always ship. */
  honeyHousePickup: boolean;
  honeyShips: boolean;
  houseShips: boolean;
  accessoriesShip: boolean;
  isSplitFulfillment: boolean;
  /** Distinct line items that ship (kept for metadata compatibility). */
  shippingLineCount: number;
  /**
   * Total jars/units Hiveborn ships itself: the SUM OF QUANTITIES of honey + house
   * items when they ship (0 for pickup). Shipping is priced from this, not from
   * the number of distinct products.
   */
  shippedJarCount: number;
  /** Distinct kitchen add-on (supplier dropship) lines. */
  accessoryLineCount: number;
}

export function planFulfillment(
  items: Array<{ id: number; quantity?: number }>,
  requestedPickup: boolean
): FulfillmentPlan {
  const hasHoneyItems = items.some((item) => isHoneyProduct(item.id));
  const hasHouseItems = items.some((item) => isHouseProduct(item.id));
  const hasAccessoryItems = items.some((item) => isAccessoryProduct(item.id));
  const pickupEligible = hasHoneyItems || hasHouseItems;
  const honeyForcedPickup = hasHoneyItems && hasAccessoryItems;
  const honeyHousePickup = (pickupEligible && requestedPickup) || honeyForcedPickup;
  const honeyShips = hasHoneyItems && !honeyHousePickup;
  const houseShips = hasHouseItems && !honeyHousePickup;
  const accessoriesShip = hasAccessoryItems;
  const shippingLineCount = items.filter((item) => {
    if (isAccessoryProduct(item.id)) return true;
    if (isHoneyProduct(item.id) || isHouseProduct(item.id)) return !honeyHousePickup;
    return false;
  }).length;
  const shippedJarCount = honeyHousePickup
    ? 0
    : items.reduce((sum, item) => {
        if (!isHoneyProduct(item.id) && !isHouseProduct(item.id)) return sum;
        const qty = Number(item.quantity ?? 1);
        return sum + (Number.isFinite(qty) && qty > 0 ? Math.floor(qty) : 0);
      }, 0);
  const accessoryLineCount = items.filter((item) => isAccessoryProduct(item.id)).length;

  return {
    hasHoneyItems,
    hasHouseItems,
    hasAccessoryItems,
    pickupEligible,
    honeyForcedPickup,
    honeyHousePickup,
    honeyShips,
    houseShips,
    accessoriesShip,
    isSplitFulfillment: honeyHousePickup && hasAccessoryItems,
    shippingLineCount,
    shippedJarCount,
    accessoryLineCount,
  };
}

export type AddressCheck =
  | { ok: true }
  | { ok: false; error: string; reason: 'honey_outside_va' | 'non_continental' };

export function validateShipDestination(
  plan: FulfillmentPlan,
  state: string
): AddressCheck {
  if (plan.honeyShips && !isVirginia(state)) {
    return { ok: false, error: COPY.honeyOutsideVa, reason: 'honey_outside_va' };
  }
  if ((plan.accessoriesShip || plan.houseShips || plan.honeyShips) && isNonContinental(state)) {
    return { ok: false, error: COPY.continentalOnly, reason: 'non_continental' };
  }
  return { ok: true };
}

/** Description for the kitchen add-on (supplier dropship) line item. Hiveborn's own
 * shipping is charged via Stripe Checkout shipping_options, not a line item. */
export function shippingLineDescription(plan: FulfillmentPlan): string {
  if (plan.isSplitFulfillment) {
    return 'Kitchen add-on shipping — supplier dropships separately from honey/house pickup';
  }
  if (plan.honeyShips || plan.houseShips) {
    return 'Kitchen add-on shipping — supplier dropships separately from Hiveborn items';
  }
  return 'Kitchen add-on shipping — supplier dropships to your address';
}

export function checkoutShippingLabel(plan: FulfillmentPlan): string {
  if (plan.shippingLineCount === 0) {
    return COPY.checkoutPickupLine;
  }
  if (plan.isSplitFulfillment) {
    return COPY.checkoutShippingSplit;
  }
  if (plan.honeyShips) {
    return COPY.checkoutShippingHoney;
  }
  if (plan.accessoriesShip) {
    return COPY.checkoutShippingAccessory;
  }
  return COPY.checkoutShippingOther;
}

export function formatAddress(address: {
  name?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
} | null | undefined): string {
  if (!address) return '';
  const line2 = [address.city, address.state, address.zip].filter(Boolean).join(' ');
  return [address.name, address.address, line2].filter(Boolean).join('\n');
}

export function fulfillmentCustomerText(
  plan: FulfillmentPlan,
  addressText: string,
  shippingMethodName?: string
): string {
  const parts: string[] = [];
  if (plan.isSplitFulfillment) {
    parts.push(COPY.splitFulfillmentHeadline);
  }
  if (plan.honeyHousePickup) {
    parts.push(COPY.webhookPickup);
  }
  if (plan.honeyShips || plan.houseShips) {
    parts.push(
      shippingMethodName
        ? `Hiveborn ships via ${shippingMethodName} to:\n${addressText}`
        : `Hiveborn ships to:\n${addressText}`
    );
  }
  if (plan.accessoriesShip) {
    parts.push(`${COPY.webhookDropship}\n${addressText}`);
  }
  return parts.join('\n\n');
}

export function successFulfillmentMessage(plan: FulfillmentPlan): string {
  if (plan.isSplitFulfillment) {
    return COPY.successSplit;
  }
  if (plan.honeyHousePickup) {
    return COPY.successPickup;
  }
  if (plan.accessoriesShip && !plan.honeyShips && !plan.houseShips) {
    return COPY.successDropship;
  }
  return COPY.successShip;
}

export function successFulfillmentBadge(plan: FulfillmentPlan): string {
  if (plan.isSplitFulfillment) return COPY.successSplitBadge;
  if (plan.honeyHousePickup) return COPY.successPickupBadge;
  if (plan.accessoriesShip) return COPY.successDropshipBadge;
  return COPY.successShipBadge;
}

export function lineFulfillmentLabel(id: number, plan: FulfillmentPlan): string {
  const product = getProductById(id);
  if (product?.kind === 'accessory') return COPY.lineAccessoryFulfillment;
  if (plan.honeyHousePickup) return COPY.linePickupFulfillment;
  if (product?.kind === 'honey') return COPY.lineHoneyShipFulfillment;
  return COPY.lineHouseShipFulfillment;
}

export function serializeFulfillmentMetadata(plan: FulfillmentPlan): Record<string, string> {
  return {
    hasHoneyItems: String(plan.hasHoneyItems),
    hasHouseItems: String(plan.hasHouseItems),
    hasAccessoryItems: String(plan.hasAccessoryItems),
    isPickup: String(plan.honeyHousePickup),
    isSplitFulfillment: String(plan.isSplitFulfillment),
    accessoriesShip: String(plan.accessoriesShip),
    honeyShips: String(plan.honeyShips),
    houseShips: String(plan.houseShips),
    shippingLineCount: String(plan.shippingLineCount),
    shippedJarCount: String(plan.shippedJarCount),
    accessoryLineCount: String(plan.accessoryLineCount),
  };
}

export function planFromMetadata(metadata: Record<string, string> | null | undefined): FulfillmentPlan {
  const m = metadata || {};
  const honeyHousePickup = m.isPickup === 'true';
  const hasHoneyItems = m.hasHoneyItems === 'true';
  const hasHouseItems = m.hasHouseItems === 'true';
  const hasAccessoryItems = m.hasAccessoryItems === 'true' || m.accessoriesShip === 'true';
  return {
    hasHoneyItems,
    hasHouseItems,
    hasAccessoryItems,
    pickupEligible: hasHoneyItems || hasHouseItems,
    honeyForcedPickup: hasHoneyItems && hasAccessoryItems,
    honeyHousePickup,
    honeyShips: m.honeyShips === 'true',
    houseShips: m.houseShips === 'true',
    accessoriesShip: m.accessoriesShip === 'true' || hasAccessoryItems,
    isSplitFulfillment: m.isSplitFulfillment === 'true',
    shippingLineCount: Number(m.shippingLineCount) || 0,
    shippedJarCount: Number(m.shippedJarCount) || 0,
    accessoryLineCount: Number(m.accessoryLineCount) || 0,
  };
}
