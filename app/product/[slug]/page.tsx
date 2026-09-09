import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PickupConversionCta } from '@/app/pickup-conversion-cta';
import { COPY } from '@/lib/copy';
import { withPickupCopyLinks } from '@/lib/pickup-maps-link';
import { getPublishedProductBySlug, PUBLISHED_PRODUCTS } from '@/lib/products';
import AddToCartButton from './add-to-cart-button';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return PUBLISHED_PRODUCTS.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getPublishedProductBySlug(slug);
  if (!product) {
    return { title: 'Product — Hiveborn' };
  }
  return {
    title: `${product.name} — Hiveborn`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getPublishedProductBySlug(slug);
  if (!product) {
    notFound();
  }

  const accessory = product.kind === 'accessory';

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <p className="text-sm text-zinc-500 mb-6">
        <Link href="/#products" className="underline">Shop</Link>
        {accessory && (
          <>
            {' · '}
            <Link href="/#kitchen-add-ons" className="underline">Kitchen add-ons</Link>
          </>
        )}
      </p>

      <div className="grid md:grid-cols-2 gap-10 items-start">
        <div className="aspect-[4/3] bg-zinc-100 rounded-3xl overflow-hidden border">
          <img
            src={product.cardImage ?? product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          {accessory && (
            <span className="inline-block text-[11px] font-semibold uppercase tracking-wide bg-zinc-800 text-white px-2.5 py-1 rounded-full mb-3">
              {COPY.kitchenBadge}
            </span>
          )}
          {!product.inStock && (
            <span className="inline-block text-[11px] font-semibold bg-zinc-800 text-white px-2.5 py-1 rounded-full mb-3 ml-2">
              {COPY.comingSoon}
            </span>
          )}
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tighter">{product.name}</h1>
          <p className="text-2xl font-medium mt-2 tracking-tighter">
            ${(product.price / 100).toFixed(2)}
          </p>
          <p className="text-zinc-700 mt-5 leading-relaxed">{product.description}</p>
          {accessory ? (
            <p className="text-sm text-zinc-600 mt-5 leading-relaxed bg-amber-50 border border-amber-200 rounded-2xl p-4">
              {COPY.accessoryPageShipNote}
            </p>
          ) : (
            <>
              <p className="text-sm text-zinc-600 mt-5 leading-relaxed">
                {withPickupCopyLinks(product.kind === 'honey' ? COPY.honeyShipNote : COPY.otherShipNote)}
              </p>
              <PickupConversionCta compact className="mt-4" />
            </>
          )}
          <div className="mt-8">
            <AddToCartButton product={product} />
          </div>
          <p className="text-xs text-zinc-500 mt-4">
            {accessory
              ? withPickupCopyLinks('Questions about honey pickup still go to johnabiddle@gmail.com / 540-400-4586. This lid ships from a supplier, not from the house.')
              : COPY.giftSetNote}
          </p>
        </div>
      </div>
    </div>
  );
}
