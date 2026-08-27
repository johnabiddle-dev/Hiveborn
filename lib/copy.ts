export const CONTACT_EMAIL = 'orders@hiveborn.com';
export const PICKUP_ADDRESS = '93 Runaway Ln, New Market, VA';

/** Customer-facing pickup + shipping copy. Pickup is email-to-schedule, not walk-in. */
export const COPY = {
  metaTitle: 'Hiveborn — Raw honey from New Market, VA',
  metaDescription:
    'Raw, unfiltered honey from New Market, Virginia. Email to schedule Saturday or Sunday pickup at the apiary. Honey ships in Virginia only.',
  heroSub: 'Raw honey from New Market, Virginia.',
  heroPickup:
    'Email ahead to schedule Saturday or Sunday pickup at the apiary, or we ship honey inside Virginia.',
  honeyShipNote: 'VA shipping, or email to schedule Saturday or Sunday pickup.',
  otherShipNote: 'Ships continental US, or email to schedule Saturday or Sunday pickup.',
  cartDrawerNote:
    'Email to schedule Saturday or Sunday pickup at the apiary — free. Virginia shipping starts at $11.',
  pickupShippingBlurb: `Email ${CONTACT_EMAIL} to schedule Saturday or Sunday pickup at the apiary (${PICKUP_ADDRESS}) — free. We have to know you are coming. Honey ships in Virginia only. Summer Lotion and Dipper ship continental US.`,
  footerPickup: 'New Market, VA · Email to schedule Saturday or Sunday pickup ·',
  footerHoney: 'Honey ships in Virginia only.',
  cartPageNote: `Email ${CONTACT_EMAIL} to schedule Saturday or Sunday pickup at the apiary — free. Virginia shipping starts at $11. Honey ships in Virginia only.`,
  checkoutIntro: `Email ${CONTACT_EMAIL} to schedule Saturday or Sunday pickup at the apiary. Honey ships in Virginia; lotion and dippers ship continental US.`,
  checkoutPickupLabel: 'Email to schedule Saturday or Sunday pickup at the apiary — free.',
  checkoutPickupHint: `We have to know you are coming. Pickup is at ${PICKUP_ADDRESS}. Email ${CONTACT_EMAIL} to set a time.`,
  checkoutUncheck: 'Uncheck only if you need shipping.',
  checkoutPickupLine: 'Saturday or Sunday apiary pickup (free)',
  checkoutShippingHoney: 'Virginia shipping starts at $11',
  checkoutShippingOther: 'Shipping starts at $11',
  checkoutPickupTotal: 'Pickup total',
  checkoutShippingNote:
    'Virginia shipping starts at $11. Honey ships in Virginia only. Summer Lotion and Honey Dipper ship continental US.',
  honeyOutsideVa: 'Honey cannot ship outside Virginia. Choose apiary pickup or a VA address.',
  honeyOutsideVaAlert: 'Honey can only be shipped to Virginia. Choose apiary pickup or a VA address.',
  continentalOnly: 'We only ship lotion and dippers in the continental US.',
  checkoutPickupFooter: `Apiary pickup Saturday or Sunday — email ${CONTACT_EMAIL} to schedule. No shipping charged. You’ll pay on Stripe first.`,
  checkoutShipFooter: 'Virginia shipping starts at $11. Honey products only to Virginia.',
  successPickup: `Your order is marked for apiary pickup. Email ${CONTACT_EMAIL} to schedule Saturday or Sunday — we have to know you are coming.`,
  successPickupBadge: '✓ Apiary pickup (email to schedule Saturday or Sunday)',
  webhookPickup: `Apiary pickup — email ${CONTACT_EMAIL} to schedule Saturday or Sunday at ${PICKUP_ADDRESS}. We have to know you are coming. When you pick up you can see the bees that made it.`,
};
