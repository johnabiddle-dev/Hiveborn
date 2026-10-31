import { CONTACT_EMAIL, CONTACT_PHONE, CONTACT_PHONE_TEL, COPY } from '@/lib/copy';
import { withPickupCopyLinks } from '@/lib/pickup-maps-link';

export function PickupConversionCta({
  compact = false,
  className = '',
}: {
  compact?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border-2 border-amber-500 bg-amber-50 ${compact ? 'p-3' : 'p-4'} ${className}`}
    >
      <p className={`${compact ? 'text-sm' : 'text-sm sm:text-base'} font-medium text-zinc-800 leading-relaxed`}>
        {withPickupCopyLinks(COPY.conversionCta)}
      </p>
      <div className={`flex flex-col sm:flex-row gap-2 ${compact ? 'mt-2.5' : 'mt-3'}`}>
        <a
          href={`tel:${CONTACT_PHONE_TEL}`}
          className="inline-flex items-center justify-center rounded-xl bg-black text-white px-4 py-2 text-sm font-medium hover:bg-zinc-800"
        >
          Text {CONTACT_PHONE}
        </a>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="inline-flex items-center justify-center rounded-xl border border-zinc-300 bg-white text-zinc-900 px-4 py-2 text-sm font-medium hover:bg-zinc-50"
        >
          Email {CONTACT_EMAIL}
        </a>
      </div>
    </div>
  );
}

/** Compact text/email row for the post-order banner and the cart drawer. */
export function OrderContactStrip({
  stacked = false,
  className = '',
}: {
  stacked?: boolean;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-2 ${stacked ? 'items-stretch' : 'sm:flex-row sm:items-center sm:justify-between'} ${className}`}>
      <p className="text-sm font-medium text-zinc-800 leading-relaxed">
        {withPickupCopyLinks(COPY.orderContactBanner)}
      </p>
      <div className="flex flex-wrap gap-2 shrink-0">
        <a
          href={`tel:${CONTACT_PHONE_TEL}`}
          className="inline-flex items-center justify-center rounded-xl bg-black text-white px-3 py-1.5 text-sm font-medium hover:bg-zinc-800"
        >
          Text {CONTACT_PHONE}
        </a>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          aria-label={`Email ${CONTACT_EMAIL}`}
          className="inline-flex items-center justify-center rounded-xl border border-zinc-300 bg-white text-zinc-900 px-3 py-1.5 text-sm font-medium hover:bg-zinc-50"
        >
          Email
        </a>
      </div>
    </div>
  );
}
