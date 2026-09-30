import React from 'react';
import { ShoppingCart, Wine, Cookie, Home, Sparkles, LayoutGrid } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const CategoryBar: React.FC = () => {
  const { products, selectedCategory, setSelectedCategory } = useStore();

  // Compute product counts dynamically from current products list
  const categoryCounts = React.useMemo(() => {
    const counts: Record<string, number> = { All: products.length };
    products.forEach((p) => {
      const cat = p.category || 'Others';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [products]);

  const categories = [
    {
      id: 'All',
      label: 'All Items',
      icon: LayoutGrid,
      count: categoryCounts['All'] || 0,
    },
    {
      id: 'Groceries',
      label: 'Groceries',
      icon: ShoppingCart,
      count: categoryCounts['Groceries'] || 0,
    },
    {
      id: 'Beverages',
      label: 'Beverages',
      icon: Wine,
      count: categoryCounts['Beverages'] || 0,
    },
    {
      id: 'Snacks',
      label: 'Snacks',
      icon: Cookie,
      count: categoryCounts['Snacks'] || 0,
    },
    {
      id: 'Household',
      label: 'Household',
      icon: Home,
      count: categoryCounts['Household'] || 0,
    },
    {
      id: 'Personal Care',
      label: 'Personal Care',
      icon: Sparkles,
      count: categoryCounts['Personal Care'] || 0,
    },
  ];

  return (
    <section id="categories-section" className="py-8 bg-[var(--color-surface)] border-b border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-[var(--color-text)]">Explore Categories</h2>
            <p className="text-xs text-[var(--color-text-muted)]">Browse items categorized by our product API</p>
          </div>
          {selectedCategory !== 'All' && (
            <button
              onClick={() => setSelectedCategory('All')}
              className="text-xs font-semibold text-[var(--color-primary)] hover:underline cursor-pointer"
            >
              Reset to All
            </button>
          )}
        </div>

        {/* Categories Grid / Carousel */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory.toLowerCase() === cat.id.toLowerCase();

            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  const el = document.getElementById('catalogue-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all cursor-pointer group ${
                  isSelected
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)] ring-2 ring-[var(--color-primary)]/20 shadow-xs'
                    : 'border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-primary)]/50 hover:bg-[var(--color-background)]'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center mb-2.5 transition-colors ${
                    isSelected
                      ? 'bg-[var(--color-primary)] text-white'
                      : 'bg-[var(--color-background)] text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)] group-hover:bg-[var(--color-primary-light)]'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span
                  className={`text-sm font-semibold truncate w-full ${
                    isSelected ? 'text-[var(--color-primary)]' : 'text-[var(--color-text)]'
                  }`}
                >
                  {cat.label}
                </span>
                <span className="text-[11px] text-[var(--color-text-muted)] mt-0.5">
                  {cat.count} {cat.count === 1 ? 'item' : 'items'}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
