export interface Product {
  id: number;
  name: string;
  price: number; // in cents for Stripe
  description: string;
  image: string; // URL or path
}

export const HONEY_PRODUCT_IDS = [2, 3, 4]; // Honey 1/2 pint, Honey 1 pint, Reaper Infused Hot Honey 1/2 pint

// Products from https://www.hiveborn.com
// Images now served locally from /public/images/ (copied from ~/Desktop/Hiveborn Images/)
export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Honey Dipper",
    price: 300,
    description: "Classic wooden honey dipper for drizzling.",
    image: "/images/honey-dipper.jpeg",
  },
  {
    id: 2,
    name: "Hive Fresh Hand Harvested Honey 1/2 pint",
    price: 1200,
    description: "1/2 pint jar of fresh, hand-harvested honey from the hive.",
    image: "/images/honey-medium.jpeg",
  },
  {
    id: 3,
    name: "Hive Fresh Hand Harvested Honey 1 pint",
    price: 1800,
    description: "1 pint jar of fresh, hand-harvested honey from the hive.",
    image: "/images/honey-large.jpeg",
  },
  {
    id: 4,
    name: "Reaper Infused Hot Honey 1/2 pint",
    price: 1500,
    description: "1/2 pint of spicy reaper-infused hot honey for a sweet kick.",
    image: "/images/hot-honey.png",
  },
  {
    id: 5,
    name: "Summer Lotion",
    price: 1400,
    description: "4 fl oz. Packaged in glass resealable jar. Ingredients: Organic jojoba oil, organic unrefined coconut oil, Wagyu beef tallow, organic and non-nano & uncoated zinc oxide, and Hiveborn beeswax.",
    image: "/images/summer-lotion.png",
  },
];
