'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { HONEY_PRODUCT_IDS } from '@/lib/products';
import { calculateShippingCents } from '@/lib/checkout';
import { CONTACT_EMAIL, COPY } from '@/lib/copy';
import { US_STATES } from '@/lib/us-states';

interface CartItem {
  id: number;
  name: string;
  price: number;
  description: string;
  quantity: number;
}

function isVirginia(state: string) {
  const a = state.toUpperCase().trim();
  return a === 'VA' || a.includes('VIRGINIA');
}

function isNonContinental(state: string) {
  const a = state.toUpperCase().trim();
  return a === 'AK' || a === 'HI' || a.includes('ALASKA') || a.includes('HAWAII');
}

export default function Checkout() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [shipping, setShipping] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: 'VA',
    zip: '',
    country: 'US',
  });
  const [isPickup, setIsPickup] = useState(true);

  const router = useRouter();

  const hasHoneyItems = cart.some(item => HONEY_PRODUCT_IDS.includes(item.id));
  const shippingCostCents = isPickup ? 0 : calculateShippingCents(cart.length);
  const productsTotalCents = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const grandTotalCents = productsTotalCents + shippingCostCents;
  const honeyBlocked = !isPickup && hasHoneyItems && !isVirginia(shipping.state);
  const continentalBlocked = !isPickup && !hasHoneyItems && isNonContinental(shipping.state);

  useEffect(() => {
    const savedCart = localStorage.getItem('hiveborn-cart');
    if (savedCart) {
      const parsed = JSON.parse(savedCart);
      if (parsed.length === 0) {
        router.push('/');
      } else {
        // eslint-disable-next-line react-hooks/set-state-in-effect
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
    if (!shipping.name || !shipping.email || !shipping.phone) {
      alert('Please fill out name, email, and phone so we can reach you.');
      return;
    }
    if (!shipping.address || !shipping.city || !shipping.state || !shipping.zip) {
      alert('Please fill out all contact / shipping fields.');
      return;
    }

    if (!isPickup) {
      if (hasHoneyItems && !isVirginia(shipping.state)) {
        alert(COPY.honeyOutsideVaAlert);
        return;
      }
      if (!hasHoneyItems && isNonContinental(shipping.state)) {
        alert(COPY.continentalOnly);
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
          email: shipping.email,
          phone: shipping.phone,
        }),
      });

      const data = await res.json();

      if (data.url) {
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

  const payLabel = isPickup
    ? `Pay $${(grandTotalCents / 100).toFixed(2)} — apiary pickup`
    : `Pay $${(grandTotalCents / 100).toFixed(2)} with Stripe`;

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-semibold tracking-tighter mb-2">Checkout</h1>
      <p className="text-sm text-zinc-600 mb-8">{COPY.checkoutIntro}</p>

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
          <div>${(productsTotalCents / 100).toFixed(2)}</div>
        </div>
        <div className="flex justify-between text-sm">
          <div>
            {isPickup
              ? COPY.checkoutPickupLine
              : hasHoneyItems
                ? COPY.checkoutShippingHoney
                : COPY.checkoutShippingOther}
          </div>
          <div>${(shippingCostCents / 100).toFixed(2)}</div>
        </div>
        <div className="flex justify-between font-semibold text-lg pt-4 border-t">
          <div>{isPickup ? COPY.checkoutPickupTotal : 'Total'}</div>
          <div>${(grandTotalCents / 100).toFixed(2)}</div>
        </div>
      </div>

      {/* Shipping Address / Pickup Details */}
      <div className="mb-10">
        <h2 className="font-semibold mb-4 text-xl tracking-tight">{isPickup ? 'Pickup / Contact Information' : 'Shipping Address'}</h2>
        <label className="flex items-start gap-3 text-sm mb-4 cursor-pointer select-none rounded-2xl border-2 border-amber-500 bg-amber-50 p-4">
          <input
            type="checkbox"
            checked={isPickup}
            onChange={(e) => setIsPickup(e.target.checked)}
            className="w-5 h-5 mt-0.5 accent-black shrink-0"
          />
          <span>
            <span className="font-semibold text-black">{COPY.checkoutPickupLabel}</span>
            <span className="block text-zinc-600 mt-0.5">{COPY.checkoutPickupHint}</span>
            <span className="block text-zinc-600 mt-0.5">{COPY.checkoutUncheck}</span>
          </span>
        </label>
        {!isPickup && (
          <p className="text-sm text-zinc-600 mb-4">{COPY.checkoutShippingNote}</p>
        )}
        {honeyBlocked && (
          <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-2xl p-3 mb-4">
            {COPY.honeyOutsideVa}
          </p>
        )}
        {continentalBlocked && (
          <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-2xl p-3 mb-4">
            {COPY.continentalOnly}
          </p>
        )}
        <div className="grid grid-cols-1 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={shipping.name}
            onChange={handleInputChange}
            className="border p-3 rounded-2xl"
            required
            autoComplete="name"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={shipping.email}
            onChange={handleInputChange}
            className="border p-3 rounded-2xl"
            required
            autoComplete="email"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone"
            value={shipping.phone}
            onChange={handleInputChange}
            className="border p-3 rounded-2xl"
            required
            autoComplete="tel"
          />
          <input
            type="text"
            name="address"
            placeholder="Street Address"
            value={shipping.address}
            onChange={handleInputChange}
            className="border p-3 rounded-2xl"
            required
            autoComplete="street-address"
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
              autoComplete="address-level2"
            />
            <select
              name="state"
              value={shipping.state}
              onChange={handleInputChange}
              className="border p-3 rounded-2xl bg-white"
              required
            >
              {US_STATES.map((s) => (
                <option key={s.code} value={s.code}>{s.name}</option>
              ))}
            </select>
          </div>
          <input
            type="text"
            name="zip"
            placeholder="ZIP"
            value={shipping.zip}
            onChange={handleInputChange}
            className="border p-3 rounded-2xl"
            required
            autoComplete="postal-code"
          />
          <p className="text-xs text-zinc-500">United States only.</p>
        </div>
      </div>

      <button
        onClick={handleCheckout}
        disabled={isLoading || honeyBlocked || continentalBlocked}
        className="w-full bg-black text-white py-4 rounded-2xl font-semibold text-lg disabled:opacity-70 active:bg-zinc-800"
      >
        {isLoading ? 'Processing...' : payLabel}
      </button>

      <p className="text-xs text-center text-zinc-500 mt-4">
        {isPickup ? COPY.checkoutPickupFooter : COPY.checkoutShipFooter}
      </p>
      {isPickup && (
        <p className="text-xs text-center text-zinc-500 mt-2">
          After you pay, pick up Saturday or Sunday at the house. Questions:{' '}
          <a href={`mailto:${CONTACT_EMAIL}`} className="underline">{CONTACT_EMAIL}</a>.
        </p>
      )}
    </div>
  );
}
