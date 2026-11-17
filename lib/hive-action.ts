import { PREFERRED_SOURCE_FALLBACK_HREF } from './preferred-source';
import { SOCIAL_LINKS } from './social';

/**
 * Homepage feature that sends visitors to the apiary socials.
 * Photos are real files already in /public. The repo has no hive, bee,
 * harvest, or frame photos, and the removed 6 oz hex images stay unused.
 */
export const HIVE_ACTION_HEADING = 'See the action at the hives';

export const HIVE_ACTION_SUBLINE =
  'Live hive inspections, harvest days, and bees up close from our New Market, VA apiary.';

function socialHref(label: (typeof SOCIAL_LINKS)[number]['label']): string {
  const link = SOCIAL_LINKS.find((item) => item.label === label);
  if (!link) {
    throw new Error(`Missing social link: ${label}`);
  }
  return link.href;
}

export const HIVE_ACTION_LINKS = [
  {
    id: 'youtube',
    label: 'Watch on YouTube',
    detail: 'Inspections and harvest days',
    href: socialHref('YouTube'),
  },
  {
    id: 'instagram',
    label: 'Follow on Instagram',
    detail: 'Bees up close from the yard',
    href: socialHref('Instagram'),
  },
  {
    id: 'facebook',
    label: 'Like on Facebook',
    detail: 'Farm updates from New Market',
    href: socialHref('Facebook'),
  },
] as const;

export const HIVE_ACTION_PHOTOS = [
  {
    src: '/images/hero-pint-web.jpg',
    alt: 'A pint mason jar of Hiveborn honey in a sheer gift bag on a porch rail, with trees and hills behind it.',
    className: 'col-span-4 row-span-2',
  },
  {
    src: '/images/hot-honey.png',
    alt: 'A hand holding a bottle of Hiveborn reaper-infused hot honey up against a bright sky.',
    className: 'col-span-2 row-span-1',
  },
  {
    src: '/images/hero-8oz-web.jpg',
    alt: 'A half-pint mason jar of Hiveborn unfiltered honey in a gift bag on a porch rail, with trees in the background.',
    className: 'col-span-2 row-span-1',
  },
] as const;

export const HIVE_ACTION_PREFERRED_SOURCE = {
  label: 'Add Hiveborn as a preferred source on Google',
  href: PREFERRED_SOURCE_FALLBACK_HREF,
} as const;
