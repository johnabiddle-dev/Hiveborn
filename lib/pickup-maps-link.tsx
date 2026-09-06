import type { ReactNode } from 'react';
import { PICKUP_MAPS_PIN } from '@/lib/copy';

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
  return text.split(PICKUP_MAPS_PIN).join(
    `<a href="${PICKUP_MAPS_PIN}">${PICKUP_MAPS_PIN}</a>`
  );
}
