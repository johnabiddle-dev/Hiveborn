export const ORDER_INTENT_KEY = 'hiveborn-order-intent';
export const ORDER_INTENT_EVENT = 'hiveborn-order-intent';

export function readCartItemCount(): number {
  if (typeof window === 'undefined') return 0;
  try {
    const raw = localStorage.getItem('hiveborn-cart');
    if (!raw) return 0;
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return 0;
    return parsed.reduce((sum, item) => {
      if (!item || typeof item !== 'object') return sum;
      const quantity = (item as { quantity?: unknown }).quantity;
      return sum + (typeof quantity === 'number' && quantity > 0 ? quantity : 0);
    }, 0);
  } catch {
    return 0;
  }
}

/** Remember that this browser tab started an order (Add to Cart / Buy). */
export function markOrderIntent(): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(ORDER_INTENT_KEY, '1');
  } catch {
    // Private mode can block storage; checkout and cart routes still show contact.
  }
  window.dispatchEvent(new Event(ORDER_INTENT_EVENT));
}

/**
 * Phone/text contact belongs at the top only after someone starts an order,
 * or on the cart/checkout/success steps themselves.
 * A saved cart alone does not surface it on the homepage — the honey comes first.
 */
export function shouldShowTopContact(input: {
  orderIntent: boolean;
  pathname: string;
  cartItemCount: number;
}): boolean {
  const path = input.pathname || '/';
  if (path === '/checkout' || path.startsWith('/checkout/')) return true;
  if (path === '/success' || path.startsWith('/success/')) return true;
  if (path === '/cart' || path.startsWith('/cart/')) {
    return input.cartItemCount > 0 || input.orderIntent;
  }
  return input.orderIntent;
}
