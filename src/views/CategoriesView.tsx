import React from 'react';
import { AppDatabase, Coupon, Store } from '../data/types';
import { OfferCard } from '../components/OfferCard';
import { ChevronRight, Tag } from 'lucide-react';

interface CategoriesViewProps {
  slug?: string;
  db: AppDatabase;
  navigate: (path: string) => void;
  onRevealOffer: (coupon: Coupon, store?: Store) => void;
}

export const CategoriesView: React.FC<CategoriesViewProps> = ({
  slug,
  db,
  navigate,
  onRevealOffer
}) => {
  const categories = db.categories.filter(c => c.status === 'published');
  const getStore = (storeSlug: string) => db.stores.find(s => s.slug === storeSlug);

  // If a specific category slug is requested
  if (slug) {
    const category = categories.find(c => c.slug === slug);
    if (!category) {
      return (
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-black text-slate-900">Category Not Found</h1>
          <button onClick={() => navigate('/categories/')} className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-xl">
            Browse Categories
          </button>
        </div>
      );
    }

    const categoryStores = db.stores.filter(s => s.category === category.slug && s.status === 'published');
    const categoryCoupons = db.coupons.filter(c => {
      const s = getStore(c.storeSlug);
      return s && s.category === category.slug && c.status === 'published';
    });

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        <nav className="flex items-center gap-2 text-xs font-semibold text-slate-400">
          <button onClick={() => navigate('/')} className="hover:text-slate-700 cursor-pointer">Home</button>
          <span>/</span>
          <button onClick={() => navigate('/categories/')} className="hover:text-slate-700 cursor-pointer">Categories</button>
          <span>/</span>
          <span className="text-slate-700 font-bold">{category.name}</span>
        </nav>

        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs flex items-center gap-6">
          <span className="text-5xl">{category.icon}</span>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              {category.name} Promo Codes & Coupons
            </h1>
            <p className="text-slate-500 text-sm mt-1 max-w-2xl">
              {category.description}
            </p>
          </div>
        </div>

        {/* Category Offers */}
        {categoryCoupons.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              Top {category.name} Deals ({categoryCoupons.length})
            </h2>
            <div className="space-y-4">
              {categoryCoupons.map(coupon => (
                <OfferCard
                  key={coupon.id}
                  coupon={coupon}
                  store={getStore(coupon.storeSlug)}
                  onReveal={onRevealOffer}
                  onSelectStore={(stSlug) => navigate(`/coupons/${stSlug}`)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Category Stores */}
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            {category.name} Stores ({categoryStores.length})
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {categoryStores.map(store => (
              <button
                key={store.slug}
                onClick={() => navigate(`/coupons/${store.slug}`)}
                className="bg-white rounded-2xl border border-slate-200 p-5 text-left hover:border-indigo-300 hover:shadow-md transition-all group cursor-pointer"
              >
                <div className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 truncate">
                  {store.name}
                </div>
                <div className="text-xs text-slate-400 mt-1 truncate">{store.domain}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // All Categories listing
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Shop by Category
        </h1>
        <p className="text-slate-500 text-sm sm:text-base mt-2">
          Select a category to view verified discount codes and popular stores.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {categories.map(cat => {
          const count = db.stores.filter(s => s.category === cat.slug && s.status === 'published').length;
          return (
            <button
              key={cat.slug}
              onClick={() => navigate(`/categories/${cat.slug}`)}
              className="bg-white rounded-3xl border border-slate-200 p-6 text-left hover:border-indigo-400 hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between h-48"
            >
              <div>
                <span className="text-4xl block mb-3">{cat.icon}</span>
                <h3 className="font-bold text-slate-900 text-lg group-hover:text-indigo-600 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {cat.description}
                </p>
              </div>
              <div className="text-xs font-bold text-indigo-600 flex items-center justify-between pt-2 border-t border-slate-100">
                <span>{count} {count === 1 ? 'store' : 'stores'}</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
