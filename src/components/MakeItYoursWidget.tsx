import React, { useState } from 'react';
import { Settings, X, Palette, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const MakeItYoursWidget: React.FC = () => {
  const { setIsSettingsOpen } = useStore();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <aside
      aria-label="Store customization banner"
      className="fixed bottom-5 right-5 z-30 max-w-xs w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-xl p-4 hidden sm:block animate-in fade-in slide-in-from-bottom-4 duration-300"
    >
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-2.5 right-2.5 p-1 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors cursor-pointer"
        aria-label="Dismiss banner"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-[var(--color-primary-light)] text-[var(--color-primary)] flex items-center justify-center flex-shrink-0 mt-0.5">
          <Settings className="w-4 h-4" />
        </div>
        <div className="flex-1 pr-3">
          <h4 className="text-xs font-bold text-[var(--color-text)] flex items-center gap-1.5">
            <span>Make It Yours</span>
            <Sparkles className="w-3 h-3 text-[var(--color-primary)]" />
          </h4>
          <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5 leading-snug">
            Customise your store's branding, color theme, and external APIs.
          </p>
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="mt-2.5 px-3 py-1.5 rounded-lg bg-[var(--color-primary)] text-white text-[11px] font-bold hover:bg-[var(--color-primary-hover)] transition-colors cursor-pointer shadow-xs"
          >
            Go to Settings
          </button>
        </div>
      </div>
    </aside>
  );
};
