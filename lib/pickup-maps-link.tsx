import type { ReactNode } from 'react';
import { CONTACT_EMAIL, CONTACT_PHONE, PICKUP_MAPS_PIN } from '@/lib/copy';

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function PickupMapsLink({ className = 'underline break-all' }: { className?: string }) {
  return (
    <a
      href={PICKUP_MAPS_PIN}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {PICKUP_MAPS_PIN}
    </a>
  );
}

/** Render copy with the driveway Maps pin as a clickable link. */
export function withPickupMapsLink(text: string): ReactNode {
  if (!text.includes(PICKUP_MAPS_PIN)) {
    return text;
  }
  return text.split(PICKUP_MAPS_PIN).flatMap((part, i, parts) =>
    i < parts.length - 1
      ? [part, <PickupMapsLink key={`pickup-maps-pin-${i}`} />]
      : [part]
  );
}

/** Same pin, wrapped for HTML emails. */
export function htmlWithPickupMapsLink(text: string): string {
  return htmlWithPickupCopyLinks(text);
}

export function ContactPhoneLink({ className = 'underline' }: { className?: string }) {
  return (
    <a href={`tel:${CONTACT_PHONE}`} className={className}>
      {CONTACT_PHONE}
    </a>
  );
}

/** Render pickup copy with clickable Maps pin, email, and phone. */
export function withPickupCopyLinks(text: string): ReactNode {
  const pattern = new RegExp(
    `(${escapeRegExp(PICKUP_MAPS_PIN)}|${escapeRegExp(CONTACT_EMAIL)}|${escapeRegExp(CONTACT_PHONE)})`,
    'g'
  );
  return text.split(pattern).map((part, i) => {
    if (part === PICKUP_MAPS_PIN) {
      return <PickupMapsLink key={`pickup-copy-pin-${i}`} />;
    }
    if (part === CONTACT_EMAIL) {
      return (
        <a key={`pickup-copy-email-${i}`} href={`mailto:${CONTACT_EMAIL}`} className="underline">
          {CONTACT_EMAIL}
        </a>
      );
    }
    if (part === CONTACT_PHONE) {
      return <ContactPhoneLink key={`pickup-copy-phone-${i}`} />;
    }
    return part;
  });
}

/** Same links, wrapped for HTML emails. */
export function htmlWithPickupCopyLinks(text: string): string {
  return text
    .split(PICKUP_MAPS_PIN)
    .join(`<a href="${PICKUP_MAPS_PIN}">${PICKUP_MAPS_PIN}</a>`)
    .split(CONTACT_EMAIL)
    .join(`<a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a>`)
    .split(CONTACT_PHONE)
    .join(`<a href="tel:${CONTACT_PHONE}">${CONTACT_PHONE}</a>`);
}
