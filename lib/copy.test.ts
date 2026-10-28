import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  CONTACT_EMAIL,
  CONTACT_PHONE,
  CONVERSION_CTA,
  COPY,
  PICKUP_OR_SHIP_TAGLINE,
  PICKUP_SCHEDULE_NOTE,
  PICKUP_TEXT_NOTE,
} from './copy';
import * as copyModule from './copy';
import {
  fulfillmentCustomerText,
  planFulfillment,
  successFulfillmentMessage,
} from './fulfillment';
import { ACCESSORY_PRODUCTS, getProductById } from './products';

test('conversion CTA puts text number beside email and says pickup in New Market', () => {
  assert.match(CONVERSION_CTA, new RegExp(CONTACT_PHONE));
  assert.match(CONVERSION_CTA, new RegExp(CONTACT_EMAIL));
  assert.match(CONVERSION_CTA, /Pickup in New Market, VA/);
  assert.ok(CONVERSION_CTA.includes(PICKUP_TEXT_NOTE));
  assert.match(CONVERSION_CTA, /hiveborn\.com/);
});

// The street address and driveway map pin must never be published (site or emails).
const FORBIDDEN = [/runaway/i, /run away/i, /93 run/i, /38\.644/, /78\.625/, /google\.com\/maps/i, /maps\.app\.goo\.gl/i, /goo\.gl/i, /22844/];

function allCopyStrings(): Array<[string, string]> {
  const out: Array<[string, string]> = [];
  for (const [k, v] of Object.entries(copyModule)) {
    if (typeof v === 'string') out.push([k, v]);
  }
  for (const [k, v] of Object.entries(COPY)) {
    if (typeof v === 'string') out.push([`COPY.${k}`, v]);
  }
  return out;
}

test('no public copy contains the street address, ZIP, or a map pin', () => {
  for (const [name, value] of allCopyStrings()) {
    for (const re of FORBIDDEN) {
      assert.doesNotMatch(value, re, `${name} must not include ${re}`);
    }
  }
});

test('approved pickup / shipping tagline is used on product, cart, and checkout copy', () => {
  assert.equal(
    PICKUP_OR_SHIP_TAGLINE,
    'Pick up at the farm and meet the bees, or have it shipped anywhere in Virginia. Shipping is calculated at checkout.'
  );
  for (const value of [COPY.honeyShipNote, COPY.cartPageNote, COPY.cartDrawerNote, COPY.checkoutIntro, COPY.pickupShippingBlurb]) {
    assert.ok(value.includes(PICKUP_OR_SHIP_TAGLINE));
  }
});

test('no copy advertises Saturday-only pickup', () => {
  for (const [name, value] of allCopyStrings()) {
    assert.doesNotMatch(value, /saturday/i, `${name} must not mention Saturday`);
  }
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

test('confirmation surfaces include the phone and the we-will-text note', () => {
  assert.match(PICKUP_SCHEDULE_NOTE, new RegExp(CONTACT_PHONE));
  assert.match(COPY.successPickup, new RegExp(CONTACT_PHONE));
  assert.match(COPY.successSplit, new RegExp(CONTACT_PHONE));
  assert.match(COPY.webhookPickup, new RegExp(CONTACT_PHONE));
  assert.match(COPY.webhookSplitBanner, /text you the address/);
  assert.ok(COPY.successPickup.includes(PICKUP_TEXT_NOTE));
  assert.ok(COPY.webhookPickup.includes(PICKUP_TEXT_NOTE));
});

test('order success and confirmation email pickup text include the phone', () => {
  const pickupPlan = planFulfillment([{ id: 3 }], true);
  const success = successFulfillmentMessage(pickupPlan);
  const email = fulfillmentCustomerText(pickupPlan, 'Customer St\nRichmond VA 23220');
  assert.match(success, new RegExp(CONTACT_PHONE));
  assert.match(email, new RegExp(CONTACT_PHONE));
  assert.match(email, new RegExp(CONTACT_EMAIL));
  for (const re of FORBIDDEN) {
    assert.doesNotMatch(success, re);
    assert.doesNotMatch(email, re);
  }
});

test('footer copy tells people to text or email', () => {
  assert.match(COPY.footerPickup, /Text or email/i);
});

test('catalog guards stay in place', () => {
  assert.equal(getProductById(3)?.price, 2500);
  assert.equal(getProductById(2)?.price, 1500);
  assert.equal(getProductById(8)?.price, 1200);
  assert.equal(getProductById(8)?.inStock, true);
  assert.equal(getProductById(4)?.inStock, false);
  assert.equal(getProductById(6)?.published, false);
  assert.equal(getProductById(7)?.published, false);
  assert.equal(ACCESSORY_PRODUCTS.length, 0);
});
