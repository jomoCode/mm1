import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle, ShoppingBag, Truck, CreditCard, Banknote, ShieldCheck, ChevronRight, Copy, Check } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { CustomerInfo, OrderSubmission } from '../types/store';
import { submitOrder } from '../services/apiClient';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartSubtotal,
    deliveryFee,
    cartTotal,
    formatPrice,
    clearCart,
    config,
    recentOrderResult,
    setRecentOrderResult,
  } = useStore();

  const [customer, setCustomer] = useState<CustomerInfo>({
    fullName: 'Amara Nwosu',
    email: 'amara.nwosu@example.com',
    phone: '+234 803 123 4567',
    deliveryAddress: 'Plot 14 Admiralty Way, Lekki Phase 1',
    city: 'Lagos',
    notes: 'Please call on arrival at gate.',
    paymentMethod: 'cash_on_delivery',
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedPayload, setCopiedPayload] = useState(false);
  const [showPayloadInspector, setShowPayloadInspector] = useState(false);

  if (!isCheckoutOpen) return null;

  const handleInputChange = (field: keyof CustomerInfo, value: string) => {
    setCustomer((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // 1. Validate cart
    if (cart.length === 0) {
      setErrorMessage('Your cart is empty. Please select products first.');
      return;
    }

    // 2. Validate customer info
    if (!customer.fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!customer.phone.trim()) {
      setErrorMessage('Please enter a valid contact phone number.');
      return;
    }
    if (!customer.deliveryAddress.trim()) {
      setErrorMessage('Please provide your complete delivery street address.');
      return;
    }

    // 3. Construct submission
    const submission: OrderSubmission = {
      customer,
      items: cart.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        unitPrice: item.product.price,
        quantity: item.quantity,
        subtotal: item.product.price * item.quantity,
        category: item.product.category,
      })),
      currency: config.currencyCode || 'NGN',
      subtotal: cartSubtotal,
      deliveryFee,
      totalAmount: cartTotal,
      notes: customer.notes,
    };

    setSubmitting(true);
    const idempotencyKey = `sub_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    try {
      // 4. Send request through backend / BFF
      const res = await submitOrder(submission, idempotencyKey);
      
      // Store result & clear cart
      setRecentOrderResult({
        orderId: res.orderId,
        orderNumber: res.orderNumber,
        submission,
        externalPayloadSent: res.externalPayloadSent,
        message: res.message,
      });
      clearCart();
    } catch (err: any) {
      setErrorMessage(err.message || 'Unable to submit your order to the order API.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setRecentOrderResult(null);
  };

  // --- RENDER SUCCESS RECEIPT VIEW ---
  if (recentOrderResult) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="relative w-full max-w-xl bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl shadow-2xl p-6 sm:p-8 animate-in zoom-in-95 duration-200">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)] flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h2 className="text-2xl font-extrabold text-[var(--color-text)]">
              Order Confirmed!
            </h2>
            <p className="text-xs text-[var(--color-text-muted)] max-w-md mx-auto">
              Your order has been transformed into the target external payload and dispatched through our backend BFF.
            </p>
          </div>

          {/* Order Details Card */}
          <div className="mt-6 p-4 rounded-2xl bg-[var(--color-background)] border border-[var(--color-border)] space-y-3">
            <div className="flex items-center justify-between text-xs pb-3 border-b border-[var(--color-border)]">
              <div>
                <span className="text-[var(--color-text-muted)] block">Order Reference</span>
                <span className="font-mono font-bold text-[var(--color-text)] text-sm">
                  {recentOrderResult.orderId}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[var(--color-text-muted)] block">Estimated Delivery</span>
                <span className="font-bold text-[var(--color-primary)]">Within 2 business hours</span>
              </div>
            </div>

            {/* Recipient & Payment */}
            <div className="grid grid-cols-2 gap-2 text-xs py-1">
              <div>
                <span className="text-[var(--color-text-muted)] block">Deliver To</span>
                <span className="font-semibold text-[var(--color-text)] block">
                  {recentOrderResult.submission.customer.fullName}
                </span>
                <span className="text-[var(--color-text-muted)] block truncate">
                  {recentOrderResult.submission.customer.deliveryAddress}, {recentOrderResult.submission.customer.city}
                </span>
              </div>
              <div>
                <span className="text-[var(--color-text-muted)] block">Payment Method</span>
                <span className="font-semibold text-[var(--color-text)] capitalize">
                  {recentOrderResult.submission.customer.paymentMethod.replace(/_/g, ' ')}
                </span>
              </div>
            </div>

            {/* Items summary */}
            <div className="pt-2 border-t border-[var(--color-border)] space-y-1.5 text-xs">
              {recentOrderResult.submission.items.map((item: any) => (
                <div key={item.productId} className="flex justify-between items-center text-[var(--color-text)]">
                  <span>{item.name} × {item.quantity}</span>
                  <span className="font-bold tabular-nums">{formatPrice(item.subtotal)}</span>
                </div>
              ))}
              <div className="flex justify-between items-center pt-2 border-t border-[var(--color-border)] font-bold text-sm text-[var(--color-text)]">
                <span>Total Amount Paid</span>
                <span className="text-[var(--color-primary)] text-base tabular-nums">
                  {formatPrice(recentOrderResult.submission.totalAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* Toggle External API Payload Inspection */}
          <div className="mt-4">
            <button
              onClick={() => setShowPayloadInspector(!showPayloadInspector)}
              className="w-full py-2 px-3 text-xs font-semibold text-[var(--color-primary)] hover:bg-[var(--color-primary-light)] rounded-xl border border-[var(--color-border)] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>{showPayloadInspector ? 'Hide' : 'Inspect'} External API Payload Sent</span>
              <ChevronRight className={`w-3.5 h-3.5 transform transition-transform ${showPayloadInspector ? 'rotate-90' : ''}`} />
            </button>

            {showPayloadInspector && recentOrderResult.externalPayloadSent && (
              <div className="mt-2 p-3 bg-slate-900 rounded-xl text-slate-100 font-mono text-[11px] overflow-x-auto relative">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(recentOrderResult.externalPayloadSent, null, 2));
                    setCopiedPayload(true);
                    setTimeout(() => setCopiedPayload(false), 1500);
                  }}
                  className="absolute top-2 right-2 px-2 py-1 rounded bg-slate-800 text-slate-300 hover:text-white flex items-center gap-1 text-[10px] cursor-pointer"
                >
                  {copiedPayload ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {copiedPayload ? 'Copied' : 'Copy JSON'}
                </button>
                <pre className="pr-16">{JSON.stringify(recentOrderResult.externalPayloadSent, null, 2)}</pre>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="mt-6 flex gap-3">
            <button
              onClick={handleClose}
              className="w-full py-3 rounded-xl bg-[var(--color-primary)] text-white font-bold text-sm hover:bg-[var(--color-primary-hover)] transition-colors cursor-pointer shadow-md"
            >
              Done & Return to Storefront
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- RENDER CHECKOUT FORM VIEW ---
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-[var(--color-border)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[var(--color-primary)]" />
            <h2 className="text-lg font-bold text-[var(--color-text)]">
              Secure Checkout
            </h2>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-background)] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmitOrder} className="p-6 space-y-6">
          {/* Order Summary Ribbon */}
          <div className="p-4 rounded-2xl bg-[var(--color-background)] border border-[var(--color-border)]">
            <div className="flex items-center justify-between font-semibold text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-2">
              <span>Items in Order ({cart.length})</span>
              <span>Subtotal: {formatPrice(cartSubtotal)}</span>
            </div>
            <div className="max-h-28 overflow-y-auto space-y-1.5 pr-2">
              {cart.map((item) => (
                <div key={item.product.id} className="flex justify-between items-center text-xs">
                  <span className="text-[var(--color-text)] truncate max-w-xs">
                    {item.product.name} <span className="text-[var(--color-text-muted)]">× {item.quantity}</span>
                  </span>
                  <span className="font-semibold text-[var(--color-text)] tabular-nums">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-[var(--color-border)] flex items-center justify-between text-sm">
              <span className="font-bold text-[var(--color-text)]">Total Payable</span>
              <span className="font-extrabold text-base text-[var(--color-primary)] tabular-nums">
                {formatPrice(cartTotal)}
              </span>
            </div>
          </div>

          {/* Customer Details Form */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-[var(--color-primary)]" />
              <span>Customer & Delivery Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={customer.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  placeholder="e.g. Amara Nwosu"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={customer.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+234 800 000 0000"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={customer.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="amara@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">
                  City / State *
                </label>
                <input
                  type="text"
                  required
                  value={customer.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="e.g. Lagos"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">
                  Delivery Street Address *
                </label>
                <input
                  type="text"
                  required
                  value={customer.deliveryAddress}
                  onChange={(e) => handleInputChange('deliveryAddress', e.target.value)}
                  placeholder="House number, Street name, Estate / Landmark"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">
                  Delivery Instructions (Optional)
                </label>
                <input
                  type="text"
                  value={customer.notes || ''}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="e.g. Leave with security guard, call before arriving"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-[var(--color-primary)]" />
              <span>Select Payment Method</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'cash_on_delivery', label: 'Cash on Delivery', icon: Banknote, desc: 'Pay when order arrives' },
                { id: 'card', label: 'Debit / Credit Card', icon: CreditCard, desc: 'Online card payment' },
                { id: 'bank_transfer', label: 'Bank Transfer', icon: ShieldCheck, desc: 'Direct bank debit' },
              ].map((m) => {
                const Icon = m.icon;
                const isSelected = customer.paymentMethod === m.id;
                return (
                  <button
                    type="button"
                    key={m.id}
                    onClick={() => handleInputChange('paymentMethod', m.id)}
                    className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)]/50 ring-2 ring-[var(--color-primary)]/20'
                        : 'border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-background)]'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mb-2 ${isSelected ? 'text-[var(--color-primary)]' : 'text-slate-500'}`} />
                    <div>
                      <span className={`block text-xs font-bold ${isSelected ? 'text-[var(--color-primary)]' : 'text-[var(--color-text)]'}`}>
                        {m.label}
                      </span>
                      <span className="text-[10px] text-[var(--color-text-muted)]">
                        {m.desc}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Submit Button with Duplicate Prevention */}
          <div className="pt-2 border-t border-[var(--color-border)] flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => setIsCheckoutOpen(false)}
              className="px-4 py-3 rounded-xl border border-[var(--color-border)] text-xs font-semibold text-[var(--color-text)] hover:bg-[var(--color-background)] transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting || cart.length === 0}
              className="flex-1 py-3 px-6 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Submitting Order to API...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Confirm & Place Order · {formatPrice(cartTotal)}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
