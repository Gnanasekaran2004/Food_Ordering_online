/* ================================================================
   SAVORIA - Order Utilities
   SINGLE SOURCE OF TRUTH for order calculations.
   Used by: CartDrawer, PaymentPage, PaymentSuccessPage.
================================================================ */

export const TAX_RATE = 0.05;
export const TAX_LABEL = 'GST (5%)';

export function calcOrderSummary(items = []) {
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const tax      = Math.round(subtotal * TAX_RATE);
  const total    = subtotal + tax;
  return { items, subtotal, tax, total, currency: 'INR' };
}

export function formatINR(amount) {
  return amount.toLocaleString('en-IN');
}