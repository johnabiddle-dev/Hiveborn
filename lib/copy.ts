export const CONTACT_EMAIL = 'johnabiddle@gmail.com';
export const PICKUP_ADDRESS = '93 Runaway Ln, New Market, VA 22844';
/** Driveway entrance — Maps often sends the street address to the neighbor on Run Away Ln. */
export const PICKUP_MAPS_PIN = 'https://maps.app.goo.gl/wJg3ERFndpF5vCB67';
export const PICKUP_MAPS_NOTE = `Google Maps often routes to the neighbor — use this pin for the driveway entrance: ${PICKUP_MAPS_PIN}.`;

/** Customer-facing pickup + shipping copy. Pickup is order-online, email to schedule — hours vary, not walk-in. */
export const COPY = {
  metaTitle: 'Hiveborn — Raw honey from New Market, VA',
  metaDescription:
    'Raw, unfiltered honey from New Market, Virginia. Order online and email johnabiddle@gmail.com to schedule pickup at the house. Honey ships in Virginia only.',
  heroSub: 'Raw honey from New Market, Virginia.',
  heroPickup:
    'Order online and email johnabiddle@gmail.com to schedule pickup at the house, or we ship honey inside Virginia.',
  honeyShipNote: 'VA shipping, or email johnabiddle@gmail.com to schedule pickup at the house.',
  otherShipNote: 'Ships continental US, or email johnabiddle@gmail.com to schedule pickup at the house.',
  cartDrawerNote:
    'Pickup at the house is free — email johnabiddle@gmail.com to schedule. Hours vary. Virginia shipping starts at $11.',
  pickupMapsNote: PICKUP_MAPS_NOTE,
  pickupShippingBlurb: `Order online, then email ${CONTACT_EMAIL} to schedule pickup at the house (${PICKUP_ADDRESS}) — free. Hours vary; email first. ${PICKUP_MAPS_NOTE} Honey ships in Virginia only. Summer Lotion and Dipper ship continental US.`,
  footerPickup: 'New Market, VA · Email johnabiddle@gmail.com to schedule pickup ·',
  footerHoney: 'Honey ships in Virginia only.',
  cartPageNote: `Order online, then email ${CONTACT_EMAIL} to schedule pickup at the house (${PICKUP_ADDRESS}) — free. Hours vary; email first. ${PICKUP_MAPS_NOTE} Virginia shipping starts at $11. Honey ships in Virginia only.`,
  checkoutIntro: `Order online, then email ${CONTACT_EMAIL} to schedule pickup at the house (${PICKUP_ADDRESS}). Hours vary; email first. Honey ships in Virginia; lotion and dippers ship continental US.`,
  checkoutPickupLabel: 'Pickup at the house — free. Email to schedule.',
  checkoutPickupHint: `Pickup is at ${PICKUP_ADDRESS}. Hours vary — email ${CONTACT_EMAIL} to schedule. When you pick up you can see the bees that made it. ${PICKUP_MAPS_NOTE}`,
  checkoutUncheck: 'Uncheck only if you need shipping.',
  checkoutPickupLine: 'Pickup at the house (free)',
  checkoutShippingHoney: 'Virginia shipping starts at $11',
  checkoutShippingOther: 'Shipping starts at $11',
  checkoutPickupTotal: 'Pickup total',
  checkoutShippingNote:
    'Virginia shipping starts at $11. Honey ships in Virginia only. Summer Lotion and Honey Dipper ship continental US.',
  honeyOutsideVa: 'Honey cannot ship outside Virginia. Choose pickup at the house or a VA address.',
  honeyOutsideVaAlert: 'Honey can only be shipped to Virginia. Choose pickup at the house or a VA address.',
  continentalOnly: 'We only ship lotion and dippers in the continental US.',
  checkoutPickupFooter: `Pickup at the house is free — email ${CONTACT_EMAIL} to schedule. Hours vary; email first. No shipping charged. You’ll pay on Stripe first.`,
  checkoutPickupAfterPay: `After you pay, email ${CONTACT_EMAIL} to schedule pickup. Hours vary; email first.`,
  checkoutShipFooter: 'Virginia shipping starts at $11. Honey products only to Virginia.',
  successPickup: `Your order is marked for pickup at the house (${PICKUP_ADDRESS}). Email ${CONTACT_EMAIL} to schedule — hours vary; email first. When you pick up you can see the bees that made it. ${PICKUP_MAPS_NOTE}`,
  successPickupBadge: '✓ Pickup at the house (email to schedule)',
  webhookPickup: `Pickup at the house (${PICKUP_ADDRESS}). Email ${CONTACT_EMAIL} to schedule — hours vary; email first. When you pick up you can see the bees that made it. ${PICKUP_MAPS_NOTE}`,
  comingSoon: 'Coming soon',
  giftSetNote:
    'Hive Fresh honey is sold as a gift set: mason jar of honey, gift bag, and wooden dipper.',
};
