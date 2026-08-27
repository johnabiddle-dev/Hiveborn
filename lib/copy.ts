export const CONTACT_EMAIL = 'johnabiddle@gmail.com';
export const PICKUP_ADDRESS = '93 Runaway Ln, New Market, VA 22844';

/** Customer-facing pickup + shipping copy. Pickup is order-online Sat/Sun at the house, not walk-in. */
export const COPY = {
  metaTitle: 'Hiveborn — Raw honey from New Market, VA',
  metaDescription:
    'Raw, unfiltered honey from New Market, Virginia. Order online for Saturday or Sunday pickup at the house. Honey ships in Virginia only.',
  heroSub: 'Raw honey from New Market, Virginia.',
  heroPickup:
    'Order online and pick up Saturday or Sunday at the house, or we ship honey inside Virginia.',
  honeyShipNote: 'VA shipping, or Saturday or Sunday pickup at the house.',
  otherShipNote: 'Ships continental US, or Saturday or Sunday pickup at the house.',
  cartDrawerNote:
    'Saturday or Sunday pickup at the house is free. Virginia shipping starts at $11.',
  pickupShippingBlurb: `Order online and pick up Saturday or Sunday at the house (${PICKUP_ADDRESS}) — free. We know you are coming because you ordered. Honey ships in Virginia only. Summer Lotion and Dipper ship continental US. Questions: ${CONTACT_EMAIL}.`,
  footerPickup: 'New Market, VA · Saturday or Sunday pickup at the house ·',
  footerHoney: 'Honey ships in Virginia only.',
  cartPageNote: `Order online and pick up Saturday or Sunday at the house (${PICKUP_ADDRESS}) — free. Virginia shipping starts at $11. Honey ships in Virginia only.`,
  checkoutIntro: `Order online and pick up Saturday or Sunday at the house (${PICKUP_ADDRESS}). Honey ships in Virginia; lotion and dippers ship continental US.`,
  checkoutPickupLabel: 'Saturday or Sunday pickup at the house — free.',
  checkoutPickupHint: `Pickup is at ${PICKUP_ADDRESS}. We know you are coming because you ordered. Questions: ${CONTACT_EMAIL}.`,
  checkoutUncheck: 'Uncheck only if you need shipping.',
  checkoutPickupLine: 'Saturday or Sunday pickup at the house (free)',
  checkoutShippingHoney: 'Virginia shipping starts at $11',
  checkoutShippingOther: 'Shipping starts at $11',
  checkoutPickupTotal: 'Pickup total',
  checkoutShippingNote:
    'Virginia shipping starts at $11. Honey ships in Virginia only. Summer Lotion and Honey Dipper ship continental US.',
  honeyOutsideVa: 'Honey cannot ship outside Virginia. Choose pickup at the house or a VA address.',
  honeyOutsideVaAlert: 'Honey can only be shipped to Virginia. Choose pickup at the house or a VA address.',
  continentalOnly: 'We only ship lotion and dippers in the continental US.',
  checkoutPickupFooter: `Saturday or Sunday pickup at the house — we know you are coming because you ordered. No shipping charged. You’ll pay on Stripe first.`,
  checkoutShipFooter: 'Virginia shipping starts at $11. Honey products only to Virginia.',
  successPickup: `Your order is marked for pickup at the house (${PICKUP_ADDRESS}) on Saturday or Sunday. We know you are coming because you ordered. Questions: ${CONTACT_EMAIL}.`,
  successPickupBadge: '✓ Saturday or Sunday pickup at the house',
  webhookPickup: `Pickup at the house (${PICKUP_ADDRESS}) on Saturday or Sunday. We know you are coming because you ordered. When you pick up you can see the bees that made it.`,
};
