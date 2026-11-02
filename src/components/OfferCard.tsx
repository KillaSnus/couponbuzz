import React from 'react';
import { Coupon, Store } from '../data/types';
import { CheckCircle2, Flame, Copy, ExternalLink, Clock } from 'lucide-react';

interface OfferCardProps {
  coupon: Coupon;
  store?: Store;
  onReveal: (coupon: Coupon, store?: Store) => void;
  onSelectStore?: (slug: string) => void;
  showStoreLogo?: boolean;
}

export const OfferCard: React.FC<OfferCardProps> = ({
  coupon,
  store,
  onReveal,
  onSelectStore,
  showStoreLogo = true
}) => {
  const isCode = coupon.type === 'code' && Boolean(coupon.code);

  const getInitials = (name: string) => {
    return name
      .replace(/[^A-Za-z0-9 ]/g, '')
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map(w => w[0].toUpperCase())
      .join('') || '?';
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 group">
      
      {/* Left: Discount Badge & Store Identity */}
      <div className="flex items-center gap-4 sm:min-w-[190px]">
        {/* Discount Box */}
        <div className="w-20 h-20 rounded-2xl bg-indigo-50 border-2 border-dashed border-indigo-200 text-indigo-700 flex flex-col items-center justify-center text-center p-2 shrink-0 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-transparent transition-colors">
          <span className="text-xs font-black tracking-tighter leading-tight uppercase">
            {coupon.discount || (isCode ? 'PROMO' : 'DEAL')}
          </span>
          <span className="text-[10px] font-semibold opacity-75 uppercase mt-0.5">
            {isCode ? 'CODE' : 'DEAL'}
          </span>
        </div>

        {/* Store Logo/Initials (if shown) */}
        {showStoreLogo && store && (
          <div 
            onClick={() => onSelectStore && onSelectStore(store.slug)}
            className="cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold text-sm shadow-xs border border-slate-200/60">
              {getInitials(store.name)}
            </div>
            <div className="text-xs font-bold text-slate-900 hover:text-indigo-600 mt-1 max-w-[100px] truncate">
              {store.name}
            </div>
          </div>
        )}
      </div>

      {/* Middle: Details & Badges */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1.5">
          {coupon.exclusive && (
            <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md">
              <Flame className="w-3 h-3 text-amber-600" />
              Exclusive
            </span>
          )}

          {coupon.verified && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-md">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              Verified {coupon.verifiedAt ? `(${coupon.verifiedAt.slice(5)})` : 'Active'}
            </span>
          )}

          {coupon.markets && coupon.markets.map(m => (
            <span key={m} className="text-[10px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
              {m}
            </span>
          ))}

          {coupon.expires && (
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Ends {coupon.expires}
            </span>
          )}
        </div>

        <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
          {coupon.title}
        </h3>

        {coupon.description && (
          <p className="text-slate-600 text-xs sm:text-sm mt-1 line-clamp-2">
            {coupon.description}
          </p>
        )}

        {coupon.terms && (
          <div className="text-[11px] text-slate-400 mt-2 font-medium">
            Terms: {coupon.terms}
          </div>
        )}
      </div>

      {/* Right: Reveal Action CTA */}
      <div className="w-full sm:w-auto shrink-0 pt-2 sm:pt-0">
        <button
          onClick={() => onReveal(coupon, store)}
          className={`w-full sm:w-auto px-5 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm ${
            isCode
              ? 'bg-amber-600 hover:bg-amber-700 text-white'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
        >
          {isCode ? (
            <>
              <Copy className="w-4 h-4" />
              Show code
            </>
          ) : (
            <>
              <ExternalLink className="w-4 h-4" />
              Get deal
            </>
          )}
        </button>
      </div>

    </div>
  );
};
