'use client';

import Script from 'next/script';
import { useEffect, useRef, useState } from 'react';
import {
  PREFERRED_SOURCE_FALLBACK_HREF,
  PREFERRED_SOURCE_PUBLISHER_SRC,
} from '@/lib/preferred-source';

/**
 * publisher.js scans once, when it executes, for this attribute.
 * Pass a string: React removes boolean `true` on unknown attributes and warns.
 * The footer is white, so the button uses Google's light theme.
 */
const preferredSourceHostProps = {
  'google-add-preferred-source-btn': '',
  'data-theme': 'light',
} as const;

function isButtonReady(slot: HTMLElement | null): boolean {
  if (!slot) return false;
  return slot.hasAttribute('data-initialized') || slot.shadowRoot != null;
}

export function PreferredSourceButton() {
  const slotRef = useRef<HTMLDivElement>(null);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const slot = slotRef.current;
    if (!slot) return;

    const markReady = () => {
      if (!isButtonReady(slot)) return false;
      setFallback(false);
      return true;
    };

    if (markReady()) return;

    const observer = new MutationObserver(() => {
      if (markReady()) observer.disconnect();
    });
    observer.observe(slot, { attributes: true });

    const timeout = window.setTimeout(() => {
      if (!isButtonReady(slot)) setFallback(true);
      observer.disconnect();
    }, 8000);

    return () => {
      observer.disconnect();
      window.clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="inline-flex max-w-full items-center">
      {/* afterInteractive, not beforeInteractive: the library does not rescan the DOM. */}
      <Script
        id="google-preferred-source"
        src={PREFERRED_SOURCE_PUBLISHER_SRC}
        strategy="afterInteractive"
        onLoad={() => {
          if (!isButtonReady(slotRef.current)) setFallback(true);
        }}
        onError={() => setFallback(true)}
      />
      <div
        ref={slotRef}
        className={fallback ? 'hidden' : 'inline-flex max-w-full'}
        {...preferredSourceHostProps}
      />
      {fallback ? (
        <a
          href={PREFERRED_SOURCE_FALLBACK_HREF}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          Add as a preferred source
        </a>
      ) : (
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<a href="${PREFERRED_SOURCE_FALLBACK_HREF}" target="_blank" rel="noopener noreferrer" class="hover:underline">Add as a preferred source</a>`,
          }}
        />
      )}
    </div>
  );
}
