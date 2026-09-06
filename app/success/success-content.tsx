'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import type { FulfillmentPlan } from '@/lib/fulfillment';
import { successFulfillmentBadge, successFulfillmentMessage } from '@/lib/fulfillment';
import { withPickupCopyLinks } from '@/lib/pickup-maps-link';

interface VerifiedOrder {
  verified: boolean;
  amountTotal?: number;
  isPickup?: boolean;
  isSplitFulfillment?: boolean;
  hasAccessoryItems?: boolean;
  accessoriesShip?: boolean;
  plan?: FulfillmentPlan;
  customerName?: string | null;
  shippingAddress?: { address?: string; city?: string; state?: string; zip?: string } | null;
  items?: Array<{ name: string; amount: number; quantity: number }>;
}

export default function SuccessContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState<string>('');
  const [order, setOrder] = useState<VerifiedOrder | null>(null);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStatus('error');
      setMessage('No payment session found.');
      return;
    }

    const verifyPayment = async () => {
      try {
        const res = await fetch('/api/verify-checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
        });

        const data = await res.json();

        if (data.verified) {
          setStatus('success');
          setOrder(data);

          const pickupText = data.plan
            ? successFulfillmentMessage(data.plan)
            : data.isSplitFulfillment
              ? successFulfillmentMessage({
                  hasHoneyItems: true,
                  hasHouseItems: false,
                  hasAccessoryItems: true,
                  pickupEligible: true,
                  honeyForcedPickup: true,
                  honeyHousePickup: true,
                  honeyShips: false,
                  houseShips: false,
                  accessoriesShip: true,
                  isSplitFulfillment: true,
                  shippingLineCount: 1,
                })
              : data.isPickup
                ? successFulfillmentMessage({
                    hasHoneyItems: true,
                    hasHouseItems: false,
                    hasAccessoryItems: false,
                    pickupEligible: true,
                    honeyForcedPickup: false,
                    honeyHousePickup: true,
                    honeyShips: false,
                    houseShips: false,
                    accessoriesShip: false,
                    isSplitFulfillment: false,
                    shippingLineCount: 0,
                  })
                : 'Your order will be shipped to the address you provided.';

          setMessage(`Thank you! Payment confirmed. ${pickupText}`);

          // Only clear the cart after successful server-side verification
          localStorage.removeItem('hiveborn-cart');
        } else {
          setStatus('error');
          setMessage(data.error || 'We could not confirm your payment. Please contact us if you were charged.');
        }
      } catch (err) {
        console.error(err);
        setStatus('error');
        setMessage('Something went wrong while confirming your order. Please contact us.');
      }
    };

    verifyPayment();
  }, [searchParams]);

  return (
    <div className="max-w-md mx-auto px-6 py-20 text-center">
      <h1 className="text-4xl font-semibold tracking-tighter mb-4">Order Confirmed</h1>

      {status === 'loading' && <p>Processing your order...</p>}

      {status === 'success' && (
        <>
          <p className="text-xl text-emerald-600 mb-6">{withPickupCopyLinks(message)}</p>

          {order && (
            <div className="text-left bg-zinc-50 rounded-2xl p-4 mb-8 text-sm text-zinc-600">
              {order.customerName && <div className="mb-1">Name: {order.customerName}</div>}
              {order.amountTotal && (
                <div className="mb-1">
                  Total paid: ${(order.amountTotal / 100).toFixed(2)}
                </div>
              )}
              {order.plan && (
                <div className="mb-1 font-medium">
                  {successFulfillmentBadge(order.plan)}
                </div>
              )}
              {!order.plan && order.isPickup !== undefined && (
                <div className="mb-1 font-medium">
                  {order.isPickup ? '✓ Pickup at the house (email or text to schedule)' : '✓ Shipping'}
                </div>
              )}
              {order.shippingAddress?.address && (
                <div className="mt-2 text-xs">
                  {order.plan?.isSplitFulfillment
                    ? 'Kitchen add-ons ship to:'
                    : order.plan?.honeyHousePickup
                      ? 'Contact details on file'
                      : 'Shipping to:'}
                  <br />
                  {order.shippingAddress.address}<br />
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
                </div>
              )}
            </div>
          )}

          <p className="text-sm text-zinc-600 mb-8">
            A confirmation email has been sent to the address on file. Check your Stripe receipt for the transaction details.
          </p>
        </>
      )}

      {status === 'error' && (
        <p className="text-red-600 mb-6">{message}</p>
      )}

      <Link
        href="/"
        className="inline-block bg-black text-white px-8 py-3 rounded-2xl font-medium"
      >
        Back to Shop
      </Link>
    </div>
  );
}
