'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface CartItem {
  id: number;
  name: string;
  price: number;
  description: string;
  quantity: number;
  image: string;
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('hiveborn-cart');
    if (saved) setCart(JSON.parse(saved));
  }, []);

  const updateQuantity = (id: number, qty: number) => {
    if (qty < 1) return;
    const updated = cart.map(item => 
      item.id === id ? { ...item, quantity: qty } : item
    );
    setCart(updated);
    localStorage.setItem('hiveborn-cart', JSON.stringify(updated));
  };

  const remove = (id: number) => {
    const updated = cart.filter(item => item.id !== id);
    setCart(updated);
    localStorage.setItem('hiveborn-cart', JSON.stringify(updated));
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity) / 100, 0);

  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto px-6 py-20 text-center">
        <h1 className="text-3xl font-semibold mb-4">Your Cart is Empty</h1>
        <Link href="/" className="text-blue-600 underline">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-semibold tracking-tighter mb-8">Your Cart</h1>

      <div className="space-y-6 mb-10">
        {cart.map(item => (
          <div key={item.id} className="flex gap-6 border-b pb-6">
            <img src={item.image} alt="" className="w-24 h-24 object-cover rounded-2xl" />
            <div className="flex-1">
              <div className="font-semibold">{item.name}</div>
              <div className="text-sm text-zinc-600">${(item.price / 100).toFixed(2)}</div>
              <div className="flex items-center gap-4 mt-3 text-sm">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2 border rounded">-</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 border rounded">+</button>
                <button onClick={() => remove(item.id)} className="ml-auto text-red-600 text-xs">Remove</button>
              </div>
            </div>
            <div className="font-medium text-right">
              ${((item.price * item.quantity) / 100).toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between text-2xl font-semibold mb-8">
        <div>Total</div>
        <div>${total.toFixed(2)}</div>
      </div>

      <Link 
        href="/checkout" 
        className="block text-center bg-black text-white py-4 rounded-2xl font-semibold text-lg"
      >
        Continue to Checkout
      </Link>

      <p className="text-center text-xs text-zinc-500 mt-4">Shipping starts at $11.00 (higher based on volume) or free local pickup available. All honey products ship only to Virginia or local pickup; Summer Lotion and Dipper ship to continental US or local pickup.</p>
    </div>
  );
}
