import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  PREFERRED_SOURCE_FALLBACK_HREF,
  PREFERRED_SOURCE_PUBLISHER_SRC,
} from './preferred-source';
import { SOCIAL_LINKS } from './social';

test('footer and header social links include Instagram, Facebook, and YouTube', () => {
  assert.deepEqual(
    SOCIAL_LINKS.map((link) => [link.label, link.href]),
    [
      ['Instagram', 'https://www.instagram.com/hivebornhoney/'],
      ['Facebook', 'https://www.facebook.com/p/Hiveborn-61578893080880/'],
      ['YouTube', 'https://www.youtube.com/@hivebornhoney'],
    ],
  );
});

test('preferred source uses Google publisher.js and the hiveborn.com deeplink', () => {
  assert.equal(
    PREFERRED_SOURCE_PUBLISHER_SRC,
    'https://news.google.com/swg/js/v1/publisher.js',
  );
  assert.equal(
    PREFERRED_SOURCE_FALLBACK_HREF,
    'https://google.com/preferences/source?q=hiveborn.com',
  );
});
