import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { Resend } from 'resend';
import { CONTACT_EMAIL, CONTACT_PHONE, COPY } from '@/lib/copy';
import { formatAddress, fulfillmentCustomerText, planFromMetadata } from '@/lib/fulfillment';
import { htmlWithPickupCopyLinks } from '@/lib/pickup-maps-link';

export async function POST(req: NextRequest) {
  // Webhook endpoint is registered in Stripe as https://www.hiveborn.com/api/webhook
  // (see the "Hiveborn Checkout" destination in Stripe Dashboard → Webhooks).
  // STRIPE_WEBHOOK_SECRET in Vercel must be the signing secret for that exact destination.
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
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
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Webhook signature verification failed:', message);
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 });
  }

  // Handle successful checkout
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      // Retrieve full session with line items for accurate order details
      const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ['line_items'],
      });

      const metadata = (fullSession.metadata || {}) as Record<string, string>;
      const plan = planFromMetadata(metadata);
      let shippingAddress: { name?: string; address?: string; city?: string; state?: string; zip?: string } = {};
      try {
        if (metadata.shippingAddress) {
          shippingAddress = JSON.parse(metadata.shippingAddress);
        }
      } catch {
        // ignore
      }

      const customerEmail = fullSession.customer_details?.email || '';
      const customerName = fullSession.customer_details?.name || shippingAddress.name || 'Customer';

      // Build items list from line items (includes products + shipping if any)
      const items = (fullSession.line_items?.data || []).map((item: unknown) => {
        const i = item as { description?: string; quantity?: number; amount_total?: number };
        const name = i.description || 'Item';
        const qty = i.quantity || 1;
        const amount = (i.amount_total || 0) / 100;
        return `${qty}× ${name} — $${amount.toFixed(2)}`;
      }).join('\n');

      const total = (fullSession.amount_total || 0) / 100;
      const addressText = formatAddress(shippingAddress);
      const fulfillment = fulfillmentCustomerText(plan, addressText);

      const emailHtml = `
        <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #111;">Hiveborn Order Confirmation</h1>
          <p>Hi ${customerName},</p>
          <p>Thank you for your order! Your payment has been confirmed.</p>
          ${plan.isSplitFulfillment ? `<p style="background:#fffbeb;border:1px solid #f59e0b;padding:12px;border-radius:12px;"><strong>Split fulfillment:</strong> ${COPY.webhookSplitBanner}</p>` : ''}
          
          <h2 style="margin-top: 24px; font-size: 18px;">Order Details</h2>
          <pre style="background: #f5f5f5; padding: 16px; border-radius: 8px; white-space: pre-wrap;">${items}</pre>
          
          <p><strong>Total: $${total.toFixed(2)}</strong></p>
          
          <h2 style="margin-top: 24px; font-size: 18px;">Fulfillment</h2>
          <p>${htmlWithPickupCopyLinks(fulfillment).replace(/\n/g, '<br>')}</p>
          
          <p style="margin-top: 24px;">If you have any questions, reply to this email or contact us at ${htmlWithPickupCopyLinks(plan.honeyHousePickup ? `${CONTACT_EMAIL} or text ${CONTACT_PHONE}` : CONTACT_EMAIL)}.</p>
          
          <p style="color: #666; font-size: 12px; margin-top: 32px;">
            Hiveborn • Quality products from the hive. Kitchen add-ons are not Hiveborn honey.
          </p>
        </div>
      `;

      if (customerEmail) {
        if (!process.env.RESEND_API_KEY) {
          console.error('RESEND_API_KEY is not set - skipping email');
        } else {
          const resend = new Resend(process.env.RESEND_API_KEY);
          await resend.emails.send({
            from: 'Hiveborn <onboarding@resend.dev>',
            to: customerEmail,
            bcc: CONTACT_EMAIL, // Owner notification
            subject: plan.isSplitFulfillment
              ? 'Hiveborn Order Confirmation — split fulfillment (pickup + dropship)'
              : plan.accessoriesShip && !plan.honeyHousePickup
                ? 'Hiveborn Order Confirmation — kitchen add-on dropship'
                : `Hiveborn Order Confirmation`,
            html: emailHtml,
          });
          console.log('Order confirmation email sent to', customerEmail);
        }
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
