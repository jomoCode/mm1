/**
 * JomoMart - Production-Ready API-Driven E-Commerce Storefront
 */
import React from "react";
import { StoreProvider } from "./context/StoreContext";
import { LoginPage } from "./components/LoginPage";
import { Header } from "./components/Header";
import { HeroBanner } from "./components/HeroBanner";
import { CategoryBar } from "./components/CategoryBar";
import { ProductGrid } from "./components/ProductGrid";
import { Footer } from "./components/Footer";
import { CartDrawer } from "./components/CartDrawer";
import { ProductDetailsModal } from "./components/ProductDetailsModal";
import { CheckoutModal } from "./components/CheckoutModal";
import { AdminSettingsModal } from "./components/AdminSettingsModal";
import { MakeItYoursWidget } from "./components/MakeItYoursWidget";
import { MobileBottomNav } from "./components/MobileBottomNav";

export default function App() {
  const [isSignedIn, setIsSignedIn] = React.useState(false);

  if (!isSignedIn) {
    return <LoginPage onSignIn={() => setIsSignedIn(true)} />;
  }

  return (
    <StoreProvider>
      <div className="min-h-screen flex flex-col bg-[var(--color-background)] text-[var(--color-text)] transition-colors selection:bg-[var(--color-primary-light)] selection:text-[var(--color-primary)] pb-16 md:pb-0">
        {/* Navigation Top Bar */}
        <Header onLogout={() => setIsSignedIn(false)} />

        {/* Main Content Area */}
        <main className="flex-1">
          {/* Hero Promotional Banner with Hand-picked Produce Photography */}
          <HeroBanner />

          {/* Category Filter Pills / Cards */}
          <CategoryBar />

          {/* Product Catalog Grid with API Abstraction & Stepper Add */}
          <ProductGrid />
        </main>

        {/* Trust Badges & Footer */}
        <Footer />

        {/* Slide-over Shopping Cart */}
        <CartDrawer />

        {/* Product Details Full View */}
        <ProductDetailsModal />

        {/* Checkout Modal & Order Submission */}
        <CheckoutModal />

        {/* Admin Settings & API Hub */}
        <AdminSettingsModal />

        {/* Floating Customizer Widget ("Make It Yours") */}
        <MakeItYoursWidget />

        {/* Mobile Sticky Navigation */}
        <MobileBottomNav />
      </div>
    </StoreProvider>
  );
}
