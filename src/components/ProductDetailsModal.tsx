import React, { useState } from 'react';
import { X, Plus, Minus, ShoppingCart, Check, ShieldCheck, Truck, RefreshCw, Package } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const ProductDetailsModal: React.FC = () => {
  const { selectedProduct, setSelectedProduct, addToCart, formatPrice, setIsCartOpen } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  if (!selectedProduct) return null;

  const isOutOfStock = selectedProduct.quantity <= 0;

  const handleIncrement = () => {
    if (quantity < selectedProduct.quantity) {
      setQuantity((q) => q + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((q) => q - 1);
    }
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    const added = addToCart(selectedProduct, quantity);
    if (added) {
      setJustAdded(true);
      setTimeout(() => {
        setJustAdded(false);
        setSelectedProduct(null);
        setIsCartOpen(true);
      }, 700);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={() => setSelectedProduct(null)}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-[var(--color-background)]/80 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Large Image Showcase */}
          <div className="relative bg-slate-50 flex items-center justify-center p-6 md:p-8 border-b md:border-b-0 md:border-r border-[var(--color-border)]">
            {selectedProduct.image && !imgError ? (
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                onError={() => setImgError(true)}
                referrerPolicy="no-referrer"
                className="max-h-72 w-auto object-contain mx-auto transition-transform hover:scale-105"
              />
            ) : (
              <div className="w-48 h-48 rounded-2xl bg-[var(--color-primary-light)]/50 flex flex-col items-center justify-center text-[var(--color-primary)] p-4 text-center">
                <Package className="w-16 h-16 opacity-75 mb-2" />
                <span className="text-xs font-semibold text-[var(--color-text)]">
                  {selectedProduct.name}
                </span>
                <span className="text-[10px] text-[var(--color-text-muted)] mt-1">Image not provided</span>
              </div>
            )}
          </div>

          {/* Details & Actions */}
          <div className="p-6 md:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)]">
                  {selectedProduct.category || 'General'}
                </span>
                <h2 className="text-2xl font-bold text-[var(--color-text)] mt-2">
                  {selectedProduct.name}
                </h2>
                {selectedProduct.unit && (
                  <p className="text-xs text-[var(--color-text-muted)] mt-1">
                    Pack / Size: {selectedProduct.unit}
                  </p>
                )}
              </div>

              {/* Price & Stock */}
              <div className="flex items-baseline justify-between border-y border-[var(--color-border)] py-3">
                <div>
                  <span className="text-xs text-[var(--color-text-muted)] block">Unit Price</span>
                  <span className="text-2xl font-extrabold text-[var(--color-text)] tabular-nums">
                    {formatPrice(selectedProduct.price)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-[var(--color-text-muted)] block">Availability</span>
                  {isOutOfStock ? (
                    <span className="text-rose-600 font-semibold text-xs">Out of Stock</span>
                  ) : (
                    <span className="font-semibold text-xs flex items-center gap-1.5 text-[var(--color-primary)]">
                      <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-pulse" />
                      {selectedProduct.quantity} units left
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-1">
                  Product Description
                </h4>
                <p className="text-sm text-[var(--color-text)] leading-relaxed">
                  {selectedProduct.description ||
                    'High quality, carefully packaged commodity adhering to our rigorous fresh quality guidelines.'}
                </p>
              </div>

              {/* Features Guarantee */}
              <div className="grid grid-cols-2 gap-2 pt-1 text-xs text-[var(--color-text-muted)]">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                  <span>Fast Delivery</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                  <span>100% Authentic</span>
                </div>
              </div>
            </div>

            {/* Stepper & Add to Cart */}
            <div className="pt-2 border-t border-[var(--color-border)] space-y-3">
              {!isOutOfStock ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[var(--color-text)]">Select Quantity:</span>
                    <div className="flex items-center border border-[var(--color-border)] rounded-lg bg-[var(--color-background)] px-1 py-1">
                      <button
                        onClick={handleDecrement}
                        disabled={quantity <= 1}
                        className="w-8 h-8 flex items-center justify-center rounded text-[var(--color-text-muted)] hover:text-[var(--color-text)] disabled:opacity-30 cursor-pointer"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-10 text-center font-bold text-sm tabular-nums text-[var(--color-text)]">
                        {quantity}
                      </span>
                      <button
                        onClick={handleIncrement}
                        disabled={quantity >= selectedProduct.quantity}
                        className="w-8 h-8 flex items-center justify-center rounded text-[var(--color-text-muted)] hover:text-[var(--color-text)] disabled:opacity-30 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className={`w-full py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
                      justAdded
                        ? 'bg-[var(--color-accent)] text-white'
                        : 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white'
                    }`}
                  >
                    {justAdded ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Added to Cart!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4" />
                        <span>Add {quantity} to Cart · {formatPrice(selectedProduct.price * quantity)}</span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-slate-100 text-center text-xs font-medium text-slate-500">
                  This item is currently sold out in the inventory API.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
