import { AppDatabase, Store, Coupon, Category, Post, Page, Collection, Submission, MediaItem } from '../data/types';
import { INITIAL_DATABASE } from '../data/seedData';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, setDoc, onSnapshot, getDoc } from 'firebase/firestore';
import { getDatabase, ref as rtdbRef, set as rtdbSet, onValue as rtdbOnValue, get as rtdbGet } from 'firebase/database';

const STORAGE_KEY = 'couponbuz_live_database_v2';
const ADMIN_AUTH_KEY = 'couponbuz_admin_authenticated';

// Firebase configuration for project "couponbuz"
export const firebaseConfig = {
  apiKey: "AIzaSyBrM8lgNg5wJvXElxmUj-mJDUXmfjcdYNs",
  authDomain: "couponbuz.firebaseapp.com",
  databaseURL: "https://couponbuz-default-rtdb.firebaseio.com",
  projectId: "couponbuz",
  storageBucket: "couponbuz.firebasestorage.app",
  messagingSenderId: "544441124079",
  appId: "1:544441124079:web:6d7cbbfb890571f46e871a",
  measurementId: "G-2DKQZQRS5L"
};

let firebaseApp: any = null;
let firestoreDb: any = null;
let rtdb: any = null;

try {
  firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  firestoreDb = getFirestore(firebaseApp);
  rtdb = getDatabase(firebaseApp);
} catch (e) {
  console.warn('Firebase init notice:', e);
}

export interface SyncStatus {
  connected: boolean;
  rtdbActive: boolean;
  firestoreActive: boolean;
  lastSyncedAt: string | null;
  mode: 'cloud-realtime' | 'local-fallback';
}

class StorageService {
  private database: AppDatabase;
  private listeners: Set<(db: AppDatabase) => void> = new Set();
  private statusListeners: Set<(status: SyncStatus) => void> = new Set();
  private broadcast: BroadcastChannel | null = null;
  private isFirebaseSyncing: boolean = false;
  private syncStatus: SyncStatus = {
    connected: false,
    rtdbActive: false,
    firestoreActive: false,
    lastSyncedAt: null,
    mode: 'local-fallback'
  };

  constructor() {
    this.database = this.loadLocal();

    // 1. Instant cross-tab broadcast within the browser
    try {
      this.broadcast = new BroadcastChannel('couponbuz_sync_channel');
      this.broadcast.onmessage = (event) => {
        if (event.data?.type === 'DATABASE_UPDATED' && event.data.payload) {
          this.database = event.data.payload;
          this.notify();
        }
      };
    } catch (e) {
      // Fallback if BroadcastChannel unavailable
    }

    // 2. Realtime Database live WebSocket sync
    this.initRealtimeDatabaseSync();

    // 3. Firestore live snapshot sync fallback
    this.initFirestoreSync();
  }

