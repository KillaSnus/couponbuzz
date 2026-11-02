import React, { useState, useRef, useEffect } from 'react';
import { AppDatabase, Store, Coupon, Category, Post, Page, Collection, Submission, MediaItem } from '../data/types';
import { storage, SyncStatus } from '../services/storage';
import { 
  LayoutDashboard, 
  Store as StoreIcon, 
  Tag, 
  FolderTree, 
  Calendar, 
  BookOpen, 
  FileText, 
  Inbox, 
  Image as ImageIcon, 
  ArrowUpDown, 
  Sliders, 
  Code, 
  Settings, 
  ExternalLink, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  Upload, 
  Download, 
  ShieldCheck, 
  LogOut, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  Search,
  Eye,
  RefreshCw,
  Copy,
  Globe,
  Flame,
  Wrench,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { SeoStudio } from './SeoStudio';
import { SeoAuditTool } from './SeoAuditTool';

interface AdminDashboardProps {
  db: AppDatabase;
  navigate: (path: string) => void;
  onLogout: () => void;
}

type TabType = 
  | 'dashboard' 
  | 'stores' 
  | 'coupons' 
  | 'categories' 
  | 'seasonal' 
  | 'posts' 
  | 'pages' 
  | 'submissions' 
  | 'media' 
  | 'csvexport' 
  | 'theme' 
  | 'seo'
  | 'audit'
  | 'code' 
  | 'settings';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  db,
  navigate,
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(() => storage.getSyncStatus());

  useEffect(() => {
    return storage.subscribeSyncStatus((status) => {
      setSyncStatus({ ...status });
    });
  }, []);

  // Search & Filters inside CMS tables
  const [tableSearch, setTableSearch] = useState('');

  // Active Modals
  const [editingStore, setEditingStore] = useState<Store | null>(null);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);

  // CSV Import & Media upload file input refs
  const storesFileRef = useRef<HTMLInputElement>(null);
  const couponsFileRef = useRef<HTMLInputElement>(null);
  const categoriesFileRef = useRef<HTMLInputElement>(null);
  const backupFileRef = useRef<HTMLInputElement>(null);
  const logoFileRef = useRef<HTMLInputElement>(null);
  const faviconFileRef = useRef<HTMLInputElement>(null);
  const heroFileRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const pendingSubmissions = db.submissions.filter(s => s.status === 'pending');

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row font-sans">
      
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 font-bold text-sm animate-in slide-in-from-top-3">
          <CheckCircle2 className="w-5 h-5 text-white" />
          {toastMessage}
        </div>
      )}

      {/* SHOPIFY-STYLE SIDEBAR */}
      <aside className="w-full md:w-64 bg-slate-950 border-r border-slate-800/80 flex flex-col shrink-0">
        
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white flex items-center justify-center font-bold shadow-md">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-sm tracking-tight text-white">CouponBuz</div>
              <div className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                Instant Live CMS
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto text-xs font-semibold">
          
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors cursor-pointer ${
              activeTab === 'dashboard' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 pt-4 pb-1">
            Catalog & Offers
          </div>

          <button
            onClick={() => { setActiveTab('stores'); setTableSearch(''); }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors cursor-pointer ${
              activeTab === 'stores' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <StoreIcon className="w-4 h-4" />
              <span>Stores</span>
            </div>
            <span className="text-[11px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full">
              {db.stores.length}
            </span>
          </button>

          <button
            onClick={() => { setActiveTab('coupons'); setTableSearch(''); }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors cursor-pointer ${
              activeTab === 'coupons' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <Tag className="w-4 h-4" />
              <span>Coupons & Deals</span>
            </div>
            <span className="text-[11px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full">
              {db.coupons.length}
            </span>
          </button>

          <button
            onClick={() => { setActiveTab('categories'); setTableSearch(''); }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors cursor-pointer ${
              activeTab === 'categories' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <FolderTree className="w-4 h-4" />
              <span>Categories</span>
            </div>
            <span className="text-[11px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full">
              {db.categories.length}
            </span>
          </button>

          <button
            onClick={() => { setActiveTab('seasonal'); setTableSearch(''); }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors cursor-pointer ${
              activeTab === 'seasonal' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4" />
              <span>Seasonal Deals</span>
            </div>
            <span className="text-[11px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full">
              {db.collections.length}
            </span>
          </button>

          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 pt-4 pb-1">
            Content & Moderation
          </div>

          <button
            onClick={() => { setActiveTab('submissions'); setTableSearch(''); }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors cursor-pointer ${
              activeTab === 'submissions' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <Inbox className="w-4 h-4" />
              <span>Submissions</span>
            </div>
            {pendingSubmissions.length > 0 && (
              <span className="text-[11px] bg-amber-500 text-slate-950 font-black px-2 py-0.5 rounded-full">
                {pendingSubmissions.length} new
              </span>
            )}
          </button>

          <button
            onClick={() => { setActiveTab('posts'); setTableSearch(''); }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors cursor-pointer ${
              activeTab === 'posts' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <BookOpen className="w-4 h-4" />
              <span>Guides & Blog</span>
            </div>
            <span className="text-[11px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full">
              {db.posts.length}
            </span>
          </button>

          <button
            onClick={() => { setActiveTab('pages'); setTableSearch(''); }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors cursor-pointer ${
              activeTab === 'pages' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <FileText className="w-4 h-4" />
              <span>Custom Pages</span>
            </div>
            <span className="text-[11px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full">
              {db.pages.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('media')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors cursor-pointer ${
              activeTab === 'media' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <ImageIcon className="w-4 h-4" />
              <span>Media Library</span>
            </div>
            <span className="text-[11px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full">
              {db.media.length}
            </span>
          </button>

          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 pt-4 pb-1">
            Data & Customization
          </div>

          <button
            onClick={() => setActiveTab('csvexport')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors cursor-pointer ${
              activeTab === 'csvexport' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <ArrowUpDown className="w-4 h-4" />
            <span>CSV Import / Export</span>
          </button>

          <button
            onClick={() => setActiveTab('theme')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors cursor-pointer ${
              activeTab === 'theme' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Website Customizer</span>
          </button>

          <button
            onClick={() => setActiveTab('seo')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors cursor-pointer ${
              activeTab === 'seo' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <Globe className="w-4 h-4 text-indigo-400" />
              <span>SEO & Domain</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-800">
              .pro
            </span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors cursor-pointer ${
              activeTab === 'audit' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>SEO Audit Studio</span>
            </div>
            <span className="text-[10px] font-black text-white bg-indigo-600 px-2 py-0.5 rounded-md">
              Score
            </span>
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors cursor-pointer ${
              activeTab === 'code' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Code className="w-4 h-4" />
            <span>Custom Code & Head</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors cursor-pointer ${
              activeTab === 'settings' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Settings & Security</span>
          </button>
        </nav>

        {/* Footer info & Logout */}
        <div className="p-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center font-bold text-white text-[11px]">
              AD
            </div>
            <span>Admin</span>
          </div>
          <button
            onClick={onLogout}
            className="p-1.5 hover:text-rose-400 hover:bg-slate-900 rounded-lg transition-colors cursor-pointer"
            title="Lock & Exit CMS"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* MAIN ADMIN WORKSPACE */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-900 overflow-y-auto">
        
        {/* Top Navbar */}
        <header className="h-16 border-b border-slate-800/80 px-6 flex items-center justify-between gap-4 bg-slate-950/50 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-bold text-white">
              {activeTab === 'csvexport' ? 'CSV Import & Export Studio' : 
               activeTab === 'theme' ? 'Website Customizer & Branding' :
               activeTab === 'seo' ? 'SEO & Domain Studio (https://couponbuz.pro)' :
               activeTab === 'audit' ? 'SEO Audit & Optimization Studio' :
               activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h2>
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              {syncStatus.rtdbActive ? 'Firebase Realtime Live' : 'Firebase Cloud Sync'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* View Live Website Button */}
            <button
              onClick={() => navigate('/')}
              className="px-3.5 py-2 text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Eye className="w-3.5 h-3.5 text-indigo-400" />
              <span>View Live Website</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-6 sm:p-8 flex-1 max-w-7xl w-full mx-auto space-y-6">
          
          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              
              {/* Quick Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 shadow-xs">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Stores</div>
                  <div className="text-3xl font-black text-white mt-2">{db.stores.length}</div>
                  <div className="text-xs text-indigo-400 mt-1 font-semibold">{db.stores.filter(s => s.featured).length} featured on homepage</div>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 shadow-xs">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Coupons & Deals</div>
                  <div className="text-3xl font-black text-white mt-2">{db.coupons.length}</div>
                  <div className="text-xs text-emerald-400 mt-1 font-semibold">{db.coupons.filter(c => c.verified).length} verified working</div>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 shadow-xs">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Submissions</div>
                  <div className="text-3xl font-black text-amber-400 mt-2">{pendingSubmissions.length}</div>
                  <div className="text-xs text-slate-400 mt-1">Awaiting editorial review</div>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 shadow-xs">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Categories & Hubs</div>
                  <div className="text-3xl font-black text-white mt-2">{db.categories.length + db.collections.length}</div>
                  <div className="text-xs text-slate-400 mt-1">Multi-country supported</div>
                </div>
              </div>

              {/* Quick Action Shortcuts */}
              <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
                  Quick Management Actions
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <button
                    onClick={() => {
                      setEditingStore({
                        slug: '',
                        name: '',
                        domain: '',
                        category: 'fashion',
                        markets: ['US', 'UK', 'CA', 'EU'],
                        status: 'published',
                        description: '',
                        tips: []
                      });
                      setActiveTab('stores');
                    }}
                    className="p-4 rounded-2xl bg-slate-900 hover:bg-indigo-600/30 border border-slate-800 hover:border-indigo-500 text-left transition-all cursor-pointer group"
                  >
                    <Plus className="w-5 h-5 text-indigo-400 mb-2 group-hover:scale-110 transition-transform" />
                    <div className="font-bold text-sm text-white">Add New Store</div>
                    <div className="text-xs text-slate-400">Create brand listing</div>
                  </button>

                  <button
                    onClick={() => {
                      setEditingCoupon({
                        id: `c-${Date.now().toString(36)}`,
                        storeSlug: db.stores[0]?.slug || 'nike',
                        title: '',
                        type: 'code',
                        code: '',
                        discount: '20% OFF',
                        description: '',
                        markets: ['US', 'UK', 'CA', 'EU'],
                        status: 'published',
                        verified: true,
                        verifiedAt: new Date().toISOString().slice(0, 10)
                      });
                      setActiveTab('coupons');
                    }}
                    className="p-4 rounded-2xl bg-slate-900 hover:bg-amber-600/30 border border-slate-800 hover:border-amber-500 text-left transition-all cursor-pointer group"
                  >
                    <Plus className="w-5 h-5 text-amber-400 mb-2 group-hover:scale-110 transition-transform" />
                    <div className="font-bold text-sm text-white">Add Coupon Code</div>
                    <div className="text-xs text-slate-400">Post verified discount</div>
                  </button>

                  <button
                    onClick={() => setActiveTab('csvexport')}
                    className="p-4 rounded-2xl bg-slate-900 hover:bg-emerald-600/30 border border-slate-800 hover:border-emerald-500 text-left transition-all cursor-pointer group"
                  >
                    <Upload className="w-5 h-5 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
                    <div className="font-bold text-sm text-white">Bulk CSV Import</div>
                    <div className="text-xs text-slate-400">Stores or coupons</div>
                  </button>

                  <button
                    onClick={() => setActiveTab('theme')}
                    className="p-4 rounded-2xl bg-slate-900 hover:bg-purple-600/30 border border-slate-800 hover:border-purple-500 text-left transition-all cursor-pointer group"
                  >
                    <Sliders className="w-5 h-5 text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
                    <div className="font-bold text-sm text-white">Customize Website</div>
                    <div className="text-xs text-slate-400">Theme, logo & layout</div>
                  </button>
                </div>
              </div>

              {/* Pending Submissions Quick Preview */}
              {pendingSubmissions.length > 0 && (
                <div className="bg-amber-950/30 border border-amber-600/30 rounded-3xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Inbox className="w-5 h-5 text-amber-400" />
                      <h3 className="font-bold text-amber-200">
                        Visitor Coupon Submissions Ready for Review ({pendingSubmissions.length})
                      </h3>
                    </div>
                    <button
                      onClick={() => setActiveTab('submissions')}
                      className="text-xs font-bold text-amber-400 hover:underline cursor-pointer"
                    >
                      Open Submissions Queue →
                    </button>
                  </div>
                  <div className="space-y-2">
                    {pendingSubmissions.slice(0, 3).map(sub => (
                      <div key={sub.id} className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-white text-sm">{sub.store}: {sub.title}</div>
                          <div className="text-xs text-slate-400">Code: <code className="text-amber-400">{sub.code || 'Deal'}</code> • Submitted {sub.createdAt.slice(0, 10)}</div>
                        </div>
                        <button
                          onClick={() => {
                            storage.approveSubmissionToCoupon(sub);
                            showToast(`Approved & published offer for ${sub.store}!`);
                          }}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold cursor-pointer"
                        >
                          Approve & Publish Live
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 2: STORES MANAGER */}
          {activeTab === 'stores' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="relative w-full sm:w-80">
                  <input
                    type="text"
                    placeholder="Search stores..."
                    value={tableSearch}
                    onChange={(e) => setTableSearch(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl pl-9 pr-4 py-2.5 focus:outline-hidden focus:border-indigo-500"
                  />
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>

                <button
                  onClick={() => setEditingStore({
                    slug: '',
                    name: '',
                    domain: '',
                    category: 'fashion',
                    markets: ['US', 'UK', 'CA', 'EU'],
                    status: 'published',
                    description: '',
                    tips: []
                  })}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add New Store
                </button>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800 uppercase tracking-wider font-bold">
                    <tr>
                      <th className="p-4">Store</th>
                      <th className="p-4">Domain</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Markets</th>
                      <th className="p-4">Offers</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {db.stores
                      .filter(s => s.name.toLowerCase().includes(tableSearch.toLowerCase()) || s.domain.toLowerCase().includes(tableSearch.toLowerCase()))
                      .map(store => {
                        const count = db.coupons.filter(c => c.storeSlug === store.slug).length;
                        return (
                          <tr key={store.slug} className="hover:bg-slate-900/40">
                            <td className="p-4 font-bold text-white flex items-center gap-2">
                              <span>{store.name}</span>
                              {store.featured && (
                                <span className="text-[10px] bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded">Featured</span>
                              )}
                            </td>
                            <td className="p-4 text-slate-400">{store.domain}</td>
                            <td className="p-4 capitalize text-indigo-400 font-semibold">{store.category}</td>
                            <td className="p-4 text-[11px] font-mono">{(store.markets || []).join(', ')}</td>
                            <td className="p-4 font-bold text-emerald-400">{count}</td>
                            <td className="p-4">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                store.status === 'published' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-800 text-slate-400'
                              }`}>
                                {store.status}
                              </span>
                            </td>
                            <td className="p-4 text-right space-x-2">
                              <button
                                onClick={() => setEditingStore({ ...store })}
                                className="p-1.5 text-indigo-400 hover:text-indigo-300 hover:bg-slate-800 rounded-lg cursor-pointer"
                                title="Edit Store"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Delete store ${store.name} and all its coupons?`)) {
                                    storage.deleteStore(store.slug);
                                    showToast(`Store ${store.name} deleted.`);
                                  }
                                }}
                                className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-slate-800 rounded-lg cursor-pointer"
                                title="Delete Store"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: COUPONS MANAGER */}
          {activeTab === 'coupons' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="relative w-full sm:w-80">
                  <input
                    type="text"
                    placeholder="Search by title, code or store..."
                    value={tableSearch}
                    onChange={(e) => setTableSearch(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl pl-9 pr-4 py-2.5 focus:outline-hidden focus:border-indigo-500"
                  />
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>

                <button
                  onClick={() => setEditingCoupon({
                    id: `c-${Date.now().toString(36)}`,
                    storeSlug: db.stores[0]?.slug || 'nike',
                    title: '',
                    type: 'code',
                    code: '',
                    discount: '20% OFF',
                    description: '',
                    markets: ['US', 'UK', 'CA', 'EU'],
                    status: 'published',
                    verified: true,
                    verifiedAt: new Date().toISOString().slice(0, 10)
                  })}
                  className="px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add Coupon / Deal
                </button>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800 uppercase tracking-wider font-bold">
                    <tr>
                      <th className="p-4">Store</th>
                      <th className="p-4">Offer Title</th>
                      <th className="p-4">Type</th>
                      <th className="p-4">Code / Discount</th>
                      <th className="p-4">Expires</th>
                      <th className="p-4">Verified</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {db.coupons
                      .filter(c => 
                        c.title.toLowerCase().includes(tableSearch.toLowerCase()) || 
                        c.storeSlug.toLowerCase().includes(tableSearch.toLowerCase()) ||
                        c.code.toLowerCase().includes(tableSearch.toLowerCase())
                      )
                      .map(coupon => (
                        <tr key={coupon.id} className="hover:bg-slate-900/40">
                          <td className="p-4 font-bold text-white uppercase text-[11px]">{coupon.storeSlug}</td>
                          <td className="p-4 font-semibold text-slate-200 max-w-xs truncate">{coupon.title}</td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              coupon.type === 'code' ? 'bg-amber-500/20 text-amber-300' : 'bg-blue-500/20 text-blue-300'
                            }`}>
                              {coupon.type}
                            </span>
                          </td>
                          <td className="p-4 font-mono font-bold text-white">
                            {coupon.code ? (
                              <span className="bg-slate-800 px-2 py-1 rounded text-amber-400">{coupon.code}</span>
                            ) : (
                              <span className="text-slate-400">{coupon.discount}</span>
                            )}
                          </td>
                          <td className="p-4 text-slate-400">{coupon.expires || 'Ongoing'}</td>
                          <td className="p-4">
                            {coupon.verified ? (
                              <span className="text-emerald-400 font-bold flex items-center gap-1">
                                <Check className="w-3.5 h-3.5" /> Checked
                              </span>
                            ) : (
                              <span className="text-slate-500">Unverified</span>
                            )}
                          </td>
                          <td className="p-4 text-right space-x-2">
                            <button
                              onClick={() => setEditingCoupon({ ...coupon })}
                              className="p-1.5 text-indigo-400 hover:text-indigo-300 hover:bg-slate-800 rounded-lg cursor-pointer"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Delete coupon "${coupon.title}"?`)) {
                                  storage.deleteCoupon(coupon.id);
                                  showToast('Coupon removed.');
                                }
                              }}
                              className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-slate-800 rounded-lg cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: CATEGORIES MANAGER */}
          {activeTab === 'categories' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-white">Categories ({db.categories.length})</h3>
                <button
                  onClick={() => setEditingCategory({
                    slug: '',
                    name: '',
                    icon: '🛍️',
                    description: '',
                    status: 'published'
                  })}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Category
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {db.categories.map(cat => (
                  <div key={cat.slug} className="bg-slate-950 border border-slate-800 rounded-3xl p-5 flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">{cat.icon}</span>
                      <div>
                        <div className="font-bold text-white text-sm">{cat.name}</div>
                        <div className="text-xs text-indigo-400 font-mono mt-0.5">/{cat.slug}</div>
                        <p className="text-xs text-slate-400 mt-2 line-clamp-2">{cat.description}</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => setEditingCategory({ ...cat })}
                        className="p-1.5 text-indigo-400 hover:text-indigo-300 hover:bg-slate-900 rounded-lg cursor-pointer"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete category ${cat.name}?`)) {
                            storage.deleteCategory(cat.slug);
                            showToast('Category deleted.');
                          }
                        }}
                        className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-slate-900 rounded-lg cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: SUBMISSIONS MODERATION */}
          {activeTab === 'submissions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white text-lg">Submissions & Messages</h3>
                  <p className="text-xs text-slate-400">Review coupons sent by visitors and direct messages from the contact form.</p>
                </div>
              </div>

              {db.submissions.length === 0 ? (
                <div className="bg-slate-950 border border-slate-800 rounded-3xl p-12 text-center text-slate-400 text-xs">
                  No submissions yet. Submissions from /submit-coupon/ and /contact/ appear here instantly.
                </div>
              ) : (
                <div className="space-y-3">
                  {db.submissions.map(sub => (
                    <div key={sub.id} className="bg-slate-950 border border-slate-800 rounded-3xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                            sub.status === 'pending' ? 'bg-amber-400 text-slate-950' : sub.status === 'approved' ? 'bg-emerald-950 text-emerald-400' : 'bg-slate-800 text-slate-400'
                          }`}>
                            {sub.status}
                          </span>
                          <span className="font-bold text-white text-sm">{sub.store || sub.title}</span>
                          {sub.code && <code className="text-xs bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-amber-400 font-mono">{sub.code}</code>}
                        </div>
                        <div className="text-xs text-slate-300 font-semibold">{sub.title}</div>
                        {sub.description && <p className="text-xs text-slate-400">{sub.description}</p>}
                        <div className="text-[11px] text-slate-500">
                          {sub.email && <span>From: {sub.email} • </span>}
                          <span>Submitted: {sub.createdAt.slice(0, 10)}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {sub.status === 'pending' && (
                          <button
                            onClick={() => {
                              storage.approveSubmissionToCoupon(sub);
                              showToast(`Approved & published offer for ${sub.store}!`);
                            }}
                            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            Approve to Live Site
                          </button>
                        )}
                        <button
                          onClick={() => {
                            storage.deleteSubmission(sub.id);
                            showToast('Submission removed.');
                          }}
                          className="p-2 text-rose-400 hover:bg-slate-900 rounded-xl cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 6: CSV IMPORT & EXPORT STUDIO */}
          {activeTab === 'csvexport' && (
            <div className="space-y-6">
              <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-2">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ArrowUpDown className="w-5 h-5 text-indigo-400" />
                  CSV Importer & Exporter
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
                  Import and export your store catalog, verified coupons, categories, and submissions in standard CSV format, compatible with Microsoft Excel, Google Sheets, and Shopify.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* 1. Stores CSV */}
                <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-950 text-indigo-400 flex items-center justify-center font-bold">
                      <StoreIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">Stores ({db.stores.length})</h4>
                      <p className="text-xs text-slate-400">Slug, Name, Domain, Category, Markets, Tips</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const csv = storage.exportStoresCSV();
                        const blob = new Blob([csv], { type: 'text/csv' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `couponbuz-stores-${new Date().toISOString().slice(0, 10)}.csv`;
                        a.click();
                        showToast('Stores CSV exported!');
                      }}
                      className="flex-1 py-2.5 px-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Download className="w-4 h-4 text-indigo-400" />
                      Export Stores CSV
                    </button>

                    <button
                      onClick={() => storesFileRef.current?.click()}
                      className="flex-1 py-2.5 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                    >
                      <Upload className="w-4 h-4" />
                      Import Stores CSV
                    </button>
                    <input
                      ref={storesFileRef}
                      type="file"
                      accept=".csv"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (evt) => {
                            const content = evt.target?.result as string;
                            const res = storage.importStoresCSV(content);
                            showToast(`Imported ${res.imported} store(s) instantly!`);
                          };
                          reader.readAsText(file);
                        }
                      }}
                    />
                  </div>
                </div>

                {/* 2. Coupons CSV */}
                <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-950 text-amber-400 flex items-center justify-center font-bold">
                      <Tag className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">Coupons & Deals ({db.coupons.length})</h4>
                      <p className="text-xs text-slate-400">Title, Store, Code, Discount, Expiry, Markets</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const csv = storage.exportCouponsCSV();
                        const blob = new Blob([csv], { type: 'text/csv' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `couponbuz-coupons-${new Date().toISOString().slice(0, 10)}.csv`;
                        a.click();
                        showToast('Coupons CSV exported!');
                      }}
                      className="flex-1 py-2.5 px-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Download className="w-4 h-4 text-amber-400" />
                      Export Coupons CSV
                    </button>

                    <button
                      onClick={() => couponsFileRef.current?.click()}
                      className="flex-1 py-2.5 px-3 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                    >
                      <Upload className="w-4 h-4" />
                      Import Coupons CSV
                    </button>
                    <input
                      ref={couponsFileRef}
                      type="file"
                      accept=".csv"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (evt) => {
                            const content = evt.target?.result as string;
                            const res = storage.importCouponsCSV(content);
                            showToast(`Imported ${res.imported} coupon(s) instantly!`);
                          };
                          reader.readAsText(file);
                        }
                      }}
                    />
                  </div>
                </div>

                {/* 3. Categories CSV */}
                <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-purple-950 text-purple-400 flex items-center justify-center font-bold">
                      <FolderTree className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">Categories ({db.categories.length})</h4>
                      <p className="text-xs text-slate-400">Slug, Name, Icon, Description</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const csv = storage.exportCategoriesCSV();
                        const blob = new Blob([csv], { type: 'text/csv' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `couponbuz-categories.csv`;
                        a.click();
                        showToast('Categories CSV exported!');
                      }}
                      className="flex-1 py-2.5 px-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Download className="w-4 h-4 text-purple-400" />
                      Export Categories
                    </button>

                    <button
                      onClick={() => categoriesFileRef.current?.click()}
                      className="flex-1 py-2.5 px-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                    >
                      <Upload className="w-4 h-4" />
                      Import Categories
                    </button>
                    <input
                      ref={categoriesFileRef}
                      type="file"
                      accept=".csv"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (evt) => {
                            const content = evt.target?.result as string;
                            const res = storage.importCategoriesCSV(content);
                            showToast(`Imported ${res.imported} category/categories!`);
                          };
                          reader.readAsText(file);
                        }
                      }}
                    />
                  </div>
                </div>

                {/* 4. Complete Database Backup / Restore JSON */}
                <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-950 text-emerald-400 flex items-center justify-center font-bold">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">Full Website Snapshot (JSON)</h4>
                      <p className="text-xs text-slate-400">Stores, coupons, pages, themes, and settings</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const json = storage.exportFullBackupJSON();
                        const blob = new Blob([json], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `couponbuz-full-backup-${new Date().toISOString().slice(0, 10)}.json`;
                        a.click();
                        showToast('Full backup downloaded!');
                      }}
                      className="flex-1 py-2.5 px-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Download className="w-4 h-4 text-emerald-400" />
                      Backup All
                    </button>

                    <button
                      onClick={() => backupFileRef.current?.click()}
                      className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                    >
                      <Upload className="w-4 h-4" />
                      Restore All
                    </button>
                    <input
                      ref={backupFileRef}
                      type="file"
                      accept=".json"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (evt) => {
                            const content = evt.target?.result as string;
                            if (storage.importFullBackupJSON(content)) {
                              showToast('Full website restored & live!');
                            } else {
                              alert('Invalid backup file.');
                            }
                          };
                          reader.readAsText(file);
                        }
                      }}
                    />
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 7: WEBSITE CUSTOMIZER & BRANDING (Shopify-like Theme & Layout Editor) */}
          {activeTab === 'theme' && (
            <div className="space-y-6">
              
              {/* 1. LOGO & FAVICON STUDIO */}
              <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-indigo-400" />
                    Branding, Logo & Favicon Customizer
                  </h3>
                  <p className="text-xs text-slate-400">
                    Upload your store logo and browser tab favicon. Updates publish instantly to the live header and footer.
                  </p>
                </div>

                {/* Mock Browser Tab Preview for Favicon */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Live Browser Tab Preview
                  </div>
                  <div className="bg-slate-950 rounded-xl border border-slate-800 p-2 max-w-sm flex items-center gap-2 shadow-inner">
                    <div className="w-5 h-5 rounded-md flex items-center justify-center shrink-0 bg-slate-900 overflow-hidden border border-slate-800">
                      {db.settings.theme.faviconUrl ? (
                        <img src={db.settings.theme.faviconUrl} alt="Favicon" className="w-4 h-4 object-contain" />
                      ) : (
                        <Tag className="w-3.5 h-3.5 text-indigo-400" />
                      )}
                    </div>
                    <span className="text-xs font-medium text-slate-200 truncate flex-1">
                      {db.settings.theme.logoText || db.settings.site.siteName || 'CouponBuz'} - Verified Promo Codes
                    </span>
                    <button className="text-slate-600 hover:text-slate-400 text-xs px-1">×</button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Logo Controls */}
                  <div className="space-y-4 bg-slate-900/60 p-5 rounded-2xl border border-slate-800/80">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">Website Header Logo</h4>
                      {db.settings.theme.logoUrl && (
                        <button
                          onClick={() => {
                            storage.updateSettings({ theme: { ...db.settings.theme, logoUrl: '' } });
                            showToast('Cleared custom logo. Reverted to stylish default badge.');
                          }}
                          className="text-[11px] text-rose-400 hover:underline cursor-pointer"
                        >
                          Reset to Default
                        </button>
                      )}
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">Logo Image URL</label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          placeholder="https://... or upload below"
                          value={db.settings.theme.logoUrl || ''}
                          onChange={(e) => storage.updateSettings({
                            theme: { ...db.settings.theme, logoUrl: e.target.value.trim() }
                          })}
                          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-indigo-500 font-mono"
                        />
                        <button
                          onClick={() => logoFileRef.current?.click()}
                          className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0"
                        >
                          <Upload className="w-3.5 h-3.5" /> Upload
                        </button>
                        <input
                          ref={logoFileRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (evt) => {
                                const dataUrl = evt.target?.result as string;
                                storage.updateSettings({ theme: { ...db.settings.theme, logoUrl: dataUrl } });
                                showToast('Uploaded new logo image!');
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 mb-1">Brand Name Text</label>
                        <input
                          type="text"
                          value={db.settings.theme.logoText || ''}
                          placeholder={db.settings.site.siteName || 'CouponBuz'}
                          onChange={(e) => storage.updateSettings({
                            theme: { ...db.settings.theme, logoText: e.target.value }
                          })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="text-[11px] font-bold text-slate-400">Height: {db.settings.theme.logoHeight || 36}px</label>
                        </div>
                        <input
                          type="range"
                          min="24"
                          max="56"
                          value={db.settings.theme.logoHeight || 36}
                          onChange={(e) => storage.updateSettings({
                            theme: { ...db.settings.theme, logoHeight: parseInt(e.target.value) }
                          })}
                          className="w-full cursor-pointer accent-indigo-500"
                        />
                      </div>
                    </div>

                    {/* Live Header Logo Preview */}
                    <div className="pt-2 border-t border-slate-800/80">
                      <div className="text-[10px] font-bold text-slate-500 uppercase mb-2">Live Header Preview</div>
                      <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center gap-3">
                        {db.settings.theme.logoUrl ? (
                          <img 
                            src={db.settings.theme.logoUrl} 
                            alt="Logo preview" 
                            style={{ height: `${db.settings.theme.logoHeight || 36}px` }} 
                            className="w-auto object-contain rounded-md" 
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-sm">
                            <Tag className="w-5 h-5" />
                          </div>
                        )}
                        <div>
                          <div className="font-extrabold text-slate-900 text-sm leading-tight">
                            {db.settings.theme.logoText || db.settings.site.siteName || 'CouponBuz'}
                          </div>
                          <div className="text-[10px] text-slate-500 font-medium">Verified Promo Codes</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Favicon Controls */}
                  <div className="space-y-4 bg-slate-900/60 p-5 rounded-2xl border border-slate-800/80">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">Browser Favicon</h4>
                      <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800">
                        Live Synced to Tab
                      </span>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">Favicon URL or SVG Data</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="data:image/... or URL"
                          value={db.settings.theme.faviconUrl || ''}
                          onChange={(e) => storage.updateSettings({
                            theme: { ...db.settings.theme, faviconUrl: e.target.value.trim() }
                          })}
                          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-indigo-500 font-mono text-ellipsis"
                        />
                        <button
                          onClick={() => faviconFileRef.current?.click()}
                          className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0"
                        >
                          <Upload className="w-3.5 h-3.5" /> Upload
                        </button>
                        <input
                          ref={faviconFileRef}
                          type="file"
                          accept=".svg,.png,.ico,.jpg"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (evt) => {
                                const dataUrl = evt.target?.result as string;
                                storage.updateSettings({ theme: { ...db.settings.theme, faviconUrl: dataUrl } });
                                showToast('Favicon updated and active in browser tab!');
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </div>
                    </div>

                    {/* Quick Presets */}
                    <div>
                      <div className="text-[11px] font-bold text-slate-400 mb-2">1-Click Favicon Presets</div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <button
                          onClick={() => {
                            const svg = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%234f46e5'><path d='M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8 8a2 2 0 0 0 2.828 0l7.172-7.172a2 2 0 0 0 0-2.828l-8-8zM7 9a2 2 0 1 1 0-4 2 2 0 0 1 0 4z'/></svg>";
                            storage.updateSettings({ theme: { ...db.settings.theme, faviconUrl: svg } });
                            showToast('Applied Indigo Coupon Tag Favicon!');
                          }}
                          className="p-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-[11px] font-bold text-slate-300 flex items-center gap-1.5 cursor-pointer"
                        >
                          <Tag className="w-3.5 h-3.5 text-indigo-400" />
                          Tag Icon
                        </button>

                        <button
                          onClick={() => {
                            const svg = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ea580c'><path d='M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z'/></svg>";
                            storage.updateSettings({ theme: { ...db.settings.theme, faviconUrl: svg } });
                            showToast('Applied Hot Deals Flame Favicon!');
                          }}
                          className="p-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-[11px] font-bold text-slate-300 flex items-center gap-1.5 cursor-pointer"
                        >
                          <Flame className="w-3.5 h-3.5 text-orange-500" />
                          Hot Flame
                        </button>

                        <button
                          onClick={() => {
                            const svg = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2310b981'><path d='m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z'/></svg>";
                            storage.updateSettings({ theme: { ...db.settings.theme, faviconUrl: svg } });
                            showToast('Applied Emerald Sparkle Favicon!');
                          }}
                          className="p-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-[11px] font-bold text-slate-300 flex items-center gap-1.5 cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                          Sparkle
                        </button>

                        <button
                          onClick={() => {
                            const svg = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%233b82f6'><path d='M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3.8 6l1.5-2h13.4l1.5 2zM16 10a4 4 0 0 1-8 0'/></svg>";
                            storage.updateSettings({ theme: { ...db.settings.theme, faviconUrl: svg } });
                            showToast('Applied Blue Shopping Bag Favicon!');
                          }}
                          className="p-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-[11px] font-bold text-slate-300 flex items-center gap-1.5 cursor-pointer"
                        >
                          <StoreIcon className="w-3.5 h-3.5 text-blue-400" />
                          Shopping Bag
                        </button>
                      </div>
                    </div>

                    <div className="pt-2 text-[11px] text-slate-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      Dynamically updates the browser tab in real time with zero page refresh.
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. HERO SECTION & HERO IMAGE CUSTOMIZER */}
              <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-amber-400" />
                      Home Hero Section & Section Images
                    </h3>
                    <p className="text-xs text-slate-400">
                      Customize the main homepage headline, subtitle, hero background image, or featured banner.
                    </p>
                  </div>
                </div>

                {(() => {
                  const heroSec = db.settings.home.sections.find(s => s.type === 'hero') || {
                    type: 'hero',
                    enabled: true,
                    title: 'Find verified promo codes worth using',
                    subtitle: 'Browse thousands of hand-tested discount vouchers across US, UK, Canada, Australia and Europe.'
                  };

                  return (
                    <div className="space-y-4 pt-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-400 mb-1">Hero Main Headline</label>
                          <input
                            type="text"
                            value={heroSec.title || ''}
                            onChange={(e) => {
                              const updated = db.settings.home.sections.map(s => 
                                s.type === 'hero' ? { ...s, title: e.target.value } : s
                              );
                              storage.updateSettings({ home: { sections: updated } });
                            }}
                            className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-3 py-2 text-xs font-bold focus:outline-hidden focus:border-indigo-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-400 mb-1">Hero Background Style</label>
                          <select
                            value={db.settings.theme.heroStyle || 'gradient'}
                            onChange={(e) => storage.updateSettings({
                              theme: { ...db.settings.theme, heroStyle: e.target.value }
                            })}
                            className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-3 py-2 text-xs font-bold cursor-pointer"
                          >
                            <option value="gradient">Modern Radial Indigo/Amber Gradient</option>
                            <option value="image">Custom Background Image (Full Cover Overlay)</option>
                            <option value="split">Split Layout (Headline Left, Hero Image Card Right)</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1">Hero Subtitle Paragraph</label>
                        <textarea
                          rows={2}
                          value={heroSec.subtitle || ''}
                          onChange={(e) => {
                            const updated = db.settings.home.sections.map(s => 
                              s.type === 'hero' ? { ...s, subtitle: e.target.value } : s
                            );
                            storage.updateSettings({ home: { sections: updated } });
                          }}
                          className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl p-3 text-xs focus:outline-hidden focus:border-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1">Hero Featured Image URL</label>
                        <div className="flex gap-2">
                          <input
                            type="url"
                            placeholder="https://images.unsplash.com/... or upload"
                            value={db.settings.theme.heroImageUrl || ''}
                            onChange={(e) => storage.updateSettings({
                              theme: { ...db.settings.theme, heroImageUrl: e.target.value.trim() }
                            })}
                            className="flex-1 bg-slate-900 border border-slate-800 text-white rounded-xl px-3 py-2 text-xs font-mono"
                          />
                          <button
                            onClick={() => heroFileRef.current?.click()}
                            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0"
                          >
                            <Upload className="w-3.5 h-3.5" /> Upload Image
                          </button>
                          <input
                            ref={heroFileRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (evt) => {
                                  const dataUrl = evt.target?.result as string;
                                  storage.updateSettings({
                                    theme: { ...db.settings.theme, heroImageUrl: dataUrl, heroStyle: 'split' }
                                  });
                                  showToast('Hero image uploaded!');
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </div>
                        {db.settings.theme.heroImageUrl && (
                          <div className="mt-2 relative w-48 h-24 rounded-xl overflow-hidden border border-slate-800">
                            <img src={db.settings.theme.heroImageUrl} alt="Hero Preview" className="w-full h-full object-cover" />
                            <button
                              onClick={() => storage.updateSettings({ theme: { ...db.settings.theme, heroImageUrl: '' } })}
                              className="absolute top-1 right-1 bg-black/70 text-rose-400 p-1 rounded-md text-[10px]"
                            >
                              Remove
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* 3. THEME PALETTE & ANNOUNCEMENT BAR */}
              <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
                <h3 className="text-base font-bold text-white mb-2">Palette Colors & Announcement Bar</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Primary Brand Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={db.settings.theme.primary}
                        onChange={(e) => storage.updateSettings({ theme: { ...db.settings.theme, primary: e.target.value } })}
                        className="w-10 h-10 rounded-xl bg-transparent border-0 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={db.settings.theme.primary}
                        onChange={(e) => storage.updateSettings({ theme: { ...db.settings.theme, primary: e.target.value } })}
                        className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white flex-1"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Accent Button Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={db.settings.theme.accent}
                        onChange={(e) => storage.updateSettings({ theme: { ...db.settings.theme, accent: e.target.value } })}
                        className="w-10 h-10 rounded-xl bg-transparent border-0 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={db.settings.theme.accent}
                        onChange={(e) => storage.updateSettings({ theme: { ...db.settings.theme, accent: e.target.value } })}
                        className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white flex-1"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">Announcement Banner</h4>
                      <p className="text-xs text-slate-400">Top promotional bar shown across the entire website.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={db.settings.theme.announcement?.enabled}
                      onChange={(e) => storage.updateSettings({
                        theme: {
                          ...db.settings.theme,
                          announcement: { ...db.settings.theme.announcement, enabled: e.target.checked }
                        }
                      })}
                      className="w-5 h-5 rounded text-indigo-600 cursor-pointer"
                    />
                  </div>

                  {db.settings.theme.announcement?.enabled && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1">Announcement Text</label>
                        <input
                          type="text"
                          value={db.settings.theme.announcement.text}
                          onChange={(e) => storage.updateSettings({
                            theme: {
                              ...db.settings.theme,
                              announcement: { ...db.settings.theme.announcement, text: e.target.value }
                            }
                          })}
                          className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-3 py-2 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1">Target Link</label>
                        <input
                          type="text"
                          value={db.settings.theme.announcement.link}
                          onChange={(e) => storage.updateSettings({
                            theme: {
                              ...db.settings.theme,
                              announcement: { ...db.settings.theme.announcement, link: e.target.value }
                            }
                          })}
                          className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-3 py-2 text-xs"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 4. HEADER NAVIGATION MENU EDITOR */}
              <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white">Header Navigation Links</h3>
                    <p className="text-xs text-slate-400">Edit the top navbar menu links and reorder them live.</p>
                  </div>
                  <button
                    onClick={() => {
                      const label = prompt('Enter link label (e.g. "Exclusive Deals"):');
                      const url = prompt('Enter link URL (e.g. "/deals/"):', '/deals/');
                      if (label && url) {
                        const updatedNav = [...db.settings.nav.header, { label: label.trim(), url: url.trim(), type: 'link' as const }];
                        storage.updateSettings({ nav: { ...db.settings.nav, header: updatedNav } });
                        showToast('Navigation link added!');
                      }
                    }}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Menu Item
                  </button>
                </div>

                <div className="space-y-2">
                  {db.settings.nav.header.map((item, idx) => (
                    <div key={idx} className="bg-slate-900 p-3 rounded-2xl border border-slate-800 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3">
                        <span className="text-slate-500 font-mono font-bold">{idx + 1}</span>
                        <div>
                          <div className="text-white font-bold">{item.label}</div>
                          <div className="text-slate-400 font-mono text-[11px]">{item.url}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {idx > 0 && (
                          <button
                            onClick={() => {
                              const updated = [...db.settings.nav.header];
                              const temp = updated[idx];
                              updated[idx] = updated[idx - 1];
                              updated[idx - 1] = temp;
                              storage.updateSettings({ nav: { ...db.settings.nav, header: updated } });
                            }}
                            className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg cursor-pointer"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {idx < db.settings.nav.header.length - 1 && (
                          <button
                            onClick={() => {
                              const updated = [...db.settings.nav.header];
                              const temp = updated[idx];
                              updated[idx] = updated[idx + 1];
                              updated[idx + 1] = temp;
                              storage.updateSettings({ nav: { ...db.settings.nav, header: updated } });
                            }}
                            className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg cursor-pointer"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => {
                            if (confirm(`Remove "${item.label}" from navigation?`)) {
                              const updated = db.settings.nav.header.filter((_, i) => i !== idx);
                              storage.updateSettings({ nav: { ...db.settings.nav, header: updated } });
                              showToast('Menu item removed.');
                            }
                          }}
                          className="p-1 text-rose-400 hover:text-rose-300 hover:bg-slate-800 rounded-lg cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. HOME PAGE SECTIONS ORDER & TOGGLE */}
              <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
                <h3 className="text-base font-bold text-white mb-2">Home Page Sections Visibility</h3>
                <p className="text-xs text-slate-400 mb-4">Toggle visible sections on the homepage live.</p>
                
                <div className="space-y-2">
                  {db.settings.home.sections.map((section, idx) => (
                    <div key={idx} className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-slate-500 font-bold">{idx + 1}</span>
                        <div>
                          <div className="font-bold text-xs text-white capitalize">{section.title || section.type}</div>
                          <div className="text-[11px] text-slate-400">Type: {section.type}</div>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={section.enabled !== false}
                        onChange={(e) => {
                          const updated = [...db.settings.home.sections];
                          updated[idx] = { ...section, enabled: e.target.checked };
                          storage.updateSettings({ home: { sections: updated } });
                          showToast(`Updated section: ${section.type}`);
                        }}
                        className="w-4 h-4 rounded text-indigo-600 cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB: SEO & DOMAIN STUDIO */}
          {activeTab === 'seo' && (
            <SeoStudio db={db} showToast={showToast} />
          )}

          {/* TAB: SEO AUDIT & OPTIMIZATION STUDIO */}
          {activeTab === 'audit' && (
            <SeoAuditTool
              db={db}
              onEditStore={(store) => setEditingStore({ ...store })}
              onEditCoupon={(coupon) => setEditingCoupon({ ...coupon })}
              onEditPage={(page) => setEditingPage({ ...page })}
              onEditPost={(post) => setEditingPost({ ...post })}
              showToast={showToast}
            />
          )}

          {/* TAB 8: CUSTOM CODE */}
          {activeTab === 'code' && (
            <div className="space-y-6">
              <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-4">
                <h3 className="text-base font-bold text-white">Custom Scripts & HTML Injection</h3>
                <p className="text-xs text-slate-400">
                  Insert Google Analytics, Google Tag Manager, custom CSS, or header tags safely.
                </p>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Code in &lt;head&gt;</label>
                  <textarea
                    rows={4}
                    value={db.settings.code.head}
                    onChange={(e) => storage.updateSettings({ code: { ...db.settings.code, head: e.target.value } })}
                    className="w-full bg-slate-900 border border-slate-800 font-mono text-xs text-indigo-300 p-3 rounded-xl focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Custom CSS</label>
                  <textarea
                    rows={4}
                    value={db.settings.code.css}
                    onChange={(e) => storage.updateSettings({ code: { ...db.settings.code, css: e.target.value } })}
                    className="w-full bg-slate-900 border border-slate-800 font-mono text-xs text-amber-300 p-3 rounded-xl focus:outline-hidden"
                  />
                </div>

                <button
                  onClick={() => showToast('Custom code saved and applied to live site!')}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Save Code Changes
                </button>
              </div>
            </div>
          )}

          {/* TAB 9: SETTINGS & SECURITY */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-4">
                <h3 className="text-base font-bold text-white">General Site Settings</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Site Name</label>
                    <input
                      type="text"
                      value={db.settings.site.siteName}
                      onChange={(e) => storage.updateSettings({ site: { ...db.settings.site, siteName: e.target.value } })}
                      className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-3 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Contact Email</label>
                    <input
                      type="email"
                      value={db.settings.site.email}
                      onChange={(e) => storage.updateSettings({ site: { ...db.settings.site, email: e.target.value } })}
                      className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-3 py-2 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Affiliate Disclosure Text</label>
                  <textarea
                    rows={2}
                    value={db.settings.site.disclosure}
                    onChange={(e) => storage.updateSettings({ site: { ...db.settings.site, disclosure: e.target.value } })}
                    className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl p-3 text-xs"
                  />
                </div>
              </div>

              {/* Security & PIN */}
              <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-amber-400" />
                  CMS Security & Admin PIN
                </h3>
                <p className="text-xs text-slate-400">
                  Protect this CMS from the public. Only users with this PIN can unlock the admin dashboard.
                </p>

                <div className="max-w-xs">
                  <label className="block text-xs font-bold text-slate-400 mb-1">Admin Access PIN</label>
                  <input
                    type="text"
                    value={db.settings.security?.adminPin || 'admin123'}
                    onChange={(e) => storage.updateSettings({
                      security: { ...db.settings.security, adminPin: e.target.value }
                    })}
                    className="w-full bg-slate-900 border border-slate-800 font-mono text-white rounded-xl px-3 py-2 text-sm font-bold"
                  />
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-xs text-white">Reset Catalog to Starter Seed</div>
                    <div className="text-[11px] text-slate-500">Restore default demo stores and verified coupons</div>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm('Reset all catalog data to default starter seed?')) {
                        storage.resetToFactorySeed();
                        showToast('Reset to factory seed!');
                      }
                    }}
                    className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Factory Reset
                  </button>
                </div>
              </div>

              {/* Firebase Cloud & Cloudflare Deployment Status */}
              <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                      🔥
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">Firebase & Cloudflare Integration</h3>
                      <p className="text-xs text-slate-400">Live multi-user cloud datastore and deployment status</p>
                    </div>
                  </div>

                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    Live Connected
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                    <div className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Firebase Project ID</div>
                    <div className="text-white font-mono font-bold">couponbuz</div>
                  </div>

                  <div className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                    <div className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Realtime Database URL</div>
                    <div className="text-white font-mono font-bold truncate">https://couponbuz-default-rtdb.firebaseio.com</div>
                  </div>

                  <div className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                    <div className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Auth Domain</div>
                    <div className="text-white font-mono font-bold">couponbuz.firebaseapp.com</div>
                  </div>

                  <div className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                    <div className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Cloudflare Deployment</div>
                    <div className="text-emerald-400 font-bold flex items-center gap-1">
                      <span>✓ GitHub Auto-Deploy Ready (Vite / dist)</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => {
                      storage.saveDatabase(db, true);
                      showToast('Pushed all stores, coupons & settings to Firebase Realtime Database!');
                    }}
                    className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Force Sync All Data to Firebase Cloud
                  </button>

                  <a
                    href="https://dash.cloudflare.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-bold border border-slate-800 flex items-center justify-center gap-2"
                  >
                    <span>Open Cloudflare Pages Dashboard</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* TAB 10: MEDIA LIBRARY */}
          {activeTab === 'media' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-white">Media Library ({db.media.length})</h3>
                  <p className="text-xs text-slate-400">Upload images or add external CDN image URLs.</p>
                </div>
                <button
                  onClick={() => {
                    const url = prompt('Enter image URL:');
                    if (url) {
                      storage.addMedia({
                        id: `m-${Date.now()}`,
                        name: 'Uploaded Image',
                        url: url.trim(),
                        type: 'image/jpeg',
                        createdAt: new Date().toISOString()
                      });
                      showToast('Media added!');
                    }
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Image URL
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {db.media.map(item => (
                  <div key={item.id} className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden group">
                    <img src={item.url} alt={item.name} className="w-full h-36 object-cover" />
                    <div className="p-3 flex items-center justify-between">
                      <span className="text-xs font-bold text-white truncate max-w-[120px]">{item.name}</span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(item.url);
                            showToast('Image URL copied to clipboard!');
                          }}
                          className="p-1 hover:text-indigo-400 cursor-pointer"
                          title="Copy Link"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            storage.deleteMedia(item.id);
                            showToast('Image removed.');
                          }}
                          className="p-1 hover:text-rose-400 cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 11: GUIDES & BLOG */}
          {activeTab === 'posts' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-white">Saving Guides & Articles ({db.posts.length})</h3>
                <button
                  onClick={() => setEditingPost({
                    slug: '',
                    title: '',
                    excerpt: '',
                    author: 'CouponBuz Team',
                    date: new Date().toISOString().slice(0, 10),
                    status: 'published',
                    body: ''
                  })}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Guide
                </button>
              </div>

              <div className="space-y-3">
                {db.posts.map(post => (
                  <div key={post.slug} className="bg-slate-950 border border-slate-800 rounded-3xl p-5 flex items-center justify-between gap-4">
                    <div>
                      <div className="font-bold text-white text-sm">{post.title}</div>
                      <div className="text-xs text-slate-400 mt-0.5">By {post.author} • {post.date} • /{post.slug}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingPost({ ...post })}
                        className="p-2 text-indigo-400 hover:bg-slate-900 rounded-xl cursor-pointer"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete post "${post.title}"?`)) {
                            storage.deletePost(post.slug);
                            showToast('Post deleted.');
                          }
                        }}
                        className="p-2 text-rose-400 hover:bg-slate-900 rounded-xl cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 12: PAGES MANAGER */}
          {activeTab === 'pages' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-white">Custom Pages ({db.pages.length})</h3>
                <button
                  onClick={() => setEditingPage({
                    slug: '',
                    title: '',
                    status: 'published',
                    body: ''
                  })}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Page
                </button>
              </div>

              <div className="space-y-3">
                {db.pages.map(page => (
                  <div key={page.slug} className="bg-slate-950 border border-slate-800 rounded-3xl p-5 flex items-center justify-between gap-4">
                    <div>
                      <div className="font-bold text-white text-sm">{page.title}</div>
                      <div className="text-xs text-slate-400 mt-0.5">URL: /{page.slug}/</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingPage({ ...page })}
                        className="p-2 text-indigo-400 hover:bg-slate-900 rounded-xl cursor-pointer"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete page "${page.title}"?`)) {
                            storage.deletePage(page.slug);
                            showToast('Page deleted.');
                          }
                        }}
                        className="p-2 text-rose-400 hover:bg-slate-900 rounded-xl cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 13: SEASONAL EVENTS */}
          {activeTab === 'seasonal' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-white">Seasonal Hubs ({db.collections.length})</h3>
                <button
                  onClick={() => setEditingCollection({
                    slug: '',
                    name: '',
                    status: 'published',
                    stores: ['nike', 'best-buy'],
                    intro: '',
                    body: ''
                  })}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Event Hub
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {db.collections.map(col => (
                  <div key={col.slug} className="bg-slate-950 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between">
                    <div>
                      <div className="font-bold text-white text-base">{col.name}</div>
                      <div className="text-xs text-indigo-400 font-mono mt-0.5">/deals/{col.slug}/</div>
                      <p className="text-xs text-slate-400 mt-2">{col.intro}</p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between items-center">
                      <span className="text-xs text-slate-500">{col.stores?.length || 0} stores</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingCollection({ ...col })}
                          className="p-1.5 text-indigo-400 hover:bg-slate-900 rounded-lg cursor-pointer"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete event ${col.name}?`)) {
                              storage.deleteCollection(col.slug);
                              showToast('Event removed.');
                            }
                          }}
                          className="p-1.5 text-rose-400 hover:bg-slate-900 rounded-lg cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>

      {/* --- EDIT STORE MODAL --- */}
      {editingStore && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 text-white space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-base">{editingStore.slug ? 'Edit Store' : 'Add New Store'}</h3>
              <button onClick={() => setEditingStore(null)} className="text-slate-400 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Store Name</label>
              <input
                type="text"
                required
                value={editingStore.name}
                onChange={(e) => {
                  const name = e.target.value;
                  const slug = editingStore.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                  setEditingStore({ ...editingStore, name, slug });
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">URL Slug</label>
                <input
                  type="text"
                  required
                  value={editingStore.slug}
                  onChange={(e) => setEditingStore({ ...editingStore, slug: e.target.value.toLowerCase() })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Domain</label>
                <input
                  type="text"
                  required
                  placeholder="example.com"
                  value={editingStore.domain}
                  onChange={(e) => setEditingStore({ ...editingStore, domain: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Category</label>
                <select
                  value={editingStore.category}
                  onChange={(e) => setEditingStore({ ...editingStore, category: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white"
                >
                  {db.categories.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Status</label>
                <select
                  value={editingStore.status}
                  onChange={(e) => setEditingStore({ ...editingStore, status: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Affiliate Link</label>
              <input
                type="url"
                placeholder="https://merchant.affiliate.com"
                value={editingStore.affiliateUrl || ''}
                onChange={(e) => setEditingStore({ ...editingStore, affiliateUrl: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Short Description</label>
              <textarea
                rows={3}
                value={editingStore.description}
                onChange={(e) => setEditingStore({ ...editingStore, description: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={editingStore.featured}
                onChange={(e) => setEditingStore({ ...editingStore, featured: e.target.checked })}
                className="w-4 h-4 rounded text-indigo-600"
              />
              <span className="text-xs text-slate-300 font-semibold">Feature on Home Page</span>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  if (editingStore.name && editingStore.slug) {
                    storage.updateStore(editingStore);
                    setEditingStore(null);
                    showToast(`Saved ${editingStore.name} to live website!`);
                  }
                }}
                className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-bold cursor-pointer"
              >
                Save & Publish Instantly
              </button>
              <button
                onClick={() => setEditingStore(null)}
                className="py-3 px-4 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- EDIT COUPON MODAL --- */}
      {editingCoupon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 text-white space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-base">Edit Coupon / Offer</h3>
              <button onClick={() => setEditingCoupon(null)} className="text-slate-400 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Store</label>
              <select
                value={editingCoupon.storeSlug}
                onChange={(e) => setEditingCoupon({ ...editingCoupon, storeSlug: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white capitalize"
              >
                {db.stores.map(s => <option key={s.slug} value={s.slug}>{s.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Offer Title</label>
              <input
                type="text"
                required
                value={editingCoupon.title}
                onChange={(e) => setEditingCoupon({ ...editingCoupon, title: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Type</label>
                <select
                  value={editingCoupon.type}
                  onChange={(e) => setEditingCoupon({ ...editingCoupon, type: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white"
                >
                  <option value="code">Promo Code</option>
                  <option value="deal">Automatic Deal</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Discount Tag</label>
                <input
                  type="text"
                  placeholder="e.g. 20% OFF"
                  value={editingCoupon.discount}
                  onChange={(e) => setEditingCoupon({ ...editingCoupon, discount: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white"
                />
              </div>
            </div>

            {editingCoupon.type === 'code' && (
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Promo Code</label>
                <input
                  type="text"
                  value={editingCoupon.code}
                  onChange={(e) => setEditingCoupon({ ...editingCoupon, code: e.target.value.toUpperCase() })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm font-mono text-amber-400 uppercase"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Expiry Date</label>
              <input
                type="date"
                value={editingCoupon.expires || ''}
                onChange={(e) => setEditingCoupon({ ...editingCoupon, expires: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Terms / Exclusions</label>
              <textarea
                rows={2}
                value={editingCoupon.terms || ''}
                onChange={(e) => setEditingCoupon({ ...editingCoupon, terms: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white"
              />
            </div>

            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingCoupon.verified}
                  onChange={(e) => setEditingCoupon({ ...editingCoupon, verified: e.target.checked })}
                  className="w-4 h-4 rounded text-emerald-500"
                />
                <span className="text-xs text-slate-300 font-semibold">Mark Verified Active</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingCoupon.featured}
                  onChange={(e) => setEditingCoupon({ ...editingCoupon, featured: e.target.checked })}
                  className="w-4 h-4 rounded text-indigo-500"
                />
                <span className="text-xs text-slate-300 font-semibold">Feature on Home</span>
              </label>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  if (editingCoupon.title && editingCoupon.storeSlug) {
                    storage.updateCoupon(editingCoupon);
                    setEditingCoupon(null);
                    showToast('Coupon updated & live instantly!');
                  }
                }}
                className="flex-1 py-3 bg-amber-600 hover:bg-amber-500 rounded-xl text-xs font-bold cursor-pointer"
              >
                Save & Publish
              </button>
              <button
                onClick={() => setEditingCoupon(null)}
                className="py-3 px-4 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- EDIT CATEGORY MODAL --- */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 text-white space-y-4">
            <h3 className="font-bold text-base">Category Editor</h3>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Name</label>
              <input
                type="text"
                value={editingCategory.name}
                onChange={(e) => {
                  const name = e.target.value;
                  const slug = editingCategory.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                  setEditingCategory({ ...editingCategory, name, slug });
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Emoji Icon</label>
              <input
                type="text"
                value={editingCategory.icon}
                onChange={(e) => setEditingCategory({ ...editingCategory, icon: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xl text-center"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Description</label>
              <textarea
                rows={3}
                value={editingCategory.description}
                onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  if (editingCategory.name && editingCategory.slug) {
                    storage.updateCategory(editingCategory);
                    setEditingCategory(null);
                    showToast('Category saved!');
                  }
                }}
                className="flex-1 py-2.5 bg-indigo-600 rounded-xl text-xs font-bold cursor-pointer"
              >
                Save
              </button>
              <button onClick={() => setEditingCategory(null)} className="py-2.5 px-3 bg-slate-800 rounded-xl text-xs font-bold cursor-pointer">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- EDIT GUIDE POST MODAL --- */}
      {editingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 text-white space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-base">Guide & Article Editor</h3>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Title</label>
              <input
                type="text"
                value={editingPost.title}
                onChange={(e) => {
                  const title = e.target.value;
                  const slug = editingPost.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                  setEditingPost({ ...editingPost, title, slug });
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Excerpt</label>
              <textarea
                rows={2}
                value={editingPost.excerpt}
                onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Cover Image URL</label>
              <input
                type="url"
                value={editingPost.image || ''}
                onChange={(e) => setEditingPost({ ...editingPost, image: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Content Body (Markdown)</label>
              <textarea
                rows={8}
                value={editingPost.body}
                onChange={(e) => setEditingPost({ ...editingPost, body: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 font-mono rounded-xl p-3 text-xs text-white"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  if (editingPost.title && editingPost.slug) {
                    storage.updatePost(editingPost);
                    setEditingPost(null);
                    showToast('Guide published live!');
                  }
                }}
                className="flex-1 py-3 bg-indigo-600 rounded-xl text-xs font-bold cursor-pointer"
              >
                Publish Guide
              </button>
              <button onClick={() => setEditingPost(null)} className="py-3 px-4 bg-slate-800 rounded-xl text-xs font-bold cursor-pointer">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- EDIT CUSTOM PAGE MODAL --- */}
      {editingPage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 text-white space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-base">Custom Page Editor</h3>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Title</label>
              <input
                type="text"
                value={editingPage.title}
                onChange={(e) => {
                  const title = e.target.value;
                  const slug = editingPage.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                  setEditingPage({ ...editingPage, title, slug });
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">URL Slug</label>
              <input
                type="text"
                value={editingPage.slug}
                onChange={(e) => setEditingPage({ ...editingPage, slug: e.target.value.toLowerCase() })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Page Body Content</label>
              <textarea
                rows={10}
                value={editingPage.body}
                onChange={(e) => setEditingPage({ ...editingPage, body: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 font-mono rounded-xl p-3 text-xs text-white"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  if (editingPage.title && editingPage.slug) {
                    storage.updatePage(editingPage);
                    setEditingPage(null);
                    showToast('Page updated live!');
                  }
                }}
                className="flex-1 py-3 bg-indigo-600 rounded-xl text-xs font-bold cursor-pointer"
              >
                Save Page
              </button>
              <button onClick={() => setEditingPage(null)} className="py-3 px-4 bg-slate-800 rounded-xl text-xs font-bold cursor-pointer">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- EDIT SEASONAL COLLECTION MODAL --- */}
      {editingCollection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 text-white space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-base">Seasonal Hub Editor</h3>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Event Name</label>
              <input
                type="text"
                value={editingCollection.name}
                onChange={(e) => {
                  const name = e.target.value;
                  const slug = editingCollection.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                  setEditingCollection({ ...editingCollection, name, slug });
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Intro Summary</label>
              <textarea
                rows={2}
                value={editingCollection.intro || ''}
                onChange={(e) => setEditingCollection({ ...editingCollection, intro: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Article Body</label>
              <textarea
                rows={6}
                value={editingCollection.body || ''}
                onChange={(e) => setEditingCollection({ ...editingCollection, body: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 font-mono rounded-xl p-3 text-xs text-white"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  if (editingCollection.name && editingCollection.slug) {
                    storage.updateCollection(editingCollection);
                    setEditingCollection(null);
                    showToast('Event hub published live!');
                  }
                }}
                className="flex-1 py-3 bg-indigo-600 rounded-xl text-xs font-bold cursor-pointer"
              >
                Save Event
              </button>
              <button onClick={() => setEditingCollection(null)} className="py-3 px-4 bg-slate-800 rounded-xl text-xs font-bold cursor-pointer">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
