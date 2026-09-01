import { COPY } from '@/lib/copy';

export interface Product {
  id: number;
  name: string;
  price: number; // in cents for Stripe
  description: string;
  image: string; // URL or path
  inStock: boolean;
}

export const HONEY_PRODUCT_IDS = [2, 3, 4]; // Honey 1/2 pint, pint jar 20 oz, Reaper Infused Hot Honey 1/2 pint
export const FEATURED_PRODUCT_ID = 4;

// Products from https://www.hiveborn.com
// Images now served locally from /public/images/ (copied from ~/Desktop/Hiveborn Images/)
export const PRODUCTS: Product[] = [
  {
    id: 4,
    name: "Reaper Infused Hot Honey 1/2 pint",
    price: 1500,
    description: "1/2 pint of spicy reaper-infused hot honey for a sweet kick.",
    image: "/images/hot-honey.png",
    inStock: false,
  },
  {
    id: 2,
    name: "Hive Fresh Honey Gift Set — 8 oz (half-pint)",
    price: 1200,
    description:
      "Gift set: 8 oz (half-pint) mason jar of fresh, hand-harvested honey, packed in a gift bag with a wooden dipper.",
    image: "/images/honey-medium.jpeg",
    inStock: true,
  },
  {
    id: 3,
    name: "Hive Fresh Honey Gift Set — pint jar (16 oz mason, 20 oz by weight)",
    price: 2000,
    description:
      "Gift set: a 16 oz mason jar filled with 20 oz of honey by weight, packed in a gift bag with a wooden dipper. Fresh, hand-harvested from the hive.",
    image: "/images/honey-large.jpeg",
    inStock: true,
  },
  {
    id: 5,
    name: "Summer Lotion",
    price: 1400,
    description: "4 fl oz. Packaged in glass resealable jar. Ingredients: Organic jojoba oil, organic unrefined coconut oil, Wagyu beef tallow, organic and non-nano & uncoated zinc oxide, and Hiveborn beeswax.",
    image: "/images/summer-lotion.png",
    inStock: true,
  },
  {
    id: 1,
    name: "Honey Dipper",
    price: 300,
    description: "Classic wooden honey dipper for drizzling.",
    image: "/images/honey-dipper.jpeg",
    inStock: true,
  },
];

export function isPurchasable(id: number): boolean {
  const product = PRODUCTS.find((p) => p.id === id);
  return product?.inStock === true;
}

/** Overlay catalog name/price/description so cart copy cannot stay stale in localStorage. */
export function withCatalogFields<T extends { id: number }>(item: T): T {
  const product = PRODUCTS.find((p) => p.id === item.id);
  if (!product) return item;
  return {
    ...item,
    name: product.name,
    price: product.price,
    description: product.description,
    image: product.image,
  };
}

export function productShipNote(id: number): string {
  return HONEY_PRODUCT_IDS.includes(id) ? COPY.honeyShipNote : COPY.otherShipNote;
}
