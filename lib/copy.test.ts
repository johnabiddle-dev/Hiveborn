import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  CONTACT_EMAIL,
  CONTACT_PHONE,
  CONVERSION_CTA,
  COPY,
  PICKUP_MAPS_PIN,
  PICKUP_SCHEDULE_NOTE,
  PICKUP_STREET,
} from './copy';
import {
  fulfillmentCustomerText,
  planFulfillment,
  successFulfillmentMessage,
} from './fulfillment';
import { ACCESSORY_PRODUCTS, getProductById } from './products';

test('conversion CTA puts text number beside email and street', () => {
  assert.match(CONVERSION_CTA, new RegExp(CONTACT_PHONE));
  assert.match(CONVERSION_CTA, new RegExp(CONTACT_EMAIL));
  assert.match(CONVERSION_CTA, new RegExp(PICKUP_STREET));
  assert.match(CONVERSION_CTA, /hiveborn\.com/);
});

test('homepage, product, footer, and cart pickup copy include the phone', () => {
  for (const [name, value] of Object.entries({
    heroPickup: COPY.heroPickup,
    honeyShipNote: COPY.honeyShipNote,
    otherShipNote: COPY.otherShipNote,
    conversionCta: COPY.conversionCta,
    stickyMobileCta: COPY.stickyMobileCta,
    pickupShippingBlurb: COPY.pickupShippingBlurb,
    cartPageNote: COPY.cartPageNote,
    cartDrawerNote: COPY.cartDrawerNote,
    checkoutIntro: COPY.checkoutIntro,
    checkoutPickupHint: COPY.checkoutPickupHint,
    checkoutPickupAfterPay: COPY.checkoutPickupAfterPay,
    metaDescription: COPY.metaDescription,
  })) {
    assert.match(value, new RegExp(CONTACT_PHONE), `${name} should include ${CONTACT_PHONE}`);
  }
});

test('PR #12 confirmation surfaces still include the phone and driveway pin', () => {
  assert.match(PICKUP_SCHEDULE_NOTE, new RegExp(CONTACT_PHONE));
  assert.match(COPY.successPickup, new RegExp(CONTACT_PHONE));
  assert.match(COPY.successSplit, new RegExp(CONTACT_PHONE));
  assert.match(COPY.webhookPickup, new RegExp(CONTACT_PHONE));
  assert.match(COPY.webhookSplitBanner, /text or email/);
  assert.match(COPY.successPickup, new RegExp(PICKUP_MAPS_PIN.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
});

test('order success and confirmation email pickup text include the phone', () => {
  const pickupPlan = planFulfillment([{ id: 3 }], true);
  const success = successFulfillmentMessage(pickupPlan);
  const email = fulfillmentCustomerText(pickupPlan, '93 Runaway Ln');
  assert.match(success, new RegExp(CONTACT_PHONE));
  assert.match(email, new RegExp(CONTACT_PHONE));
  assert.match(email, new RegExp(CONTACT_EMAIL));
});

test('footer copy tells people to text or email', () => {
  assert.match(COPY.footerPickup, /Text or email/i);
});

test('catalog guards stay in place', () => {
  assert.equal(getProductById(3)?.price, 2500);
  assert.equal(getProductById(2)?.price, 1500);
  assert.equal(getProductById(4)?.inStock, false);
  assert.equal(getProductById(6)?.published, false);
  assert.equal(getProductById(7)?.published, false);
  assert.equal(ACCESSORY_PRODUCTS.length, 0);
});
