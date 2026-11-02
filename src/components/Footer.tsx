import React, { useState } from 'react';
import { AppDatabase } from '../data/types';
import { storage } from '../services/storage';
import { Tag, ShieldCheck, Lock, Check, Send } from 'lucide-react';

interface FooterProps {
  db: AppDatabase;
  navigate: (path: string) => void;
  isAdmin: boolean;
  onOpenAdminAuth: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  db,
  navigate,
  isAdmin,
  onOpenAdminAuth
}) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const { site, nav } = db.settings;

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim() && newsletterEmail.includes('@')) {
      // Save subscription as submission
      storage.addSubmission({
        kind: 'newsletter',
        email: newsletterEmail.trim(),
        title: 'Newsletter Subscription',
        status: 'message'
      });
      setSubscribed(true);
      setNewsletterEmail('');
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Newsletter / Quick Bar */}
        <div className="bg-slate-800/80 rounded-3xl p-6 sm:p-10 mb-14 border border-slate-700/60 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full inline-block mb-2">
              Free Weekly Voucher Digest
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Get the highest-value promo codes sent to your inbox
            </h3>
            <p className="text-slate-400 text-sm mt-1">
              One short email when genuinely good deals appear. No spam. Unsubscribe anytime.
            </p>
          </div>

          <form onSubmit={handleNewsletter} className="w-full md:w-auto flex flex-col sm:flex-row gap-2 max-w-md">
            {subscribed ? (
              <div className="flex items-center gap-2 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 px-5 py-3 rounded-xl text-sm font-semibold">
                <Check className="w-5 h-5 text-emerald-400" />
                You are on the VIP deal list!
              </div>
            ) : (
              <>
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="bg-slate-900/90 border border-slate-700 text-white placeholder-slate-400 text-sm rounded-xl px-4 py-3 focus:outline-hidden focus:border-indigo-400 w-full sm:w-64"
                />
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm px-6 py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer shrink-0"
                >
                  <Send className="w-4 h-4" />
                  Subscribe
                </button>
              </>
            )}
          </form>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand & About */}
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-sm">
                <Tag className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                {site.siteName || 'CouponBuz'}
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm mb-4">
              {site.footerAbout || 'Independent verified promo codes and discount deals for shoppers in the US, UK, Canada, Australia and Europe.'}
            </p>
            <div className="text-xs text-slate-500 leading-relaxed max-w-sm">
              {site.disclosure}
            </div>
          </div>

          {/* Dynamic Footer Columns from CMS */}
          {nav.footer && nav.footer.map((col, idx) => (
            <div key={idx}>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
                {col.title}
              </h4>
              <ul className="space-y-2.5 text-sm">
                {col.links && col.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    <button
                      onClick={() => navigate(link.url)}
                      className="text-slate-400 hover:text-white transition-colors cursor-pointer text-left"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar & Discreet Admin Entry */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} {site.siteName || 'CouponBuz'}. All rights reserved. Hand-tested discount coupons.
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/privacy/')}
              className="hover:text-slate-400 cursor-pointer"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button
              onClick={() => navigate('/terms/')}
              className="hover:text-slate-400 cursor-pointer"
            >
              Terms of Service
            </button>
            <span>•</span>
            <button
              onClick={() => navigate('/how-we-verify/')}
              className="hover:text-slate-400 cursor-pointer"
            >
              Verification Standards
            </button>
            <span>•</span>

            {/* Hidden CMS / Admin Link */}
            {isAdmin ? (
              <button
                onClick={() => navigate('/admin')}
                className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                CMS Admin
              </button>
            ) : (
              <button
                onClick={onOpenAdminAuth}
                className="text-slate-600 hover:text-slate-400 flex items-center gap-1 cursor-pointer"
                title="Admin Staff Access"
              >
                <Lock className="w-3 h-3" />
                Staff Portal
              </button>
            )}
          </div>
        </div>

      </div>
    </footer>
  );
};
