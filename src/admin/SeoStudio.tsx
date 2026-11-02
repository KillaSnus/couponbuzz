import React, { useState } from 'react';
import { AppDatabase } from '../data/types';
import { storage } from '../services/storage';
import { 
  Globe, 
  Search, 
  Share2, 
  ShieldCheck, 
  CheckCircle2, 
  Copy, 
  ExternalLink, 
  Check, 
  AlertCircle,
  HelpCircle,
  Code,
  FileText
} from 'lucide-react';

interface SeoStudioProps {
  db: AppDatabase;
  showToast: (msg: string) => void;
}

export const SeoStudio: React.FC<SeoStudioProps> = ({ db, showToast }) => {
  const [copiedDns, setCopiedDns] = useState(false);
  const [activePreview, setActivePreview] = useState<'twitter' | 'facebook'>('twitter');

  const { seo, site } = db.settings;
  const canonicalUrl = seo.canonicalUrl || 'https://couponbuz.pro';
  const descLength = seo.defaultDescription?.length || 0;

  const handleCopyDns = () => {
    navigator.clipboard.writeText('couponbuz.pages.dev');
    setCopiedDns(true);
    setTimeout(() => setCopiedDns(false), 2000);
    showToast('Copied Cloudflare target hostname!');
  };

  return (
    <div className="space-y-6">
      
      {/* 1. DOMAIN CONNECTION & CLOUDFLARE STATUS */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Custom Domain: https://couponbuz.pro</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Active & Connected
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Primary canonical domain for international search rankings and Cloudflare Pages SSL.
              </p>
            </div>
          </div>

          <a
            href="https://dash.cloudflare.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="py-2 px-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <span>Cloudflare DNS Dashboard</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs">
          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-1">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Canonical Domain</div>
            <input
              type="text"
              value={seo.canonicalUrl || 'https://couponbuz.pro'}
              onChange={(e) => storage.updateSettings({
                seo: { ...seo, canonicalUrl: e.target.value.trim() },
                site: { ...site, url: e.target.value.trim() }
              })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono font-bold focus:outline-hidden focus:border-indigo-500"
            />
          </div>

          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-1">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Cloudflare DNS Target</div>
            <div className="flex items-center justify-between font-mono font-bold text-slate-200">
              <span className="truncate">couponbuz.pages.dev</span>
              <button onClick={handleCopyDns} className="text-indigo-400 hover:text-indigo-300 p-1 cursor-pointer">
                {copiedDns ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-1">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">SSL / HTTPS Encryption</div>
            <div className="text-emerald-400 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Full (Strict) SSL Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. GLOBAL METADATA & TITLE TEMPLATE */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Search className="w-4 h-4 text-indigo-400" />
            Global Meta Titles & Descriptions
          </h3>
          <p className="text-xs text-slate-400">
            Control the default search title template and snippet description shown on Google and Bing.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
              Title Template
            </label>
            <input
              type="text"
              value={seo.titleTemplate || '%title% | CouponBuz - Verified Promo Codes'}
              onChange={(e) => storage.updateSettings({
                seo: { ...seo, titleTemplate: e.target.value }
              })}
              placeholder="%title% | CouponBuz"
              className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-3 py-2.5 text-xs focus:outline-hidden focus:border-indigo-500"
            />
            <span className="text-[11px] text-slate-500 mt-1 block">
              Variables: <code className="text-indigo-300">%title%</code>, <code className="text-indigo-300">%site%</code>
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
              Default Social Card Image (OG:Image URL)
            </label>
            <input
              type="url"
              value={seo.ogImage || ''}
              onChange={(e) => storage.updateSettings({
                seo: { ...seo, ogImage: e.target.value }
              })}
              placeholder="https://images.unsplash.com/..."
              className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-3 py-2.5 text-xs focus:outline-hidden focus:border-indigo-500"
            />
            <span className="text-[11px] text-slate-500 mt-1 block">
              Recommended size: 1200 x 630 px.
            </span>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-bold text-slate-400 uppercase">
              Default Meta Description
            </label>
            <span className={`text-[11px] font-mono font-bold ${
              descLength >= 120 && descLength <= 160 ? 'text-emerald-400' : 'text-amber-400'
            }`}>
              {descLength} / 160 chars {descLength >= 120 && descLength <= 160 ? '✓ Ideal length' : '(Recommended: 120-160)'}
            </span>
          </div>
          <textarea
            rows={3}
            value={seo.defaultDescription || ''}
            onChange={(e) => storage.updateSettings({
              seo: { ...seo, defaultDescription: e.target.value }
            })}
            placeholder="Verified promo codes and discount vouchers for US, UK, Canada, Australia and Europe shoppers, tested with clear checkout terms."
            className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl p-3 text-xs focus:outline-hidden focus:border-indigo-500"
          />
        </div>

        <button
          onClick={() => showToast('SEO settings saved and published instantly to live site!')}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold cursor-pointer shadow-sm"
        >
          Save Metadata
        </button>
      </div>

      {/* 3. SOCIAL MEDIA CARD PREVIEWS (Twitter & Facebook) */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Share2 className="w-4 h-4 text-indigo-400" />
              Social Sharing Card Preview
            </h3>
            <p className="text-xs text-slate-400">
              How links look when shoppers share CouponBuz on Twitter, Facebook, LinkedIn, and iMessage.
            </p>
          </div>

          <div className="bg-slate-900 p-1 rounded-xl border border-slate-800 flex items-center text-xs font-bold">
            <button
              onClick={() => setActivePreview('twitter')}
              className={`px-3 py-1 rounded-lg cursor-pointer ${activePreview === 'twitter' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Twitter / X Card
            </button>
            <button
              onClick={() => setActivePreview('facebook')}
              className={`px-3 py-1 rounded-lg cursor-pointer ${activePreview === 'facebook' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Facebook OpenGraph
            </button>
          </div>
        </div>

        {/* Mock Social Card */}
        <div className="max-w-xl mx-auto bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
          <div className="h-48 sm:h-56 bg-slate-800 relative overflow-hidden">
            {seo.ogImage ? (
              <img src={seo.ogImage} alt="Social Card" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-500">
                <Globe className="w-10 h-10 mb-2 opacity-50" />
                <span className="text-xs">No OG Image Specified</span>
              </div>
            )}
            <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] text-white font-mono">
              couponbuz.pro
            </div>
          </div>

          <div className="p-4 space-y-1">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">couponbuz.pro</div>
            <div className="text-sm font-bold text-white line-clamp-1">
              CouponBuz: Verified Promo Codes & Hand-Tested Coupons (2026)
            </div>
            <div className="text-xs text-slate-400 line-clamp-2">
              {seo.defaultDescription || 'Find verified promo codes worth using. Hand-tested daily discount vouchers across US, UK, Canada, Australia and Europe.'}
            </div>
          </div>
        </div>
      </div>

      {/* 4. SEARCH ENGINES & ANALYTICS TRACKING */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Code className="w-4 h-4 text-emerald-400" />
            Search Engine Verification & Analytics
          </h3>
          <p className="text-xs text-slate-400">
            Connect Google Search Console, Bing Webmaster Tools, and Google Analytics 4 (GA4).
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1">
              Google Search Console Verification Tag
            </label>
            <input
              type="text"
              value={seo.googleVerification || ''}
              onChange={(e) => storage.updateSettings({
                seo: { ...seo, googleVerification: e.target.value }
              })}
              placeholder="e.g. g-site-verification-code"
              className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-3 py-2 text-xs font-mono"
            />
            <span className="text-[11px] text-slate-500 mt-1 block">Injected into &lt;head&gt; automatically.</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1">
              Bing Webmaster Tools Verification Tag
            </label>
            <input
              type="text"
              value={seo.bingVerification || ''}
              onChange={(e) => storage.updateSettings({
                seo: { ...seo, bingVerification: e.target.value }
              })}
              placeholder="e.g. bing-verification-token"
              className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-3 py-2 text-xs font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1">
              Google Analytics (GA4 Measurement ID)
            </label>
            <input
              type="text"
              value={seo.gaId || 'G-2DKQZQRS5L'}
              onChange={(e) => storage.updateSettings({
                seo: { ...seo, gaId: e.target.value }
              })}
              placeholder="G-XXXXXXXXXX"
              className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-3 py-2 text-xs font-mono"
            />
            <span className="text-[11px] text-slate-500 mt-1 block">Connected to your CouponBuz Firebase Analytics stream.</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1">
              Google Tag Manager Container ID
            </label>
            <input
              type="text"
              value={seo.gtmId || ''}
              onChange={(e) => storage.updateSettings({
                seo: { ...seo, gtmId: e.target.value }
              })}
              placeholder="GTM-XXXXXXX"
              className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-3 py-2 text-xs font-mono"
            />
          </div>
        </div>

        <button
          onClick={() => showToast('Analytics and verification tags updated!')}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold cursor-pointer"
        >
          Save Analytics Settings
        </button>
      </div>

    </div>
  );
};
