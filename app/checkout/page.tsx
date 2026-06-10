'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { HONEY_PRODUCT_IDS } from '@/lib/products';

interface CartItem {
  id: number;
  name: string;
  price: number;
  description: string;
  quantity: number;
}

export default function Checkout() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [shipping, setShipping] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'US',
  });
  const [isPickup, setIsPickup] = useState(false);

  const router = useRouter();

  const hasHoneyItems = cart.some(item => HONEY_PRODUCT_IDS.includes(item.id));

  const calculateShippingCents = (numItems: number) => {
    if (numItems === 0) return 0;
    const base = 1100; // minimum $11.00
    const perAdditional = 400; // +$4 per additional item (proxy for volume)
    return base + (numItems - 1) * perAdditional;
  };

  const shippingCostCents = isPickup ? 0 : calculateShippingCents(cart.length);
  const productsTotalCents = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const grandTotalCents = productsTotalCents + shippingCostCents;

  useEffect(() => {
    const savedCart = localStorage.getItem('hiveborn-cart');
    if (savedCart) {
      const parsed = JSON.parse(savedCart);
      if (parsed.length === 0) {
        router.push('/');
      } else {
        setCart(parsed);
      }
    } else {
      router.push('/');
    }
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShipping(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckout = async () => {
    if (!shipping.name || !shipping.address || !shipping.city || !shipping.state || !shipping.zip) {
      alert('Please fill out all contact / shipping fields.');
      return;
    }

    const stateUpper = shipping.state.toUpperCase().trim();
    if (!isPickup) {
      if (hasHoneyItems && stateUpper !== 'VA' && !stateUpper.includes('VIRGINIA')) {
        alert('All honey products can only be shipped to Virginia addresses.');
        return;
      }
      if (!hasHoneyItems && (stateUpper === 'AK' || stateUpper === 'HI' || stateUpper.includes('ALASKA') || stateUpper.includes('HAWAII'))) {
        alert('We only ship to the continental US for non-honey items (Summer Lotion and Dipper).');
        return;
      }
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          shippingAddress: shipping,
          shippingCost: shippingCostCents,
          isPickup,
        }),
      });

      const data = await res.json();

      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        alert(data.error || 'Something went wrong with checkout.');
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      alert('Failed to start checkout. Please try again.');
      setIsLoading(false);
    }
  };

  if (cart.length === 0) {
    return <div className="p-12 text-center">Loading cart...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-semibold tracking-tighter mb-8">Checkout</h1>

      {/* Order Summary */}
      <div className="mb-10 border rounded-3xl p-6">
        <h2 className="font-semibold mb-4">Order Summary</h2>
        {cart.map(item => (
          <div key={item.id} className="flex justify-between py-2 border-b last:border-0 text-sm">
            <div>
              {item.name} × {item.quantity}
            </div>
            <div>${((item.price * item.quantity) / 100).toFixed(2)}</div>
          </div>
        ))}
        <div className="flex justify-between text-sm pt-2">
          <div>Products</div>
          <div>${(cart.reduce((sum, item) => sum + item.price * item.quantity, 0) / 100).toFixed(2)}</div>
        </div>
        <div className="flex justify-between text-sm">
          <div>{isPickup ? 'Pickup (no shipping charge)' : `Shipping (min $11, volume-based${hasHoneyItems ? ', honey to VA only' : ''})`}</div>
          <div>${(shippingCostCents / 100).toFixed(2)}</div>
        </div>
        <div className="flex justify-between font-semibold text-lg pt-4 border-t">
          <div>Total</div>
          <div>${(grandTotalCents / 100).toFixed(2)}</div>
        </div>
        <p className="text-xs text-zinc-500 mt-1">{isPickup ? 'Address information collected for order processing and pickup coordination. No shipping charged.' : 'Honey products can only be shipped to Virginia addresses. Shipping calculated server-side.'}</p>
      </div>

      {/* Shipping Address / Pickup Details */}
      <div className="mb-10">
        <h2 className="font-semibold mb-4 text-xl tracking-tight">{isPickup ? 'Pickup / Contact Information' : 'Shipping Address'}</h2>
        <label className="flex items-center gap-2 text-sm mb-4 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={isPickup}
            onChange={(e) => setIsPickup(e.target.checked)}
            className="w-4 h-4 accent-black"
          />
          This is a local pickup order — no shipping fee will be charged (address still required for order processing)
        </label>
        <p className="text-sm text-zinc-600 mb-4">
          {isPickup ? (
            'Please provide your contact details for pickup coordination and order records. No shipping will be charged.'
          ) : (
            <>
              Shipping is a minimum of $11.00 (higher depending on order volume). 
              All honey products can <strong>only</strong> be shipped to Virginia. 
              Summer Lotion and Honey Dipper ship to the continental US.
            </>
          )}
        </p>
        <div className="grid grid-cols-1 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={shipping.name}
            onChange={handleInputChange}
            className="border p-3 rounded-2xl"
            required
          />
          <input
            type="text"
            name="address"
            placeholder="Street Address"
            value={shipping.address}
            onChange={handleInputChange}
            className="border p-3 rounded-2xl"
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="city"
              placeholder="City"
              value={shipping.city}
              onChange={handleInputChange}
              className="border p-3 rounded-2xl"
              required
            />
            <input
              type="text"
              name="state"
              placeholder="State / Province"
              value={shipping.state}
              onChange={handleInputChange}
              className="border p-3 rounded-2xl"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="zip"
              placeholder="ZIP / Postal Code"
              value={shipping.zip}
              onChange={handleInputChange}
              className="border p-3 rounded-2xl"
              required
            />
            <select
              name="country"
              value={shipping.country}
              onChange={handleInputChange}
              className="border p-3 rounded-2xl"
            >
              <option value="US">United States</option>
              <option value="CA">Canada</option>
            </select>
          </div>
        </div>
      </div>

      <button
        onClick={handleCheckout}
        disabled={isLoading}
        className="w-full bg-black text-white py-4 rounded-2xl font-semibold text-lg disabled:opacity-70 active:bg-zinc-800"
      >
        {isLoading ? 'Processing...' : `Pay $${(grandTotalCents / 100).toFixed(2)} with Stripe`}
      </button>

      <p className="text-xs text-center text-zinc-500 mt-4">
        {isPickup 
          ? 'Local pickup selected — no shipping charged. You will be redirected to Stripe to complete payment.' 
          : 'Shipping starts at $11 (volume-based). Honey products only to Virginia. You will be redirected to Stripe to complete payment.'}
      </p>
    </div>
  );
}
