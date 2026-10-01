import React, { useState } from "react";
import {
  ShoppingCart,
  Search,
  Settings,
  SlidersHorizontal,
  Leaf,
  X,
  LogOut,
} from "lucide-react";
import { useStore } from "../context/StoreContext";

interface HeaderProps {
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  const {
    config,
    cartCount,
    setIsCartOpen,
    setIsSettingsOpen,
    searchQuery,
    setSearchQuery,
    setSelectedCategory,
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[var(--color-surface)] border-b border-[var(--color-border)] shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-4">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => {
                setSelectedCategory("All");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="flex items-center gap-2.5 group cursor-pointer text-left"
            >
              {config.logoUrl ? (
                <img
                  src={config.logoUrl}
                  alt={config.brandName}
                  className="h-9 w-auto object-contain"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-[var(--color-primary-light)] flex items-center justify-center text-[var(--color-primary)] transition-transform group-hover:scale-105">
                  <Leaf className="w-6 h-6 fill-current" />
                </div>
              )}
              <div>
                <span className="text-xl font-bold tracking-tight text-[var(--color-text)] block leading-none">
                  {config.brandName}
                </span>
                {config.brandTagline && (
                  <span className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] font-medium block mt-1">
                    {config.brandTagline}
                  </span>
                )}
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-[var(--color-text-muted)]">
              <button
                onClick={() => {
                  setSelectedCategory("All");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="hover:text-[var(--color-primary)] transition-colors cursor-pointer"
              >
                Home
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById("catalogue-section");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="hover:text-[var(--color-primary)] transition-colors cursor-pointer"
              >
                Shop
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById("categories-section");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="hover:text-[var(--color-primary)] transition-colors cursor-pointer"
              >
                Categories
              </button>
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="hover:text-[var(--color-primary)] transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span>Store Settings</span>
              </button>
            </nav>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--color-text-muted)]">
                <Search className="h-4 w-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products by name or category..."
                className="w-full pl-10 pr-9 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-full text-sm text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--color-text-muted)] hover:text-[var(--color-text)] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Admin / Settings Button */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-background)] transition-colors cursor-pointer"
              title="Configure API, Branding and Themes"
            >
              <Settings className="w-4 h-4 text-[var(--color-primary)]" />
              <span className="hidden sm:inline">Settings & APIs</span>
            </button>

            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-background)] transition-colors cursor-pointer"
              title="Log out"
              aria-label="Log out"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Log out</span>
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center justify-center p-2.5 rounded-full text-[var(--color-text)] hover:bg-[var(--color-primary-light)] hover:text-[var(--color-primary)] transition-colors cursor-pointer"
              aria-label={`Cart with ${cartCount} items`}
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-5 h-5 px-1 rounded-full bg-[var(--color-primary)] text-white text-[11px] font-bold shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text)] cursor-pointer"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-3 pt-1">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--color-text-muted)]">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-9 pr-8 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-full text-sm text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--color-text-muted)]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
