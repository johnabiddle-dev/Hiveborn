'use client';

import { useState, useEffect } from 'react';
import { ShoppingCart, Plus, X } from 'lucide-react';
import { PRODUCTS, Product } from '@/lib/products';



interface CartItem extends Product {
  quantity: number;
}

export default function HivebornShop() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('hiveborn-cart');
    if (savedCart) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('hiveborn-cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product) => {
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        return current.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...current, { ...product, quantity: 1 }];
      }
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCart((current) =>
      current.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (id: number) => {
    setCart((current) => current.filter((item) => item.id !== id));
  };

  const cartTotal = cart.reduce(
    (sum, item) => sum + (item.price * item.quantity) / 100,
    0
  );

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="border-b bg-amber-50">
        <div className="max-w-6xl mx-auto px-6 py-20 text-center">
          <img 
            src="/images/logo.jpg" 
            alt="Hiveborn" 
            className="h-28 w-auto mx-auto mb-8" 
          />
          <p className="text-2xl font-medium text-zinc-700 max-w-md mx-auto mb-8 tracking-tight">
            Local. Raw. Unfiltered. Perfect.
          </p>
          <a 
            href="#products" 
            className="inline-block bg-black text-white px-8 py-3 rounded-2xl font-medium hover:bg-zinc-800 transition-colors"
          >
            Shop Now
          </a>
        </div>
      </div>

      {/* Products */}
      <div id="products" className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-4xl font-semibold tracking-tighter mb-2 text-center">Our Products</h2>
        <p className="text-center text-zinc-600 mb-12 max-w-md mx-auto">
          Carefully crafted from the hive.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {PRODUCTS.map((product) => (
            <div key={product.id} className="group border rounded-3xl overflow-hidden bg-white flex flex-col">
              <div className="aspect-[4/3] bg-zinc-100 overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div>
                  <h3 className="font-semibold text-xl tracking-tight">{product.name}</h3>
                  <p className="text-2xl font-medium mt-1 tracking-tighter">
                    ${(product.price / 100).toFixed(2)}
                  </p>
                  <p className="text-sm text-zinc-600 mt-3 leading-relaxed">{product.description}</p>
                </div>
                <button
                  onClick={() => addToCart(product)}
                  className="mt-auto w-full bg-black text-white py-3 rounded-2xl font-medium flex items-center justify-center gap-2 hover:bg-zinc-800 active:scale-[0.985] transition-all mt-6"
                >
                  <Plus size={16} /> Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="fixed inset-0 bg-black/40" onClick={() => setIsCartOpen(false)} />
          <div className="relative w-full max-w-md bg-white h-full shadow-xl flex flex-col">
            <div className="p-6 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingCart />
                <div>
                  <div className="font-semibold">Your Cart</div>
                  <div className="text-xs text-zinc-500">{cartCount} items</div>
                </div>
              </div>
              <button onClick={() => setIsCartOpen(false)}><X /></button>
            </div>

            {cart.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-zinc-500">
                Your cart is empty.
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-auto p-6 space-y-6">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <img src={item.image} alt="" className="w-20 h-20 object-cover rounded-xl" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-zinc-600">${(item.price / 100).toFixed(2)} each</div>
                        
                        <div className="flex items-center gap-3 mt-2">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="border w-8 h-8 flex items-center justify-center rounded active:bg-zinc-100">-</button>
                          <span>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="border w-8 h-8 flex items-center justify-center rounded active:bg-zinc-100">+</button>
                          <button onClick={() => removeFromCart(item.id)} className="ml-auto text-xs text-red-600">Remove</button>
                        </div>
                      </div>
                      <div className="font-medium text-right">
                        ${((item.price * item.quantity) / 100).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-6 border-t">
                  <div className="flex justify-between text-lg font-semibold mb-6">
                    <div>Total</div>
                    <div>${cartTotal.toFixed(2)}</div>
                  </div>
                  <a 
                    href="/checkout" 
                    onClick={() => setIsCartOpen(false)}
                    className="block w-full bg-black text-white text-center py-3.5 rounded-2xl font-medium active:bg-zinc-800"
                  >
                    Proceed to Checkout
                  </a>
                  <p className="text-[10px] text-center text-zinc-500 mt-3">Shipping starts at $11 or free local pickup (see checkout for details)</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Simple info */}
      <div className="max-w-6xl mx-auto px-6 py-12 border-t text-sm text-zinc-600">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="font-medium text-black mb-1">Shipping Policy</div>
            <p>All honey products ship only to Virginia (or available for local pickup); Summer Lotion and Dipper ship to continental US or local pickup. Orders ship within 1-2 business days or ready for pickup.</p>
          </div>
          <div>
            <div className="font-medium text-black mb-1">Satisfaction guaranteed</div>
            <p>Not happy with your order? Contact us within 30 days.</p>
          </div>
          <div>
            <div className="font-medium text-black mb-1">Questions?</div>
            <p>Email us at orders@hiveborn.com — we reply fast.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
