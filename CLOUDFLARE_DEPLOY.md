# Cloudflare Pages Deployment Guide (GitHub to Live)

This guide walks you through deploying **CouponBuz** from GitHub directly to Cloudflare Pages with full client-side routing, instant Firebase Realtime Database synchronisation, and live Admin CMS access.

---

## 1. Quick Deploy Steps (GitHub → Cloudflare Pages)

1. **Commit and Push Code to GitHub**:
   ```bash
   git add .
   git commit -m "Configure Firebase Realtime Database & Cloudflare SPA routing"
   git push origin main
   ```

2. **Open Cloudflare Dashboard**:
   - Go to [dash.cloudflare.com](https://dash.cloudflare.com/)
   - Navigate to **Workers & Pages** in the left menu.
   - Click **Create application** → Select the **Pages** tab → Click **Connect to Git**.

3. **Select Your GitHub Repository**:
   - Select your `couponbuz` repository.
   - Branch: `main` (or your default branch).

4. **Configure Build Settings**:
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/` (leave empty or default)

5. **Add Environment Variable**:
   Under **Environment variables (advanced)**, click **Add variable**:
   - **Variable name**: `NODE_VERSION`
   - **Value**: `20`

6. **Click "Save and Deploy"**:
   - Cloudflare Pages will run `npm run build` and publish your live site in under 1 minute.
   - Your site will be available on your custom domain (e.g. `https://couponbuz.pro`) or your free `*.pages.dev` subdomain.

---

## 2. How SPA Client-Side Routing Works on Cloudflare

This repository includes a `public/_redirects` file:
```
/*    /index.html   200
```
This rule instructs Cloudflare Pages to route all deep links (such as `/admin`, `/coupons/nike`, `/stores/`, `/categories/fashion`) to the single-page application entrypoint without returning 404 errors.

---

## 3. Real-Time Firebase Database Architecture

Your app is connected to:
- **Firebase Project ID**: `couponbuz`
- **Realtime Database URL**: `https://couponbuz-default-rtdb.firebaseio.com`
- **Auth Domain**: `couponbuz.firebaseapp.com`
- **Storage Bucket**: `couponbuz.firebasestorage.app`

### Why CMS Updates Publish Instantly (No Rebuild Needed)
1. When you edit any store, coupon, category, or setting in `https://couponbuz.pro/admin/`, the changes are instantly dispatched via WebSockets to **Firebase Realtime Database** and **Cloud Firestore**.
2. All visitors browsing the website have an active real-time listener (`onValue`) that automatically applies the update in their browser within **milliseconds** without needing a page refresh or redeploy.
3. If an internet connection is temporarily offline, the built-in `localStorage` and `BroadcastChannel` provide 100% resilient fallback.

---

## 4. Firebase Security Rules

Make sure your Firebase Realtime Database and Firestore rules are set to allow live reading and writing:

### Realtime Database Rules (`database.rules.json`):
```json
{
  "rules": {
    "couponbuz_live": {
      ".read": true,
      ".write": true
    }
  }
}
```

### Cloud Firestore Rules (`firestore.rules`):
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /couponbuz_live/{document} {
      allow read, write: if true;
    }
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

---

## 5. Admin Access Credentials

- **Admin URL**: `https://couponbuz.pro/admin` or `#/admin`
- **Default Email**: `admin@couponbuz.com`
- **Default PIN / Password**: `admin123`
- You can change the Admin PIN anytime inside **CMS Settings & Security**.

---

## 6. Connecting Your Custom Domain (`https://couponbuz.pro`)

1. In the Cloudflare Pages dashboard for your project, click the **Custom domains** tab.
2. Click **Set up a custom domain**.
3. Enter `couponbuz.pro` (and optionally `www.couponbuz.pro`).
4. Click **Continue**. Cloudflare will automatically route DNS records to `couponbuz.pages.dev` and issue universal SSL certificates.
5. In your Cloudflare DNS tab, verify:
   - Type: `CNAME` | Name: `@` (or `www`) | Target: `<your-project>.pages.dev` | Proxy: Proxied (Orange cloud)
6. Under **SSL/TLS**, ensure the encryption mode is set to **Full (strict)** so all shopper traffic is HTTPS encrypted.
