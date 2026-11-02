export interface Store {
  slug: string;
  name: string;
  domain: string;
  category: string;
  markets: string[];
  featured?: boolean;
  status: 'published' | 'draft';
  description: string;
  tips?: string[];
  logo?: string;
  logoAlt?: string;
  affiliateUrl?: string;
  body?: string;
  faqs?: { q: string; a: string }[];
  seoTitle?: string;
  seoDescription?: string;
  noindex?: boolean;
  canonicalUrl?: string;
  customHead?: string;
  updatedAt?: string;
}

export interface Coupon {
  id: string;
  storeSlug: string;
  title: string;
  type: 'code' | 'deal';
  code: string;
  discount: string;
  description: string;
  expires?: string;
  verified?: boolean;
  verifiedAt?: string;
  markets: string[];
  status: 'published' | 'draft';
  demo?: boolean;
  featured?: boolean;
  exclusive?: boolean;
  url?: string;
  terms?: string;
  tags?: string[];
  updatedAt?: string;
}

export interface Category {
  slug: string;
  name: string;
  icon: string;
  description: string;
  status: 'published' | 'draft';
  seoTitle?: string;
  seoDescription?: string;
  noindex?: boolean;
}

export interface Collection {
  slug: string;
  name: string;
  status: 'published' | 'draft';
  stores: string[];
  seoTitle?: string;
  seoDescription?: string;
  intro?: string;
  body?: string;
}

export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  status: 'published' | 'draft';
  image?: string;
  imageAlt?: string;
  seoTitle?: string;
  seoDescription?: string;
  body: string;
}

export interface Page {
  slug: string;
  title: string;
  status: 'published' | 'draft';
  seoDescription?: string;
  body: string;
}

export interface Redirect {
  from: string;
  to: string;
  code: '301' | '302';
  active: boolean;
  note?: string;
}

export interface Submission {
  id: string;
  kind?: 'coupon' | 'contact' | 'newsletter';
  store?: string;
  title?: string;
  code?: string;
  url?: string;
  description?: string;
  markets?: string[];
  expires?: string;
  email?: string;
  type?: 'code' | 'deal';
  status: 'pending' | 'approved' | 'rejected' | 'message';
  createdAt: string;
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  type: string;
  size?: number;
  createdAt: string;
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  url: string;
  email: string;
  disclosure: string;
  openOnReveal?: boolean;
  social: {
    twitter: string;
    facebook: string;
    instagram: string;
    youtube: string;
    tiktok: string;
  };
  footerAbout: string;
}

export interface ThemeSettings {
  primary: string;
  primaryDark: string;
  accent: string;
  bg: string;
  surface: string;
  ink: string;
  muted: string;
  radius: number;
  font: string;
  darkMode: 'auto' | 'light' | 'dark';
  logoUrl?: string;
  logoHeight?: number;
  logoText?: string;
  faviconUrl?: string;
  heroStyle?: string;
  heroImageUrl?: string;
  heroCtaText?: string;
  heroCtaLink?: string;
  announcement: {
    enabled: boolean;
    text: string;
    link: string;
    bg: string;
  };
}

export interface NavItem {
  label: string;
  type: 'link' | 'dropdown' | 'stores' | 'categories' | 'regions';
  url: string;
  children?: { label: string; url: string }[];
}

export interface FooterColumn {
  title: string;
  links: { label: string; url: string }[];
}

export interface HomeSection {
  type: 'hero' | 'stats' | 'offers' | 'stores' | 'categories' | 'regions' | 'collections' | 'howitworks' | 'guides' | 'faq' | 'newsletter' | 'html';
  enabled: boolean;
  title?: string;
  subtitle?: string;
  limit?: number;
  html?: string;
  imageUrl?: string;
  ctaText?: string;
  ctaLink?: string;
  items?: { q: string; a: string }[];
}

export interface SeoSettings {
  titleTemplate: string;
  defaultDescription: string;
  ogImage: string;
  canonicalUrl?: string;
  googleVerification: string;
  bingVerification: string;
  gaId: string;
  gtmId: string;
  robotsExtra: string;
  customRobotsTxt?: string;
  noindexThin: boolean;
  sameAs: string[];
}

export interface CustomCodeSettings {
  head: string;
  bodyEnd: string;
  css: string;
}

export interface BotSettings {
  enabled: boolean;
  name: string;
  greeting: string;
  color: string;
  contactEmail: string;
  instructions: string;
  quickReplies: string[];
  faqs: { q: string; a: string; k?: string }[];
}

export interface AdminSecuritySettings {
  adminPin: string;
  isCmsHidden: boolean; // Hide CMS from public, require PIN / admin sign-in
}

export interface AppDatabase {
  settings: {
    site: SiteSettings;
    theme: ThemeSettings;
    nav: {
      header: NavItem[];
      footer: FooterColumn[];
    };
    home: {
      sections: HomeSection[];
    };
    seo: SeoSettings;
    code: CustomCodeSettings;
    bot: BotSettings;
    security: AdminSecuritySettings;
  };
  categories: Category[];
  stores: Store[];
  coupons: Coupon[];
  posts: Post[];
  pages: Page[];
  collections: Collection[];
  redirects: Redirect[];
  submissions: Submission[];
  media: MediaItem[];
}
