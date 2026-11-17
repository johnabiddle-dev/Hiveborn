import assert from 'node:assert/strict';
import { test } from 'node:test';
import { renderToStaticMarkup } from 'react-dom/server';
import { HiveActionSection } from '../app/hive-action';
import HivebornShop from '../app/page';
import {
  HIVE_ACTION_HEADING,
  HIVE_ACTION_LINKS,
  HIVE_ACTION_PHOTOS,
  HIVE_ACTION_PREFERRED_SOURCE,
  HIVE_ACTION_SUBLINE,
} from './hive-action';

test('hive action links point at the Hiveborn social profiles', () => {
  assert.deepEqual(
    HIVE_ACTION_LINKS.map((link) => [link.label, link.href]),
    [
      ['Watch on YouTube', 'https://www.youtube.com/@hivebornhoney'],
      ['Follow on Instagram', 'https://www.instagram.com/hivebornhoney/'],
      ['Like on Facebook', 'https://www.facebook.com/p/Hiveborn-61578893080880/'],
    ],
  );
  assert.equal(
    HIVE_ACTION_PREFERRED_SOURCE.href,
    'https://google.com/preferences/source?q=hiveborn.com',
  );
});

test('hive action photos are existing farm photos and not the 6 oz set', () => {
  const srcs = HIVE_ACTION_PHOTOS.map((photo) => photo.src);
  assert.deepEqual(srcs, [
    '/images/hero-pint-web.jpg',
    '/images/hot-honey.png',
    '/images/hero-8oz-web.jpg',
  ]);
  for (const photo of HIVE_ACTION_PHOTOS) {
    assert.equal(photo.alt.trim().length > 20, true);
    assert.doesNotMatch(photo.src, /6oz|6-oz|hex/i);
    assert.doesNotMatch(photo.alt, /6 oz|stock|illustration/i);
  }
});

test('homepage renders the hive action section after the products', () => {
  const html = renderToStaticMarkup(<HivebornShop />);
  const shopNow = html.indexOf('Shop Now');
  const products = html.indexOf('Our Products');
  const action = html.indexOf(HIVE_ACTION_HEADING);
  const pickupInfo = html.indexOf('Pickup &amp; shipping');

  assert.ok(shopNow >= 0 && products > shopNow, 'Shop Now stays above the products');
  assert.ok(action > products, 'hive action stays below the products');
  assert.ok(pickupInfo > action, 'pickup info stays below the hive action section');
  assert.match(html, /\$25\.00/);
  assert.match(html, /\$15\.00/);
  assert.match(html, /Add to Cart/);

  const section = renderToStaticMarkup(<HiveActionSection />);
  assert.match(section, new RegExp(HIVE_ACTION_SUBLINE));
  assert.equal((section.match(/target="_blank"/g) ?? []).length, 4);
  assert.equal((section.match(/rel="noopener noreferrer"/g) ?? []).length, 4);
  assert.doesNotMatch(section, /<iframe|<video|youtube\.com\/embed|facebook\.com\/plugins/i);
  for (const link of HIVE_ACTION_LINKS) {
    assert.match(section, new RegExp(link.href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
    assert.match(section, new RegExp(link.label));
  }
});
