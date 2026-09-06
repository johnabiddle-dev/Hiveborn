import assert from 'node:assert/strict';
import { test } from 'node:test';
import { calculateShippingCents, resolveCartItems } from './checkout';
import {
  planFulfillment,
  serializeFulfillmentMetadata,
  planFromMetadata,
  validateShipDestination,
} from './fulfillment';

test('honey-only pickup has no shipping', () => {
  const plan = planFulfillment([{ id: 2 }, { id: 3 }], true);
  assert.equal(plan.honeyHousePickup, true);
  assert.equal(plan.accessoriesShip, false);
  assert.equal(plan.isSplitFulfillment, false);
  assert.equal(plan.shippingLineCount, 0);
  assert.equal(calculateShippingCents(plan.shippingLineCount), 0);
});

test('accessory-only cart cannot pickup and always ships', () => {
  const plan = planFulfillment([{ id: 6 }], true);
  assert.equal(plan.pickupEligible, false);
  assert.equal(plan.honeyHousePickup, false);
  assert.equal(plan.accessoriesShip, true);
  assert.equal(plan.shippingLineCount, 1);
  assert.equal(calculateShippingCents(plan.shippingLineCount), 1100);
});

test('mixed cart splits honey pickup and accessory dropship', () => {
  const plan = planFulfillment([{ id: 2 }, { id: 6 }], true);
  assert.equal(plan.isSplitFulfillment, true);
  assert.equal(plan.honeyHousePickup, true);
  assert.equal(plan.honeyShips, false);
  assert.equal(plan.accessoriesShip, true);
  assert.equal(plan.shippingLineCount, 1);
  assert.equal(calculateShippingCents(plan.shippingLineCount), 1100);
  assert.equal(validateShipDestination(plan, 'CA').ok, true);
});

test('mixed cart shipping honey requires Virginia', () => {
  const plan = planFulfillment([{ id: 2 }, { id: 6 }], false);
  assert.equal(plan.isSplitFulfillment, false);
  assert.equal(plan.honeyShips, true);
  assert.equal(plan.shippingLineCount, 2);
  assert.equal(validateShipDestination(plan, 'CA').ok, false);
  assert.equal(validateShipDestination(plan, 'VA').ok, true);
});

test('accessories cannot ship to Alaska', () => {
  const plan = planFulfillment([{ id: 7 }], false);
  const check = validateShipDestination(plan, 'AK');
  assert.equal(check.ok, false);
});

test('out-of-stock Reaper cannot resolve', () => {
  const resolved = resolveCartItems([{ id: 4, quantity: 1 }]);
  assert.equal(resolved.ok, false);
});

test('server catalog prices accessories', () => {
  const resolved = resolveCartItems([{ id: 6, quantity: 2, price: 1 }]);
  assert.equal(resolved.ok, true);
  if (resolved.ok) {
    assert.equal(resolved.resolvedItems[0].price, 1499);
    assert.equal(resolved.hasAccessoryItems, true);
    const plan = resolved.plan(true);
    assert.equal(plan.honeyHousePickup, false);
  }
});

test('metadata round-trips split fulfillment', () => {
  const plan = planFulfillment([{ id: 3 }, { id: 7 }], true);
  const restored = planFromMetadata(serializeFulfillmentMetadata(plan));
  assert.equal(restored.isSplitFulfillment, true);
  assert.equal(restored.hasAccessoryItems, true);
  assert.equal(restored.honeyHousePickup, true);
});
