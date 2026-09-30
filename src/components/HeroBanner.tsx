import React from "react";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Truck,
  Sparkles,
} from "lucide-react";
const heroImg = "/src/assets/images/hero_grocery_bag_1790612945337.jpg";
import { useStore } from "../context/StoreContext";

export const HeroBanner: React.FC = () => {
  const { config } = useStore();

  const scrollToCatalog = () => {
    const el = document.getElementById("catalogue-section");
    el?.scrollIntoView({ behavior: "smooth" });
  };

  const eyebrow =
    config.heroEyebrow || config.brandTagline || "FRESH • QUALITY • AFFORDABLE";
  const title = config.heroTitle || "Everything You Need,";
  const highlight = config.heroTitleAccent || "All in One Place";
  const description =
    config.heroDescription ||
    "Quality groceries and household essentials at great prices with fast, reliable doorstep delivery. Shop with confidence from our external API-backed catalog.";
  const ctaText = config.heroPrimaryCta || "Shop Now";
  const deliveryText =
    config.heroDeliveryText ||
    `Free delivery over ${config.currencySymbol}50,000`;
  const trustText = config.heroTrustText || "100% Guaranteed Fresh";
  const imageBadge = config.heroImageBadge || "Hand-picked Fresh Everyday";

  return (
    <section
      style={{
        background:
          "linear-gradient(135deg, var(--color-hero-from) 0%, var(--color-hero-via) 50%, var(--color-hero-to) 100%)",
      }}
      className="relative overflow-hidden text-white transition-colors duration-300"
    >
      {/* Background glow effects */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[var(--color-accent)]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-[var(--color-primary)]/20 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[var(--color-accent)]">
              <Sparkles className="w-3.5 h-3.5 text-[var(--color-accent)]" />
              <span>{eyebrow}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-white text-balance">
              {title} <br />
              <span className="text-[var(--color-accent)]">{highlight}</span>
            </h1>

            <p className="text-base sm:text-lg text-white/85 max-w-xl font-normal leading-relaxed">
              {description}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={scrollToCatalog}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer border border-white/20"
              >
                <span>{ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-4 text-xs text-white/80 px-2 py-1">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-[var(--color-accent)]" />{" "}
                  {deliveryText}
                </span>
                <span className="hidden sm:inline opacity-40">|</span>
                <span className="hidden sm:flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[var(--color-accent)]" />{" "}
                  {trustText}
                </span>
              </div>
            </div>
          </div>

          {/* Right Product Showcase / Grocery Bag Image */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Image Frame */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10 aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] group">
                <img
                  src={heroImg}
                  alt="Fresh groceries in a kraft paper bag"
                  className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                {/* Subtitle tag overlay */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white/90">
                  <span className="font-medium bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                    {imageBadge}
                  </span>

                  {/* Subtle Carousel Dots / Affordances from Mockup */}
                  <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                    <span className="w-4 h-1.5 rounded-full bg-[var(--color-accent)]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                    <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
