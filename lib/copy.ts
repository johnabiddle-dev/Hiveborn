export const CONTACT_EMAIL = 'johnabiddle@gmail.com';
export const CONTACT_PHONE = '540-400-4586';
export const CONTACT_PHONE_TEL = '5404004586';
/**
 * Public pickup location. The street address is intentionally NOT published
 * anywhere on the site or in customer emails — John texts it after an order.
 */
export const PICKUP_LOCATION = 'New Market, VA';
export const PICKUP_TEXT_NOTE = "We'll text you the pickup address and time after you order.";
export const PICKUP_CONTACT = `text ${CONTACT_PHONE} or email ${CONTACT_EMAIL}`;
export const PICKUP_SCHEDULE_NOTE = `${PICKUP_TEXT_NOTE} Questions? ${PICKUP_CONTACT}.`;
/** Approved site line for the product / pickup / checkout area. */
export const PICKUP_OR_SHIP_TAGLINE =
  'Pick up at the farm and meet the bees, or have it shipped anywhere in Virginia. Shipping is calculated at checkout.';

/** IG/FB conversion line: text is equal to email. */
export const CONVERSION_CTA = `Order at hiveborn.com → Pickup in ${PICKUP_LOCATION}. ${PICKUP_TEXT_NOTE} Questions? ${PICKUP_CONTACT}.`;
export const STICKY_MOBILE_CTA = `Order · Questions? Text ${CONTACT_PHONE}`;

