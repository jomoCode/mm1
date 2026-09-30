import React from 'react';
import { Home, ShoppingBag, ShoppingCart, Sliders } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const MobileBottomNav: React.FC = () => {
  const { cartCount, setIsCartOpen, setIsSettingsOpen, setSelectedCategory } = useStore();

  return (
    <nav
      aria-label="Mobile navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--color-surface)] border-t border-[var(--color-border)] shadow-lg px-2 py-1.5 flex items-center justify-around"
    >
      <button
        onClick={() => {
          setSelectedCategory('All');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className="flex flex-col items-center p-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] cursor-pointer"
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px] font-medium mt-0.5">Home</span>
      </button>

      <button
        onClick={() => {
          const el = document.getElementById('catalogue-section');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        className="flex flex-col items-center p-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] cursor-pointer"
      >
        <ShoppingBag className="w-5 h-5" />
        <span className="text-[10px] font-medium mt-0.5">Shop</span>
      </button>

      <button
        onClick={() => setIsCartOpen(true)}
        className="relative flex flex-col items-center p-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] cursor-pointer"
      >
        <div className="relative">
          <ShoppingCart className="w-5 h-5" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-[var(--color-primary)] text-white text-[9px] font-bold flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </div>
        <span className="text-[10px] font-medium mt-0.5">Cart</span>
      </button>

      <button
        onClick={() => setIsSettingsOpen(true)}
        className="flex flex-col items-center p-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] cursor-pointer"
      >
        <Sliders className="w-5 h-5" />
        <span className="text-[10px] font-medium mt-0.5">Settings</span>
      </button>
    </nav>
  );
};
