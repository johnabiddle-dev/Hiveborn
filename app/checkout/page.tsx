'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { calculateShippingCents } from '@/lib/checkout';
import { CONTACT_EMAIL, COPY } from '@/lib/copy';
import {
  checkoutShippingLabel,
  lineFulfillmentLabel,
  planFulfillment,
  validateShipDestination,
} from '@/lib/fulfillment';
import { isPurchasable, withCatalogFields } from '@/lib/products';
import { withPickupCopyLinks, withPickupMapsLink } from '@/lib/pickup-maps-link';
import { US_STATES } from '@/lib/us-states';

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

  const plan = planFulfillment(cart, isPickup);
  const shippingCostCents = calculateShippingCents(plan.shippingLineCount);
  const productsTotalCents = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const grandTotalCents = productsTotalCents + shippingCostCents;
  const destination = validateShipDestination(plan, shipping.state);
  const honeyBlocked = !destination.ok && destination.reason === 'honey_outside_va';
  const continentalBlocked = !destination.ok && destination.reason === 'non_continental';

  useEffect(() => {
    const savedCart = localStorage.getItem('hiveborn-cart');
    if (savedCart) {
      const parsed = (JSON.parse(savedCart) as CartItem[])
        .filter((item) => isPurchasable(item.id))
        .map(withCatalogFields);
      localStorage.setItem('hiveborn-cart', JSON.stringify(parsed));
      if (parsed.length === 0) {
        router.push('/');
      } else {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCart(parsed);
        const nextPlan = planFulfillment(parsed, true);
        if (!nextPlan.pickupEligible) {
          setIsPickup(false);
        }
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
    if (cart.some((item) => !isPurchasable(item.id))) {
      alert('Some items in your cart are no longer available. Please remove them and try again.');
      return;
    }
    if (!shipping.name || !shipping.email || !shipping.phone) {
      alert('Please fill out name, email, and phone so we can reach you.');
      return;
    }
    if (!shipping.address || !shipping.city || !shipping.state || !shipping.zip) {
      alert(plan.hasAccessoryItems
        ? 'Kitchen add-ons need a ship-to address. The supplier dropships to you.'
        : 'Please fill out all contact / shipping fields.');
      return;
    }

    if (!destination.ok) {
      alert(destination.reason === 'honey_outside_va' ? COPY.honeyOutsideVaAlert : COPY.continentalOnly);
      return;
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
          isPickup: plan.honeyHousePickup,
          email: shipping.email,
          phone: shipping.phone,
        }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.assign(data.url);
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

  const payLabel = plan.shippingLineCount === 0
    ? `Pay $${(grandTotalCents / 100).toFixed(2)} — apiary pickup`
    : `Pay $${(grandTotalCents / 100).toFixed(2)} with Stripe`;

  const addressHeading = plan.isSplitFulfillment
    ? COPY.checkoutAddressSplit
    : plan.shippingLineCount > 0
      ? COPY.checkoutAddressShip
      : COPY.checkoutAddressHoney;

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-semibold tracking-tighter mb-2">Checkout</h1>
      <p className="text-sm text-zinc-600 mb-2">{COPY.checkoutIntro}</p>
      <p className="text-sm text-zinc-600 mb-8">{COPY.giftSetNote}</p>

      {plan.isSplitFulfillment && (
        <div className="mb-8 rounded-3xl border-2 border-amber-500 bg-amber-50 p-4 text-sm text-zinc-800">
          {COPY.checkoutSplitBanner}
        </div>
      )}
      {!plan.pickupEligible && plan.hasAccessoryItems && (
        <div className="mb-8 rounded-3xl border border-zinc-300 bg-zinc-50 p-4 text-sm text-zinc-700">
          {COPY.checkoutAccessoryOnlyNote}
        </div>
      )}

      {/* Order Summary */}
      <div className="mb-10 border rounded-3xl p-6">
        <h2 className="font-semibold mb-4">Order Summary</h2>
        {cart.map(item => (
          <div key={item.id} className="flex justify-between py-2 border-b last:border-0 text-sm">
            <div>
              <div>{item.name} × {item.quantity}</div>
              {item.description && (
                <div className="text-xs text-zinc-500 mt-0.5">{item.description}</div>
              )}
              <div className="text-xs text-amber-800 mt-0.5">{lineFulfillmentLabel(item.id, plan)}</div>
            </div>
            <div>${((item.price * item.quantity) / 100).toFixed(2)}</div>
          </div>
        ))}
        <div className="flex justify-between text-sm pt-2">
          <div>Products</div>
          <div>${(productsTotalCents / 100).toFixed(2)}</div>
        </div>
        <div className="flex justify-between text-sm">
          <div>{checkoutShippingLabel(plan)}</div>
          <div>${(shippingCostCents / 100).toFixed(2)}</div>
        </div>
        <div className="flex justify-between font-semibold text-lg pt-4 border-t">
          <div>{plan.shippingLineCount === 0 ? COPY.checkoutPickupTotal : 'Total'}</div>
          <div>${(grandTotalCents / 100).toFixed(2)}</div>
        </div>
      </div>

      {/* Shipping Address / Pickup Details */}
      <div className="mb-10">
        <h2 className="font-semibold mb-4 text-xl tracking-tight">{addressHeading}</h2>
        {plan.pickupEligible && (
          <label className="flex items-start gap-3 text-sm mb-4 cursor-pointer select-none rounded-2xl border-2 border-amber-500 bg-amber-50 p-4">
            <input
              type="checkbox"
              checked={isPickup}
              onChange={(e) => setIsPickup(e.target.checked)}
              className="w-5 h-5 mt-0.5 accent-black shrink-0"
            />
            <span>
              <span className="font-semibold text-black">{COPY.checkoutPickupLabel}</span>
              <span className="block text-zinc-600 mt-0.5">{withPickupMapsLink(COPY.checkoutPickupHint)}</span>
              <span className="block text-zinc-600 mt-0.5">
                {plan.hasAccessoryItems ? COPY.checkoutPickupWithAccessories : COPY.checkoutUncheck}
              </span>
            </span>
          </label>
        )}
        {plan.shippingLineCount > 0 && (
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
            placeholder={plan.hasAccessoryItems ? 'Ship-to street address' : 'Street Address'}
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
        {plan.isSplitFulfillment
          ? COPY.checkoutSplitFooter
          : plan.shippingLineCount === 0
            ? COPY.checkoutPickupFooter
            : COPY.checkoutShipFooter}
      </p>
      {plan.honeyHousePickup && (
        <p className="text-xs text-center text-zinc-500 mt-2">
          {withPickupCopyLinks(COPY.checkoutPickupAfterPay)} Questions:{' '}
          <a href={`mailto:${CONTACT_EMAIL}`} className="underline">{CONTACT_EMAIL}</a>.
        </p>
      )}
    </div>
  );
}
