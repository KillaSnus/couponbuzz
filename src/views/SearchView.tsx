import React, { useState, useEffect } from 'react';
import { AppDatabase, Coupon, Store } from '../data/types';
import { OfferCard } from '../components/OfferCard';
import { Search, Tag, ExternalLink } from 'lucide-react';

interface SearchViewProps {
  initialQuery?: string;
  db: AppDatabase;
  navigate: (path: string) => void;
  onRevealOffer: (coupon: Coupon, store?: Store) => void;
}

export const SearchView: React.FC<SearchViewProps> = ({
  initialQuery = '',
  db,
  navigate,
  onRevealOffer
}) => {
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const qLower = query.toLowerCase().trim();

  const matchingStores = qLower ? db.stores.filter(s => 
    s.status === 'published' && (
      s.name.toLowerCase().includes(qLower) ||
      s.domain.toLowerCase().includes(qLower) ||
      s.category.toLowerCase().includes(qLower) ||
      s.description.toLowerCase().includes(qLower)
    )
  ) : [];

  const matchingCoupons = qLower ? db.coupons.filter(c => 
    c.status === 'published' && (
      c.title.toLowerCase().includes(qLower) ||
      c.code.toLowerCase().includes(qLower) ||
      c.storeSlug.toLowerCase().includes(qLower) ||
      c.description.toLowerCase().includes(qLower)
    )
  ) : [];

  const getStore = (slug: string) => db.stores.find(s => s.slug === slug);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Search Stores & Deals
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Search across {db.stores.length} stores and active promo codes.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative max-w-xl">
        <input
          type="text"
          placeholder="Search by store name, voucher code or keyword..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-white text-slate-900 pl-12 pr-4 py-3.5 text-base rounded-2xl border border-slate-300 focus:outline-hidden focus:border-indigo-600 shadow-xs"
        />
        <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
      </div>

      {query.trim() ? (
        <div className="space-y-10">
          {/* Matching Stores */}
          {matchingStores.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-4">
                Matching Stores ({matchingStores.length})
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {matchingStores.map(store => (
                  <button
                    key={store.slug}
                    onClick={() => navigate(`/coupons/${store.slug}`)}
                    className="bg-white rounded-2xl border border-slate-200 p-4 text-left hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="font-bold text-slate-900 text-sm">{store.name}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{store.domain}</div>
                    <span className="inline-block mt-2 text-xs font-semibold text-indigo-600">
                      View deals →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matching Coupons */}
          {matchingCoupons.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-4">
                Matching Coupons & Deals ({matchingCoupons.length})
              </h2>
              <div className="space-y-4">
                {matchingCoupons.map(coupon => (
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

          {matchingStores.length === 0 && matchingCoupons.length === 0 && (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto">
              <Tag className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-900">No results found for "{query}"</h3>
              <p className="text-xs text-slate-500 mt-1">Try another brand name or check your spelling.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="text-sm text-slate-400">
          Enter a search term above to find matching discounts.
        </div>
      )}
    </div>
  );
};
