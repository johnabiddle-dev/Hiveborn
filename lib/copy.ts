export const CONTACT_EMAIL = 'johnabiddle@gmail.com';
export const PICKUP_ADDRESS = '93 Runaway Ln, New Market, VA 22844';

/** Customer-facing pickup + shipping copy. Order online, then email to schedule pickup. */
export const COPY = {
  metaTitle: 'Hiveborn — Raw honey from New Market, VA',
  metaDescription:
    'Raw, unfiltered honey from New Market, Virginia. Order online at hiveborn.com. Pickup is available — email johnabiddle@gmail.com to schedule. Honey ships in Virginia only.',
  heroSub: 'Raw honey from New Market, Virginia.',
  heroPickup:
    'Order online at hiveborn.com. Pickup is available — email johnabiddle@gmail.com to schedule. Honey ships in Virginia only.',
  aboutFarm:
    'We keep bees in New Market, Virginia, and harvest by hand. The honey is raw and unfiltered — the same jars we sell at the farm. Order online at hiveborn.com. Pickup is available at the house — email johnabiddle@gmail.com to schedule. When you pick up you can see the bees that made it. Honey orders ship inside Virginia only. Summer Lotion and Honey Dippers ship continental US.',
  honeyShipNote: 'VA shipping, or pickup at the house after you order online.',
  otherShipNote: 'Ships continental US, or pickup at the house after you order online.',
  cartDrawerNote:
    'Pickup at the house is free. Email johnabiddle@gmail.com to schedule. Virginia shipping starts at $11.',
  pickupShippingBlurb: `Order online at hiveborn.com. Pickup is available at ${PICKUP_ADDRESS} — email ${CONTACT_EMAIL} to schedule. When you pick up you can see the bees. Honey ships in Virginia only. Summer Lotion and Dipper ship continental US.`,
  footerPickup: 'New Market, VA · Pickup available — email to schedule ·',
  footerHoney: 'Honey ships in Virginia only.',
  cartPageNote: `Order online at hiveborn.com. Pickup is available at ${PICKUP_ADDRESS} — email ${CONTACT_EMAIL} to schedule. Virginia shipping starts at $11. Honey ships in Virginia only.`,
  checkoutIntro: `Order online at hiveborn.com. Pickup is available at ${PICKUP_ADDRESS} — email ${CONTACT_EMAIL} to schedule. Honey ships in Virginia; lotion and dippers ship continental US.`,
  checkoutPickupLabel: 'Pickup at the house — free. Email to schedule after you order.',
  checkoutPickupHint: `Pickup is at ${PICKUP_ADDRESS}. Email ${CONTACT_EMAIL} to schedule. When you pick up you can see the bees.`,
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
  checkoutPickupFooter: `Pickup at the house is free. Email ${CONTACT_EMAIL} to schedule after you order. You’ll pay on Stripe first.`,
  checkoutAfterPay: 'After you pay, email to schedule pickup at the house. Questions:',
  checkoutShipFooter: 'Virginia shipping starts at $11. Honey products only to Virginia.',
  successPickup: `Your order is marked for pickup at the house (${PICKUP_ADDRESS}). Email ${CONTACT_EMAIL} to schedule. When you pick up you can see the bees.`,
  successPickupBadge: '✓ Pickup at the house',
  webhookPickup: `Pickup at the house (${PICKUP_ADDRESS}). Email ${CONTACT_EMAIL} to schedule. When you pick up you can see the bees that made it.`,
};
