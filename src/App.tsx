import React, { useState, useEffect } from 'react';
import { AppDatabase, Coupon, Store } from './data/types';
import { storage } from './services/storage';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { RevealModal } from './components/RevealModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AiBot } from './components/AiBot';

// Views
import { HomeView } from './views/HomeView';
import { StoresView } from './views/StoresView';
import { StoreDetailView } from './views/StoreDetailView';
import { CategoriesView } from './views/CategoriesView';
import { RegionsView } from './views/RegionsView';
import { SeasonalView } from './views/SeasonalView';
import { GuidesView } from './views/GuidesView';
import { SubmitCouponView } from './views/SubmitCouponView';
import { PageView } from './views/PageView';
import { SearchView } from './views/SearchView';

// Admin CMS
import { AdminDashboard } from './admin/AdminDashboard';
import { LoginPanelView } from './admin/LoginPanelView';

export function App() {
  const [db, setDb] = useState<AppDatabase>(() => storage.getDatabase());
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });
  const [isAdmin, setIsAdmin] = useState<boolean>(() => storage.isAdminAuthenticated());
  const [showAdminAuthModal, setShowAdminAuthModal] = useState<boolean>(false);

  // Active coupon reveal modal
  const [revealedOffer, setRevealedOffer] = useState<{ coupon: Coupon; store?: Store } | null>(null);

  // Subscribe to storage updates for instant live sync
  useEffect(() => {
    const unsubscribe = storage.subscribe((newDb) => {
      setDb({ ...newDb });
    });
    return unsubscribe;
  }, []);

  // Synchronize dynamic favicon
  useEffect(() => {
    const faviconUrl = db.settings.theme.faviconUrl;
    if (faviconUrl) {
      let link: HTMLLinkElement | null = document.getElementById('app-favicon') as HTMLLinkElement | null;
      if (!link) {
        link = document.querySelector("link[rel*='icon']");
      }
      if (!link) {
        link = document.createElement('link');
        link.id = 'app-favicon';
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = faviconUrl;
    }
  }, [db.settings.theme.faviconUrl]);

  // Listen to browser navigation
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
      checkHash();
    };

    const checkHash = () => {
      if (window.location.hash.startsWith('#o-')) {
        const id = window.location.hash.slice(3);
        const c = db.coupons.find((x) => x.id === id);
        if (c) {
          const s = db.stores.find((st) => st.slug === c.storeSlug);
          setRevealedOffer({ coupon: c, store: s });
        }
      } else if (window.location.hash === '#/admin' || window.location.hash === '#admin') {
        navigate('/admin');
      }
    };

    window.addEventListener('popstate', handlePopState);
    checkHash();
    return () => window.removeEventListener('popstate', handlePopState);
  }, [db]);

  // Navigate helper
  const navigate = (path: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.history.pushState(null, '', path);
    setCurrentPath(path);
  };

  const handleRevealOffer = (coupon: Coupon, store?: Store) => {
    const s = store || db.stores.find((st) => st.slug === coupon.storeSlug);
    setRevealedOffer({ coupon, store: s });
    window.history.replaceState(null, '', `#o-${coupon.id}`);

    // If openOnReveal is enabled in CMS settings, open store in a new tab
    if (db.settings.site.openOnReveal && s) {
      const url = coupon.url || s.affiliateUrl || `https://${s.domain}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleCloseReveal = () => {
    setRevealedOffer(null);
    if (window.location.hash.startsWith('#o-')) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  };

  // Check if viewing Admin CMS or Login panel
  const pathClean = currentPath.toLowerCase().replace(/\/$/, '') || '/';
  const isAdminRoute = pathClean === '/admin' || pathClean.startsWith('/admin/') || pathClean === '/login';

  // If on admin route and authenticated, show Admin Dashboard
  if (isAdminRoute && isAdmin) {
    return (
      <AdminDashboard
        db={db}
        navigate={navigate}
        onLogout={() => {
          storage.logoutAdmin();
          setIsAdmin(false);
          navigate('/');
        }}
      />
    );
  }

  // If on admin route and NOT authenticated, show dedicated Login Panel View
  if (isAdminRoute && !isAdmin) {
    return (
      <LoginPanelView
        db={db}
        navigate={navigate}
        onLoginSuccess={() => {
          setIsAdmin(true);
        }}
      />
    );
  }

  // Determine current public view based on URL path
  const renderView = () => {
    // Normalise path
    const path = currentPath.toLowerCase().replace(/\/$/, '') || '/';

    if (path === '' || path === '/') {
      return <HomeView db={db} navigate={navigate} onRevealOffer={handleRevealOffer} />;
    }

    if (path === '/stores') {
      return <StoresView db={db} navigate={navigate} />;
    }

    if (path.startsWith('/coupons/')) {
      const slug = path.replace('/coupons/', '');
      return <StoreDetailView slug={slug} db={db} navigate={navigate} onRevealOffer={handleRevealOffer} />;
    }

    if (path === '/categories') {
      return <CategoriesView db={db} navigate={navigate} onRevealOffer={handleRevealOffer} />;
    }

    if (path.startsWith('/categories/')) {
      const slug = path.replace('/categories/', '').replace(/-coupons$/, '');
      return <CategoriesView slug={slug} db={db} navigate={navigate} onRevealOffer={handleRevealOffer} />;
    }

    if (path === '/promo-codes') {
      return <RegionsView db={db} navigate={navigate} onRevealOffer={handleRevealOffer} />;
    }

    if (path.startsWith('/promo-codes/')) {
      const region = path.replace('/promo-codes/', '');
      return <RegionsView regionCode={region} db={db} navigate={navigate} onRevealOffer={handleRevealOffer} />;
    }

    if (path === '/deals') {
      return <SeasonalView db={db} navigate={navigate} onRevealOffer={handleRevealOffer} />;
    }

    if (path.startsWith('/deals/')) {
      const slug = path.replace('/deals/', '');
      return <SeasonalView slug={slug} db={db} navigate={navigate} onRevealOffer={handleRevealOffer} />;
    }

    if (path === '/guides') {
      return <GuidesView db={db} navigate={navigate} />;
    }

    if (path.startsWith('/guides/')) {
      const slug = path.replace('/guides/', '');
      return <GuidesView slug={slug} db={db} navigate={navigate} />;
    }

    if (path === '/submit-coupon') {
      return <SubmitCouponView db={db} navigate={navigate} />;
    }

    if (path.startsWith('/search')) {
      const urlParams = new URLSearchParams(window.location.search);
      const q = urlParams.get('q') || '';
      return <SearchView initialQuery={q} db={db} navigate={navigate} onRevealOffer={handleRevealOffer} />;
    }

    // Static pages
    const pageSlug = path.replace(/^\//, '');
    const matchedPage = db.pages.find((p) => p.slug === pageSlug);
    if (matchedPage) {
      return <PageView slug={matchedPage.slug} db={db} navigate={navigate} />;
    }

    // Fallback 404
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <h1 className="text-3xl font-black text-slate-900">Page not found</h1>
        <p className="text-slate-500 mt-2">The page you are looking for does not exist or has been moved.</p>
        <div className="mt-6 flex justify-center gap-3">
          <button onClick={() => navigate('/')} className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm cursor-pointer">
            Back to Home
          </button>
          <button onClick={() => navigate('/stores/')} className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold text-sm cursor-pointer">
            Browse Stores
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white">
      {/* Dynamic Theme CSS Injection */}
      <style>{`
        :root {
          --primary: ${db.settings.theme.primary || '#4f46e5'};
          --primary-dark: ${db.settings.theme.primaryDark || '#3730a3'};
          --accent: ${db.settings.theme.accent || '#ea580c'};
        }
        ${db.settings.code.css || ''}
      `}</style>

      {/* Public Header */}
      <Header
        db={db}
        currentPath={currentPath}
        navigate={navigate}
        isAdmin={isAdmin}
        onOpenAdminAuth={() => navigate('/admin')}
      />

      {/* Main Content */}
      <main className="flex-1">
        {renderView()}
      </main>

      {/* Public Footer */}
      <Footer
        db={db}
        navigate={navigate}
        isAdmin={isAdmin}
        onOpenAdminAuth={() => navigate('/admin')}
      />

      {/* Coupon Reveal Modal */}
      {revealedOffer && (
        <RevealModal
          coupon={revealedOffer.coupon}
          store={revealedOffer.store}
          onClose={handleCloseReveal}
        />
      )}

      {/* Admin Unlock Modal */}
      <AdminLoginModal
        isOpen={showAdminAuthModal}
        onClose={() => setShowAdminAuthModal(false)}
        onSuccess={() => {
          setIsAdmin(true);
          setShowAdminAuthModal(false);
          navigate('/admin');
        }}
      />

      {/* AI Assistant "Buzz" Bot */}
      <AiBot db={db} navigate={navigate} />
    </div>
  );
}
export default App;
