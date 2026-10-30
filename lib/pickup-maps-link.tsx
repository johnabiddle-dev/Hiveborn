import type { ReactNode } from 'react';
import { CONTACT_EMAIL, CONTACT_PHONE, CONTACT_PHONE_TEL } from '@/lib/copy';

// The pickup street address and driveway map pin are intentionally not published.
// John texts the pickup address and time after an order is placed.

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function ContactPhoneLink({ className = 'underline' }: { className?: string }) {
  return (
    <a href={`tel:${CONTACT_PHONE_TEL}`} className={className}>
      {CONTACT_PHONE}
    </a>
  );
}

/** Render pickup copy with clickable email and phone. */
export function withPickupCopyLinks(text: string): ReactNode {
  const pattern = new RegExp(`(${escapeRegExp(CONTACT_EMAIL)}|${escapeRegExp(CONTACT_PHONE)})`, 'g');
  return text.split(pattern).map((part, i) => {
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
    .split(CONTACT_EMAIL)
    .join(`<a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a>`)
    .split(CONTACT_PHONE)
    .join(`<a href="tel:${CONTACT_PHONE_TEL}">${CONTACT_PHONE}</a>`);
}