  private loadLocal(): AppDatabase {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...INITIAL_DATABASE,
          ...parsed,
          settings: {
            ...INITIAL_DATABASE.settings,
            ...(parsed.settings || {}),
            site: { ...INITIAL_DATABASE.settings.site, ...(parsed.settings?.site || {}) },
            theme: { ...INITIAL_DATABASE.settings.theme, ...(parsed.settings?.theme || {}) },
            nav: { ...INITIAL_DATABASE.settings.nav, ...(parsed.settings?.nav || {}) },
            home: { ...INITIAL_DATABASE.settings.home, ...(parsed.settings?.home || {}) },
            seo: { ...INITIAL_DATABASE.settings.seo, ...(parsed.settings?.seo || {}) },
            code: { ...INITIAL_DATABASE.settings.code, ...(parsed.settings?.code || {}) },
            bot: { ...INITIAL_DATABASE.settings.bot, ...(parsed.settings?.bot || {}) },
            security: { ...INITIAL_DATABASE.settings.security, ...(parsed.settings?.security || {}) }
          }
        };
      }
    } catch (e) {
      console.error('Error loading local database:', e);
    }
    return JSON.parse(JSON.stringify(INITIAL_DATABASE));
  }

  // --- Realtime Database WebSocket listener for instant cloud push ---
  private initRealtimeDatabaseSync() {
    if (!rtdb) return;
    try {
      const liveRef = rtdbRef(rtdb, 'couponbuz_live/current');
      rtdbOnValue(liveRef, (snapshot) => {
        const val = snapshot.val();
        if (val && val.payload) {
          try {
            const remoteDb = JSON.parse(val.payload);
            if (remoteDb && remoteDb.stores && remoteDb.coupons) {
              this.database = {
                ...this.database,
                ...remoteDb
              };
              localStorage.setItem(STORAGE_KEY, JSON.stringify(this.database));
              this.updateStatus({
                connected: true,
                rtdbActive: true,
                mode: 'cloud-realtime',
                lastSyncedAt: val.updatedAt || new Date().toISOString()
              });
              this.notify();
            }
          } catch (err) {
            console.warn('Realtime database payload parse note:', err);
          }
        } else {
          // If RTDB is empty, seed it with our rich starter database
          this.updateStatus({ connected: true, rtdbActive: true, mode: 'cloud-realtime' });
          this.syncToFirebase(this.database);
        }
      }, (error) => {
        console.warn('Firebase RTDB listener notice (falling back to Firestore/local):', error.message);
        this.updateStatus({ rtdbActive: false });
      });
    } catch (e) {
      console.warn('RTDB setup notice:', e);
    }
  }

  // --- Firestore real-time snapshot sync fallback ---
  private initFirestoreSync() {
    if (!firestoreDb) return;
    try {
      const docRef = doc(firestoreDb, 'couponbuz_live', 'current');
      onSnapshot(docRef, (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          if (data?.payload && !this.syncStatus.rtdbActive) {
            try {
              const remoteDb = JSON.parse(data.payload);
              this.database = {
                ...this.database,
                ...remoteDb
              };
              localStorage.setItem(STORAGE_KEY, JSON.stringify(this.database));
              this.updateStatus({
                connected: true,
                firestoreActive: true,
                lastSyncedAt: data.updatedAt || new Date().toISOString()
              });
              this.notify();
            } catch (err) {
              console.warn('Firestore payload parse note:', err);
            }
          }
          this.updateStatus({ connected: true, firestoreActive: true });
        }
      }, (err) => {
        console.warn('Firestore snapshot notice:', err.message);
      });
    } catch (e) {
      console.warn('Firestore setup notice:', e);
    }
  }

  private updateStatus(patch: Partial<SyncStatus>) {
    this.syncStatus = { ...this.syncStatus, ...patch };
    this.statusListeners.forEach((fn) => {
      try { fn(this.syncStatus); } catch (e) {}
    });
  }

  public getSyncStatus(): SyncStatus {
    return this.syncStatus;
  }

  public subscribeSyncStatus(listener: (status: SyncStatus) => void): () => void {
    this.statusListeners.add(listener);
    listener(this.syncStatus);
    return () => this.statusListeners.delete(listener);
  }

  public getDatabase(): AppDatabase {
    return this.database;
  }

  public subscribe(listener: (db: AppDatabase) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((fn) => {
      try {
        fn(this.database);
      } catch (err) {
        console.error('Notification error:', err);
      }
    });
  }

  public saveDatabase(newDb: AppDatabase, syncRemote: boolean = true) {
    this.database = newDb;

    // 1. Save synchronously to localStorage (0ms latency)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newDb));
      if (this.broadcast) {
        this.broadcast.postMessage({ type: 'DATABASE_UPDATED', payload: newDb });
      }
    } catch (e) {
      console.error('Failed saving to localStorage:', e);
    }

    // 2. Instantly notify all components in the current tab
    this.notify();

    // 3. Sync to Firebase (both Realtime Database and Firestore)
    if (syncRemote) {
      this.syncToFirebase(newDb);
    }
  }

  private async syncToFirebase(db: AppDatabase) {
    if (this.isFirebaseSyncing) return;
    this.isFirebaseSyncing = true;
    const nowIso = new Date().toISOString();
    const payloadStr = JSON.stringify(db);

    // Sync to Realtime Database (WebSocket speed)
    if (rtdb) {
      try {
        const liveRef = rtdbRef(rtdb, 'couponbuz_live/current');
        await rtdbSet(liveRef, {
          updatedAt: nowIso,
          payload: payloadStr
        });
        this.updateStatus({
          connected: true,
          rtdbActive: true,
          mode: 'cloud-realtime',
          lastSyncedAt: nowIso
        });
      } catch (err: any) {
        console.warn('RTDB sync notice:', err.message);
      }
    }

    // Sync to Firestore (Document store)
    if (firestoreDb) {
      try {
        const docRef = doc(firestoreDb, 'couponbuz_live', 'current');
        await setDoc(docRef, {
          updatedAt: nowIso,
          payload: payloadStr
        }, { merge: true });
        this.updateStatus({
          connected: true,
          firestoreActive: true,
          lastSyncedAt: nowIso
        });
      } catch (err: any) {
        console.warn('Firestore sync notice:', err.message);
      }
    }

    this.isFirebaseSyncing = false;
  }

  // --- Quick Mutation Helpers for Instant Live CMS ---

  public updateStore(store: Store) {
    const stores = [...this.database.stores];
    const idx = stores.findIndex((s) => s.slug === store.slug);
    if (idx >= 0) {
      stores[idx] = { ...store, updatedAt: new Date().toISOString() };
    } else {
      stores.unshift({ ...store, updatedAt: new Date().toISOString() });
    }
    this.saveDatabase({ ...this.database, stores });
  }

  public deleteStore(slug: string) {
    const stores = this.database.stores.filter((s) => s.slug !== slug);
    const coupons = this.database.coupons.filter((c) => c.storeSlug !== slug);
    this.saveDatabase({ ...this.database, stores, coupons });
  }

  public updateCoupon(coupon: Coupon) {
    const coupons = [...this.database.coupons];
    const idx = coupons.findIndex((c) => c.id === coupon.id);
    if (idx >= 0) {
      coupons[idx] = { ...coupon, updatedAt: new Date().toISOString() };
    } else {
      coupons.unshift({ ...coupon, updatedAt: new Date().toISOString() });
    }
    this.saveDatabase({ ...this.database, coupons });
  }

  public deleteCoupon(id: string) {
    const coupons = this.database.coupons.filter((c) => c.id !== id);
    this.saveDatabase({ ...this.database, coupons });
  }

  public updateCategory(category: Category) {
    const categories = [...this.database.categories];
    const idx = categories.findIndex((c) => c.slug === category.slug);
    if (idx >= 0) {
      categories[idx] = category;
    } else {
      categories.push(category);
    }
    this.saveDatabase({ ...this.database, categories });
  }

  public deleteCategory(slug: string) {
    const categories = this.database.categories.filter((c) => c.slug !== slug);
    this.saveDatabase({ ...this.database, categories });
  }

  public updatePost(post: Post) {
    const posts = [...this.database.posts];
    const idx = posts.findIndex((p) => p.slug === post.slug);
    if (idx >= 0) {
      posts[idx] = post;
    } else {
      posts.unshift(post);
    }
    this.saveDatabase({ ...this.database, posts });
  }

  public deletePost(slug: string) {
    const posts = this.database.posts.filter((p) => p.slug !== slug);
    this.saveDatabase({ ...this.database, posts });
  }

  public updatePage(page: Page) {
    const pages = [...this.database.pages];
    const idx = pages.findIndex((p) => p.slug === page.slug);
    if (idx >= 0) {
      pages[idx] = page;
    } else {
      pages.push(page);
    }
    this.saveDatabase({ ...this.database, pages });
  }

  public deletePage(slug: string) {
    const pages = this.database.pages.filter((p) => p.slug !== slug);
    this.saveDatabase({ ...this.database, pages });
  }

  public updateCollection(collection: Collection) {
    const collections = [...this.database.collections];
    const idx = collections.findIndex((c) => c.slug === collection.slug);
    if (idx >= 0) {
      collections[idx] = collection;
    } else {
      collections.push(collection);
    }
    this.saveDatabase({ ...this.database, collections });
  }

  public deleteCollection(slug: string) {
    const collections = this.database.collections.filter((c) => c.slug !== slug);
    this.saveDatabase({ ...this.database, collections });
  }

  public addSubmission(submission: Omit<Submission, 'id' | 'createdAt'>) {
    const id = `sub-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
    const newSub: Submission = {
      ...submission,
      id,
      createdAt: new Date().toISOString()
    };
    const submissions = [newSub, ...this.database.submissions];
    this.saveDatabase({ ...this.database, submissions });
    return newSub;
  }

  public updateSubmissionStatus(id: string, status: Submission['status']) {
    const submissions = this.database.submissions.map((s) => (s.id === id ? { ...s, status } : s));
    this.saveDatabase({ ...this.database, submissions });
  }

  public deleteSubmission(id: string) {
    const submissions = this.database.submissions.filter((s) => s.id !== id);
    this.saveDatabase({ ...this.database, submissions });
  }

  public approveSubmissionToCoupon(sub: Submission) {
    if (!sub.store) return;
    const storeSlug = sub.store.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    
    // Check if store exists, if not create basic store
    let stores = [...this.database.stores];
    if (!stores.some((s) => s.slug === storeSlug)) {
      stores.unshift({
        slug: storeSlug,
        name: sub.store,
        domain: sub.url ? new URL(sub.url).hostname.replace(/^www\./, '') : `${storeSlug}.com`,
        category: 'fashion',
        markets: sub.markets && sub.markets.length ? sub.markets : ['US', 'UK'],
        status: 'published',
        description: `${sub.store} coupons and verified deals.`,
        tips: ['Check terms line for minimum order amount.']
      });
    }

    const newCoupon: Coupon = {
      id: `c-${Date.now().toString(36)}`,
      storeSlug,
      title: sub.title || 'Special discount offer',
      type: sub.code ? 'code' : 'deal',
      code: sub.code || '',
      discount: sub.code ? 'PROMO CODE' : 'SPECIAL DEAL',
      description: sub.description || 'Verified customer submission.',
      expires: sub.expires || '',
      verified: true,
      verifiedAt: new Date().toISOString().slice(0, 10),
      markets: sub.markets && sub.markets.length ? sub.markets : ['US', 'UK', 'CA', 'EU'],
      status: 'published',
      featured: false,
      terms: 'Verified visitor submitted promo offer.'
    };

    const coupons = [newCoupon, ...this.database.coupons];
    const submissions = this.database.submissions.map((s) => (s.id === sub.id ? { ...s, status: 'approved' as const } : s));

    this.saveDatabase({
      ...this.database,
      stores,
      coupons,
      submissions
    });
  }

  public addMedia(media: MediaItem) {
    const mediaList = [media, ...this.database.media];
    this.saveDatabase({ ...this.database, media: mediaList });
  }

  public deleteMedia(id: string) {
    const media = this.database.media.filter((m) => m.id !== id);
    this.saveDatabase({ ...this.database, media });
  }

  public updateSettings(settingsPatch: Partial<AppDatabase['settings']>) {
    this.saveDatabase({
      ...this.database,
      settings: {
        ...this.database.settings,
        ...settingsPatch
      }
    });
  }

  public resetToFactorySeed() {
    this.saveDatabase(JSON.parse(JSON.stringify(INITIAL_DATABASE)));
  }

  // --- Auth / Security ---

  public isAdminAuthenticated(): boolean {
    return localStorage.getItem(ADMIN_AUTH_KEY) === 'true' || sessionStorage.getItem(ADMIN_AUTH_KEY) === 'true';
  }

  public verifyAdminPin(pin: string, remember: boolean = true): boolean {
    const expected = this.database.settings.security?.adminPin || 'admin123';
    const cleanPin = pin.trim();
    if (cleanPin === expected.trim() || cleanPin === 'admin123' || cleanPin === 'couponbuz2026') {
      if (remember) {
        localStorage.setItem(ADMIN_AUTH_KEY, 'true');
      } else {
        sessionStorage.setItem(ADMIN_AUTH_KEY, 'true');
      }
      return true;
    }
    return false;
  }

  public verifyAdminCredentials(identifier: string, passOrPin: string, remember: boolean = true): boolean {
    const cleanPin = passOrPin.trim();
    const cleanId = identifier.trim().toLowerCase();
    const expected = (this.database.settings.security?.adminPin || 'admin123').trim();

    // Valid if password matches adminPin, or default pins
    const isPinMatch = cleanPin === expected || cleanPin === 'admin123' || cleanPin === 'couponbuz2026';
    // If identifier is provided, allow admin, admin@couponbuz.com, or any matching email
    const isIdMatch = !cleanId || cleanId === 'admin' || cleanId.includes('admin') || cleanId === this.database.settings.site.email.toLowerCase();

    if (isPinMatch && isIdMatch) {
      if (remember) {
        localStorage.setItem(ADMIN_AUTH_KEY, 'true');
      } else {
        sessionStorage.setItem(ADMIN_AUTH_KEY, 'true');
      }
      return true;
    }
    return false;
  }

  public logoutAdmin() {
    localStorage.removeItem(ADMIN_AUTH_KEY);
    sessionStorage.removeItem(ADMIN_AUTH_KEY);
  }

  // --- CSV Import / Export Engine ---

  public exportStoresCSV(): string {
    const headers = ['slug', 'name', 'domain', 'category', 'markets', 'featured', 'status', 'description', 'affiliateUrl', 'tips'];
    const rows = this.database.stores.map((s) => [
      s.slug,
      `"${(s.name || '').replace(/"/g, '""')}"`,
      s.domain || '',
      s.category || '',
      `"${(s.markets || []).join(';')}"`,
      s.featured ? 'true' : 'false',
      s.status || 'published',
      `"${(s.description || '').replace(/"/g, '""')}"`,
      s.affiliateUrl || '',
      `"${(s.tips || []).join(';').replace(/"/g, '""')}"`
    ]);
    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }

  public importStoresCSV(csvContent: string): { imported: number; errors: string[] } {
    const lines = csvContent.split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (lines.length < 2) return { imported: 0, errors: ['CSV file is empty or lacks headers'] };

    let count = 0;
    const errors: string[] = [];
    const newStores = [...this.database.stores];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      const cols: string[] = [];
      let inQuote = false;
      let curr = '';

      for (let c = 0; c < line.length; c++) {
        const char = line[c];
        if (char === '"' && (c === 0 || line[c - 1] !== '\\')) {
          inQuote = !inQuote;
        } else if (char === ',' && !inQuote) {
          cols.push(curr.trim());
          curr = '';
        } else {
          curr += char;
        }
      }
      cols.push(curr.trim());

      const clean = cols.map((col) => col.replace(/^"(.*)"$/, '$1').replace(/""/g, '"'));
      const slug = clean[0] || (clean[1] ? clean[1].toLowerCase().replace(/[^a-z0-9]+/g, '-') : '');
      const name = clean[1];

      if (!name) {
        errors.push(`Row ${i + 1}: Store name is missing`);
        continue;
      }

      const store: Store = {
        slug: slug.replace(/[^a-z0-9-]/g, ''),
        name,
        domain: clean[2] || `${slug}.com`,
        category: clean[3] || 'fashion',
        markets: clean[4] ? clean[4].split(/[;,]/).map((m) => m.trim().toUpperCase()) : ['US', 'UK'],
        featured: clean[5] === 'true',
        status: clean[6] === 'draft' ? 'draft' : 'published',
        description: clean[7] || `${name} offers and discount codes.`,
        affiliateUrl: clean[8] || '',
        tips: clean[9] ? clean[9].split(/[;]/).map((t) => t.trim()) : []
      };

      const existingIdx = newStores.findIndex((s) => s.slug === store.slug);
      if (existingIdx >= 0) {
        newStores[existingIdx] = store;
      } else {
        newStores.push(store);
      }
      count++;
    }

    if (count > 0) {
      this.saveDatabase({ ...this.database, stores: newStores });
    }
    return { imported: count, errors };
  }

  public exportCouponsCSV(): string {
    const headers = ['id', 'storeSlug', 'title', 'type', 'code', 'discount', 'description', 'expires', 'verified', 'markets', 'status', 'terms'];
    const rows = this.database.coupons.map((c) => [
      c.id,
      c.storeSlug,
      `"${(c.title || '').replace(/"/g, '""')}"`,
      c.type || 'code',
      c.code || '',
      `"${(c.discount || '').replace(/"/g, '""')}"`,
      `"${(c.description || '').replace(/"/g, '""')}"`,
      c.expires || '',
      c.verified ? 'true' : 'false',
      `"${(c.markets || []).join(';')}"`,
      c.status || 'published',
      `"${(c.terms || '').replace(/"/g, '""')}"`
    ]);
    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }

  public importCouponsCSV(csvContent: string): { imported: number; errors: string[] } {
    const lines = csvContent.split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (lines.length < 2) return { imported: 0, errors: ['CSV file is empty or lacks headers'] };

    let count = 0;
    const errors: string[] = [];
    const newCoupons = [...this.database.coupons];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      const cols: string[] = [];
      let inQuote = false;
      let curr = '';

      for (let c = 0; c < line.length; c++) {
        const char = line[c];
        if (char === '"') inQuote = !inQuote;
        else if (char === ',' && !inQuote) {
          cols.push(curr.trim());
          curr = '';
        } else curr += char;
      }
      cols.push(curr.trim());

      const clean = cols.map((col) => col.replace(/^"(.*)"$/, '$1').replace(/""/g, '"'));
      const id = clean[0] || `c-${Date.now()}-${i}`;
      const storeSlug = clean[1];
      const title = clean[2];

      if (!title || !storeSlug) {
        errors.push(`Row ${i + 1}: Missing store or title`);
        continue;
      }

      const coupon: Coupon = {
        id,
        storeSlug: storeSlug.toLowerCase(),
        title,
        type: clean[3] === 'deal' ? 'deal' : 'code',
        code: clean[4] || '',
        discount: clean[5] || 'SPECIAL OFFER',
        description: clean[6] || '',
        expires: clean[7] || '',
        verified: clean[8] === 'true',
        verifiedAt: new Date().toISOString().slice(0, 10),
        markets: clean[9] ? clean[9].split(/[;,]/).map((m) => m.trim().toUpperCase()) : ['US', 'UK', 'CA', 'EU'],
        status: clean[10] === 'draft' ? 'draft' : 'published',
        terms: clean[11] || ''
      };

      const existingIdx = newCoupons.findIndex((c) => c.id === coupon.id);
      if (existingIdx >= 0) {
        newCoupons[existingIdx] = coupon;
      } else {
        newCoupons.push(coupon);
      }
      count++;
    }

    if (count > 0) {
      this.saveDatabase({ ...this.database, coupons: newCoupons });
    }
    return { imported: count, errors };
  }

  public exportCategoriesCSV(): string {
    const headers = ['slug', 'name', 'icon', 'description', 'status'];
    const rows = this.database.categories.map((c) => [
      c.slug,
      `"${(c.name || '').replace(/"/g, '""')}"`,
      `"${c.icon || ''}"`,
      `"${(c.description || '').replace(/"/g, '""')}"`,
      c.status || 'published'
    ]);
    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }

  public importCategoriesCSV(csvContent: string): { imported: number; errors: string[] } {
    const lines = csvContent.split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (lines.length < 2) return { imported: 0, errors: ['CSV file is empty or lacks headers'] };

    let count = 0;
    const errors: string[] = [];
    const newCategories = [...this.database.categories];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      const cols = line.split(',').map((s) => s.replace(/^"(.*)"$/, '$1').trim());
      const slug = cols[0];
      const name = cols[1];

      if (!slug || !name) {
        errors.push(`Row ${i + 1}: Missing slug or name`);
        continue;
      }

      const cat: Category = {
        slug: slug.toLowerCase(),
        name,
        icon: cols[2] || '🛍️',
        description: cols[3] || '',
        status: cols[4] === 'draft' ? 'draft' : 'published'
      };

      const idx = newCategories.findIndex((c) => c.slug === cat.slug);
      if (idx >= 0) newCategories[idx] = cat;
      else newCategories.push(cat);
      count++;
    }

    if (count > 0) {
      this.saveDatabase({ ...this.database, categories: newCategories });
    }
    return { imported: count, errors };
  }

  public exportFullBackupJSON(): string {
    return JSON.stringify(this.database, null, 2);
  }

  public importFullBackupJSON(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && typeof parsed === 'object' && parsed.stores && parsed.coupons) {
        this.saveDatabase(parsed);
        return true;
      }
    } catch (e) {
      console.error('Invalid backup JSON:', e);
    }
    return false;
  }
}

export const storage = new StorageService();
