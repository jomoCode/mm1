import React from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartCount,
    cartSubtotal,
    deliveryFee,
    cartTotal,
    formatPrice,
    setIsCheckoutOpen,
    config,
  } = useStore();

  if (!isCartOpen) return null;

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs">
      <div className="absolute inset-0" onClick={() => setIsCartOpen(false)} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[var(--color-surface)] border-l border-[var(--color-border)] shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-250">
          {/* Header */}
          <div className="p-5 border-b border-[var(--color-border)] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[var(--color-primary)]" />
              <h2 className="text-lg font-bold text-[var(--color-text)]">
                Your Cart ({cartCount})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-background)] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-full bg-[var(--color-background)] flex items-center justify-center text-[var(--color-text-muted)]">
                  <ShoppingBag className="w-8 h-8 opacity-40" />
                </div>
                <h3 className="font-bold text-base text-[var(--color-text)]">Your cart is empty</h3>
                <p className="text-xs text-[var(--color-text-muted)] max-w-xs">
                  Looks like you haven't added anything to your cart yet. Explore our grocery catalog!
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-3 px-5 py-2.5 rounded-xl bg-[var(--color-primary)] text-white text-xs font-semibold hover:bg-[var(--color-primary-hover)] transition-colors cursor-pointer"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => {
                  const maxStock = item.product.quantity;
                  const itemTotal = item.product.price * item.quantity;

                  return (
                    <div
                      key={item.product.id}
                      className="flex gap-3.5 p-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-slate-300 transition-colors"
                    >
                      {/* Product Thumbnail */}
                      <div className="w-16 h-16 rounded-lg bg-slate-100 flex-shrink-0 overflow-hidden flex items-center justify-center p-1">
                        {item.product.image ? (
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-full h-full object-contain"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <ShoppingBag className="w-6 h-6 text-slate-400" />
                        )}
                      </div>

                      {/* Info & Quantity */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="font-semibold text-sm text-[var(--color-text)] line-clamp-1">
                              {item.product.name}
                            </h4>
                            <span className="text-xs font-medium text-[var(--color-text-muted)] tabular-nums">
                              {formatPrice(item.product.price)}
                            </span>
                          </div>

                          {/* Delete Item */}
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Quantity Stepper & Line Total */}
                        <div className="flex items-center justify-between mt-2 pt-1 border-t border-[var(--color-border)]/60">
                          <div className="flex items-center border border-[var(--color-border)] rounded-md bg-[var(--color-background)] px-0.5 py-0.5">
                            <button
                              onClick={() => updateCartQuantity(item.product.id, -1)}
                              className="w-6 h-6 flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-6 text-center text-xs font-bold tabular-nums text-[var(--color-text)]">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateCartQuantity(item.product.id, 1)}
                              disabled={item.quantity >= maxStock}
                              className="w-6 h-6 flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-text)] disabled:opacity-30 cursor-pointer"
                              title={item.quantity >= maxStock ? 'Max stock reached' : ''}
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <span className="text-sm font-bold text-[var(--color-text)] tabular-nums">
                            {formatPrice(itemTotal)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {cart.length > 0 && (
                  <div className="flex justify-end pt-1">
                    <button
                      onClick={clearCart}
                      className="text-[11px] text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                    >
                      Clear all items
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer Totals & Checkout Actions */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-[var(--color-border)] bg-[var(--color-background)]/50 space-y-4">
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-[var(--color-text-muted)]">
                  <span>Subtotal</span>
                  <span className="font-semibold tabular-nums text-[var(--color-text)]">
                    {formatPrice(cartSubtotal)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[var(--color-text-muted)]">
                  <span>Delivery</span>
                  <span className="font-semibold text-[var(--color-primary)]">
                    {deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-base font-extrabold text-[var(--color-text)] pt-2 border-t border-[var(--color-border)]">
                  <span>Total</span>
                  <span className="tabular-nums text-lg text-[var(--color-primary)]">
                    {formatPrice(cartTotal)}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={handleProceedToCheckout}
                  className="w-full py-3.5 px-4 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-full py-2.5 px-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-background)] text-xs font-semibold text-[var(--color-text)] transition-colors cursor-pointer"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
