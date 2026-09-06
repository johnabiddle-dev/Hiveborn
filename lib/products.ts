import { COPY } from '@/lib/copy';

export type ProductKind = 'honey' | 'house' | 'accessory';
export type Fulfillment = 'pickup_or_va_ship' | 'pickup_or_us_ship' | 'dropship';

export interface Product {
  id: number;
  slug: string;
  name: string;
  price: number; // in cents for Stripe
  description: string;
  image: string; // URL or path — primary / web crop
  cardImage?: string; // optional square crop for shop cards and cart thumbs
  inStock: boolean;
  kind: ProductKind;
  fulfillment: Fulfillment;
  /** Optional Amazon reference ASIN for sourcing — not a buy link. */
  amazonAsin?: string;
}

export const HONEY_PRODUCT_IDS = [2, 3, 4]; // Honey 1/2 pint, pint jar 20 oz, Reaper Infused Hot Honey 1/2 pint
export const ACCESSORY_PRODUCT_IDS = [6, 7];
export const FEATURED_PRODUCT_ID = 4;

// Products from https://www.hiveborn.com
// Images now served locally from /public/images/ (copied from ~/Desktop/Hiveborn Images/)
export const PRODUCTS: Product[] = [
  {
    id: 4,
    slug: 'reaper-infused-hot-honey-half-pint',
    name: 'Reaper Infused Hot Honey 1/2 pint',
    price: 1500,
    description: '1/2 pint of spicy reaper-infused hot honey for a sweet kick.',
    image: '/images/hot-honey.png',
    inStock: false,
    kind: 'honey',
    fulfillment: 'pickup_or_va_ship',
  },
  {
    id: 2,
    slug: 'hive-fresh-honey-gift-set-half-pint',
    name: 'Hive Fresh Honey Gift Set — half-pint jar (8 oz mason, 10 oz by weight)',
    price: 1500,
    description:
      'Gift set: an 8 oz mason jar filled with 10 oz of honey by weight, packed in a gift bag with a wooden dipper. Fresh, hand-harvested from the hive.',
    image: '/images/hero-8oz-web.jpg',
    cardImage: '/images/hero-8oz-square.jpg',
    inStock: true,
    kind: 'honey',
    fulfillment: 'pickup_or_va_ship',
  },
  {
    id: 3,
    slug: 'hive-fresh-honey-gift-set-pint',
    name: 'Hive Fresh Honey Gift Set — pint jar (16 oz mason, 20 oz by weight)',
    price: 2500,
    description:
      'Gift set: a 16 oz mason jar filled with 20 oz of honey by weight, packed in a gift bag with a wooden dipper. Fresh, hand-harvested from the hive.',
    image: '/images/hero-pint-web.jpg',
    cardImage: '/images/hero-pint-square.jpg',
    inStock: true,
    kind: 'honey',
    fulfillment: 'pickup_or_va_ship',
  },
  {
    id: 6,
    slug: 'wide-mouth-mason-jar-pump-lids-2-pack',
    name: 'Wide-Mouth Mason Jar Pump Lids (2-Pack) — Kitchen Add-On',
    price: 1499,
    description:
      'Kitchen add-on, not Hiveborn honey. A 2-pack of pump lids for standard wide-mouth mason jars (about 86 mm). Use on jars you already own, or as an add-on if your Hiveborn gift jar is wide-mouth. Confirm mouth size before ordering — these do not fit regular-mouth jars.',
    image: '/images/wide-mouth-pump-lids.svg',
    cardImage: '/images/wide-mouth-pump-lids.svg',
    inStock: true,
    kind: 'accessory',
    fulfillment: 'dropship',
    amazonAsin: 'B0GKZSTKNM',
  },
  {
    id: 7,
    slug: 'regular-mouth-stainless-mason-lid-honey-dipper',
    name: 'Regular-Mouth Stainless Mason Lid with Built-In Honey Dipper — Kitchen Add-On',
    price: 1299,
    description:
      'Kitchen add-on, not Hiveborn honey. A stainless lid with a built-in dipper for standard regular-mouth mason jars (about 70 mm). Use on jars you already own, or as an add-on if your Hiveborn gift jar is regular-mouth. Confirm mouth size before ordering — this does not fit wide-mouth jars.',
    image: '/images/regular-mouth-dipper-lid.svg',
    cardImage: '/images/regular-mouth-dipper-lid.svg',
    inStock: true,
    kind: 'accessory',
    fulfillment: 'dropship',
    amazonAsin: 'B0C49HMP73',
  },
  {
    id: 5,
    slug: 'summer-lotion',
    name: 'Summer Lotion',
    price: 1400,
    description: '4 fl oz. Packaged in glass resealable jar. Ingredients: Organic jojoba oil, organic unrefined coconut oil, Wagyu beef tallow, organic and non-nano & uncoated zinc oxide, and Hiveborn beeswax.',
    image: '/images/summer-lotion.png',
    inStock: true,
    kind: 'house',
    fulfillment: 'pickup_or_us_ship',
  },
  {
    id: 1,
    slug: 'honey-dipper',
    name: 'Honey Dipper',
    price: 300,
    description: 'Classic wooden honey dipper for drizzling.',
    image: '/images/honey-dipper.jpeg',
    inStock: true,
    kind: 'house',
    fulfillment: 'pickup_or_us_ship',
  },
];

export function getProductById(id: number): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function productPath(product: Pick<Product, 'slug'>): string {
  return `/product/${product.slug}`;
}

export function isHoneyProduct(id: number): boolean {
  return getProductById(id)?.kind === 'honey';
}

export function isAccessoryProduct(id: number): boolean {
  return getProductById(id)?.kind === 'accessory';
}

export function isHouseProduct(id: number): boolean {
  return getProductById(id)?.kind === 'house';
}

export function isPurchasable(id: number): boolean {
  const product = getProductById(id);
  return product?.inStock === true;
}

/** Overlay catalog name/price/description so cart copy cannot stay stale in localStorage. */
export function withCatalogFields<T extends { id: number }>(item: T): T {
  const product = getProductById(item.id);
  if (!product) return item;
  return {
    ...item,
    name: product.name,
    price: product.price,
    description: product.description,
    image: product.image,
    cardImage: product.cardImage,
    slug: product.slug,
    kind: product.kind,
    fulfillment: product.fulfillment,
  };
}

export function productShipNote(id: number): string {
  const product = getProductById(id);
  if (product?.kind === 'accessory') return COPY.accessoryShipNote;
  return product?.kind === 'honey' ? COPY.honeyShipNote : COPY.otherShipNote;
}

export const HONEY_PRODUCTS = PRODUCTS.filter((p) => p.kind === 'honey');
export const ACCESSORY_PRODUCTS = PRODUCTS.filter((p) => p.kind === 'accessory');
export const HOUSE_PRODUCTS = PRODUCTS.filter((p) => p.kind === 'house');
