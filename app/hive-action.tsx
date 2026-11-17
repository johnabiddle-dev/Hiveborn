import {
  HIVE_ACTION_HEADING,
  HIVE_ACTION_LINKS,
  HIVE_ACTION_PHOTOS,
  HIVE_ACTION_PREFERRED_SOURCE,
  HIVE_ACTION_SUBLINE,
} from '@/lib/hive-action';

function SocialGlyph({ id }: { id: (typeof HIVE_ACTION_LINKS)[number]['id'] }) {
  const common = {
    viewBox: '0 0 24 24',
    'aria-hidden': true as const,
    className: 'h-6 w-6',
    fill: 'currentColor',
  };

  if (id === 'youtube') {
    return (
      <svg {...common}>
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    );
  }

  if (id === 'instagram') {
    return (
      <svg {...common}>
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

export function HiveActionSection() {
  return (
    <section
      id="hive-action"
      aria-labelledby="hive-action-heading"
      className="border-y border-amber-300 bg-amber-50"
    >
      <div className="grid h-52 grid-cols-6 grid-rows-2 gap-1 bg-amber-200 sm:h-72 lg:h-[28rem]">
        {HIVE_ACTION_PHOTOS.map((photo) => (
          <img
            key={photo.src}
            src={photo.src}
            alt={photo.alt}
            width={1200}
            height={900}
            loading="lazy"
            decoding="async"
            className={`${photo.className} h-full w-full object-cover`}
          />
        ))}
      </div>

      <div className="mx-auto max-w-6xl px-6 py-8 sm:py-12">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-amber-950">
          New Market, Virginia
        </p>
        <h2
          id="hive-action-heading"
          className="mx-auto mt-2 max-w-3xl text-balance text-center text-3xl font-semibold tracking-tighter text-zinc-950 sm:text-5xl"
        >
          {HIVE_ACTION_HEADING}
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-balance text-center text-base leading-relaxed text-zinc-800 sm:text-lg">
          {HIVE_ACTION_SUBLINE}
        </p>

        <div className="mx-auto mt-8 grid max-w-5xl grid-cols-1 gap-3 md:grid-cols-3">
          {HIVE_ACTION_LINKS.map((link) => (
            <a
              key={link.id}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-14 items-center gap-3 rounded-2xl border-2 border-amber-500 bg-white px-4 py-3 text-left shadow-sm transition hover:bg-amber-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-950 active:scale-[0.985]"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-black">
                <SocialGlyph id={link.id} />
              </span>
              <span className="min-w-0">
                <span className="block text-base font-semibold tracking-tight text-zinc-950">
                  {link.label}
                </span>
                <span className="block text-sm leading-snug text-zinc-700">{link.detail}</span>
              </span>
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          ))}
        </div>

        <p className="mt-6 text-center">
          <a
            href={HIVE_ACTION_PREFERRED_SOURCE.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center justify-center px-2 text-sm font-medium text-amber-950 underline decoration-amber-700 underline-offset-4 hover:decoration-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-950"
          >
            {HIVE_ACTION_PREFERRED_SOURCE.label}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </p>
      </div>
    </section>
  );
}
