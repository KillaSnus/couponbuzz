import React, { useState } from 'react';
import { AppDatabase } from '../data/types';
import { storage } from '../services/storage';
import { Send, CheckCircle2, ShieldCheck, Tag, Info } from 'lucide-react';

interface SubmitCouponViewProps {
  db: AppDatabase;
  navigate: (path: string) => void;
}

export const SubmitCouponView: React.FC<SubmitCouponViewProps> = ({ db, navigate }) => {
  const [store, setStore] = useState('');
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [markets, setMarkets] = useState<string[]>(['US']);
  const [expires, setExpires] = useState('');
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const toggleMarket = (m: string) => {
    setMarkets(prev => 
      prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!store.trim() || !title.trim() || !consent) return;

    storage.addSubmission({
      kind: 'coupon',
      store: store.trim(),
      title: title.trim(),
      code: code.trim(),
      url: url.trim(),
      description: description.trim(),
      markets,
      expires,
      email: email.trim(),
      type: code.trim() ? 'code' : 'deal',
      status: 'pending'
    });

    setSubmitted(true);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-8">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
          <Send className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Submit a Coupon or Deal
        </h1>
        <p className="text-sm text-slate-500 mt-2">
          Found a working discount code? Help fellow shoppers save. Every submission is checked by our team before going live.
        </p>
      </div>

      {submitted ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-emerald-950">Thank You!</h2>
          <p className="text-sm text-emerald-800 max-w-md mx-auto">
            Your promo code submission has been received and added to our editorial review queue. Once verified in checkout, it will be published to CouponBuz.
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setStore('');
              setTitle('');
              setCode('');
              setUrl('');
              setDescription('');
            }}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition-colors cursor-pointer"
          >
            Submit Another Offer
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Store Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Nike, ASOS, Adidas"
              value={store}
              onChange={(e) => setStore(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-xl px-4 py-3 focus:outline-hidden focus:border-indigo-600 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Offer Title / Discount <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 20% off all footwear or Free Delivery"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-xl px-4 py-3 focus:outline-hidden focus:border-indigo-600 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Promo Code (leave blank if automatic deal)
              </label>
              <input
                type="text"
                placeholder="e.g. SAVE20"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-mono text-sm rounded-xl px-4 py-3 focus:outline-hidden focus:border-indigo-600 focus:bg-white uppercase"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Expiry Date (Optional)
              </label>
              <input
                type="date"
                value={expires}
                onChange={(e) => setExpires(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-xl px-4 py-3 focus:outline-hidden focus:border-indigo-600 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Link to Store or Deal Page
            </label>
            <input
              type="url"
              placeholder="https://store.com/deal"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-xl px-4 py-3 focus:outline-hidden focus:border-indigo-600 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Countries Where Code Works
            </label>
            <div className="flex flex-wrap gap-2">
              {['US', 'UK', 'CA', 'EU', 'AU'].map(m => (
                <button
                  type="button"
                  key={m}
                  onClick={() => toggleMarket(m)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    markets.includes(m)
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Restrictions, Exclusions or Details
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Valid on first order only. Minimum spend $50."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-xl p-3 focus:outline-hidden focus:border-indigo-600 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Your Email (Optional, kept private)
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-xl px-4 py-3 focus:outline-hidden focus:border-indigo-600 focus:bg-white"
            />
          </div>

          <div className="pt-2">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-1 w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-xs text-slate-600 leading-normal">
                I have personally tested this offer and confirm it is a genuine working promotion.
              </span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm py-3.5 px-6 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            Send for Editorial Review
          </button>
        </form>
      )}
    </div>
  );
};