/** Customer-facing pickup + shipping copy. Pickup is order-online; John texts the address and time after the order — not walk-in. */
export const COPY = {
  metaTitle: 'Hiveborn — Raw honey from New Market, VA',
  metaDescription: `Raw, unfiltered honey from New Market, Virginia. ${PICKUP_OR_SHIP_TAGLINE} Questions? ${PICKUP_CONTACT}.`,
  heroSub: 'Local, raw, unfiltered honey from New Market, Virginia.',
  heroPickup: CONVERSION_CTA,
  conversionCta: CONVERSION_CTA,
  stickyMobileCta: STICKY_MOBILE_CTA,
  honeyShipNote: `${PICKUP_OR_SHIP_TAGLINE} Pickup in ${PICKUP_LOCATION} is free. ${PICKUP_TEXT_NOTE} Questions? ${PICKUP_CONTACT}.`,
  otherShipNote: `Ships continental US (shipping calculated at checkout), or free pickup in ${PICKUP_LOCATION}. ${PICKUP_TEXT_NOTE} Questions? ${PICKUP_CONTACT}.`,
  accessoryShipNote:
    'Kitchen add-on — not Hiveborn honey. Supplier dropships from overseas (often China). Typical delivery 2–4 weeks. Hiveborn does not inventory or ship this.',
  accessoryPageShipNote:
    'This is a kitchen add-on for mason jars you already own (or for a Hiveborn gift jar if the mouth size matches). It is not cottage-food honey and is not sold as Hiveborn honey. Hiveborn does not inventory or ship this item — a supplier dropships it to the address you give at checkout. These lids typically ship from China or another international warehouse. Plan on about 2–4 weeks. Exact CJ / AliExpress listing URLs will be wired when John can log into those accounts. Continental US only.',
  kitchenAddOnsHeading: 'Kitchen add-ons',
  kitchenAddOnsIntro:
    'Mason-jar lids and pumps for jars you already own, or as an add-on for our gift jars if the mouth size matches. These are not Hiveborn honey. A supplier dropships them from overseas (often China; typically 2–4 weeks).',
  cartDrawerNote: `${PICKUP_OR_SHIP_TAGLINE} Pickup in ${PICKUP_LOCATION} is free. Questions? ${PICKUP_CONTACT}.`,
  pickupScheduleNote: PICKUP_SCHEDULE_NOTE,
  pickupShippingBlurb: `${PICKUP_OR_SHIP_TAGLINE} Pickup in ${PICKUP_LOCATION} is free. ${PICKUP_TEXT_NOTE} Questions? ${PICKUP_CONTACT}. USPS Ground Advantage starts at $12 and is free on orders $100+; USPS Priority Mail is also available. Honey ships in Virginia only. Summer Lotion and Dipper ship continental US.`,
  footerPickup: 'Pickup in New Market, VA · Ships anywhere in Virginia · Text or email:',
  footerHoney: 'Honey ships in Virginia only.',
  cartPageNote: `${PICKUP_OR_SHIP_TAGLINE} Pickup in ${PICKUP_LOCATION} is free. ${PICKUP_TEXT_NOTE} Questions? ${PICKUP_CONTACT}. Honey ships in Virginia only.`,
  cartSplitNote:
    'Mixed cart: honey gift sets stay pickup in New Market, VA (we’ll text you the address and time). Kitchen add-ons always ship to your address via supplier dropship.',
  checkoutIntro: `${PICKUP_OR_SHIP_TAGLINE} Questions? ${PICKUP_CONTACT}. Honey ships in Virginia; lotion and dippers ship continental US.`,
  checkoutPickupLabel: `Free pickup in ${PICKUP_LOCATION} — come meet the bees.`,
  checkoutPickupHint: `${PICKUP_TEXT_NOTE} Questions? ${PICKUP_CONTACT}.`,
  checkoutUncheck: 'Uncheck to have it shipped. You’ll choose USPS Ground Advantage or Priority Mail on the secure Stripe page.',
  checkoutPickupWithAccessories:
    'Honey gift sets in a mixed cart stay pickup-only. Kitchen add-ons still ship to the address below via supplier dropship.',
  checkoutPickupLine: `Pickup in ${PICKUP_LOCATION} (free)`,
  checkoutShippingHoney: 'Virginia shipping (calculated at checkout)',
  checkoutShippingOther: 'Shipping (calculated at checkout)',
  checkoutShippingAccessory: 'Kitchen add-on shipping (supplier dropship)',
  checkoutShippingSplit: 'Kitchen add-on shipping (honey is pickup)',
  checkoutPickupTotal: 'Pickup total',
  checkoutShippingNote: 'Shipping is calculated at checkout by jar count. USPS Ground Advantage: $12 for 1–2 jars, $14 for 3–4, $18 for 5–8 — free on orders $100+. USPS Priority Mail: $16 / $19 / $22. Honey ships in Virginia only. Summer Lotion and Dipper ship continental US.',
  checkoutSplitBanner:
    'Split fulfillment: honey gift sets stay pickup in New Market, VA (we’ll text you the address and time). Kitchen add-ons ship separately to the address below — a supplier dropships them from overseas (often China; typically 2–4 weeks). Hiveborn does not inventory or ship the lids.',
  checkoutAccessoryOnlyNote:
    'Kitchen add-ons cannot be picked up. Enter the ship-to address — the supplier dropships from overseas (often China). Typical delivery 2–4 weeks.',
  checkoutAddressHoney: 'Contact information (we’ll text you pickup details)',
  checkoutAddressShip: 'Shipping Address',
  checkoutAddressSplit: 'Ship-to address for kitchen add-ons (also used as pickup contact)',
  honeyOutsideVa: `Honey cannot ship outside Virginia. Choose free pickup in ${PICKUP_LOCATION} or a VA address.`,
  honeyOutsideVaAlert: `Honey can only be shipped to Virginia. Choose free pickup in ${PICKUP_LOCATION} or a VA address.`,
  continentalOnly: 'We only ship lotion and dippers in the continental US.',
  checkoutPickupFooter: `Pickup in ${PICKUP_LOCATION} is free — no shipping charged. You’ll pay on Stripe first. ${PICKUP_TEXT_NOTE}`,
  checkoutPickupAfterPay: `After you pay, we'll text you the pickup address and time. You can also ${PICKUP_CONTACT}.`,
  checkoutShipFooter: 'Choose USPS Ground Advantage or Priority Mail on the secure Stripe page. Honey ships to Virginia only.',
  checkoutSplitFooter:
    'You will pay once. Honey / house items are marked for pickup in New Market, VA (we’ll text you the address and time). Kitchen add-ons ship separately to your address via supplier dropship.',
  successPickup: `Your order is marked for pickup in ${PICKUP_LOCATION}. ${PICKUP_SCHEDULE_NOTE} When you pick up you can see the bees that made it.`,
  successShip: 'Hiveborn items will be shipped to the address you provided.',
  successDropship:
    'Kitchen add-ons will be supplier-dropshipped to the address you provided, typically from China or another international warehouse (about 2–4 weeks). Hiveborn does not inventory or ship these items.',
  successSplit: `Split fulfillment: honey gift sets are pickup in ${PICKUP_LOCATION}. ${PICKUP_SCHEDULE_NOTE} Kitchen add-ons ship separately to your address via supplier dropship (often China; typically 2–4 weeks).`,
  successPickupBadge: `✓ Pickup in ${PICKUP_LOCATION} (we’ll text you the address and time)`,
  successShipBadge: '✓ Hiveborn shipping',
  successDropshipBadge: '✓ Kitchen add-ons: supplier dropship',
  successSplitBadge: '✓ Split fulfillment — honey pickup + lids ship',
  webhookPickup: `Pickup in ${PICKUP_LOCATION}. ${PICKUP_SCHEDULE_NOTE} When you pick up you can see the bees that made it.`,
  webhookDropship:
    'Kitchen add-ons (not Hiveborn honey) are supplier-dropshipped separately to this address. Packages typically ship from China or another international warehouse (about 2–4 weeks). Hiveborn does not inventory or ship these items.',
  webhookSplitBanner:
    'Split fulfillment: honey / house items are pickup in New Market, VA (we’ll text you the address and time). Kitchen add-ons ship separately via supplier dropship.',
  splitFulfillmentHeadline:
    'This order has split fulfillment: honey / house items are pickup in New Market, VA; kitchen add-ons ship separately via supplier dropship.',
  lineAccessoryFulfillment: 'Ships separately — supplier dropship',
  linePickupFulfillment: `Pickup in ${PICKUP_LOCATION}`,
  lineHoneyShipFulfillment: 'Hiveborn ships (Virginia only)',
  lineHouseShipFulfillment: 'Hiveborn ships (continental US)',
  comingSoon: 'Coming soon',
  soldOut: 'Sold out',
  giftSetNote:
    'Hive Fresh honey is sold as a gift set: mason jar of honey, gift bag, and wooden dipper.',
  kitchenBadge: 'Kitchen add-on',
};
