import React, { createContext, useContext, useState, useCallback } from 'react';

/* ================================================================
   SAVORIA - Payment Context
   Stores the completed payment result so the success page can
   verify the user arrived through a real payment flow (not a
   direct URL visit). Sensitive card data is NEVER stored here.
================================================================ */

const PaymentContext = createContext(null);

export function PaymentProvider({ children }) {
  const [paymentResult, setPaymentResult] = useState(null);

  const savePaymentResult = useCallback((result) => {
    // Only store non-sensitive data
    setPaymentResult({
      orderId:       result.orderId,
      amount:        result.amount,
      method:        result.method,
      transactionId: result.transactionId,
      timestamp:     result.timestamp,
      items:         result.items,
      subtotal:      result.subtotal,
      tax:           result.tax,
      total:         result.total,
    });
  }, []);

  const clearPaymentResult = useCallback(() => setPaymentResult(null), []);

  return (
    <PaymentContext.Provider value={{ paymentResult, savePaymentResult, clearPaymentResult }}>
      {children}
    </PaymentContext.Provider>
  );
}

export function usePayment() {
  const ctx = useContext(PaymentContext);
  if (!ctx) throw new Error('usePayment must be used within PaymentProvider');
  return ctx;
}