import React, { useState } from 'react';
import { Coupon, Store } from '../data/types';
import { X, Copy, Check, ExternalLink, ShieldCheck, AlertCircle } from 'lucide-react';

interface RevealModalProps {
  coupon: Coupon | null;
  store?: Store;
  onClose: () => void;
}

export const RevealModal: React.FC<RevealModalProps> = ({
  coupon,
  store,
  onClose
}) => {
  const [copied, setCopied] = useState(false);

  if (!coupon) return null;

  const isCode = coupon.type === 'code' && Boolean(coupon.code);
  const targetUrl = coupon.url || store?.affiliateUrl || (store?.domain ? `https://${store.domain}` : '#');
  const storeName = store?.name || coupon.storeSlug.toUpperCase();

  const handleCopy = () => {
    if (coupon.code) {
      navigator.clipboard.writeText(coupon.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Store & Discount Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 font-extrabold text-xl flex items-center justify-center mx-auto mb-3 border border-indigo-100 shadow-inner">
            {storeName.slice(0, 2).toUpperCase()}
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
            {storeName} Verified Offer
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
            {coupon.title}
          </h2>
          {coupon.discount && (
            <div className="text-base font-bold text-amber-600 mt-1">
              {coupon.discount}
            </div>
          )}
        </div>

        {/* Promo Code Box (if type is code) */}
        {isCode ? (
          <div className="mb-6">
            <div className="bg-slate-50 border-2 border-dashed border-indigo-300 rounded-2xl p-3 sm:p-4 flex items-center justify-between gap-3">
              <code className="text-lg sm:text-xl font-mono font-extrabold text-slate-900 tracking-wider pl-2 select-all">
                {coupon.code}
              </code>
              <button
                onClick={handleCopy}
                className={`px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all cursor-pointer shadow-xs ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-amber-600 hover:bg-amber-700 text-white'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </button>
            </div>
            <p className="text-xs text-slate-500 text-center mt-2 font-medium">
              Copy the code, then paste it in the promo box at checkout on {storeName}.
            </p>
          </div>
        ) : (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold rounded-2xl p-4 text-center mb-6">
            🎉 No promo code needed! The discount will automatically apply when visiting {storeName}.
          </div>
        )}

        {/* Outbound Link CTA */}
        <div className="space-y-3">
          <a
            href={targetUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3.5 px-6 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all shadow-md text-center"
          >
            Go to {storeName}
            <ExternalLink className="w-4 h-4 text-slate-400" />
          </a>

          {/* Terms / Expiry */}
          {coupon.terms && (
            <div className="text-xs text-slate-400 bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>{coupon.terms}</span>
            </div>
          )}

          {coupon.expires && (
            <div className="text-[11px] text-slate-400 text-center">
              Offer expires on {coupon.expires}. Verified before publishing.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
