import React from "react";
import {
  Truck,
  ShieldCheck,
  Headphones,
  Sparkles,
  Leaf,
  Settings,
} from "lucide-react";
import { useStore } from "../context/StoreContext";

export const Footer: React.FC = () => {
  const { config, setIsSettingsOpen } = useStore();

  return (
    <footer
      style={{ backgroundColor: "var(--color-footer-bg)" }}
      className="mt-16 text-white transition-colors duration-300"
    >
      {/* Trust Badges Strip */}
      <div
        style={{ backgroundColor: "var(--color-footer-strip)" }}
        className="border-b border-white/10 transition-colors duration-300"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 text-[var(--color-accent)]">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white tracking-wide">
                  Fast Delivery
                </h4>
                <p className="text-[11px] text-white/70">
                  Get your orders quickly
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 text-[var(--color-accent)]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white tracking-wide">
                  Secure Payments
                </h4>
                <p className="text-[11px] text-white/70">
                  Your information is safe
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 text-[var(--color-accent)]">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white tracking-wide">
                  24/7 Support
                </h4>
                <p className="text-[11px] text-white/70">We're here to help</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 text-[var(--color-accent)]">
                <Leaf className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white tracking-wide">
                  Quality Guaranteed
                </h4>
                <p className="text-[11px] text-white/70">
                  Only the best for you
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Architecture Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-[var(--color-accent)]">
              <Leaf className="w-5 h-5 fill-current" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white block">
                {config.brandName}
              </span>
              <span className="text-[11px] text-white/70">
                Production-grade API-driven e-commerce storefront
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-white/80">
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="hover:text-[var(--color-accent)] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Admin & API Settings</span>
            </button>
            <span>·</span>
            <span>Product API Adapter v1.0</span>
            <span>·</span>
            <span>Order BFF Service</span>
          </div>

          <p className="text-xs text-white/50">
            © {new Date().getFullYear()} splendidcomm. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
