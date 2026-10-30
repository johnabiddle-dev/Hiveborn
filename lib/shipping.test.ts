import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  buildStripeShippingOptions,
  groundAdvantageCents,
  priorityMailCents,
  shippingQuotes,
} from './shipping';

test('USPS Ground Advantage tiers by jar count', () => {
  assert.equal(groundAdvantageCents(1, 2500), 1200);
  assert.equal(groundAdvantageCents(2, 5000), 1200);
  assert.equal(groundAdvantageCents(3, 4500), 1400);
  assert.equal(groundAdvantageCents(4, 6000), 1400);
  assert.equal(groundAdvantageCents(5, 6000), 1800);
  assert.equal(groundAdvantageCents(8, 9600), 1800);
});

test('Ground Advantage is free at $100+ subtotal', () => {
  assert.equal(groundAdvantageCents(4, 10000), 0);
  assert.equal(groundAdvantageCents(6, 15000), 0);
  assert.equal(groundAdvantageCents(3, 9999), 1400);
});

test('USPS Priority Mail tiers are always full price', () => {
  assert.equal(priorityMailCents(1), 1600);
  assert.equal(priorityMailCents(2), 1600);
  assert.equal(priorityMailCents(3), 1900);
  assert.equal(priorityMailCents(4), 1900);
  assert.equal(priorityMailCents(5), 2200);
  assert.equal(priorityMailCents(8), 2200);
});

test('9+ jars price as multiple boxes (needs review)', () => {
  assert.equal(groundAdvantageCents(9, 9000), 1800 + 1200);
  assert.equal(priorityMailCents(9), 2200 + 1600);
  assert.equal(priorityMailCents(16), 4400);
});

test('six pints: Ground $18 unless free threshold, Priority $22', () => {
  const quotes = shippingQuotes(6, 6 * 2500);
  assert.equal(quotes[0].method, 'usps_ground_advantage');
  assert.equal(quotes[0].amountCents, 0); // $150 subtotal ships free
  assert.equal(quotes[1].amountCents, 2200);
  const cheaper = shippingQuotes(6, 6 * 1200);
  assert.equal(cheaper[0].amountCents, 1800);
});

test('Stripe shipping_options: pickup is a single free option', () => {
  const opts = buildStripeShippingOptions({ pickup: true, jars: 0, subtotalCents: 2500 });
  assert.equal(opts.length, 1);
  assert.equal(opts[0].shipping_rate_data.fixed_amount.amount, 0);
  assert.match(opts[0].shipping_rate_data.display_name, /pickup in New Market, VA/i);
});

test('Stripe shipping_options: shipped orders get Ground (default) then Priority', () => {
  const opts = buildStripeShippingOptions({ pickup: false, jars: 2, subtotalCents: 5000 });
  assert.equal(opts.length, 2);
  assert.equal(opts[0].shipping_rate_data.display_name, 'USPS Ground Advantage');
  assert.equal(opts[0].shipping_rate_data.fixed_amount.amount, 1200);
  assert.equal(opts[1].shipping_rate_data.display_name, 'USPS Priority Mail');
  assert.equal(opts[1].shipping_rate_data.fixed_amount.amount, 1600);
});
