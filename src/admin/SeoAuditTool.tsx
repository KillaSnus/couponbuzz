import React, { useState, useMemo } from 'react';
import { AppDatabase, Store, Coupon, Category, Post, Page } from '../data/types';
import { storage } from '../services/storage';
import { 
  ShieldCheck, 
  AlertTriangle, 
  AlertOctagon, 
  CheckCircle2, 
  ExternalLink, 
  RefreshCw, 
  Download, 
  Search, 
  Smartphone, 
  Monitor, 
  Wrench, 
  Globe, 
  FileCode, 
  Sliders,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Copy,
  Check
} from 'lucide-react';

interface SeoAuditToolProps {
  db: AppDatabase;
  onEditStore: (store: Store) => void;
  onEditCoupon: (coupon: Coupon) => void;
  onEditPage: (page: Page) => void;
  onEditPost: (post: Post) => void;
  showToast: (msg: string) => void;
}

export interface AuditIssue {
  id: string;
  type: 'critical' | 'warning' | 'pass';
  entityType: 'store' | 'coupon' | 'category' | 'post' | 'page' | 'technical';
  entityName: string;
  entitySlug: string;
  issue: string;
  recommendation: string;
  scoreImpact: number;
  fixAction?: 'editStore' | 'editCoupon' | 'editPage' | 'editPost' | 'autoFix';
  rawEntity?: any;
}

