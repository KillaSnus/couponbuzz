import React, { useState } from 'react';
import { AppDatabase, Coupon, Store } from '../data/types';
import { OfferCard } from '../components/OfferCard';
import { 
  CheckCircle2, 
  ExternalLink, 
  Tag, 
  ChevronRight, 
  AlertCircle, 
  Globe, 
  Clock,
  HelpCircle,
  ChevronDown
} from 'lucide-react';

interface StoreDetailViewProps {
  slug: string;
  db: AppDatabase;
  navigate: (path: string) => void;
  onRevealOffer: (coupon: Coupon, store?: Store) => void;
}

export const StoreDetailView: React.FC<StoreDetailViewProps> = ({
  slug,
  db,
  navigate,
  onRevealOffer
}) => {
  const [filterType, setFilterType] = useState<'all' | 'code' | 'deal'>('all');
  const [selectedMarket, setSelectedMarket] = useState<string>('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const store = db.stores.find(s => s.slug === slug);

  if (!store) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-black text-slate-900">Store Not Found</h1>
        <p className="text-slate-500 mt-2">The store you are looking for does not exist or has been removed.</p>
        <button
          onClick={() => navigate('/stores/')}
          className="mt-6 px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl"
        >
          Browse All Stores
        </button>
      </div>
    );
  }

  const category = db.categories.find(c => c.slug === store.category);
  const storeCoupons = db.coupons
    .filter(c => c.storeSlug === store.slug && c.status === 'published')
    .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));

  const filteredCoupons = storeCoupons.filter(c => {
    const matchesType = filterType === 'all' || c.type === filterType;
    const matchesMarket = !selectedMarket || (c.markets && c.markets.includes(selectedMarket));
    return matchesType && matchesMarket;
  });

  const codeCount = storeCoupons.filter(c => c.type === 'code' && c.code).length;
  const dealCount = storeCoupons.filter(c => c.type === 'deal' || !c.code).length;
  const lastVerified = storeCoupons.find(c => c.verifiedAt)?.verifiedAt;
  const similarStores = db.stores.filter(s => s.category === store.category && s.slug !== store.slug).slice(0, 5);

  const getInitials = (name: string) => {
    return name
      .replace(/[^A-Za-z0-9 ]/g, '')
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map(w => w[0].toUpperCase())
      .join('') || '?';
  };

  const storeFaqs = [
    {
      q: `Does ${store.name} have working promo codes right now?`,
      a: storeCoupons.length > 0 
        ? `Yes! We currently list ${storeCoupons.length} active offer(s) for ${store.name}, including ${codeCount} verified promo code(s). Each offer shows when it was last checked.`
        : `We are monitoring ${store.name} for new promotions. Bookmark this page or subscribe to alerts.`
    },
    {
      q: `What should I know before using a ${store.name} discount code?`,
      a: (store.tips && store.tips.length > 0)
        ? store.tips.join(' ')
        : 'Read the terms on each voucher for exclusions, minimum spend requirements, and regional eligibility.'
    },
    {
      q: `Which countries does this ${store.name} page cover?`,
      a: store.markets && store.markets.length > 0
        ? `Offers on this page apply to ${store.markets.join(', ')}. Each coupon has badges indicating which market it is valid in.`
        : 'Offers show country badges. Check your local currency before applying at checkout.'
    },
    ...(store.faqs || [])
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-slate-400">
        <button onClick={() => navigate('/')} className="hover:text-slate-700 cursor-pointer">Home</button>
        <span>/</span>
        <button onClick={() => navigate('/stores/')} className="hover:text-slate-700 cursor-pointer">Stores</button>
        {category && (
          <>
            <span>/</span>
            <button onClick={() => navigate(`/categories/${category.slug}`)} className="hover:text-slate-700 cursor-pointer">{category.name}</button>
          </>
        )}
        <span>/</span>
        <span className="text-slate-700 font-bold">{store.name}</span>
      </nav>

      {/* Store Hero Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center font-black text-2xl sm:text-3xl shrink-0 shadow-inner">
            {getInitials(store.name)}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                {category?.name || 'Verified Store'}
              </span>
              {lastVerified && (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Checked {lastVerified}
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              {store.name} Promo Codes & Deals
            </h1>
            <p className="text-sm sm:text-base text-slate-500 mt-1 max-w-2xl">
              {store.description}
            </p>
          </div>
        </div>

        <a
          href={store.affiliateUrl || `https://${store.domain}`}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm px-6 py-3.5 rounded-2xl flex items-center gap-2 transition-all shadow-md shrink-0 w-full md:w-auto justify-center"
        >
          Visit {store.name}
          <ExternalLink className="w-4 h-4 text-slate-400" />
        </a>
      </div>

      {/* Main Content & Sidebar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Offers & Info */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Filter Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-3 flex flex-wrap items-center justify-between gap-3 shadow-xs">
            {/* Type tabs */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                  filterType === 'all' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All ({storeCoupons.length})
              </button>
              <button
                onClick={() => setFilterType('code')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                  filterType === 'code' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Codes ({codeCount})
              </button>
              <button
                onClick={() => setFilterType('deal')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                  filterType === 'deal' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Deals ({dealCount})
              </button>
            </div>

            {/* Markets filter */}
            {store.markets && store.markets.length > 1 && (
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-slate-400 mr-1">Region:</span>
                <button
                  onClick={() => setSelectedMarket('')}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                    !selectedMarket ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  All
                </button>
                {store.markets.map(m => (
                  <button
                    key={m}
                    onClick={() => setSelectedMarket(m)}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                      selectedMarket === m ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Offers Stack */}
          <div className="space-y-4">
            {filteredCoupons.map(coupon => (
              <OfferCard
                key={coupon.id}
                coupon={coupon}
                store={store}
                onReveal={onRevealOffer}
                showStoreLogo={false}
              />
            ))}

            {filteredCoupons.length === 0 && (
              <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center">
                <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <h3 className="text-base font-bold text-slate-900">No coupons match your filter</h3>
                <p className="text-xs text-slate-500 mt-1">Try switching to 'All' to view other active deals.</p>
              </div>
            )}
          </div>

          {/* Savings Tips for Store */}
          {store.tips && store.tips.length > 0 && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span>💡 Savings Tips for {store.name}</span>
              </h2>
              <ul className="space-y-2.5 text-sm text-slate-600">
                {store.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Store FAQs Accordion */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              {store.name} Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {storeFaqs.map((faq, idx) => (
                <div key={idx} className="border border-slate-200 rounded-2xl overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full p-4 text-left font-bold text-slate-900 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50"
                  >
                    <span className="text-sm">{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openFaq === idx ? 'rotate-180 text-indigo-600' : ''}`} />
                  </button>
                  {openFaq === idx && (
                    <div className="p-4 pt-1 text-sm text-slate-600 border-t border-slate-100">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Quick Facts Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
              Store Information
            </h3>
            <dl className="divide-y divide-slate-100 text-sm">
              <div className="py-2.5 flex justify-between">
                <dt className="text-slate-500">Official Website</dt>
                <dd className="font-bold text-slate-900">{store.domain}</dd>
              </div>
              <div className="py-2.5 flex justify-between">
                <dt className="text-slate-500">Category</dt>
                <dd className="font-bold text-indigo-600">{category?.name || 'General'}</dd>
              </div>
              <div className="py-2.5 flex justify-between">
                <dt className="text-slate-500">Supported Regions</dt>
                <dd className="font-bold text-slate-900">{(store.markets || []).join(', ') || 'Global'}</dd>
              </div>
              <div className="py-2.5 flex justify-between">
                <dt className="text-slate-500">Active Offers</dt>
                <dd className="font-bold text-emerald-600">{storeCoupons.length}</dd>
              </div>
            </dl>
          </div>

          {/* Similar Stores */}
          {similarStores.length > 0 && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
                Similar Stores in {category?.name}
              </h3>
              <div className="space-y-3">
                {similarStores.map(sim => (
                  <button
                    key={sim.slug}
                    onClick={() => navigate(`/coupons/${sim.slug}`)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs">
                        {getInitials(sim.name)}
                      </div>
                      <span className="font-bold text-sm text-slate-800 group-hover:text-indigo-600">
                        {sim.name}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Affiliate Disclosure */}
          <div className="text-xs text-slate-400 bg-slate-100/80 rounded-2xl p-4 leading-relaxed">
            {db.settings.site.disclosure}
          </div>

        </div>

      </div>

    </div>
  );
};
