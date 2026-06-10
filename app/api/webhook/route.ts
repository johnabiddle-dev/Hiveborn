import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { Resend } from 'resend';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature');

  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    const body = await req.text();
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle successful checkout
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      // Retrieve full session with line items for accurate order details
      const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ['line_items'],
      });

      const metadata = fullSession.metadata || {};
      const isPickup = metadata.isPickup === 'true';
      let shippingAddress: any = {};
      try {
        if (metadata.shippingAddress) {
          shippingAddress = JSON.parse(metadata.shippingAddress);
        }
      } catch (e) {
        // ignore
      }

      const customerEmail = fullSession.customer_details?.email || '';
      const customerName = fullSession.customer_details?.name || shippingAddress.name || 'Customer';

      // Build items list from line items (includes products + shipping if any)
      const items = (fullSession.line_items?.data || []).map((item: any) => {
        const name = item.description || 'Item';
        const qty = item.quantity || 1;
        const amount = (item.amount_total || 0) / 100;
        return `${qty}× ${name} — $${amount.toFixed(2)}`;
      }).join('\n');

      const total = (fullSession.amount_total || 0) / 100;
      const fulfillment = isPickup
        ? 'Local Pickup — we will contact you to arrange a time and location.'
        : `Shipping to:\n${shippingAddress.name || ''}\n${shippingAddress.address || ''}\n${shippingAddress.city || ''}, ${shippingAddress.state || ''} ${shippingAddress.zip || ''}`;

      const emailHtml = `
        <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #111;">Hiveborn Order Confirmation</h1>
          <p>Hi ${customerName},</p>
          <p>Thank you for your order! Your payment has been confirmed.</p>
          
          <h2 style="margin-top: 24px; font-size: 18px;">Order Details</h2>
          <pre style="background: #f5f5f5; padding: 16px; border-radius: 8px; white-space: pre-wrap;">${items}</pre>
          
          <p><strong>Total: $${total.toFixed(2)}</strong></p>
          
          <h2 style="margin-top: 24px; font-size: 18px;">Fulfillment</h2>
          <p>${fulfillment.replace(/\n/g, '<br>')}</p>
          
          <p style="margin-top: 24px;">If you have any questions, reply to this email or contact us at orders@hiveborn.com.</p>
          
          <p style="color: #666; font-size: 12px; margin-top: 32px;">
            Hiveborn • Quality products from the hive.
          </p>
        </div>
      `;

      if (customerEmail) {
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: 'Hiveborn <orders@hiveborn.com>',
          to: customerEmail,
          bcc: 'orders@hiveborn.com', // Owner notification
          subject: `Hiveborn Order Confirmation`,
          html: emailHtml,
        });
        console.log('Order confirmation email sent to', customerEmail);
      } else {
        console.warn('No customer email on session', fullSession.id);
      }
    } catch (emailErr) {
      console.error('Failed to send order email:', emailErr);
      // Still return 200 so Stripe doesn't retry forever
    }
  }

  // Acknowledge receipt
  return NextResponse.json({ received: true });
}
