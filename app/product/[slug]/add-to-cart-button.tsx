'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { track } from '@vercel/analytics';
import { Plus } from 'lucide-react';
import { markOrderIntent } from '@/lib/order-intent';
import { isPurchasable, unavailableLabel, type Product } from '@/lib/products';

export default function AddToCartButton({ product }: { product: Product }) {
  const router = useRouter();
  const [added, setAdded] = useState(false);

  if (!product.inStock || !isPurchasable(product.id)) {
    return (
      <button
        type="button"
        disabled
        aria-disabled="true"
        className="w-full bg-zinc-200 text-zinc-600 py-3 rounded-2xl font-medium cursor-not-allowed"
      >
        {unavailableLabel(product)}
      </button>
    );
  }

  const addToCart = () => {
    markOrderIntent();
    track('add_to_cart', {
      productName: product.name,
      price: product.price / 100,
      productId: product.id,
    });
    const saved = localStorage.getItem('hiveborn-cart');
    const cart = saved ? (JSON.parse(saved) as Array<Product & { quantity: number }>) : [];
    const existing = cart.find((item) => item.id === product.id);
    const next = existing
      ? cart.map((item) =>
          item.id === product.id ? { ...item, ...product, quantity: item.quantity + 1 } : item
        )
      : [...cart, { ...product, quantity: 1 }];
    localStorage.setItem('hiveborn-cart', JSON.stringify(next));
    setAdded(true);
    router.push('/cart');
  };

  return (
    <button
      type="button"
      onClick={addToCart}
      className="w-full bg-black text-white py-3 rounded-2xl font-medium flex items-center justify-center gap-2 hover:bg-zinc-800 active:scale-[0.985] transition-all"
    >
      <Plus size={16} /> {added ? 'Added — going to cart' : 'Add to Cart'}
    </button>
  );
}
