import Link from 'next/link';
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

export function StickyMobilePickupBar() {
  return (
    <div className="fixed bottom-0 inset-x-0 z-40 md:hidden border-t border-amber-600 bg-amber-500 text-black text-sm font-medium pb-[env(safe-area-inset-bottom)]">
      <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-center gap-2">
        <Link href="/#products" className="underline underline-offset-2">
          Order
        </Link>
        <span aria-hidden="true">·</span>
        <a href={`tel:${CONTACT_PHONE_TEL}`} className="underline underline-offset-2">
          Text {CONTACT_PHONE} to schedule pickup
        </a>
      </div>
    </div>
  );
}
