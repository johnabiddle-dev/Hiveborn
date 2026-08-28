import { COPY } from '@/lib/copy';

export interface Product {
  id: number;
  name: string;
  price: number; // in cents for Stripe
  description: string;
  image: string; // URL or path
}

// Pint jar only. Half-pint (id 2) and Reaper Infused Hot Honey (id 4) are not sold.
export const HONEY_PRODUCT_IDS = [3];
export const FEATURED_PRODUCT_ID = 3;

const SELLABLE_IDS = new Set([1, 3, 5]);

export const PRODUCTS: Product[] = [
  {
    id: 3,
    name: "Hive Fresh Honey — pint jar (16 oz mason / 20 oz by weight) — $20",
    price: 2000,
    description: "A 16 oz mason jar filled with 20 oz of honey by weight. Fresh, hand-harvested from the hive.",
    image: "/images/honey-large.jpeg",
  },
  {
    id: 5,
    name: "Summer Lotion",
    price: 1400,
    description: "4 fl oz. Packaged in glass resealable jar. Ingredients: Organic jojoba oil, organic unrefined coconut oil, Wagyu beef tallow, organic and non-nano & uncoated zinc oxide, and Hiveborn beeswax.",
    image: "/images/summer-lotion.png",
  },
  {
    id: 1,
    name: "Honey Dipper",
    price: 300,
    description: "Classic wooden honey dipper for drizzling.",
    image: "/images/honey-dipper.jpeg",
  },
];

export function isSellableProductId(id: number): boolean {
  return SELLABLE_IDS.has(id);
}

export function keepSellableCartItems<T extends { id: number }>(items: T[]): T[] {
  return items.filter((item) => isSellableProductId(item.id));
}

export function productShipNote(id: number): string {
  return HONEY_PRODUCT_IDS.includes(id) ? COPY.honeyShipNote : COPY.otherShipNote;
}
