import React, { useState } from 'react';
import { ShoppingCart, Plus, Minus, Package, Check, Sparkles } from 'lucide-react';
import { Product } from '../types/store';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, formatPrice, setSelectedProduct } = useStore();
  const [selectedQty, setSelectedQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const isOutOfStock = product.quantity <= 0;

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedQty < product.quantity) {
      setSelectedQty((q) => q + 1);
    }
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedQty > 1) {
      setSelectedQty((q) => q - 1);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;

    const added = addToCart(product, selectedQty);
    if (added) {
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1400);
      setSelectedQty(1);
    }
  };

  return (
    <div
      onClick={() => setSelectedProduct(product)}
      className="group relative flex flex-col bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden hover:shadow-md hover:border-[var(--color-primary)]/40 transition-all duration-200 cursor-pointer"
    >
      {/* Top Category Tag & Stock Status */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
        <span className="px-2.5 py-1 text-[11px] font-semibold rounded-full bg-[var(--color-surface)]/90 backdrop-blur-md text-[var(--color-primary)] shadow-xs border border-[var(--color-border)]">
          {product.category || 'General'}
        </span>
      </div>

      {/* Product Image Area */}
      <div className="relative w-full aspect-[4/3] bg-gradient-to-b from-slate-50 to-slate-100/70 overflow-hidden flex items-center justify-center p-4">
        {product.image && !imgError ? (
          <img
            src={product.image}
            alt={product.name}
            onError={() => setImgError(true)}
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain transform transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          /* Graceful Fallback Container */
          <div className="w-full h-full flex flex-col items-center justify-center text-[var(--color-text-muted)] bg-[var(--color-primary-light)]/40 rounded-xl p-4 text-center">
            <Package className="w-12 h-12 text-[var(--color-primary)]/60 mb-2" />
            <span className="text-xs font-semibold text-[var(--color-text)] line-clamp-1">
              {product.name}
            </span>
            <span className="text-[10px] text-[var(--color-text-muted)]">Verified Quality</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h3 className="font-semibold text-base text-[var(--color-text)] line-clamp-1 group-hover:text-[var(--color-primary)] transition-colors">
            {product.name}
          </h3>

          {product.unit && (
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5 line-clamp-1">
              {product.unit}
            </p>
          )}

          {/* Price */}
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-lg font-bold text-[var(--color-text)] tracking-tight tabular-nums">
              {formatPrice(product.price)}
            </span>
          </div>

          {/* Stock Availability Indicator */}
          <div className="mt-1.5 flex items-center gap-1.5 text-xs">
            {isOutOfStock ? (
              <span className="text-rose-600 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                Out of Stock
              </span>
            ) : (
              <span className="font-semibold flex items-center gap-1.5 text-[var(--color-primary)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] animate-pulse" />
                In Stock ({product.quantity} available)
              </span>
            )}
          </div>
        </div>

        {/* Action Row: Stepper + Add to Cart Button */}
        <div className="pt-2 space-y-2" onClick={(e) => e.stopPropagation()}>
          {!isOutOfStock ? (
            <div className="flex items-center gap-2">
              {/* Stepper */}
              <div className="flex items-center border border-[var(--color-border)] rounded-lg bg-[var(--color-background)] px-1 py-1">
                <button
                  onClick={handleDecrement}
                  disabled={selectedQty <= 1}
                  className="w-7 h-7 flex items-center justify-center rounded text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface)] disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center text-xs font-semibold tabular-nums text-[var(--color-text)]">
                  {selectedQty}
                </span>
                <button
                  onClick={handleIncrement}
                  disabled={selectedQty >= product.quantity}
                  className="w-7 h-7 flex items-center justify-center rounded text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface)] disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Add Button */}
              <button
                onClick={handleAddToCart}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer shadow-xs ${
                  justAdded
                    ? 'bg-[var(--color-accent)] text-white'
                    : 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white'
                }`}
              >
                {justAdded ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Added!</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <button
              disabled
              className="w-full py-2 px-3 rounded-lg text-xs font-semibold bg-slate-100 text-slate-400 cursor-not-allowed text-center"
            >
              Unavailable
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