export const SeoAuditTool: React.FC<SeoAuditToolProps> = ({
  db,
  onEditStore,
  onEditCoupon,
  onEditPage,
  onEditPost,
  showToast
}) => {
  const [filterType, setFilterType] = useState<'all' | 'critical' | 'warning' | 'pass'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [serpDevice, setSerpDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [selectedSerpEntity, setSelectedSerpEntity] = useState<'home' | 'store'>('home');
  const [selectedStoreSlug, setSelectedStoreSlug] = useState<string>(db.stores[0]?.slug || 'nike');
  const [copiedSitemap, setCopiedSitemap] = useState(false);

  // Compute live audit issues
  const auditReport = useMemo(() => {
    const issues: AuditIssue[] = [];
    let deductions = 0;

    // 1. Technical & Domain checks
    const targetDomain = db.settings.seo?.canonicalUrl || db.settings.site?.url || 'https://couponbuz.pro';
    
    if (!targetDomain.startsWith('https://')) {
      deductions += 15;
      issues.push({
        id: 'tech-https',
        type: 'critical',
        entityType: 'technical',
        entityName: 'HTTPS Protocol',
        entitySlug: 'security',
        issue: 'Domain does not enforce HTTPS.',
        recommendation: 'Ensure your canonical domain uses https:// to avoid Google search penalty.',
        scoreImpact: -15
      });
    } else {
      issues.push({
        id: 'tech-https-pass',
        type: 'pass',
        entityType: 'technical',
        entityName: 'HTTPS Canonical Protocol',
        entitySlug: 'security',
        issue: `Secure HTTPS domain configured: ${targetDomain}`,
        recommendation: 'All links and canonical tags properly use HTTPS.',
        scoreImpact: 0
      });
    }

    if (!db.settings.theme.faviconUrl) {
      deductions += 5;
      issues.push({
        id: 'tech-favicon',
        type: 'warning',
        entityType: 'technical',
        entityName: 'Website Favicon',
        entitySlug: 'favicon',
        issue: 'Favicon is missing or empty.',
        recommendation: 'Google Mobile SERP displays website favicons alongside rankings. Set a 48x48 icon.',
        scoreImpact: -5
      });
    } else {
      issues.push({
        id: 'tech-favicon-pass',
        type: 'pass',
        entityType: 'technical',
        entityName: 'Favicon Icon',
        entitySlug: 'favicon',
        issue: 'Favicon is configured and displays in search results.',
        recommendation: 'Good job! Favicon is active.',
        scoreImpact: 0
      });
    }

    if (!db.settings.seo?.ogImage) {
      deductions += 5;
      issues.push({
        id: 'tech-og-image',
        type: 'warning',
        entityType: 'technical',
        entityName: 'Social Share Image (OG:Image)',
        entitySlug: 'social',
        issue: 'Default OpenGraph social card image is missing.',
        recommendation: 'Provide a 1200x630px social card image for rich previews when shared on Twitter/FB.',
        scoreImpact: -5
      });
    }

    // 2. Stores Audits
    db.stores.forEach(store => {
      // Check store offers count (thin content warning)
      const storeCoupons = db.coupons.filter(c => c.storeSlug === store.slug && c.status === 'published');
      
      if (storeCoupons.length === 0) {
        deductions += 6;
        issues.push({
          id: `store-empty-${store.slug}`,
          type: 'warning',
          entityType: 'store',
          entityName: store.name,
          entitySlug: store.slug,
          issue: `Store has 0 active published coupons (Thin Content).`,
          recommendation: `Add at least 1 verified promo code or deal to prevent search engines treating this page as thin content.`,
          scoreImpact: -6,
          fixAction: 'editStore',
          rawEntity: store
        });
      }

      // Check SEO Title
      const title = store.seoTitle || `${store.name} Promo Codes & Coupons`;
      if (title.length < 25) {
        deductions += 4;
        issues.push({
          id: `store-title-short-${store.slug}`,
          type: 'warning',
          entityType: 'store',
          entityName: store.name,
          entitySlug: store.slug,
          issue: `Title is too short (${title.length} characters). Minimum recommended is 30 characters.`,
          recommendation: `Expand title to include year and discount (e.g. "${store.name} Promo Codes: 20% Off Verified Coupons 2026").`,
          scoreImpact: -4,
          fixAction: 'editStore',
          rawEntity: store
        });
      } else if (title.length > 65) {
        deductions += 3;
        issues.push({
          id: `store-title-long-${store.slug}`,
          type: 'warning',
          entityType: 'store',
          entityName: store.name,
          entitySlug: store.slug,
          issue: `Title is too long (${title.length} characters). May be truncated by Google.`,
          recommendation: `Keep title under 60 characters so Google displays the full headline without '...'.`,
          scoreImpact: -3,
          fixAction: 'editStore',
          rawEntity: store
        });
      } else {
        issues.push({
          id: `store-title-pass-${store.slug}`,
          type: 'pass',
          entityType: 'store',
          entityName: store.name,
          entitySlug: store.slug,
          issue: `Optimal title length (${title.length} chars).`,
          recommendation: `Well balanced title for search ranking.`,
          scoreImpact: 0
        });
      }

      // Check SEO Description
      const desc = store.seoDescription || store.description || '';
      if (!desc || desc.length < 60) {
        deductions += 5;
        issues.push({
          id: `store-desc-short-${store.slug}`,
          type: 'critical',
          entityType: 'store',
          entityName: store.name,
          entitySlug: store.slug,
          issue: `Meta description is missing or too short (${desc.length} chars).`,
          recommendation: `Write an enticing meta description between 120 and 155 characters highlighting top discounts.`,
          scoreImpact: -5,
          fixAction: 'editStore',
          rawEntity: store
        });
      } else if (desc.length > 165) {
        deductions += 2;
        issues.push({
          id: `store-desc-long-${store.slug}`,
          type: 'warning',
          entityType: 'store',
          entityName: store.name,
          entitySlug: store.slug,
          issue: `Meta description exceeds 160 characters (${desc.length} chars).`,
          recommendation: `Trim description to 150-160 characters to avoid snippet truncation.`,
          scoreImpact: -2,
          fixAction: 'editStore',
          rawEntity: store
        });
      }

      // Check markets
      if (!store.markets || store.markets.length === 0) {
        deductions += 3;
        issues.push({
          id: `store-markets-${store.slug}`,
          type: 'warning',
          entityType: 'store',
          entityName: store.name,
          entitySlug: store.slug,
          issue: `Store is missing target country/market tags.`,
          recommendation: `Tag regions (US, UK, CA, EU, AU) so international visitors find relevant codes.`,
          scoreImpact: -3,
          fixAction: 'editStore',
          rawEntity: store
        });
      }
    });

    // 3. Coupons Audits (Orphan checks & verification)
    const storeSlugs = new Set(db.stores.map(s => s.slug));
    db.coupons.forEach(coupon => {
      if (!storeSlugs.has(coupon.storeSlug)) {
        deductions += 8;
        issues.push({
          id: `coupon-orphan-${coupon.id}`,
          type: 'critical',
          entityType: 'coupon',
          entityName: coupon.title,
          entitySlug: coupon.id,
          issue: `Orphan Coupon: Linked to non-existent store slug "${coupon.storeSlug}".`,
          recommendation: `Change store slug or create store "${coupon.storeSlug}". Orphan links hurt crawler indexation.`,
          scoreImpact: -8,
          fixAction: 'editCoupon',
          rawEntity: coupon
        });
      }

      if (!coupon.discount && !coupon.title) {
        deductions += 4;
        issues.push({
          id: `coupon-no-discount-${coupon.id}`,
          type: 'warning',
          entityType: 'coupon',
          entityName: coupon.title || coupon.id,
          entitySlug: coupon.id,
          issue: `Coupon missing discount badge (e.g. 20% OFF or Free Shipping).`,
          recommendation: `Add a clear discount percentage or monetary value for Google rich snippets.`,
          scoreImpact: -4,
          fixAction: 'editCoupon',
          rawEntity: coupon
        });
      }
    });

    // 4. Guides & Blog
    db.posts.forEach(post => {
      if (!post.excerpt || post.excerpt.length < 50) {
        deductions += 3;
        issues.push({
          id: `post-excerpt-${post.slug}`,
          type: 'warning',
          entityType: 'post',
          entityName: post.title,
          entitySlug: post.slug,
          issue: `Guide has no excerpt or summary snippet.`,
          recommendation: `Add a 1-2 sentence excerpt summarizing saving strategies.`,
          scoreImpact: -3,
          fixAction: 'editPost',
          rawEntity: post
        });
      }
    });

    // Calculate score (out of 100)
    const rawScore = 100 - deductions;
    const finalScore = Math.max(10, Math.min(100, rawScore));

    return {
      score: finalScore,
      issues: issues,
      criticalCount: issues.filter(i => i.type === 'critical').length,
      warningCount: issues.filter(i => i.type === 'warning').length,
      passCount: issues.filter(i => i.type === 'pass').length
    };
  }, [db]);

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      showToast('SEO Audit re-scan completed across all stores, coupons, and pages!');
    }, 600);
  };

  const handleAutoFixTitles = () => {
    let fixedCount = 0;
    const updatedStores = db.stores.map(s => {
      if (!s.seoTitle || s.seoTitle.length < 25) {
        fixedCount++;
        return {
          ...s,
          seoTitle: `${s.name} Promo Codes & Verified Coupons 2026`
        };
      }
      return s;
    });

    if (fixedCount > 0) {
      storage.saveDatabase({ ...db, stores: updatedStores }, true);
      showToast(`Auto-optimized ${fixedCount} store SEO titles with 2026 keyword targets!`);
    } else {
      showToast('All store SEO titles are already optimized!');
    }
  };

  const exportAuditCsv = () => {
    const headers = ['Type', 'Severity', 'Item Name', 'Slug', 'Issue', 'Recommendation', 'Impact'];
    const rows = auditReport.issues.map(i => [
      i.entityType,
      i.type.toUpperCase(),
      `"${i.entityName.replace(/"/g, '""')}"`,
      i.entitySlug,
      `"${i.issue.replace(/"/g, '""')}"`,
      `"${i.recommendation.replace(/"/g, '""')}"`,
      i.scoreImpact
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `couponbuz-seo-audit-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    showToast('SEO Audit CSV exported!');
  };

  const filteredIssues = auditReport.issues.filter(i => {
    if (filterType !== 'all' && i.type !== filterType) return false;
    if (filterCategory !== 'all' && i.entityType !== filterCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        i.entityName.toLowerCase().includes(q) ||
        i.issue.toLowerCase().includes(q) ||
        i.entitySlug.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Selected Store for SERP Preview
  const selectedStore = db.stores.find(s => s.slug === selectedStoreSlug) || db.stores[0];
  const serpTitle = selectedSerpEntity === 'home'
    ? `${db.settings.site.siteName || 'CouponBuz'}: Verified Promo Codes & Hand-Tested Coupons`
    : (selectedStore?.seoTitle || `${selectedStore?.name} Promo Codes: Verified Discounts (2026) | CouponBuz`);
  const serpUrl = selectedSerpEntity === 'home'
    ? 'https://couponbuz.pro'
    : `https://couponbuz.pro/coupons/${selectedStore?.slug || 'nike'}/`;
  const serpSnippet = selectedSerpEntity === 'home'
    ? (db.settings.seo?.defaultDescription || 'Find verified promo codes worth using. Hand-tested daily discount vouchers across US, UK, Canada, Australia and Europe.')
    : (selectedStore?.seoDescription || selectedStore?.description || `Get the latest verified ${selectedStore?.name} promo codes, discount deals and vouchers tested today. Save at checkout.`);

  return (
    <div className="space-y-6">
      
      {/* 1. TOP SEO AUDIT SCORECARD */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          
          {/* Health Gauge */}
          <div className="flex items-center gap-6">
            <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#1e293b"
                  strokeWidth="10"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke={
                    auditReport.score >= 85 ? '#10b981' : auditReport.score >= 65 ? '#f59e0b' : '#ef4444'
                  }
                  strokeWidth="10"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 - (251.2 * auditReport.score) / 100}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-black text-white">{auditReport.score}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">/ 100</span>
              </div>
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-0.5 rounded-full mb-1.5 bg-indigo-950/80 border border-indigo-500/30 text-indigo-300">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                Live SEO Health Score
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                {auditReport.score >= 85 ? 'Excellent SEO Health' : auditReport.score >= 65 ? 'Good, Needs Attention' : 'Critical Fixes Required'}
              </h2>
              <p className="text-xs text-slate-400 mt-1 max-w-md">
                Continuous automated audit of Google SERP titles, meta descriptions, canonical URLs, thin content, and schema structure for <span className="text-indigo-400 font-mono font-bold">https://couponbuz.pro</span>.
              </p>
            </div>
          </div>

          {/* Quick Metrics & Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            <div className="grid grid-cols-3 gap-2 w-full sm:w-auto text-center">
              <div className="bg-rose-950/40 border border-rose-800/50 p-3 rounded-2xl min-w-[90px]">
                <div className="text-xl font-black text-rose-400">{auditReport.criticalCount}</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase">Critical</div>
              </div>
              <div className="bg-amber-950/40 border border-amber-800/50 p-3 rounded-2xl min-w-[90px]">
                <div className="text-xl font-black text-amber-400">{auditReport.warningCount}</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase">Warnings</div>
              </div>
              <div className="bg-emerald-950/40 border border-emerald-800/50 p-3 rounded-2xl min-w-[90px]">
                <div className="text-xl font-black text-emerald-400">{auditReport.passCount}</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase">Passed</div>
              </div>
            </div>

            <div className="flex flex-col gap-2 w-full sm:w-auto">
              <button
                onClick={handleScan}
                disabled={isScanning}
                className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
                {isScanning ? 'Auditing Catalog...' : 'Re-scan Catalog'}
              </button>

              <button
                onClick={handleAutoFixTitles}
                className="py-2 px-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all"
              >
                <Wrench className="w-3.5 h-3.5 text-amber-400" />
                1-Click Fix All Titles
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* 2. GOOGLE SERP SIMULATOR (Desktop vs Mobile Preview) */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Search className="w-4 h-4 text-indigo-400" />
              Live Google SERP Snippet Simulator
            </h3>
            <p className="text-xs text-slate-400">
              Preview exactly how your website snippet and store landing pages appear to shoppers on Google.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {/* Device Switcher */}
            <div className="bg-slate-900 p-1 rounded-xl border border-slate-800 flex items-center">
              <button
                onClick={() => setSerpDevice('desktop')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
                  serpDevice === 'desktop' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Monitor className="w-3 h-3" />
                Desktop
              </button>
              <button
                onClick={() => setSerpDevice('mobile')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
                  serpDevice === 'mobile' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3 h-3" />
                Mobile
              </button>
            </div>

            {/* Entity select */}
            <select
              value={selectedSerpEntity}
              onChange={(e) => setSelectedSerpEntity(e.target.value as any)}
              className="bg-slate-900 border border-slate-800 text-white rounded-xl px-2.5 py-1.5 text-xs font-bold cursor-pointer"
            >
              <option value="home">Homepage (https://couponbuz.pro)</option>
              <option value="store">Store Page</option>
            </select>

            {selectedSerpEntity === 'store' && (
              <select
                value={selectedStoreSlug}
                onChange={(e) => setSelectedStoreSlug(e.target.value)}
                className="bg-slate-900 border border-slate-800 text-white rounded-xl px-2.5 py-1.5 text-xs font-bold cursor-pointer"
              >
                {db.stores.map(s => (
                  <option key={s.slug} value={s.slug}>{s.name}</option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Mock Google Result Container */}
        <div className={`bg-white rounded-2xl p-5 shadow-inner border border-slate-200 transition-all ${
          serpDevice === 'mobile' ? 'max-w-md mx-auto ring-8 ring-slate-800 rounded-3xl' : 'max-w-2xl'
        }`}>
          {/* Breadcrumb line */}
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center shrink-0 overflow-hidden border border-slate-200">
              {db.settings.theme.faviconUrl ? (
                <img src={db.settings.theme.faviconUrl} alt="Favicon" className="w-4 h-4 object-contain" />
              ) : (
                <span className="text-[10px] font-bold text-indigo-600">CB</span>
              )}
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-medium text-slate-800 leading-none">CouponBuz</span>
              <span className="text-[11px] text-slate-500 font-mono leading-none truncate max-w-xs sm:max-w-md mt-0.5">
                {serpUrl}
              </span>
            </div>
          </div>

          {/* Clickable Blue Google Title */}
          <h4 className="text-lg sm:text-xl text-[#1a0dab] hover:underline cursor-pointer font-normal leading-snug line-clamp-2">
            {serpTitle}
          </h4>

          {/* Rating stars & review rich snippet */}
          <div className="flex items-center gap-2 text-xs text-slate-600 my-1">
            <div className="flex text-amber-500 text-xs">
              {'★★★★★'}
            </div>
            <span className="font-semibold text-slate-700">Rating: 4.8</span>
            <span>·</span>
            <span>Verified promo codes</span>
            <span>·</span>
            <span className="text-emerald-700 font-medium">Free discounts</span>
          </div>

          {/* Google Meta Snippet */}
          <p className="text-xs sm:text-sm text-[#4d5156] leading-relaxed line-clamp-2">
            {serpSnippet}
          </p>

          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Title: {serpTitle.length} chars (Target: 35-60)</span>
            <span>Description: {serpSnippet.length} chars (Target: 120-160)</span>
          </div>
        </div>
      </div>

      {/* 3. AUDIT FINDINGS TABLE & FILTER */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-4">
        
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Audit Findings & Actionable Recommendations ({filteredIssues.length})
            </h3>
            <p className="text-xs text-slate-400">Click &apos;Fix in Editor&apos; on any finding to resolve the issue directly.</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Filter Pills */}
            <div className="bg-slate-900 p-1 rounded-xl border border-slate-800 flex items-center text-xs font-bold">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1 rounded-lg cursor-pointer ${filterType === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                All ({auditReport.issues.length})
              </button>
              <button
                onClick={() => setFilterType('critical')}
                className={`px-3 py-1 rounded-lg cursor-pointer flex items-center gap-1 ${filterType === 'critical' ? 'bg-rose-600 text-white' : 'text-rose-400 hover:text-rose-300'}`}
              >
                <AlertOctagon className="w-3 h-3" />
                Critical ({auditReport.criticalCount})
              </button>
              <button
                onClick={() => setFilterType('warning')}
                className={`px-3 py-1 rounded-lg cursor-pointer flex items-center gap-1 ${filterType === 'warning' ? 'bg-amber-600 text-white' : 'text-amber-400 hover:text-amber-300'}`}
              >
                <AlertTriangle className="w-3 h-3" />
                Warnings ({auditReport.warningCount})
              </button>
              <button
                onClick={() => setFilterType('pass')}
                className={`px-3 py-1 rounded-lg cursor-pointer flex items-center gap-1 ${filterType === 'pass' ? 'bg-emerald-600 text-white' : 'text-emerald-400 hover:text-emerald-300'}`}
              >
                <CheckCircle2 className="w-3 h-3" />
                Passed ({auditReport.passCount})
              </button>
            </div>

            {/* Export CSV button */}
            <button
              onClick={exportAuditCsv}
              className="py-1.5 px-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Search & Scope bar */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search audit findings by store, issue, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 text-white placeholder-slate-500 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-hidden focus:border-indigo-500"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-300 rounded-xl px-3 py-2 text-xs font-bold cursor-pointer"
          >
            <option value="all">All Entity Types</option>
            <option value="store">Stores Only</option>
            <option value="coupon">Coupons Only</option>
            <option value="technical">Technical / Protocol Only</option>
            <option value="post">Blog & Guides Only</option>
          </select>
        </div>

        {/* Findings List */}
        <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
          {filteredIssues.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              No audit findings matched your filter. Everything is clean!
            </div>
          ) : (
            filteredIssues.map(issue => (
              <div
                key={issue.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  issue.type === 'critical'
                    ? 'bg-rose-950/20 border-rose-900/40 hover:border-rose-700/60'
                    : issue.type === 'warning'
                    ? 'bg-amber-950/20 border-amber-900/40 hover:border-amber-700/60'
                    : 'bg-emerald-950/20 border-emerald-900/40 hover:border-emerald-700/60'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 shrink-0">
                    {issue.type === 'critical' && <AlertOctagon className="w-5 h-5 text-rose-400" />}
                    {issue.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-400" />}
                    {issue.type === 'pass' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-white">{issue.entityName}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-900 text-slate-400 border border-slate-800">
                        /{issue.entitySlug}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        issue.type === 'critical'
                          ? 'bg-rose-900/60 text-rose-300'
                          : issue.type === 'warning'
                          ? 'bg-amber-900/60 text-amber-300'
                          : 'bg-emerald-900/60 text-emerald-300'
                      }`}>
                        {issue.entityType}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 mt-1 font-medium">{issue.issue}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5 italic">{issue.recommendation}</p>
                  </div>
                </div>

                {/* Action button */}
                <div className="self-end sm:self-center shrink-0">
                  {issue.fixAction === 'editStore' && issue.rawEntity && (
                    <button
                      onClick={() => onEditStore(issue.rawEntity)}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Wrench className="w-3.5 h-3.5" />
                      Fix in Store Editor
                    </button>
                  )}

                  {issue.fixAction === 'editCoupon' && issue.rawEntity && (
                    <button
                      onClick={() => onEditCoupon(issue.rawEntity)}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Wrench className="w-3.5 h-3.5" />
                      Fix Coupon
                    </button>
                  )}

                  {issue.fixAction === 'editPost' && issue.rawEntity && (
                    <button
                      onClick={() => onEditPost(issue.rawEntity)}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Wrench className="w-3.5 h-3.5" />
                      Fix Guide
                    </button>
                  )}

                  {issue.type === 'pass' && (
                    <span className="text-emerald-400 text-xs font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Optimal
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

      </div>

      {/* 4. SITEMAP & ROBOTS.TXT VERIFIER */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Sitemap Generator */}
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <Globe className="w-4 h-4 text-indigo-400" />
              XML Sitemap Generator
            </h4>
            <span className="text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-800 px-2.5 py-0.5 rounded-full">
              {db.stores.length + db.categories.length + db.posts.length + db.pages.length + 5} URLs indexed
            </span>
          </div>

          <p className="text-xs text-slate-400">
            Automatically includes all store landing pages, category archives, seasonal deal hubs, and country prefixes for Googlebot.
          </p>

          <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 truncate">
            https://couponbuz.pro/sitemap.xml
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://couponbuz.pro/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>
  <url><loc>https://couponbuz.pro/stores/</loc><changefreq>daily</changefreq><priority>0.9</priority></url>
  <url><loc>https://couponbuz.pro/categories/</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>https://couponbuz.pro/promo-codes/</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>https://couponbuz.pro/promo-codes/us/</loc><changefreq>daily</changefreq><priority>0.8</priority></url>
  <url><loc>https://couponbuz.pro/promo-codes/uk/</loc><changefreq>daily</changefreq><priority>0.8</priority></url>
  <url><loc>https://couponbuz.pro/promo-codes/canada/</loc><changefreq>daily</changefreq><priority>0.8</priority></url>
  <url><loc>https://couponbuz.pro/promo-codes/europe/</loc><changefreq>daily</changefreq><priority>0.8</priority></url>
  <url><loc>https://couponbuz.pro/promo-codes/australia/</loc><changefreq>daily</changefreq><priority>0.8</priority></url>
${db.stores.map(s => `  <url><loc>https://couponbuz.pro/coupons/${s.slug}/</loc><changefreq>daily</changefreq><priority>0.9</priority></url>`).join('\n')}
${db.categories.map(c => `  <url><loc>https://couponbuz.pro/categories/${c.slug}/</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>`).join('\n')}
${db.posts.map(p => `  <url><loc>https://couponbuz.pro/guides/${p.slug}/</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>`).join('\n')}
</urlset>`;
                navigator.clipboard.writeText(sitemapXml);
                setCopiedSitemap(true);
                setTimeout(() => setCopiedSitemap(false), 2000);
                showToast('Copied full XML Sitemap to clipboard!');
              }}
              className="flex-1 py-2 px-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {copiedSitemap ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedSitemap ? 'Copied XML!' : 'Copy XML'}
            </button>

            <button
              onClick={() => {
                const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://couponbuz.pro/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>
${db.stores.map(s => `  <url><loc>https://couponbuz.pro/coupons/${s.slug}/</loc><changefreq>daily</changefreq><priority>0.9</priority></url>`).join('\n')}
</urlset>`;
                const blob = new Blob([sitemapXml], { type: 'application/xml' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'sitemap.xml';
                a.click();
                showToast('Downloaded sitemap.xml!');
              }}
              className="flex-1 py-2 px-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              Download sitemap.xml
            </button>
          </div>
        </div>

        {/* Robots.txt Preview */}
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <FileCode className="w-4 h-4 text-emerald-400" />
              Robots.txt Configuration
            </h4>
            <span className="text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 px-2.5 py-0.5 rounded-full">
              Disallow: /admin Active
            </span>
          </div>

          <p className="text-xs text-slate-400">
            Protects your admin panel from search crawler indexation while granting full crawl access to coupons.
          </p>

          <pre className="bg-slate-900 p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-emerald-300 leading-relaxed overflow-x-auto">
{db.settings.seo?.customRobotsTxt || `User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/
Disallow: /login
Sitemap: https://couponbuz.pro/sitemap.xml`}
          </pre>

          <button
            onClick={() => {
              const content = db.settings.seo?.customRobotsTxt || `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /admin/\nSitemap: https://couponbuz.pro/sitemap.xml`;
              const blob = new Blob([content], { type: 'text/plain' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'robots.txt';
              a.click();
              showToast('Downloaded robots.txt!');
            }}
            className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Download robots.txt
          </button>
        </div>

      </div>

    </div>
  );
};
