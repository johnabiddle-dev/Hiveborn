export const CONTACT_EMAIL = 'johnabiddle@gmail.com';
export const CONTACT_PHONE = '540-400-4586';
export const PICKUP_ADDRESS = '93 Runaway Ln, New Market, VA 22844';
/** Driveway entrance — Maps often sends the street address to the neighbor on Run Away Ln. */
export const PICKUP_MAPS_PIN = 'https://www.google.com/maps?q=38.6449831,-78.6259750';
export const PICKUP_MAPS_NOTE = `Google Maps often routes to the neighbor — use this pin for the driveway entrance: ${PICKUP_MAPS_PIN}.`;
export const PICKUP_SCHEDULE_NOTE = `To schedule pickup, email ${CONTACT_EMAIL} or text ${CONTACT_PHONE}.`;

/** Customer-facing pickup + shipping copy. Pickup is order-online, email to schedule — hours vary, not walk-in. */
export const COPY = {
  metaTitle: 'Hiveborn — Raw honey from New Market, VA',
  metaDescription:
    'Raw, unfiltered honey from New Market, Virginia. Order online and email johnabiddle@gmail.com to schedule pickup at the house. Honey ships in Virginia only. Kitchen mason-jar add-ons are supplier-dropshipped separately.',
  heroSub: 'Raw honey from New Market, Virginia.',
  heroPickup:
    'Order online and email johnabiddle@gmail.com to schedule pickup at the house, or we ship honey inside Virginia. Kitchen add-ons ship separately via supplier dropship.',
  honeyShipNote: 'VA shipping, or email johnabiddle@gmail.com to schedule pickup at the house.',
  otherShipNote: 'Ships continental US, or email johnabiddle@gmail.com to schedule pickup at the house.',
  accessoryShipNote:
    'Kitchen add-on — not Hiveborn honey. Supplier dropships from overseas (often China). Typical delivery 2–4 weeks. Hiveborn does not inventory or ship this.',
  accessoryPageShipNote:
    'This is a kitchen add-on for mason jars you already own (or for a Hiveborn gift jar if the mouth size matches). It is not cottage-food honey and is not sold as Hiveborn honey. Hiveborn does not inventory or ship this item — a supplier dropships it to the address you give at checkout. These lids typically ship from China or another international warehouse. Plan on about 2–4 weeks. Exact CJ / AliExpress listing URLs will be wired when John can log into those accounts. Continental US only.',
  kitchenAddOnsHeading: 'Kitchen add-ons',
  kitchenAddOnsIntro:
    'Mason-jar lids and pumps for jars you already own, or as an add-on for our gift jars if the mouth size matches. These are not Hiveborn honey. A supplier dropships them from overseas (often China; typically 2–4 weeks).',
  cartDrawerNote:
    'Honey pickup at the house is free — email johnabiddle@gmail.com to schedule. Kitchen add-ons always ship separately (supplier dropship). Virginia honey shipping starts at $11.',
  pickupMapsNote: PICKUP_MAPS_NOTE,
  pickupScheduleNote: PICKUP_SCHEDULE_NOTE,
  pickupShippingBlurb: `Order online, then email ${CONTACT_EMAIL} to schedule pickup at the house (${PICKUP_ADDRESS}) — free. Hours vary; email first. ${PICKUP_MAPS_NOTE} Honey ships in Virginia only. Summer Lotion and Dipper ship continental US. Kitchen mason-jar add-ons are supplier-dropshipped separately and cannot be picked up.`,
  footerPickup: 'New Market, VA · Email johnabiddle@gmail.com to schedule pickup ·',
  footerHoney: 'Honey ships in Virginia only. Kitchen add-ons dropship separately.',
  cartPageNote: `Order online, then email ${CONTACT_EMAIL} to schedule pickup at the house (${PICKUP_ADDRESS}) — free. Hours vary; email first. ${PICKUP_MAPS_NOTE} Virginia honey shipping starts at $11. Honey ships in Virginia only. Kitchen add-ons always require a ship-to address — supplier dropships them separately.`,
  cartSplitNote:
    'Mixed cart: honey gift sets stay pickup at the house (email to schedule). Kitchen add-ons always ship to your address via supplier dropship.',
  checkoutIntro: `Order online, then email ${CONTACT_EMAIL} to schedule pickup at the house (${PICKUP_ADDRESS}). Hours vary; email first. Honey ships in Virginia; lotion and dippers ship continental US. Kitchen add-ons always ship separately (supplier dropship).`,
  checkoutPickupLabel: 'Pickup honey / house items at the house — free. Email to schedule.',
  checkoutPickupHint: `Pickup is at ${PICKUP_ADDRESS}. Hours vary — email ${CONTACT_EMAIL} to schedule. When you pick up you can see the bees that made it. ${PICKUP_MAPS_NOTE}`,
  checkoutUncheck: 'Uncheck only if you need Hiveborn to ship honey or house items.',
  checkoutPickupWithAccessories:
    'Honey gift sets in a mixed cart stay pickup-only. Kitchen add-ons still ship to the address below via supplier dropship.',
  checkoutPickupLine: 'Pickup at the house (free)',
  checkoutShippingHoney: 'Virginia shipping starts at $11',
  checkoutShippingOther: 'Shipping starts at $11',
  checkoutShippingAccessory: 'Kitchen add-on shipping (supplier dropship) starts at $11',
  checkoutShippingSplit: 'Kitchen add-on shipping (honey is pickup) starts at $11',
  checkoutPickupTotal: 'Pickup total',
  checkoutShippingNote:
    'Virginia honey shipping starts at $11 when you are not picking up. Honey gift sets in a mixed cart stay pickup-only. Summer Lotion, Honey Dipper, and kitchen add-ons ship continental US. Kitchen add-ons are supplier-dropshipped from overseas (often China; typically 2–4 weeks).',
  checkoutSplitBanner:
    'Split fulfillment: honey gift sets stay pickup at the house (email to schedule). Kitchen add-ons ship separately to the address below — a supplier dropships them from overseas (often China; typically 2–4 weeks). Hiveborn does not inventory or ship the lids.',
  checkoutAccessoryOnlyNote:
    'Kitchen add-ons cannot be picked up. Enter the ship-to address — the supplier dropships from overseas (often China). Typical delivery 2–4 weeks.',
  checkoutAddressHoney: 'Pickup / Contact Information',
  checkoutAddressShip: 'Shipping Address',
  checkoutAddressSplit: 'Ship-to address for kitchen add-ons (also used as pickup contact)',
  honeyOutsideVa: 'Honey cannot ship outside Virginia. Choose pickup at the house or a VA address.',
  honeyOutsideVaAlert: 'Honey can only be shipped to Virginia. Choose pickup at the house or a VA address.',
  continentalOnly: 'We only ship lotion, dippers, and kitchen add-ons in the continental US.',
  checkoutPickupFooter: `Pickup at the house is free — email ${CONTACT_EMAIL} to schedule. Hours vary; email first. No shipping charged for pickup items. You’ll pay on Stripe first.`,
  checkoutPickupAfterPay: `After you pay, email ${CONTACT_EMAIL} or text ${CONTACT_PHONE} to schedule honey / house-item pickup. Hours vary.`,
  checkoutShipFooter: 'Virginia honey shipping starts at $11. Honey products only to Virginia. Kitchen add-ons ship separately via supplier dropship.',
  checkoutSplitFooter:
    'You will pay once. Honey / house items are marked for pickup (email to schedule). Kitchen add-ons ship separately to your address via supplier dropship.',
  successPickup: `Your order is marked for pickup at the house (${PICKUP_ADDRESS}). ${PICKUP_SCHEDULE_NOTE} Hours vary. When you pick up you can see the bees that made it. ${PICKUP_MAPS_NOTE}`,
  successShip: 'Hiveborn items will be shipped to the address you provided.',
  successDropship:
    'Kitchen add-ons will be supplier-dropshipped to the address you provided, typically from China or another international warehouse (about 2–4 weeks). Hiveborn does not inventory or ship these items.',
  successSplit: `Split fulfillment: honey gift sets are pickup at the house (${PICKUP_ADDRESS}). ${PICKUP_SCHEDULE_NOTE} Kitchen add-ons ship separately to your address via supplier dropship (often China; typically 2–4 weeks).`,
  successPickupBadge: '✓ Pickup at the house (email or text to schedule)',
  successShipBadge: '✓ Hiveborn shipping',
  successDropshipBadge: '✓ Kitchen add-ons: supplier dropship',
  successSplitBadge: '✓ Split fulfillment — honey pickup + lids ship',
  webhookPickup: `Pickup at the house (${PICKUP_ADDRESS}). ${PICKUP_SCHEDULE_NOTE} Hours vary. When you pick up you can see the bees that made it. ${PICKUP_MAPS_NOTE}`,
  webhookDropship:
    'Kitchen add-ons (not Hiveborn honey) are supplier-dropshipped separately to this address. Packages typically ship from China or another international warehouse (about 2–4 weeks). Hiveborn does not inventory or ship these items.',
  splitFulfillmentHeadline:
    'This order has split fulfillment: honey / house items are pickup at the house; kitchen add-ons ship separately via supplier dropship.',
  lineAccessoryFulfillment: 'Ships separately — supplier dropship',
  linePickupFulfillment: 'Pickup at the house',
  lineHoneyShipFulfillment: 'Hiveborn ships (Virginia only)',
  lineHouseShipFulfillment: 'Hiveborn ships (continental US)',
  comingSoon: 'Coming soon',
  giftSetNote:
    'Hive Fresh honey is sold as a gift set: mason jar of honey, gift bag, and wooden dipper.',
  kitchenBadge: 'Kitchen add-on',
};
