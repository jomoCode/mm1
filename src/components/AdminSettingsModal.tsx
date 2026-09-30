import React, { useState, useEffect } from "react";
import {
  X,
  Palette,
  Sliders,
  Database,
  Send,
  Save,
  RotateCcw,
  Check,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Code2,
  ListOrdered,
  Eye,
} from "lucide-react";
import { useStore } from "../context/StoreContext";
import { THEME_PRESETS } from "../data/themes";
import { StoreConfig, StoreTheme, OrderRecord } from "../types/store";
import { testApiConnection, fetchRecentOrders } from "../services/apiClient";
import { deriveThemeDarkSurfaces } from "../utils/colorUtils";

export const AdminSettingsModal: React.FC = () => {
  const {
    isSettingsOpen,
    setIsSettingsOpen,
    config,
    updateConfig,
    resetConfig,
  } = useStore();

  const [activeTab, setActiveTab] = useState<"branding" | "theme" | "orderLog">(
    "branding",
  );
  const [formConfig, setFormConfig] = useState<StoreConfig>(config);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Testing API states
  const [testingProductApi, setTestingProductApi] = useState(false);
  const [productApiTestResult, setProductApiTestResult] = useState<any | null>(
    null,
  );

  const [testingOrderApi, setTestingOrderApi] = useState(false);
  const [orderApiTestResult, setOrderApiTestResult] = useState<any | null>(
    null,
  );

  // Orders log
  const [recentOrders, setRecentOrders] = useState<OrderRecord[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [selectedLogOrder, setSelectedLogOrder] = useState<OrderRecord | null>(
    null,
  );

  useEffect(() => {
    if (isSettingsOpen) {
      setFormConfig(config);
      setProductApiTestResult(null);
      setOrderApiTestResult(null);
      if (activeTab === "orderLog") {
        loadRecentOrders();
      }
    }
  }, [isSettingsOpen, config]);

  useEffect(() => {
    if (activeTab === "orderLog" && isSettingsOpen) {
      loadRecentOrders();
    }
  }, [activeTab]);

  const loadRecentOrders = async () => {
    setLoadingOrders(true);
    try {
      const orders = await fetchRecentOrders();
      setRecentOrders(orders);
      if (orders.length > 0 && !selectedLogOrder) {
        setSelectedLogOrder(orders[0]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingOrders(false);
    }
  };

  if (!isSettingsOpen) return null;

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateConfig(formConfig);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (
      window.confirm(
        "Reset all storefront settings, theme, and API configs to default values?",
      )
    ) {
      await resetConfig();
      setIsSettingsOpen(false);
    }
  };

  const handleSelectThemePreset = (preset: StoreTheme) => {
    setFormConfig((prev) => ({
      ...prev,
      theme: { ...preset },
    }));
  };

  const handleCustomColorChange = (key: keyof StoreTheme, value: string) => {
    setFormConfig((prev) => {
      const updatedTheme = {
        ...prev.theme,
        [key]: value,
      };
      if (key === "primary") {
        const derived = deriveThemeDarkSurfaces(value);
        updatedTheme.heroBgFrom = derived.heroBgFrom;
        updatedTheme.heroBgVia = derived.heroBgVia;
        updatedTheme.heroBgTo = derived.heroBgTo;
        updatedTheme.footerBg = derived.footerBg;
        updatedTheme.footerStripBg = derived.footerStripBg;
      }
      return {
        ...prev,
        theme: updatedTheme,
      };
    });
  };

  const handleTestProductApi = async () => {
    setTestingProductApi(true);
    setProductApiTestResult(null);
    try {
      const res = await testApiConnection("product", formConfig.productApi);
      setProductApiTestResult(res);
    } catch (err: any) {
      setProductApiTestResult({ success: false, message: err.message });
    } finally {
      setTestingProductApi(false);
    }
  };

  const handleTestOrderApi = async () => {
    setTestingOrderApi(true);
    setOrderApiTestResult(null);
    try {
      const res = await testApiConnection("order", formConfig.orderApi);
      setOrderApiTestResult(res);
    } catch (err: any) {
      setOrderApiTestResult({ success: false, message: err.message });
    } finally {
      setTestingOrderApi(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-4xl bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Top Bar */}
        <div className="p-5 border-b border-[var(--color-border)] flex items-center justify-between bg-[var(--color-background)]/50">
          <div>
            <h2 className="text-lg font-bold text-[var(--color-text)] flex items-center gap-2">
              <Sliders className="w-5 h-5 text-[var(--color-primary)]" />
              <span>Store Configuration & API Hub</span>
            </h2>
            <p className="text-xs text-[var(--color-text-muted)]">
              Manage dynamic branding, CSS theme variables, and external Product
              & Order API adapters
            </p>
          </div>

          <button
            onClick={() => setIsSettingsOpen(false)}
            className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[var(--color-border)] px-5 bg-[var(--color-surface)] overflow-x-auto text-xs font-semibold gap-1">
          <button
            onClick={() => setActiveTab("branding")}
            className={`py-3 px-3 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === "branding"
                ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                : "border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            }`}
          >
            Storefront & Branding
          </button>
          <button
            onClick={() => setActiveTab("theme")}
            className={`py-3 px-3 border-b-2 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === "theme"
                ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                : "border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Theme & Colors</span>
          </button>
          <button
            onClick={() => setActiveTab("orderLog")}
            className={`py-3 px-3 border-b-2 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === "orderLog"
                ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                : "border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            }`}
          >
            <ListOrdered className="w-3.5 h-3.5" />
            <span>Orders Dispatched Log</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: BRANDING */}
          {activeTab === "branding" && (
            <div className="space-y-5">
              <div className="bg-[var(--color-background)] p-4 rounded-2xl border border-[var(--color-border)]">
                <h3 className="text-sm font-bold text-[var(--color-text)] mb-1">
                  Brand Identity
                </h3>
                <p className="text-xs text-[var(--color-text-muted)] mb-4">
                  Changes take effect globally across header, footer, page
                  title, and receipts.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">
                      Store Name
                    </label>
                    <input
                      type="text"
                      value={formConfig.brandName}
                      onChange={(e) =>
                        setFormConfig({
                          ...formConfig,
                          brandName: e.target.value,
                        })
                      }
                      placeholder="e.g. JomoMart"
                      className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">
                      Brand Tagline
                    </label>
                    <input
                      type="text"
                      value={formConfig.brandTagline}
                      onChange={(e) =>
                        setFormConfig({
                          ...formConfig,
                          brandTagline: e.target.value,
                        })
                      }
                      placeholder="e.g. Fresh • Quality • Affordable"
                      className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">
                      Hero Eyebrow Text
                    </label>
                    <input
                      type="text"
                      value={formConfig.heroEyebrow || ""}
                      onChange={(e) =>
                        setFormConfig({
                          ...formConfig,
                          heroEyebrow: e.target.value,
                        })
                      }
                      placeholder="e.g. Fresh • Quality • Affordable"
                      className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">
                      Hero Title
                    </label>
                    <input
                      type="text"
                      value={formConfig.heroTitle || ""}
                      onChange={(e) =>
                        setFormConfig({
                          ...formConfig,
                          heroTitle: e.target.value,
                        })
                      }
                      placeholder="e.g. Everything You Need,"
                      className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">
                      Hero Highlighted Line
                    </label>
                    <input
                      type="text"
                      value={formConfig.heroTitleAccent || ""}
                      onChange={(e) =>
                        setFormConfig({
                          ...formConfig,
                          heroTitleAccent: e.target.value,
                        })
                      }
                      placeholder="e.g. All in One Place"
                      className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">
                      Hero Description
                    </label>
                    <textarea
                      value={formConfig.heroDescription || ""}
                      onChange={(e) =>
                        setFormConfig({
                          ...formConfig,
                          heroDescription: e.target.value,
                        })
                      }
                      placeholder="Describe your offer"
                      rows={3}
                      className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">
                      Hero CTA Label
                    </label>
                    <input
                      type="text"
                      value={formConfig.heroPrimaryCta || ""}
                      onChange={(e) =>
                        setFormConfig({
                          ...formConfig,
                          heroPrimaryCta: e.target.value,
                        })
                      }
                      placeholder="e.g. Shop Now"
                      className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">
                      Hero Delivery text
                    </label>
                    <input
                      type="text"
                      value={formConfig.heroDeliveryText || ""}
                      onChange={(e) =>
                        setFormConfig({
                          ...formConfig,
                          heroDeliveryText: e.target.value,
                        })
                      }
                      placeholder="e.g. Free delivery over ₦50,000"
                      className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">
                      Hero Trust text
                    </label>
                    <input
                      type="text"
                      value={formConfig.heroTrustText || ""}
                      onChange={(e) =>
                        setFormConfig({
                          ...formConfig,
                          heroTrustText: e.target.value,
                        })
                      }
                      placeholder="e.g. 100% Guaranteed Fresh"
                      className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">
                      Hero Image Badge
                    </label>
                    <input
                      type="text"
                      value={formConfig.heroImageBadge || ""}
                      onChange={(e) =>
                        setFormConfig({
                          ...formConfig,
                          heroImageBadge: e.target.value,
                        })
                      }
                      placeholder="e.g. Hand-picked Fresh Everyday"
                      className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">
                      Custom Logo Image URL (Optional)
                    </label>
                    <input
                      type="url"
                      value={formConfig.logoUrl || ""}
                      onChange={(e) =>
                        setFormConfig({
                          ...formConfig,
                          logoUrl: e.target.value,
                        })
                      }
                      placeholder="https://example.com/logo.png"
                      className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
                    />
                    <p className="text-[11px] text-[var(--color-text-muted)] mt-1">
                      Leave empty to use the clean modern stylized leaf icon
                      logo.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-[var(--color-background)] p-4 rounded-2xl border border-[var(--color-border)]">
                <h3 className="text-sm font-bold text-[var(--color-text)] mb-1">
                  Currency & Delivery Economics
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-3">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">
                      Currency Symbol
                    </label>
                    <input
                      type="text"
                      value={formConfig.currencySymbol}
                      onChange={(e) =>
                        setFormConfig({
                          ...formConfig,
                          currencySymbol: e.target.value,
                        })
                      }
                      placeholder="₦, $, €, £"
                      className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">
                      Currency Code
                    </label>
                    <input
                      type="text"
                      value={formConfig.currencyCode}
                      onChange={(e) =>
                        setFormConfig({
                          ...formConfig,
                          currencyCode: e.target.value,
                        })
                      }
                      placeholder="NGN, USD, EUR, GBP"
                      className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">
                      Free Delivery Threshold
                    </label>
                    <input
                      type="number"
                      value={formConfig.freeDeliveryThreshold}
                      onChange={(e) =>
                        setFormConfig({
                          ...formConfig,
                          freeDeliveryThreshold: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: THEME CUSTOMIZATION */}
          {activeTab === "theme" && (
            <div className="space-y-6">
              {/* Presets */}
              <div>
                <h3 className="text-sm font-bold text-[var(--color-text)] mb-2">
                  Predefined Theme Presets
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {THEME_PRESETS.map((preset) => {
                    const isActive = formConfig.theme.id === preset.id;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleSelectThemePreset(preset)}
                        className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                          isActive
                            ? "border-[var(--color-primary)] bg-[var(--color-surface)] ring-2 ring-[var(--color-primary)]/30 shadow-xs"
                            : "border-[var(--color-border)] bg-[var(--color-surface)] hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-[var(--color-text)]">
                            {preset.name}
                          </span>
                          {isActive && (
                            <Check className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                          )}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div
                            className="w-5 h-5 rounded-full border border-black/10"
                            style={{ backgroundColor: preset.primary }}
                          />
                          <div
                            className="w-5 h-5 rounded-full border border-black/10"
                            style={{ backgroundColor: preset.accent }}
                          />
                          <div
                            className="w-5 h-5 rounded-full border border-black/10"
                            style={{ backgroundColor: preset.secondary }}
                          />
                          <div
                            className="w-5 h-5 rounded-full border border-black/10"
                            style={{ backgroundColor: preset.background }}
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Color Controls */}
              <div className="p-4 rounded-2xl bg-[var(--color-background)] border border-[var(--color-border)]">
                <h3 className="text-sm font-bold text-[var(--color-text)] mb-1">
                  Custom Color Palette (CSS Variable Injection)
                </h3>
                <p className="text-xs text-[var(--color-text-muted)] mb-4">
                  Adjust individual CSS design tokens. Changes apply immediately
                  throughout all storefront components.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    {
                      key: "primary",
                      label: "Primary Brand Color",
                      varName: "--color-primary",
                    },
                    {
                      key: "primaryHover",
                      label: "Primary Hover",
                      varName: "--color-primary-hover",
                    },
                    {
                      key: "primaryLight",
                      label: "Primary Light Tint",
                      varName: "--color-primary-light",
                    },
                    {
                      key: "secondary",
                      label: "Secondary Tone",
                      varName: "--color-secondary",
                    },
                    {
                      key: "accent",
                      label: "Accent Highlight",
                      varName: "--color-accent",
                    },
                    {
                      key: "heroBgFrom",
                      label: "Hero Gradient Start",
                      varName: "--color-hero-from",
                    },
                    {
                      key: "heroBgTo",
                      label: "Hero Gradient End",
                      varName: "--color-hero-to",
                    },
                    {
                      key: "footerBg",
                      label: "Footer Background",
                      varName: "--color-footer-bg",
                    },
                    {
                      key: "footerStripBg",
                      label: "Footer Trust Strip",
                      varName: "--color-footer-strip",
                    },
                    {
                      key: "background",
                      label: "Canvas Background",
                      varName: "--color-background",
                    },
                    {
                      key: "surface",
                      label: "Card / Surface",
                      varName: "--color-surface",
                    },
                    {
                      key: "text",
                      label: "Text Heading",
                      varName: "--color-text",
                    },
                    {
                      key: "border",
                      label: "Borders & Lines",
                      varName: "--color-border",
                    },
                  ].map((item) => (
                    <div
                      key={item.key}
                      className="flex items-center gap-3 p-2 bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)]"
                    >
                      <input
                        type="color"
                        value={(formConfig.theme as any)[item.key] || "#000000"}
                        onChange={(e) =>
                          handleCustomColorChange(
                            item.key as any,
                            e.target.value,
                          )
                        }
                        className="w-8 h-8 rounded-lg border-0 cursor-pointer p-0 bg-transparent"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="block text-xs font-semibold text-[var(--color-text)] truncate">
                          {item.label}
                        </span>
                        <span className="block text-[10px] font-mono text-[var(--color-text-muted)] truncate">
                          {(formConfig.theme as any)[item.key]}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: ORDERS DISPATCHED LOG */}
          {activeTab === "orderLog" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[var(--color-text)]">
                    Audit Log of Submissions to Order API
                  </h3>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    Inspect the transformed payloads and responses dispatched
                    through our backend BFF
                  </p>
                </div>
                <button
                  type="button"
                  onClick={loadRecentOrders}
                  disabled={loadingOrders}
                  className="px-3 py-1.5 rounded-lg border border-[var(--color-border)] text-xs font-semibold hover:bg-[var(--color-background)] transition-colors cursor-pointer"
                >
                  Refresh
                </button>
              </div>

              {recentOrders.length === 0 ? (
                <div className="p-8 text-center rounded-2xl border border-dashed border-[var(--color-border)] text-xs text-[var(--color-text-muted)]">
                  No orders have been submitted yet. Place an order on the
                  storefront to inspect the outbound API payload here!
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  {/* Orders list */}
                  <div className="md:col-span-5 space-y-2 max-h-96 overflow-y-auto pr-1">
                    {recentOrders.map((ord) => {
                      const isSelected = selectedLogOrder?.id === ord.id;
                      return (
                        <div
                          key={ord.id}
                          onClick={() => setSelectedLogOrder(ord)}
                          className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                            isSelected
                              ? "border-[var(--color-primary)] bg-[var(--color-primary-light)]/40 shadow-xs"
                              : "border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-background)]"
                          }`}
                        >
                          <div className="flex items-center justify-between font-bold mb-1">
                            <span className="font-mono text-[var(--color-text)]">
                              {ord.id}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                              {ord.status}
                            </span>
                          </div>
                          <div className="text-[var(--color-text-muted)] text-[11px]">
                            {ord.submission.customer.fullName} ·{" "}
                            {ord.submission.currency}
                            {ord.submission.totalAmount.toLocaleString()}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-1">
                            {new Date(ord.createdAt).toLocaleTimeString()} ·{" "}
                            {ord.submission.items.length} items
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Selected Payload Inspector */}
                  <div className="md:col-span-7 bg-slate-950 text-slate-100 p-4 rounded-2xl font-mono text-[11px] overflow-x-auto max-h-96">
                    {selectedLogOrder ? (
                      <div className="space-y-3">
                        <div className="text-emerald-400 text-xs font-bold border-b border-slate-800 pb-2">
                          Outbound API Payload: {selectedLogOrder.id}
                        </div>
                        <pre className="text-[10px] text-slate-300">
                          {JSON.stringify(
                            selectedLogOrder.externalPayloadSent,
                            null,
                            2,
                          )}
                        </pre>
                      </div>
                    ) : (
                      <div className="text-slate-500 py-10 text-center">
                        Select an order on the left to inspect its JSON payload
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-4 border-t border-[var(--color-border)] flex items-center justify-between bg-[var(--color-background)]/50">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsSettingsOpen(false)}
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-[var(--color-border)] hover:bg-[var(--color-surface)] text-[var(--color-text)] transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-xs font-bold shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              {saving ? (
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : saveSuccess ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              <span>
                {saveSuccess ? "Changes Applied!" : "Save & Apply Config"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
