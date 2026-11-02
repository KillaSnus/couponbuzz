import React from 'react';
import { AppDatabase, Coupon, Store } from '../data/types';
import { OfferCard } from '../components/OfferCard';
import { Flame, ArrowRight, Tag } from 'lucide-react';

interface SeasonalViewProps {
  slug?: string;
  db: AppDatabase;
  navigate: (path: string) => void;
  onRevealOffer: (coupon: Coupon, store?: Store) => void;
}

export const SeasonalView: React.FC<SeasonalViewProps> = ({
  slug,
  db,
  navigate,
  onRevealOffer
}) => {
  const getStore = (storeSlug: string) => db.stores.find(s => s.slug === storeSlug);

  // If specific collection slug like "black-friday" or "christmas"
  if (slug) {
    const collection = db.collections.find(c => c.slug === slug);
    if (!collection) {
      return (
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-black text-slate-900">Event Not Found</h1>
          <button onClick={() => navigate('/')} className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-xl">
            Home
          </button>
        </div>
      );
    }

    const participatingStores = db.stores.filter(s => collection.stores?.includes(s.slug) && s.status === 'published');
    const seasonalOffers = db.coupons.filter(c => collection.stores?.includes(c.storeSlug) && c.status === 'published');

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        <nav className="flex items-center gap-2 text-xs font-semibold text-slate-400">
          <button onClick={() => navigate('/')} className="hover:text-slate-700 cursor-pointer">Home</button>
          <span>/</span>
          <span className="text-slate-700 font-bold">{collection.name}</span>
        </nav>

        {/* Hero */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full mb-4">
            <Flame className="w-4 h-4 text-amber-400" />
            Seasonal Savings Event
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            {collection.name} Promo Codes & Deals
          </h1>
          <p className="text-slate-300 text-base sm:text-lg mt-3 max-w-2xl">
            {collection.intro}
          </p>
        </div>

        {/* Offers */}
        {seasonalOffers.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              Featured {collection.name} Offers ({seasonalOffers.length})
            </h2>
            <div className="space-y-4">
              {seasonalOffers.map(coupon => (
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

        {/* Participating Stores */}
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            Top Stores to Watch for {collection.name}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {participatingStores.map(store => (
              <button
                key={store.slug}
                onClick={() => navigate(`/coupons/${store.slug}`)}
                className="bg-white rounded-2xl border border-slate-200 p-5 text-left hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 truncate">
                  {store.name}
                </div>
                <div className="text-xs text-slate-400 mt-1 truncate">{store.domain}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Content Body */}
        {collection.body && (
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs prose max-w-none text-slate-700">
            <div className="whitespace-pre-line text-sm sm:text-base leading-relaxed">
              {collection.body}
            </div>
          </div>
        )}
      </div>
    );
  }

  // All Seasonal hubs
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <h1 className="text-3xl font-black text-slate-900">Seasonal Deals Hub</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {db.collections.map(col => (
          <div
            key={col.slug}
            onClick={() => navigate(`/deals/${col.slug}`)}
            className="bg-white rounded-3xl border border-slate-200 p-8 hover:shadow-xl hover:border-indigo-300 transition-all cursor-pointer group"
          >
            <h2 className="text-2xl font-bold text-slate-900 group-hover:text-indigo-600">
              {col.name}
            </h2>
            <p className="text-sm text-slate-500 mt-2">{col.intro}</p>
            <div className="mt-4 font-bold text-indigo-600 flex items-center gap-1">
              View {col.name} deals →
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
