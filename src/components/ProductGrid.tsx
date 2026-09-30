import React, { useMemo } from 'react';
import { RefreshCw, AlertCircle, ArrowUpDown, FilterX, Globe, Database } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { useStore } from '../context/StoreContext';

export const ProductGrid: React.FC = () => {
  const {
    products,
    loadingProducts,
    productsError,
    productsSource,
    reloadProducts,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    sortOption,
    setSortOption,
    config,
  } = useStore();

  // Filter and sort
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by category
    if (selectedCategory && selectedCategory !== 'All') {
      result = result.filter(
        (p) => p.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortOption === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortOption === 'name-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [products, selectedCategory, searchQuery, sortOption]);

  return (
    <section id="catalogue-section" className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[var(--color-border)]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl font-bold tracking-tight text-[var(--color-text)]">
              Featured Products
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-border)] font-medium text-[var(--color-text-muted)]">
              {filteredProducts.length} items
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
            {config.productApi.mode === 'external' ? (
              <span className="flex items-center gap-1 text-emerald-600 font-medium">
                <Globe className="w-3.5 h-3.5" /> External Product API Connected
              </span>
            ) : (
              <span className="flex items-center gap-1 text-slate-500 font-medium">
                <Database className="w-3.5 h-3.5" /> Demo Catalog (External Adapter Ready)
              </span>
            )}
            <span>·</span>
            <span>All prices in {config.currencyCode || 'NGN'}</span>
          </div>
        </div>

        {/* Sorting & Filter Actions */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Sorting Dropdown */}
          <div className="flex items-center gap-1.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-2.5 py-1.5 text-xs text-[var(--color-text)]">
            <ArrowUpDown className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
            <span className="text-[var(--color-text-muted)] hidden sm:inline">Sort:</span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as any)}
              className="bg-transparent font-medium focus:outline-none cursor-pointer text-[var(--color-text)]"
            >
              <option value="default">Featured / Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
            </select>
          </div>

          {/* Refresh Button */}
          <button
            onClick={() => reloadProducts()}
            disabled={loadingProducts}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-background)] text-xs font-medium text-[var(--color-text)] transition-colors cursor-pointer disabled:opacity-50"
            title="Refresh from API"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[var(--color-primary)] ${loadingProducts ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Active Filter Chips */}
      {(selectedCategory !== 'All' || searchQuery) && (
        <div className="flex items-center gap-2 pt-4 flex-wrap text-xs">
          <span className="text-[var(--color-text-muted)]">Active filters:</span>
          {selectedCategory !== 'All' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)] font-medium">
              Category: {selectedCategory}
              <button
                onClick={() => setSelectedCategory('All')}
                className="hover:opacity-75 font-bold ml-1 cursor-pointer"
              >
                ×
              </button>
            </span>
          )}
          {searchQuery && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-200 text-slate-800 font-medium">
              Search: "{searchQuery}"
              <button
                onClick={() => setSearchQuery('')}
                className="hover:opacity-75 font-bold ml-1 cursor-pointer"
              >
                ×
              </button>
            </span>
          )}
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="text-[var(--color-primary)] hover:underline ml-2 cursor-pointer font-medium"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Main Grid Content */}
      <div className="mt-8">
        {/* Loading State */}
        {loadingProducts ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-[var(--color-border)] p-4 bg-[var(--color-surface)] animate-pulse space-y-4"
              >
                <div className="aspect-[4/3] bg-slate-200 rounded-xl" />
                <div className="h-4 bg-slate-200 rounded w-3/4" />
                <div className="h-4 bg-slate-200 rounded w-1/2" />
                <div className="h-8 bg-slate-200 rounded" />
              </div>
            ))}
          </div>
        ) : productsError ? (
          /* Error State */
          <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-8 text-center max-w-lg mx-auto space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-rose-900">Catalogue Sync Issue</h3>
              <p className="text-xs text-rose-700 mt-1">{productsError}</p>
            </div>
            <button
              onClick={() => reloadProducts()}
              className="px-4 py-2 rounded-lg bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 transition-colors cursor-pointer"
            >
              Retry Connection
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] max-w-lg mx-auto">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <FilterX className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-[var(--color-text)]">No matching products found</h3>
            <p className="text-xs text-[var(--color-text-muted)] mt-1 max-w-sm mx-auto">
              We couldn't find any items matching your search or active filters. Try adjusting your search query or category.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white text-xs font-medium cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          /* Product Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
