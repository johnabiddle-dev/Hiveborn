'use client';

import { useSyncExternalStore } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CONTACT_PHONE, CONTACT_PHONE_TEL } from '@/lib/copy';
import {
  ORDER_INTENT_EVENT,
  ORDER_INTENT_KEY,
  readCartItemCount,
  shouldShowTopContact,
} from '@/lib/order-intent';
import { OrderContactStrip } from '@/app/pickup-conversion-cta';

function subscribe(onStoreChange: () => void) {
  window.addEventListener(ORDER_INTENT_EVENT, onStoreChange);
  window.addEventListener('storage', onStoreChange);
  return () => {
    window.removeEventListener(ORDER_INTENT_EVENT, onStoreChange);
    window.removeEventListener('storage', onStoreChange);
  };
}

function snapshot() {
  let intent = false;
  try {
    intent = sessionStorage.getItem(ORDER_INTENT_KEY) === '1';
  } catch {
    intent = false;
  }
  return `${intent ? '1' : '0'}:${readCartItemCount()}`;
}

function serverSnapshot() {
  return '0:0';
}

export function useShowOrderContact() {
  const pathname = usePathname() ?? '/';
  const snap = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  const [intentFlag, countStr] = snap.split(':');
  return shouldShowTopContact({
    orderIntent: intentFlag === '1',
    pathname,
    cartItemCount: Number(countStr) || 0,
  });
}

/** Contact/text bar. Rendered under the nav only after an order click, or on checkout. */
export function OrderContactBanner() {
  const show = useShowOrderContact();
  if (!show) return null;

  return (
    <div
      role="region"
      aria-label="Questions about your order"
      className="sticky top-0 z-30 border-b border-amber-200 bg-amber-50/95 backdrop-blur"
    >
      <div className="max-w-6xl mx-auto px-6 py-3">
        <OrderContactStrip />
      </div>
    </div>
  );
}

export function StickyMobilePickupBar() {
  const showContact = useShowOrderContact();

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 md:hidden border-t border-amber-600 bg-amber-500 text-black text-sm font-medium pb-[env(safe-area-inset-bottom)]">
      <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-center gap-2">
        <Link href="/#products" className="underline underline-offset-2">
          {showContact ? 'Order' : 'Shop the honey'}
        </Link>
        {showContact && (
          <>
            <span aria-hidden="true">·</span>
            <a href={`tel:${CONTACT_PHONE_TEL}`} className="underline underline-offset-2">
              Text {CONTACT_PHONE}
            </a>
          </>
        )}
      </div>
    </div>
  );
}
