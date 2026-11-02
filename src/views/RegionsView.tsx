import React from 'react';
import { AppDatabase, Coupon, Store } from '../data/types';
import { OfferCard } from '../components/OfferCard';
import { Globe, ChevronRight } from 'lucide-react';

interface RegionsViewProps {
  regionCode?: string;
  db: AppDatabase;
  navigate: (path: string) => void;
  onRevealOffer: (coupon: Coupon, store?: Store) => void;
}

const REGION_MAP: { [key: string]: { name: string; flag: string; currency: string; advice: string } } = {
  us: {
    name: 'United States',
    flag: '🇺🇸',
    currency: 'USD ($)',
    advice: 'Prices in the US are shown before state sales tax, which is calculated at checkout. Look for free delivery thresholds (typically $35 to $50).'
  },
  uk: {
    name: 'United Kingdom',
    flag: '🇬🇧',
    currency: 'GBP (£)',
    advice: 'UK promo codes are often called "voucher codes" or "discount codes". Prices include 20% VAT. Check Royal Mail delivery cut-offs.'
  },
  ca: {
    name: 'Canada',
    flag: '🇨🇦',
    currency: 'CAD (CA$)',
    advice: 'Prices are in Canadian Dollars. When purchasing from cross-border US merchants, check import duties and shipping rates.'
  },
  eu: {
    name: 'Europe',
    flag: '🇪🇺',
    currency: 'EUR (€)',
    advice: 'European stores display prices inclusive of VAT. European Union consumer protection directives guarantee a 14-day statutory right of withdrawal.'
  },
  au: {
    name: 'Australia',
    flag: '🇦🇺',
    currency: 'AUD (A$)',
    advice: 'Australian prices include 10% GST. Click & Collect options at local department stores often skip shipping costs.'
  },
  de: {
    name: 'Germany',
    flag: '🇩🇪',
    currency: 'EUR (€)',
    advice: 'Gutscheincodes und Rabatte für deutsche Online-Shops inklusive 19% MwSt.'
  },
  fr: {
    name: 'France',
    flag: '🇫🇷',
    currency: 'EUR (€)',
    advice: 'Codes promo et réductions vérifiés pour les boutiques en ligne en France.'
  },
  it: {
    name: 'Italy',
    flag: '🇮🇹',
    currency: 'EUR (€)',
    advice: 'Codici sconto e offerte verificate per lo shopping online in Italia.'
  }
};

export const RegionsView: React.FC<RegionsViewProps> = ({
  regionCode,
  db,
  navigate,
  onRevealOffer
}) => {
  const getStore = (storeSlug: string) => db.stores.find(s => s.slug === storeSlug);

  // If viewing a specific country/region page
  if (regionCode) {
    const code = regionCode.toLowerCase();
    const regionInfo = REGION_MAP[code] || {
      name: regionCode.toUpperCase(),
      flag: '🌐',
      currency: 'Local',
      advice: 'Ensure the discount voucher matches your delivery location.'
    };

    const targetUpper = regionCode.toUpperCase();
    const regionStores = db.stores.filter(s => 
      s.status === 'published' && (s.markets?.includes(targetUpper) || targetUpper === 'EU' && s.markets?.includes('EU'))
    );
    const regionCoupons = db.coupons.filter(c => 
      c.status === 'published' && (c.markets?.includes(targetUpper) || c.markets?.includes('US'))
    );

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        <nav className="flex items-center gap-2 text-xs font-semibold text-slate-400">
          <button onClick={() => navigate('/')} className="hover:text-slate-700 cursor-pointer">Home</button>
          <span>/</span>
          <button onClick={() => navigate('/promo-codes/')} className="hover:text-slate-700 cursor-pointer">Countries</button>
          <span>/</span>
          <span className="text-slate-700 font-bold">{regionInfo.name}</span>
        </nav>

        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs flex items-center gap-6">
          <span className="text-5xl">{regionInfo.flag}</span>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              {regionInfo.name} Promo Codes & Discounts
            </h1>
            <p className="text-slate-500 text-sm mt-1 max-w-2xl">
              Hand-tested voucher codes valid in {regionInfo.name} in {regionInfo.currency}.
            </p>
          </div>
        </div>

        {/* Shopping advice */}
        <div className="bg-indigo-50/60 border border-indigo-100 rounded-3xl p-6 text-sm text-indigo-950">
          <h3 className="font-bold mb-1 flex items-center gap-2">
            <span>💡 Shopping in {regionInfo.name}</span>
          </h3>
          <p className="text-indigo-900/80">{regionInfo.advice}</p>
        </div>

        {/* Regional Deals */}
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            Active Offers for {regionInfo.name} ({regionCoupons.length})
          </h2>
          <div className="space-y-4">
            {regionCoupons.map(coupon => (
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

        {/* Regional Stores */}
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            Stores Shipping to {regionInfo.name} ({regionStores.length})
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {regionStores.map(store => (
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

  // All Regions Directory
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Promo Codes by Country & Region
        </h1>
        <p className="text-slate-500 text-sm sm:text-base mt-2">
          Select your location to view deals and voucher codes validated for your currency.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {Object.entries(REGION_MAP).map(([code, info]) => {
          const upper = code.toUpperCase();
          const storeCount = db.stores.filter(s => s.status === 'published' && s.markets?.includes(upper)).length;
          return (
            <button
              key={code}
              onClick={() => navigate(`/promo-codes/${code}`)}
              className="bg-white rounded-3xl border border-slate-200 p-6 text-left hover:border-indigo-400 hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between h-48"
            >
              <div>
                <span className="text-4xl block mb-3">{info.flag}</span>
                <h3 className="font-bold text-slate-900 text-lg group-hover:text-indigo-600 transition-colors">
                  {info.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Currency: {info.currency}
                </p>
              </div>
              <div className="text-xs font-bold text-indigo-600 flex items-center justify-between pt-2 border-t border-slate-100">
                <span>{storeCount} stores</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
