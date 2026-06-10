'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

interface VerifiedOrder {
  verified: boolean;
  amountTotal?: number;
  isPickup?: boolean;
  customerName?: string | null;
  shippingAddress?: any;
  items?: Array<{ name: string; amount: number; quantity: number }>;
}

export default function SuccessContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [order, setOrder] = useState<VerifiedOrder | null>(null);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
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

          const pickupText = data.isPickup
            ? 'Your order is marked for local pickup. We will contact you to arrange a time.'
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
          <p className="text-xl text-emerald-600 mb-6">{message}</p>

          {order && (
            <div className="text-left bg-zinc-50 rounded-2xl p-4 mb-8 text-sm text-zinc-600">
              {order.customerName && <div className="mb-1">Name: {order.customerName}</div>}
              {order.amountTotal && (
                <div className="mb-1">
                  Total paid: ${(order.amountTotal / 100).toFixed(2)}
                </div>
              )}
              {order.isPickup !== undefined && (
                <div className="mb-1 font-medium">
                  {order.isPickup ? '✓ Local pickup' : '✓ Shipping'}
                </div>
              )}
              {order.shippingAddress?.address && (
                <div className="mt-2 text-xs">
                  {order.isPickup ? 'Contact details on file' : 'Shipping to:'}<br />
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

      <a 
        href="/" 
        className="inline-block bg-black text-white px-8 py-3 rounded-2xl font-medium"
      >
        Back to Shop
      </a>
    </div>
  );
}
