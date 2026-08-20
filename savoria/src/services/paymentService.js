/* ================================================================
   SAVORIA - Payment Service
   ABSTRACTION LAYER between payment UI and payment provider.

   CURRENT STATE: mock frontend-only implementation.
   FUTURE: replace mock* functions with real Razorpay / Stripe SDK.
   The UI components do NOT change when you swap providers here.

   SECURITY:
   - No card data is stored or persisted here.
   - No CVV is ever passed to this service.
   - Sensitive inputs are discarded after the UI flow completes.
================================================================ */

/** Generate a human-readable order ID, e.g. SV-20260820-10482 */
export function generateOrderId() {
  const d = new Date();
  const date = d.getFullYear().toString()
    + String(d.getMonth() + 1).padStart(2, '0')
    + String(d.getDate()).padStart(2, '0');
  const seq = Math.floor(10000 + Math.random() * 89999);
  return 'SV-' + date + '-' + seq;
}

/** Generate a transaction reference ID, e.g. TXN-SV-8F72A9 */
export function generateTransactionId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let ref = '';
  for (let i = 0; i < 6; i++) ref += chars[Math.floor(Math.random() * chars.length)];
  return 'TXN-SV-' + ref;
}

/**
 * processPayment â€” mock implementation.
 *
 * Simulates a payment gateway call.
 * Returns a Promise that resolves with the payment result.
 * In production: replace this body with real gateway SDK call.
 *
 * @param {{ method: string, amount: number, orderId: string }} params
 * @returns {Promise<{ success: boolean, transactionId: string, orderId: string, amount: number, method: string, timestamp: string }>}
 */
export async function processPayment({ method, amount, orderId }) {
  // Simulate 1.5 second gateway latency
  await new Promise(res => setTimeout(res, 1500));

  // Mock: always succeeds in dev. Replace with real gateway call.
  // To simulate failure: throw paymentError('payment/declined', 'Payment was declined.');
  return {
    success: true,
    transactionId: generateTransactionId(),
    orderId,
    amount,
    method,
    timestamp: new Date().toISOString(),
  };
}

/** Structured payment error factory */
export function paymentError(code, message) {
  const err = new Error(message);
  err.code = code;
  return err;
}