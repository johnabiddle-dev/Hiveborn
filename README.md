# Hiveborn Store

Next.js + Stripe + Resend store for honey, hot honey, lotion, and dipper products.

The site is live on the custom domain at **hiveborn.com** (www.hiveborn.com).

Webhook is registered at `https://www.hiveborn.com/api/webhook`.

You monitor orders primarily through the Stripe dashboard (Payments section). The webhook still runs for any server-side logic and attempts to send a confirmation email as a bonus (from `onboarding@resend.dev` with BCC to `orders@hiveborn.com`).

---

## Current production configuration

**In Vercel (Hiveborn project):**

- **Domains**: `hiveborn.com` and `www.hiveborn.com` should be added and assigned to the **Production** deployment. (Vercel will usually recommend a redirect from apex to www or vice versa — keep whatever you have working.)

- **Environment Variables** (Production scope, exact names required):

  - `NEXT_PUBLIC_APP_URL=https://www.hiveborn.com`  
    (Matches the current webhook registration shown in Stripe. Controls the success/cancel URLs customers are sent to after payment.)

  - `STRIPE_SECRET_KEY=sk_live_...` (or sk_test_... while testing)

  - `STRIPE_WEBHOOK_SECRET=whsec_...`  
    Must be the signing secret from the exact "Hiveborn Checkout" destination in Stripe that points at `https://www.hiveborn.com/api/webhook`. If you roll the secret in Stripe, update this and redeploy.

  - `RESEND_API_KEY=re_...`

After changing any of these, redeploy.

**In Stripe Dashboard → Developers → Webhooks:**

The destination "Hiveborn Checkout" (or equivalent) should have Endpoint URL `https://www.hiveborn.com/api/webhook`.

You can view recent deliveries and the signing secret there (as in the screenshot you shared).

---

## Testing on the live domain

Even with the site on the real domain, use Stripe **test cards** until you're comfortable:

- Card: `4242 4242 4242 4242`
- Expiry: any future date
- CVC: `123`
- ZIP: any

After a successful payment you will land on the success page at `https://www.hiveborn.com/success?...`

The order will appear in Stripe → Payments (with the metadata we attach: shipping details, `isPickup` flag, etc.).

---

## Local development

```bash
npm run dev
```

Open http://localhost:3000.

For local webhooks you'd need the Stripe CLI or a tunnel (ngrok), but for normal work you can test the UI locally and do real purchases on the live domain.

## Key files

- `app/api/checkout/route.ts` — creates the Stripe Checkout session and attaches metadata
- `app/api/webhook/route.ts` — handles `checkout.session.completed`, sends Resend email (bonus)
- `app/checkout/page.tsx` — shipping/pickup form + policy text
- `app/success/success-content.tsx` — verifies the payment server-side and clears the cart
- `lib/products.ts` — product data + local images from /public/images

## Environment variables (local)

Copy `.env.local.example` to `.env.local` and fill values. The example is set up for the live `www.hiveborn.com` domain.

## Deploy

The repo is connected to the Hiveborn Vercel project. The root is the `hiveborn` folder (or explicitly set if the repo contains multiple apps).

---

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js).
