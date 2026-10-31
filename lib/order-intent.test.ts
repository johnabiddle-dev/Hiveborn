import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { shouldShowTopContact } from './order-intent';

test('top contact stays hidden on the shop until an order click', () => {
  assert.equal(
    shouldShowTopContact({ orderIntent: false, pathname: '/', cartItemCount: 0 }),
    false,
  );
  assert.equal(
    shouldShowTopContact({ orderIntent: false, pathname: '/', cartItemCount: 2 }),
    false,
  );
  assert.equal(
    shouldShowTopContact({ orderIntent: true, pathname: '/', cartItemCount: 1 }),
    true,
  );
  assert.equal(
    shouldShowTopContact({
      orderIntent: false,
      pathname: '/product/hive-fresh-honey-gift-set-pint',
      cartItemCount: 0,
    }),
    false,
  );
});

test('cart, checkout, and success show contact at the top of the order step', () => {
  assert.equal(
    shouldShowTopContact({ orderIntent: false, pathname: '/checkout', cartItemCount: 1 }),
    true,
  );
  assert.equal(
    shouldShowTopContact({ orderIntent: false, pathname: '/success', cartItemCount: 0 }),
    true,
  );
  assert.equal(
    shouldShowTopContact({ orderIntent: false, pathname: '/cart', cartItemCount: 1 }),
    true,
  );
  assert.equal(
    shouldShowTopContact({ orderIntent: false, pathname: '/cart', cartItemCount: 0 }),
    false,
  );
});

test('homepage source puts the honey and order buttons before the phone CTA', () => {
  const src = readFileSync(new URL('../app/page.tsx', import.meta.url), 'utf8');
  const jsx = src.slice(src.indexOf('min-h-screen bg-white'));
  const productsAt = jsx.indexOf('id="products"');
  const ctaAt = jsx.indexOf('<PickupConversionCta');
  assert.ok(productsAt > 0, 'products section missing');
  assert.ok(ctaAt > productsAt, 'phone CTA should sit below the products');
  const beforeProducts = jsx.slice(0, productsAt);
  assert.match(beforeProducts, /Give the gift of summer this winter\./);
  assert.doesNotMatch(beforeProducts, /PickupConversionCta/);
  assert.doesNotMatch(beforeProducts, /CONTACT_PHONE/);
  assert.doesNotMatch(beforeProducts, /tel:/);
});

test('product page order button comes before the phone CTA', () => {
  const src = readFileSync(new URL('../app/product/[slug]/page.tsx', import.meta.url), 'utf8');
  const addAt = src.indexOf('<AddToCartButton');
  const ctaAt = src.indexOf('<PickupConversionCta');
  assert.ok(addAt > 0 && ctaAt > addAt);
});
