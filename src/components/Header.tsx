import React, { useState, useRef, useEffect } from 'react';
import { AppDatabase, Store } from '../data/types';
import { 
  Search, 
  Menu, 
  X, 
  ChevronDown, 
  Tag, 
  Globe, 
  Flame, 
  BookOpen, 
  Send, 
  ShieldCheck, 
  Lock,
  ExternalLink
} from 'lucide-react';

interface HeaderProps {
  db: AppDatabase;
  currentPath: string;
  navigate: (path: string) => void;
  isAdmin: boolean;
  onOpenAdminAuth: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  db,
  currentPath,
  navigate,
  isAdmin,
  onOpenAdminAuth
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const { site, theme, announcement } = {
    site: db.settings.site,
    theme: db.settings.theme,
    announcement: db.settings.theme.announcement
  };

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchResults = searchQuery.trim()
    ? db.stores
        .filter(s => s.status === 'published')
        .filter(s => 
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.category.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 6)
    : [];

  const handleSelectStore = (store: Store) => {
    setSearchQuery('');
    setIsSearchFocused(false);
    navigate(`/coupons/${store.slug}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchFocused(false);
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Generate SVG store logo letter
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
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 transition-all shadow-xs">
      {/* Announcement Bar */}
      {announcement?.enabled && announcement.text && (
        <div 
          className="text-white text-xs sm:text-sm font-medium py-2 px-4 text-center flex items-center justify-center gap-2"
          style={{ backgroundColor: announcement.bg || '#0f172a' }}
        >
          <span>{announcement.text}</span>
          {announcement.link && (
            <button 
              onClick={() => navigate(announcement.link)}
              className="underline hover:text-amber-300 font-semibold cursor-pointer transition-colors"
            >
              Learn more →
            </button>
          )}
        </div>
      )}

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-8">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-hidden"
            >
              {theme.logoUrl ? (
                <img src={theme.logoUrl} alt={site.siteName} className="h-9 w-auto object-contain rounded-md" />
              ) : (
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm"
                  style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryDark})` }}
                >
                  <Tag className="w-5 h-5 text-white" />
                </div>
              )}
              <div>
                <span className="text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {site.siteName || 'CouponBuz'}
                </span>
                <span className="hidden sm:block text-[11px] font-medium text-slate-500 leading-none">
                  Verified Promo Codes
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1">
              {/* Stores Mega Menu */}
              <div 
                className="relative"
                onMouseEnter={() => setActiveDropdown('stores')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button 
                  onClick={() => navigate('/stores/')}
                  className={`flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
                    currentPath.startsWith('/stores') || currentPath.startsWith('/coupons') 
                      ? 'text-indigo-600 bg-indigo-50' 
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Stores
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {activeDropdown === 'stores' && (
                  <div className="absolute top-full left-0 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 p-3 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                    <div className="text-xs font-semibold text-slate-400 px-3 py-1.5 uppercase tracking-wider">
                      Popular Stores
                    </div>
                    <div className="grid grid-cols-2 gap-1 mt-1">
                      {db.stores.slice(0, 8).map(store => (
                        <button
                          key={store.slug}
                          onClick={() => {
                            setActiveDropdown(null);
                            navigate(`/coupons/${store.slug}`);
                          }}
                          className="flex items-center gap-2 p-2 rounded-xl hover:bg-indigo-50 text-left text-sm font-medium text-slate-800 transition-colors cursor-pointer"
                        >
                          <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0">
                            {getInitials(store.name)}
                          </div>
                          <span className="truncate">{store.name}</span>
                        </button>
                      ))}
                    </div>
                    <div className="mt-2 pt-2 border-t border-slate-100 text-center">
                      <button
                        onClick={() => {
                          setActiveDropdown(null);
                          navigate('/stores/');
                        }}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer block w-full py-1"
                      >
                        Browse all {db.stores.length} stores A–Z →
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Categories Mega Menu */}
              <div 
                className="relative"
                onMouseEnter={() => setActiveDropdown('categories')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button 
                  onClick={() => navigate('/categories/')}
                  className={`flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
                    currentPath.startsWith('/categories') 
                      ? 'text-indigo-600 bg-indigo-50' 
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Categories
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {activeDropdown === 'categories' && (
                  <div className="absolute top-full left-0 w-96 bg-white rounded-2xl shadow-xl border border-slate-100 p-3 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                    <div className="text-xs font-semibold text-slate-400 px-3 py-1.5 uppercase tracking-wider">
                      Shop By Category
                    </div>
                    <div className="grid grid-cols-2 gap-1 mt-1">
                      {db.categories.slice(0, 10).map(cat => (
                        <button
                          key={cat.slug}
                          onClick={() => {
                            setActiveDropdown(null);
                            navigate(`/categories/${cat.slug}`);
                          }}
                          className="flex items-center gap-2 p-2 rounded-xl hover:bg-indigo-50 text-left text-sm font-medium text-slate-800 transition-colors cursor-pointer"
                        >
                          <span className="text-base">{cat.icon}</span>
                          <span className="truncate">{cat.name}</span>
                        </button>
                      ))}
                    </div>
                    <div className="mt-2 pt-2 border-t border-slate-100 text-center">
                      <button
                        onClick={() => {
                          setActiveDropdown(null);
                          navigate('/categories/');
                        }}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer block w-full py-1"
                      >
                        All Categories ({db.categories.length}) →
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Countries / Regions */}
              <button 
                onClick={() => navigate('/promo-codes/')}
                className={`flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
                  currentPath.startsWith('/promo-codes') 
                    ? 'text-indigo-600 bg-indigo-50' 
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Globe className="w-4 h-4 text-slate-500" />
                Countries
              </button>

              {/* Seasonal Deals */}
              <button 
                onClick={() => navigate('/deals/black-friday/')}
                className={`flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
                  currentPath.startsWith('/deals') 
                    ? 'text-amber-600 bg-amber-50' 
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Flame className="w-4 h-4 text-amber-500" />
                Deals
              </button>

              {/* Guides */}
              <button 
                onClick={() => navigate('/guides/')}
                className={`flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
                  currentPath.startsWith('/guides') 
                    ? 'text-indigo-600 bg-indigo-50' 
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <BookOpen className="w-4 h-4 text-slate-500" />
                Guides
              </button>
            </nav>
          </div>

          {/* Search & Actions */}
          <div className="flex items-center gap-3">
            {/* Live Search Input */}
            <div ref={searchRef} className="relative hidden md:block w-56 lg:w-72">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  placeholder="Search stores or brands..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  className="w-full bg-slate-100 text-slate-900 pl-10 pr-4 py-2 text-sm rounded-full border border-transparent focus:border-indigo-400 focus:bg-white focus:outline-hidden transition-all shadow-inner"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </form>

              {/* Search Suggestions Dropdown */}
              {isSearchFocused && searchQuery.trim() && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-50 animate-in fade-in duration-100">
                  {searchResults.length > 0 ? (
                    <div>
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1">
                        Matching Stores
                      </div>
                      {searchResults.map(store => (
                        <button
                          key={store.slug}
                          onClick={() => handleSelectStore(store)}
                          className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-indigo-50 text-left transition-colors cursor-pointer group"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                              {getInitials(store.name)}
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-slate-900">{store.name}</div>
                              <div className="text-xs text-slate-500">{store.domain}</div>
                            </div>
                          </div>
                          <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                            View offers →
                          </span>
                        </button>
                      ))}
                      <button
                        onClick={handleSearchSubmit}
                        className="w-full text-center text-xs font-bold text-indigo-600 pt-2 pb-1 border-t border-slate-100 block hover:underline cursor-pointer"
                      >
                        View all results for "{searchQuery}"
                      </button>
                    </div>
                  ) : (
                    <div className="p-4 text-center text-sm text-slate-500">
                      No stores found matching "{searchQuery}"
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Submit Coupon CTA button */}
            <button
              onClick={() => navigate('/submit-coupon/')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-full border border-indigo-200 transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              Submit Code
            </button>

            {/* Admin Badge / Trigger (Hidden CMS entrypoint) */}
            {isAdmin ? (
              <button
                onClick={() => navigate('/admin')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-full shadow-sm cursor-pointer transition-colors"
                title="Open Admin CMS"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                CMS Active
              </button>
            ) : (
              <button
                onClick={onOpenAdminAuth}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
                title="Admin Login (Staff only)"
                aria-label="Admin Login"
              >
                <Lock className="w-4 h-4" />
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-4 shadow-xl animate-in slide-in-from-top-2">
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search stores or brands..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 text-slate-900 pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-hidden"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </form>

          <nav className="grid grid-cols-2 gap-2 text-sm font-semibold">
            <button
              onClick={() => { setMobileMenuOpen(false); navigate('/stores/'); }}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 text-slate-800 hover:bg-indigo-50 hover:text-indigo-600 text-left cursor-pointer"
            >
              <Tag className="w-4 h-4 text-indigo-500" />
              All Stores
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); navigate('/categories/'); }}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 text-slate-800 hover:bg-indigo-50 hover:text-indigo-600 text-left cursor-pointer"
            >
              <span className="text-base">🛍️</span>
              Categories
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); navigate('/promo-codes/'); }}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 text-slate-800 hover:bg-indigo-50 hover:text-indigo-600 text-left cursor-pointer"
            >
              <Globe className="w-4 h-4 text-blue-500" />
              Countries
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); navigate('/deals/black-friday/'); }}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 text-slate-800 hover:bg-amber-50 hover:text-amber-600 text-left cursor-pointer"
            >
              <Flame className="w-4 h-4 text-amber-500" />
              Black Friday
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); navigate('/guides/'); }}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 text-slate-800 hover:bg-indigo-50 hover:text-indigo-600 text-left cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-purple-500" />
              Guides
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); navigate('/submit-coupon/'); }}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-left cursor-pointer"
            >
              <Send className="w-4 h-4 text-indigo-600" />
              Submit Code
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};
