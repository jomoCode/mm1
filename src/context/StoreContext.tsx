import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { CartItem, Product, StoreConfig, OrderSubmission, OrderRecord } from '../types/store';
import { DEFAULT_STORE_CONFIG } from '../data/defaultConfig';
import { fetchStoreConfig, updateStoreConfig, fetchProducts, submitOrder } from '../services/apiClient';
import { deriveThemeDarkSurfaces } from '../utils/colorUtils';

interface StoreContextType {
  config: StoreConfig;
  updateConfig: (newConfig: StoreConfig) => Promise<void>;
  resetConfig: () => Promise<void>;
  products: Product[];
  loadingProducts: boolean;
  productsError: string | null;
  productsSource: string;
  reloadProducts: () => Promise<void>;
  
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => boolean;
  updateCartQuantity: (productId: string, delta: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  deliveryFee: number;
  cartTotal: number;
  
  // UI Dialogs
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  recentOrderResult: {
    orderId: string;
    orderNumber: number;
    submission: OrderSubmission;
    externalPayloadSent?: any;
    message?: string;
  } | null;
  setRecentOrderResult: (res: any) => void;

  // Filter & Search
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  sortOption: 'default' | 'price-asc' | 'price-desc' | 'name-asc';
  setSortOption: (opt: 'default' | 'price-asc' | 'price-desc' | 'name-asc') => void;

  // Utilities
  formatPrice: (amount: number) => string;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<StoreConfig>(DEFAULT_STORE_CONFIG);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState<boolean>(true);
  const [productsError, setProductsError] = useState<string | null>(null);
  const [productsSource, setProductsSource] = useState<string>('mock_catalog');

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('jomomart_cart_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [recentOrderResult, setRecentOrderResult] = useState<any | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOption, setSortOption] = useState<'default' | 'price-asc' | 'price-desc' | 'name-asc'>('default');

  // Save cart to local storage
  useEffect(() => {
    try {
      localStorage.setItem('jomomart_cart_v1', JSON.stringify(cart));
    } catch (e) {
      console.warn('Could not persist cart to localStorage', e);
    }
  }, [cart]);

  // Apply theme variables dynamically to root document
  useEffect(() => {
    if (!config?.theme) return;
    const root = document.documentElement;
    const theme = config.theme;
    root.style.setProperty('--color-primary', theme.primary);
    root.style.setProperty('--color-primary-hover', theme.primaryHover);
    root.style.setProperty('--color-primary-light', theme.primaryLight);
    root.style.setProperty('--color-secondary', theme.secondary);
    root.style.setProperty('--color-accent', theme.accent);
    root.style.setProperty('--color-background', theme.background);
    root.style.setProperty('--color-surface', theme.surface);
    root.style.setProperty('--color-text', theme.text);
    root.style.setProperty('--color-text-muted', theme.textMuted);
    root.style.setProperty('--color-border', theme.border);

    // Compute or read coordinated dark surfaces for hero & footer
    const derived = deriveThemeDarkSurfaces(theme.primary);
    root.style.setProperty('--color-hero-from', theme.heroBgFrom || derived.heroBgFrom);
    root.style.setProperty('--color-hero-via', theme.heroBgVia || derived.heroBgVia);
    root.style.setProperty('--color-hero-to', theme.heroBgTo || derived.heroBgTo);
    root.style.setProperty('--color-footer-bg', theme.footerBg || derived.footerBg);
    root.style.setProperty('--color-footer-strip', theme.footerStripBg || derived.footerStripBg);
  }, [config.theme]);

  // Initial load of config & products
  useEffect(() => {
    async function init() {
      try {
        const loadedConfig = await fetchStoreConfig();
        if (loadedConfig) {
          setConfig(loadedConfig);
        }
      } catch (e) {
        console.warn('Using default store config', e);
      }
      loadProductsList();
    }
    init();
  }, []);

  const loadProductsList = async () => {
    setLoadingProducts(true);
    setProductsError(null);
    try {
      const data = await fetchProducts();
      setProducts(data.products);
      setProductsSource(data.source);
    } catch (err: any) {
      console.error('Failed to load products:', err);
      setProductsError(err.message || 'Unable to connect to product catalog');
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleUpdateConfig = async (newConfig: StoreConfig) => {
    setConfig(newConfig);
    try {
      await updateStoreConfig(newConfig);
      // Reload products if API parameters changed
      await loadProductsList();
    } catch (err) {
      console.error('Failed to sync config with server', err);
    }
  };

  const handleResetConfig = async () => {
    await handleUpdateConfig(DEFAULT_STORE_CONFIG);
  };

  // Cart operations
  const addToCart = (product: Product, quantity = 1): boolean => {
    if (product.quantity <= 0) return false;

    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        const newQty = Math.min(product.quantity, existing.quantity + quantity);
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: newQty } : item
        );
      }
      return [...prev, { product, quantity: Math.min(product.quantity, quantity) }];
    });
    return true;
  };

  const updateCartQuantity = (productId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.product.id === productId) {
            const nextQty = item.quantity + delta;
            if (nextQty <= 0) return null;
            const capped = Math.min(item.product.quantity, nextQty);
            return { ...item, quantity: capped };
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null);
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Computations
  const cartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [cart]);

  const deliveryFee = useMemo(() => {
    if (cartSubtotal === 0) return 0;
    if (cartSubtotal >= (config.freeDeliveryThreshold || 50000)) return 0;
    return config.deliveryFee || 0;
  }, [cartSubtotal, config.freeDeliveryThreshold, config.deliveryFee]);

  const cartTotal = useMemo(() => {
    return cartSubtotal + deliveryFee;
  }, [cartSubtotal, deliveryFee]);

  const formatPrice = (amount: number): string => {
    const symbol = config.currencySymbol || '₦';
    return `${symbol}${amount.toLocaleString('en-US')}`;
  };

  return (
    <StoreContext.Provider
      value={{
        config,
        updateConfig: handleUpdateConfig,
        resetConfig: handleResetConfig,
        products,
        loadingProducts,
        productsError,
        productsSource,
        reloadProducts: loadProductsList,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartSubtotal,
        deliveryFee,
        cartTotal,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isSettingsOpen,
        setIsSettingsOpen,
        selectedProduct,
        setSelectedProduct,
        recentOrderResult,
        setRecentOrderResult,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        sortOption,
        setSortOption,
        formatPrice,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
