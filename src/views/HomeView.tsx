import React, { useState } from 'react';
import { AppDatabase, Coupon, Store } from '../data/types';
import { OfferCard } from '../components/OfferCard';
import { 
  Search, 
  Tag, 
  ShieldCheck, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  Flame, 
  ChevronRight, 
  BookOpen,
  Sparkles,
  HelpCircle,
  ChevronDown
} from 'lucide-react';

interface HomeViewProps {
  db: AppDatabase;
  navigate: (path: string) => void;
  onRevealOffer: (coupon: Coupon, store?: Store) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  db,
  navigate,
  onRevealOffer
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const homeSections = db.settings.home.sections || [];
  const publishedStores = db.stores.filter(s => s.status === 'published');
  const publishedCoupons = db.coupons.filter(c => c.status === 'published');
  const featuredOffers = publishedCoupons.filter(c => c.featured).slice(0, 8);
  const popularStores = publishedStores.slice(0, 12);
  const publishedPosts = db.posts.filter(p => p.status === 'published').slice(0, 3);

  const getStore = (slug: string) => db.stores.find(s => s.slug === slug);

  const getInitials = (name: string) => {
    return name
      .replace(/[^A-Za-z0-9 ]/g, '')
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map(w => w[0].toUpperCase())
      .join('') || '?';
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="space-y-16 pb-16">
      
      {/* 1. HERO SECTION */}
      {homeSections.some(s => s.type === 'hero' && s.enabled !== false) && (() => {
        const heroSec = homeSections.find(s => s.type === 'hero');
        const heroTitle = heroSec?.title || 'Find verified promo codes worth using';
        const heroSubtitle = heroSec?.subtitle || `Browse ${publishedStores.length}+ stores across the US, UK, Canada, Australia and Europe. Every discount voucher shows when it was last checked, and expired ones are removed.`;
        const heroImage = heroSec?.imageUrl || db.settings.theme.heroImageUrl;

        return (
          <section 
            className="relative text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden shadow-inner"
            style={{
              background: heroImage && db.settings.theme.heroStyle === 'image'
                ? `linear-gradient(rgba(15, 23, 42, 0.85), rgba(15, 23, 42, 0.85)), url('${heroImage}') center/cover no-repeat`
                : `radial-gradient(900px 400px at 85% -10%, rgba(234, 88, 12, 0.35), transparent 60%), linear-gradient(135deg, ${db.settings.theme.primaryDark || '#3730a3'}, ${db.settings.theme.primary || '#4f46e5'})`
            }}
          >
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                
                <div className="lg:col-span-7 text-center lg:text-left">
                  <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-white mb-6 border border-white/20">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Tested & Hand-Verified Daily</span>
                  </div>

                  <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white">
                    {heroTitle}
                  </h1>

                  <p className="mt-4 text-base sm:text-lg text-slate-200 max-w-2xl leading-relaxed">
                    {heroSubtitle}
                  </p>

                  {/* Hero Search Box */}
                  <form onSubmit={handleSearch} className="mt-8 flex flex-col sm:flex-row gap-2 max-w-xl">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder="Search store, e.g. Nike, ASOS, NordVPN..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white text-slate-900 placeholder-slate-400 pl-12 pr-4 py-4 rounded-2xl text-base shadow-xl focus:outline-hidden focus:ring-4 focus:ring-white/30"
                      />
                      <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    </div>
                    <button
                      type="submit"
                      className="bg-amber-600 hover:bg-amber-500 text-white font-bold text-base px-8 py-4 rounded-2xl transition-all shadow-xl hover:shadow-2xl cursor-pointer"
                    >
                      Find Codes
                    </button>
                  </form>

                  {/* Popular Brand Pills */}
                  <div className="mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-2 text-xs text-white/80">
                    <span className="font-semibold text-white">Trending:</span>
                    {['nike', 'nordvpn', 'asos', 'best-buy', 'sephora'].map(slug => (
                      <button
                        key={slug}
                        onClick={() => navigate(`/coupons/${slug}`)}
                        className="bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-full border border-white/15 transition-colors cursor-pointer capitalize"
                      >
                        {slug.replace('-', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Hero Right Column: Custom Hero Image OR Floating Deals Display */}
                <div className="hidden lg:grid lg:col-span-5 gap-3.5 justify-items-end">
                  {heroImage && db.settings.theme.heroStyle !== 'image' ? (
                    <div className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20">
                      <img src={heroImage} alt="Hero Highlight" className="w-full h-80 object-cover" />
                    </div>
                  ) : (
                    featuredOffers.slice(0, 3).map((offer, idx) => {
                      const s = getStore(offer.storeSlug);
                      return (
                        <div
                          key={offer.id}
                          onClick={() => onRevealOffer(offer, s)}
                          className={`bg-white text-slate-900 p-4 rounded-2xl shadow-2xl border border-white/20 w-80 cursor-pointer hover:-translate-y-1 transition-all ${
                            idx === 0 ? '-rotate-1' : idx === 1 ? 'translate-x-4 rotate-1' : '-rotate-1'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                              {s ? getInitials(s.name) : 'CB'}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-xs font-bold text-slate-500 uppercase truncate">
                                {s?.name || offer.storeSlug}
                              </div>
                              <div className="text-sm font-bold text-slate-900 truncate">
                                {offer.discount || offer.title}
                              </div>
                            </div>
                            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg shrink-0">
                              Reveal
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

              </div>
            </div>
          </section>
        );
      })()}

      {/* 2. STATS STRIP */}
      {homeSections.some(s => s.type === 'stats' && s.enabled !== false) && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-12 relative z-10">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-6 sm:p-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl sm:text-3xl font-black text-indigo-600">
                {publishedStores.length}+
              </div>
              <div className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
                Verified Stores
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-indigo-600">
                {publishedCoupons.length}+
              </div>
              <div className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
                Active Promo Codes
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-indigo-600">
                Daily
              </div>
              <div className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
                Manual Checkout Tests
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-600">
                100% Free
              </div>
              <div className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
                Shopper Guarantee
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. TOP VERIFIED OFFERS TODAY */}
      {homeSections.some(s => s.type === 'offers' && s.enabled !== false) && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">
                Editor's Top Picks
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Top verified offers today
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Hand-picked discounts guaranteed working right now.
              </p>
            </div>
            <button
              onClick={() => navigate('/stores/')}
              className="text-sm font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
            >
              See all active stores <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            {featuredOffers.map(offer => (
              <OfferCard
                key={offer.id}
                coupon={offer}
                store={getStore(offer.storeSlug)}
                onReveal={onRevealOffer}
                onSelectStore={(slug) => navigate(`/coupons/${slug}`)}
              />
            ))}
          </div>
        </section>
      )}

      {/* 4. POPULAR STORES TILE GRID */}
      {homeSections.some(s => s.type === 'stores' && s.enabled !== false) && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Popular stores
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Direct promo codes for top retailers in the US, UK, Canada & Europe.
              </p>
            </div>
            <button
              onClick={() => navigate('/stores/')}
              className="text-sm font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
            >
              All stores A–Z →
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {popularStores.map(store => {
              const count = publishedCoupons.filter(c => c.storeSlug === store.slug).length;
              return (
                <button
                  key={store.slug}
                  onClick={() => navigate(`/coupons/${store.slug}`)}
                  className="bg-white rounded-2xl border border-slate-200 p-5 text-center hover:border-indigo-300 hover:shadow-lg transition-all group flex flex-col items-center justify-center cursor-pointer"
                >
                  <div className="w-14 h-14 rounded-2xl bg-indigo-50 group-hover:bg-indigo-600 text-indigo-700 group-hover:text-white flex items-center justify-center font-black text-lg transition-colors mb-3 shadow-xs">
                    {getInitials(store.name)}
                  </div>
                  <div className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 truncate max-w-full">
                    {store.name}
                  </div>
                  <div className="text-xs text-slate-400 mt-1 font-medium">
                    {count} {count === 1 ? 'offer' : 'offers'}
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* 5. SHOP BY CATEGORY */}
      {homeSections.some(s => s.type === 'categories' && s.enabled !== false) && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Shop by category
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Explore savings across all product departments.
              </p>
            </div>
            <button
              onClick={() => navigate('/categories/')}
              className="text-sm font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
            >
              All categories →
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {db.categories.map(cat => {
              const storeCount = publishedStores.filter(s => s.category === cat.slug).length;
              return (
                <button
                  key={cat.slug}
                  onClick={() => navigate(`/categories/${cat.slug}`)}
                  className="bg-white rounded-2xl border border-slate-200 p-5 text-left hover:border-indigo-300 hover:shadow-md transition-all flex items-center gap-4 cursor-pointer group"
                >
                  <span className="text-3xl shrink-0 group-hover:scale-110 transition-transform">
                    {cat.icon}
                  </span>
                  <div className="min-w-0">
                    <div className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 truncate">
                      {cat.name}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      {storeCount} stores
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* 6. REGIONS / COUNTRIES */}
      {homeSections.some(s => s.type === 'regions' && s.enabled !== false) && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-3xl p-8 sm:p-12 text-white shadow-xl">
            <div className="max-w-2xl mb-8">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full inline-block mb-3">
                International Coverage
              </span>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                Offers for your country
              </h2>
              <p className="text-slate-300 text-sm sm:text-base mt-2">
                Codes are tagged by country so you never waste time on coupons that won't work in your currency.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { code: 'US', name: 'United States', flag: '🇺🇸', sub: 'Dollar savings ($)' },
                { code: 'UK', name: 'United Kingdom', flag: '🇬🇧', sub: 'Pound codes (£)' },
                { code: 'CA', name: 'Canada', flag: '🇨🇦', sub: 'CAD deals (CA$)' },
                { code: 'EU', name: 'Europe', flag: '🇪🇺', sub: 'Euro vouchers (€)' },
                { code: 'AU', name: 'Australia', flag: '🇦🇺', sub: 'AUD coupons (A$)' },
                { code: 'DE', name: 'Germany', flag: '🇩🇪', sub: 'Gutscheine (€)' },
                { code: 'FR', name: 'France', flag: '🇫🇷', sub: 'Codes promo (€)' },
                { code: 'IT', name: 'Italy', flag: '🇮🇹', sub: 'Codici sconto (€)' }
              ].map(country => (
                <button
                  key={country.code}
                  onClick={() => navigate(`/promo-codes/${country.code.toLowerCase()}`)}
                  className="bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl p-4 text-left transition-all cursor-pointer group"
                >
                  <div className="text-2xl mb-2">{country.flag}</div>
                  <div className="font-bold text-white text-sm group-hover:text-amber-300 transition-colors">
                    {country.name}
                  </div>
                  <div className="text-xs text-slate-300 mt-0.5">
                    {country.sub}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. SEASONAL DEALS (Black Friday, Christmas) */}
      {homeSections.some(s => s.type === 'collections' && s.enabled !== false) && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Seasonal deals & events
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Plan ahead for the biggest shopping events of the year.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {db.collections.map(col => (
              <div
                key={col.slug}
                onClick={() => navigate(`/deals/${col.slug}`)}
                className="bg-gradient-to-br from-indigo-50 to-white rounded-3xl p-8 border border-indigo-100 hover:border-indigo-300 hover:shadow-xl transition-all cursor-pointer group"
              >
                <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-amber-700 bg-amber-100 px-3 py-1 rounded-full mb-3">
                  <Flame className="w-3.5 h-3.5" />
                  Special Hub
                </div>
                <h3 className="text-2xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {col.name}
                </h3>
                <p className="text-slate-600 text-sm mt-2 line-clamp-2">
                  {col.intro}
                </p>
                <div className="mt-6 flex items-center gap-2 text-sm font-bold text-indigo-600 group-hover:text-indigo-800">
                  <span>Explore participating stores</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 8. HOW IT WORKS */}
      {homeSections.some(s => s.type === 'howitworks' && s.enabled !== false) && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              How CouponBuz works
            </h2>
            <p className="text-slate-500 text-sm mt-2">
              Our 3-step quality testing pipeline ensures zero dead links.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center relative shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 font-black text-xl flex items-center justify-center mx-auto mb-4">
                1
              </div>
              <h3 className="text-lg font-bold text-slate-900">Find Your Store</h3>
              <p className="text-sm text-slate-500 mt-2">
                Search or browse hundreds of verified brand stores across clothing, tech, travel, and food delivery.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center relative shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 font-black text-xl flex items-center justify-center mx-auto mb-4">
                2
              </div>
              <h3 className="text-lg font-bold text-slate-900">Reveal & Copy Code</h3>
              <p className="text-sm text-slate-500 mt-2">
                Click 'Show code' to copy the coupon in one click and review specific terms and minimum spends.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center relative shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 font-black text-xl flex items-center justify-center mx-auto mb-4">
                3
              </div>
              <h3 className="text-lg font-bold text-slate-900">Save at Checkout</h3>
              <p className="text-sm text-slate-500 mt-2">
                Paste into the promo field during checkout on the merchant's site and watch your total drop.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* 9. SAVING GUIDES BLOG */}
      {homeSections.some(s => s.type === 'guides' && s.enabled !== false) && publishedPosts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Saving guides & advice
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Practical shopping advice to save you money at checkout.
              </p>
            </div>
            <button
              onClick={() => navigate('/guides/')}
              className="text-sm font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
            >
              All guides →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {publishedPosts.map(post => (
              <div
                key={post.slug}
                onClick={() => navigate(`/guides/${post.slug}`)}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden hover:border-indigo-300 hover:shadow-xl transition-all cursor-pointer group flex flex-col"
              >
                {post.image ? (
                  <img
                    src={post.image}
                    alt={post.imageAlt || post.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-indigo-100 to-indigo-50 flex items-center justify-center">
                    <BookOpen className="w-10 h-10 text-indigo-300" />
                  </div>
                )}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-xs text-slate-400 font-semibold mb-2">
                      {post.date} • By {post.author}
                    </div>
                    <h3 className="font-bold text-slate-900 text-lg group-hover:text-indigo-600 transition-colors leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-slate-500 text-xs sm:text-sm mt-2 line-clamp-2">
                      {post.excerpt}
                    </p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-100 text-xs font-bold text-indigo-600 group-hover:text-indigo-800 flex items-center gap-1">
                    Read guide →
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 10. FAQ ACCORDION */}
      {homeSections.some(s => s.type === 'faq' && s.enabled !== false) && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Frequently asked questions
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Everything you need to know about using CouponBuz promo codes.
            </p>
          </div>

          <div className="space-y-3">
            {(homeSections.find(s => s.type === 'faq')?.items || []).map((faq, idx) => (
              <div 
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-5 text-left font-bold text-slate-900 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <span className="text-sm sm:text-base">{faq.q}</span>
                  <ChevronDown 
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform ${openFaq === idx ? 'rotate-180 text-indigo-600' : ''}`} 
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
};
