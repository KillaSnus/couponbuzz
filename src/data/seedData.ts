import { AppDatabase } from './types';

export const INITIAL_DATABASE: AppDatabase = {
  settings: {
    site: {
      siteName: "CouponBuz",
      tagline: "Promo codes and deals, checked before you shop",
      url: "https://couponbuz.com",
      email: "hello@couponbuz.com",
      disclosure: "CouponBuz may earn a commission when you use a link on this site to buy something. This never changes the price you pay.",
      openOnReveal: true,
      social: {
        twitter: "https://twitter.com/couponbuz",
        facebook: "https://facebook.com/couponbuz",
        instagram: "https://instagram.com/couponbuz",
        youtube: "",
        tiktok: ""
      },
      footerAbout: "Independent promo codes and deals for shoppers worldwide across the US, UK, Canada, Australia and Europe."
    },
    theme: {
      primary: "#4f46e5",
      primaryDark: "#3730a3",
      accent: "#ea580c",
      bg: "#f8fafc",
      surface: "#ffffff",
      ink: "#0f172a",
      muted: "#64748b",
      radius: 12,
      font: "Inter",
      darkMode: "light",
      logoUrl: "",
      faviconUrl: "",
      heroStyle: "gradient",
      announcement: {
        enabled: true,
        text: "⚡ Black Friday & Cyber Week 2026 early access codes are live!",
        link: "/deals/black-friday/",
        bg: "#0f172a"
      }
    },
    nav: {
      header: [
        { label: "Stores", type: "stores", url: "/stores/" },
        { label: "Categories", type: "categories", url: "/categories/" },
        { label: "Countries & Regions", type: "regions", url: "/promo-codes/" },
        {
          label: "Seasonal Deals",
          type: "dropdown",
          url: "/deals/black-friday/",
          children: [
            { label: "Black Friday 2026", url: "/deals/black-friday/" },
            { label: "Christmas Gifts", url: "/deals/christmas/" }
          ]
        },
        { label: "Guides", type: "link", url: "/guides/" },
        { label: "Submit Code", type: "link", url: "/submit-coupon/" }
      ],
      footer: [
        {
          title: "Explore",
          links: [
            { label: "All stores A–Z", url: "/stores/" },
            { label: "Categories", url: "/categories/" },
            { label: "Saving guides", url: "/guides/" },
            { label: "Black Friday Deals", url: "/deals/black-friday/" },
            { label: "Christmas Hub", url: "/deals/christmas/" },
            { label: "Submit a coupon", url: "/submit-coupon/" }
          ]
        },
        {
          title: "Regions",
          links: [
            { label: "United States (US)", url: "/promo-codes/us/" },
            { label: "United Kingdom (UK)", url: "/promo-codes/uk/" },
            { label: "Canada (CA)", url: "/promo-codes/canada/" },
            { label: "Europe (EU)", url: "/promo-codes/europe/" },
            { label: "Australia (AU)", url: "/promo-codes/australia/" }
          ]
        },
        {
          title: "Company",
          links: [
            { label: "About CouponBuz", url: "/about/" },
            { label: "How we verify offers", url: "/how-we-verify/" },
            { label: "How we make money", url: "/how-we-make-money/" },
            { label: "Contact us", url: "/contact/" }
          ]
        },
        {
          title: "Legal",
          links: [
            { label: "Privacy Policy", url: "/privacy/" },
            { label: "Terms of Use", url: "/terms/" }
          ]
        }
      ]
    },
    home: {
      sections: [
        {
          type: "hero",
          enabled: true,
          title: "Find verified promo codes worth using",
          subtitle: "Browse thousands of hand-tested discount vouchers across US, UK, Canada, Australia and Europe. Expired deals are removed promptly."
        },
        { type: "stats", enabled: true },
        {
          type: "offers",
          enabled: true,
          title: "Top verified offers today",
          subtitle: "Tested and guaranteed active by our deal editors",
          limit: 8
        },
        {
          type: "stores",
          enabled: true,
          title: "Popular stores",
          subtitle: "Direct promo codes from top international brands",
          limit: 12
        },
        {
          type: "categories",
          enabled: true,
          title: "Shop by category",
          subtitle: "Explore discounts across tech, fashion, travel and more"
        },
        {
          type: "regions",
          enabled: true,
          title: "Offers for your country",
          subtitle: "Codes are tagged by region so you never waste time on invalid vouchers."
        },
        {
          type: "collections",
          enabled: true,
          title: "Seasonal savings events",
          subtitle: "Plan ahead for the biggest shopping weekends of the year"
        },
        {
          type: "howitworks",
          enabled: true,
          title: "How CouponBuz works",
          subtitle: "Our 3-step quality testing pipeline"
        },
        {
          type: "guides",
          enabled: true,
          title: "Expert saving guides",
          subtitle: "Tested tips to maximize your checkout discounts",
          limit: 3
        },
        {
          type: "faq",
          enabled: true,
          title: "Frequently asked questions",
          items: [
            {
              q: "Are the promo codes on CouponBuz free to use?",
              a: "Yes! CouponBuz is 100% free for all shoppers. We earn an affiliate commission when you buy through our links, with zero extra cost to you."
            },
            {
              q: "Why did my promo code not work at checkout?",
              a: "Codes can expire, apply to new customers only, require a minimum spend threshold, or be locked to a specific country. Check the terms label on the offer card."
            },
            {
              q: "Which countries do you cover?",
              a: "We actively cover the United States, United Kingdom, Canada, Australia, and European countries (Germany, France, Spain, Italy, Netherlands, etc.)."
            },
            {
              q: "How frequently are promo codes verified?",
              a: "Offers show the exact date last checked by our editorial team. Inactive or expired codes are retired daily."
            }
          ]
        },
        {
          type: "newsletter",
          enabled: true,
          title: "Never miss a verified flash code",
          subtitle: "Get one curated weekly email with high-value discounts. Unsubscribe anytime."
        }
      ]
    },
    seo: {
      titleTemplate: "%title% | %site%",
      defaultDescription: "Verified promo codes and discounts for US, UK, Canada, Australia and Europe shoppers, tested with clear terms.",
      ogImage: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&h=630&q=80",
      googleVerification: "",
      bingVerification: "",
      gaId: "G-93D3GVK2DS",
      gtmId: "",
      robotsExtra: "",
      noindexThin: true,
      sameAs: [
        "https://twitter.com/couponbuz",
        "https://facebook.com/couponbuz"
      ]
    },
    code: {
      head: "<!-- Custom head scripts injected safely -->",
      bodyEnd: "<!-- Custom footer scripts -->",
      css: "/* Custom CSS injected via CMS */"
    },
    bot: {
      enabled: true,
      name: "Buzz Assistant",
      greeting: "Hello! I am Buzz, your CouponBuz smart shopping assistant. Looking for a coupon or need help saving money?",
      color: "#4f46e5",
      contactEmail: "support@couponbuz.com",
      instructions: "Keep answers friendly, direct and helpful. Help shoppers find coupons for Nike, ASOS, NordVPN, Expedia and more.",
      quickReplies: [
        "How do I use a code?",
        "Why did my code fail?",
        "Show Nike discounts",
        "Which countries are supported?"
      ],
      faqs: [
        {
          q: "How do I use a promo code?",
          a: "Click 'Show code' on any offer card. Copy the voucher string and paste it into the promo box during checkout on the store's official site.",
          k: "use apply redeem enter code checkout paste"
        },
        {
          q: "Why did my code fail?",
          a: "Most common causes: minimum basket spend not met, excluded sale items, new-customer restrictions, or regional country locks.",
          k: "fail work invalid expired error broken"
        },
        {
          q: "Which regions do you cover?",
          a: "We support United States (US), United Kingdom (UK), Canada (CA), Europe (EU), and Australia (AU).",
          k: "region country uk us canada europe eu australia"
        },
        {
          q: "How does CouponBuz make money?",
          a: "We earn affiliate commissions from retailers when shoppers complete orders through our verified links. It never costs you extra.",
          k: "money revenue commission affiliate free business"
        }
      ]
    },
    security: {
      adminPin: "admin123", // default PIN to access hidden CMS
      isCmsHidden: true // Keep CMS hidden from public visitors
    }
  },
  categories: [
    {
      slug: "fashion",
      name: "Fashion & Apparel",
      icon: "👟",
      description: "Clothing, shoes and luxury accessories from premier high-street brands and online boutiques.",
      status: "published"
    },
    {
      slug: "electronics",
      name: "Electronics & Tech",
      icon: "💻",
      description: "Smartphones, laptops, 4K TVs, audio gear and smart home devices with maximum savings.",
      status: "published"
    },
    {
      slug: "software",
      name: "Software & SaaS",
      icon: "🧩",
      description: "VPNs, cloud storage, design suites, website builders, and productivity software.",
      status: "published"
    },
    {
      slug: "travel",
      name: "Travel & Stays",
      icon: "✈️",
      description: "Flight booking engines, luxury hotels, vacation rentals, and car hire packages.",
      status: "published"
    },
    {
      slug: "food-delivery",
      name: "Food & Groceries",
      icon: "🍕",
      description: "Restaurant delivery platforms, gourmet meal kits, and online supermarket discounts.",
      status: "published"
    },
    {
      slug: "health-beauty",
      name: "Health & Beauty",
      icon: "💄",
      description: "Skincare, cosmetics, wellness vitamins, fragrances, and pharmacy essentials.",
      status: "published"
    },
    {
      slug: "home-garden",
      name: "Home & Garden",
      icon: "🛋️",
      description: "Modern furniture, bedding, kitchen appliances, DIY tools and garden decor.",
      status: "published"
    },
    {
      slug: "sports-outdoors",
      name: "Sports & Outdoors",
      icon: "🏕️",
      description: "Running shoes, cycling equipment, camping gear, gym apparel and sportswear.",
      status: "published"
    },
    {
      slug: "education",
      name: "Education & Courses",
      icon: "🎓",
      description: "Online certifications, programming bootcamps, and professional courses.",
      status: "published"
    },
    {
      slug: "pets",
      name: "Pets & Supplies",
      icon: "🐾",
      description: "Premium pet nutrition, toys, accessories, and repeat-order veterinary supplies.",
      status: "published"
    },
    {
      slug: "automotive",
      name: "Automotive & Parts",
      icon: "🚗",
      description: "Car maintenance, tires, performance accessories, and audio upgrades.",
      status: "published"
    },
    {
      slug: "entertainment",
      name: "Entertainment & Gaming",
      icon: "🎟️",
      description: "Concert tickets, theater, video games, consoles, and streaming passes.",
      status: "published"
    }
  ],
  stores: [
    {
      slug: "nike",
      name: "Nike",
      domain: "nike.com",
      category: "fashion",
      markets: ["US", "UK", "CA", "EU", "AU"],
      featured: true,
      status: "published",
      description: "Nike designs and sells premium sportswear, iconic sneakers (Air Jordan, Dunk, Pegasus), and training accessories.",
      tips: [
        "Sign up for free Nike Membership for free delivery and 20% birthday promo codes.",
        "Check Nike clearance section where extra 20% off codes frequently stack."
      ],
      affiliateUrl: "https://nike.com"
    },
    {
      slug: "nordvpn",
      name: "NordVPN",
      domain: "nordvpn.com",
      category: "software",
      markets: ["US", "UK", "CA", "EU", "AU"],
      featured: true,
      status: "published",
      description: "NordVPN delivers high-speed encrypted internet protection, threat protection, and geo-unblocking across 110+ countries.",
      tips: [
        "Longer 2-year subscriptions offer up to 74% off plus 3 free bonus months.",
        "Students and graduates get an extra 15% discount via StudentBeans."
      ],
      affiliateUrl: "https://nordvpn.com"
    },
    {
      slug: "asos",
      name: "ASOS",
      domain: "asos.com",
      category: "fashion",
      markets: ["UK", "US", "EU", "AU"],
      featured: true,
      status: "published",
      description: "ASOS stocks over 850 world-renowned fashion brands alongside ASOS DESIGN, Topshop, and COLLUSION.",
      tips: [
        "Students get an instant 10% to 20% discount all year round.",
        "Premier Delivery pays for itself after just two orders with unlimited next-day shipping."
      ],
      affiliateUrl: "https://asos.com"
    },
    {
      slug: "best-buy",
      name: "Best Buy",
      domain: "bestbuy.com",
      category: "electronics",
      markets: ["US", "CA"],
      featured: true,
      status: "published",
      description: "Leading consumer tech retailer offering laptops, 4K OLED TVs, appliances, gaming consoles, and Geek Squad services.",
      tips: [
        "Best Buy Open-Box items offer pristine electronics at up to 40% discount.",
        "Price Match Guarantee applies against Amazon, Target, and Walmart."
      ],
      affiliateUrl: "https://bestbuy.com"
    },
    {
      slug: "sephora",
      name: "Sephora",
      domain: "sephora.com",
      category: "health-beauty",
      markets: ["US", "CA", "EU", "UK"],
      featured: true,
      status: "published",
      description: "Sephora carries luxury cosmetics, fragrances, haircare (Dyson, Olaplex), and prestige skincare.",
      tips: [
        "Beauty Insider rewards members earn points convertible to cash off baskets.",
        "Select two complimentary deluxe samples with every online checkout."
      ],
      affiliateUrl: "https://sephora.com"
    },
    {
      slug: "expedia",
      name: "Expedia",
      domain: "expedia.com",
      category: "travel",
      markets: ["US", "UK", "CA", "EU", "AU"],
      featured: true,
      status: "published",
      description: "Full-service online travel agency offering flight deals, hotel reservations, cruise packages, and rental cars.",
      tips: [
        "Book flight + hotel packages simultaneously to unlock unpublished package rates.",
        "Expedia OneKey members save an average of 10% on VIP Access hotel properties."
      ],
      affiliateUrl: "https://expedia.com"
    },
    {
      slug: "uber-eats",
      name: "Uber Eats",
      domain: "ubereats.com",
      category: "food-delivery",
      markets: ["US", "UK", "CA", "EU", "AU"],
      featured: true,
      status: "published",
      description: "Order restaurant takeout, grocery deliveries, and convenience items delivered direct to your door.",
      tips: [
        "New customers can save up to $20 on their first 2 grocery or restaurant orders.",
        "Uber One subscription waives delivery fees on eligible $15+ orders."
      ],
      affiliateUrl: "https://ubereats.com"
    },
    {
      slug: "canva",
      name: "Canva",
      domain: "canva.com",
      category: "software",
      markets: ["US", "UK", "CA", "EU", "AU"],
      featured: false,
      status: "published",
      description: "Intuitive graphic design suite with AI Magic Studio tools, templates, video editing, and team collaboration.",
      tips: [
        "Start with a 30-day free trial of Canva Pro before committing.",
        "Educators and registered non-profits can claim free Canva Pro access."
      ],
      affiliateUrl: "https://canva.com"
    },
    {
      slug: "ikea",
      name: "IKEA",
      domain: "ikea.com",
      category: "home-garden",
      markets: ["US", "UK", "CA", "EU", "AU"],
      featured: false,
      status: "published",
      description: "Scandinavian home furnishings, flat-pack furniture, modular kitchens, and smart home lighting.",
      tips: [
        "Join IKEA Family for free tea/coffee in-store, extra 5% discount on furniture, and free damage insurance during transit."
      ],
      affiliateUrl: "https://ikea.com"
    },
    {
      slug: "udemy",
      name: "Udemy",
      domain: "udemy.com",
      category: "education",
      markets: ["US", "UK", "CA", "EU", "AU"],
      featured: false,
      status: "published",
      description: "Global e-learning marketplace with 220,000+ video courses covering coding, business, AI, and languages.",
      tips: [
        "Wait for Udemy sitewide sales where top $150+ courses drop to $9.99 - $14.99."
      ],
      affiliateUrl: "https://udemy.com"
    },
    {
      slug: "chewy",
      name: "Chewy",
      domain: "chewy.com",
      category: "pets",
      markets: ["US", "CA"],
      featured: false,
      status: "published",
      description: "America's favorite pet store for dog & cat food, prescription medications, toys, and supplies.",
      tips: [
        "Autoship repeat delivery gives 35% off your first order and 5% off recurring shipments."
      ],
      affiliateUrl: "https://chewy.com"
    },
    {
      slug: "samsung",
      name: "Samsung",
      domain: "samsung.com",
      category: "electronics",
      markets: ["US", "UK", "CA", "EU", "AU"],
      featured: true,
      status: "published",
      description: "Official store for Galaxy S25 smartphones, Neo QLED TVs, Galaxy Book laptops, and Bespoke appliances.",
      tips: [
        "Trade-in bonuses give up to $800 credit toward new flagship devices.",
        "Samsung Education & First Responder portal unlocks extra 10% to 20% discounts."
      ],
      affiliateUrl: "https://samsung.com"
    }
  ],
  coupons: [
    {
      id: "nike-member-20",
      storeSlug: "nike",
      title: "Exclusive 20% Off Select Running Shoes & Apparel",
      type: "code",
      code: "SPORT20",
      discount: "20% OFF",
      description: "Save 20% on full-price and sale items for verified Nike Members. Excludes select Jordan releases.",
      expires: "2026-12-31",
      verified: true,
      verifiedAt: "2026-11-01",
      markets: ["US", "UK", "CA", "EU"],
      status: "published",
      featured: true,
      exclusive: true,
      terms: "Must be logged into free Nike Member account. Minimum spend $50. One use per member."
    },
    {
      id: "nike-clearance-deal",
      storeSlug: "nike",
      title: "Up to 50% Off Nike Clearance Sneakers & Sportswear",
      type: "deal",
      code: "",
      discount: "UP TO 50% OFF",
      description: "Instant markdown applied automatically at checkout on over 1,500 discontinued footwear and clothing lines.",
      expires: "2026-11-30",
      verified: true,
      verifiedAt: "2026-11-01",
      markets: ["US", "UK", "CA", "EU", "AU"],
      status: "published",
      featured: true,
      terms: "No promo code required. Prices as marked online."
    },
    {
      id: "nordvpn-74",
      storeSlug: "nordvpn",
      title: "74% Off 2-Year Complete Plan + 3 Extra Months Free",
      type: "deal",
      code: "",
      discount: "74% OFF",
      description: "Get highest-tier NordVPN protection plus NordPass password manager and 1TB encrypted cloud storage.",
      expires: "2026-12-15",
      verified: true,
      verifiedAt: "2026-11-01",
      markets: ["US", "UK", "CA", "EU", "AU"],
      status: "published",
      featured: true,
      exclusive: true,
      terms: "Includes 30-day money-back guarantee. First term billing only."
    },
    {
      id: "asos-new-customer",
      storeSlug: "asos",
      title: "15% Off Your First Order on the ASOS App",
      type: "code",
      code: "ASOSAPP15",
      discount: "15% OFF",
      description: "Download the ASOS mobile app and apply this code at checkout on your first order.",
      expires: "2026-12-31",
      verified: true,
      verifiedAt: "2026-10-30",
      markets: ["US", "UK", "EU", "AU"],
      status: "published",
      featured: true,
      terms: "Valid on first ASOS app purchase only. Min spend $30. Excludes certain brand partner drops."
    },
    {
      id: "bestbuy-appliance-sale",
      storeSlug: "best-buy",
      title: "Save up to $800 on Major Kitchen & Laundry Appliance Packages",
      type: "deal",
      code: "",
      discount: "SAVE $800",
      description: "Bundle 2 or more qualifying Samsung, LG, or Whirlpool appliances and receive instant savings plus free delivery.",
      expires: "2026-11-28",
      verified: true,
      verifiedAt: "2026-10-29",
      markets: ["US", "CA"],
      status: "published",
      featured: true,
      terms: "Applies to qualifying major appliance purchases of $1,499+. In-store and online."
    },
    {
      id: "sephora-free-gift",
      storeSlug: "sephora",
      title: "Free Deluxe Charlotte Tilbury Magic Cream with $45 Order",
      type: "code",
      code: "MAGICSKIN",
      discount: "FREE GIFT",
      description: "Add a 15ml deluxe trial size of the award-winning Charlotte Tilbury Magic Cream with qualifying basket.",
      expires: "2026-11-20",
      verified: true,
      verifiedAt: "2026-11-01",
      markets: ["US", "CA"],
      status: "published",
      featured: false,
      terms: "While stock lasts. One per client. Must be a Beauty Insider member."
    },
    {
      id: "expedia-hotel-bundle",
      storeSlug: "expedia",
      title: "10% Off Worldwide VIP Access Hotel Stays",
      type: "code",
      code: "EXPLORE10",
      discount: "10% OFF",
      description: "Enjoy an extra 10% coupon off standalone hotel bookings across top rated properties worldwide.",
      expires: "2026-12-31",
      verified: true,
      verifiedAt: "2026-11-01",
      markets: ["US", "UK", "CA", "EU", "AU"],
      status: "published",
      featured: true,
      terms: "Book by Dec 31, 2026. Travel through mid-2027. Excludes major brand chains like Marriott and Hilton."
    },
    {
      id: "ubereats-first-order",
      storeSlug: "uber-eats",
      title: "$15 Off Your First 2 Grocery Orders over $30",
      type: "code",
      code: "EATSGROCERY15",
      discount: "$15 OFF",
      description: "Stock up your pantry from local supermarkets and save $15 on each of your first two deliveries.",
      expires: "2026-12-15",
      verified: true,
      verifiedAt: "2026-10-28",
      markets: ["US", "UK", "CA"],
      status: "published",
      featured: true,
      terms: "Order subtotal must be $30+ before taxes and tips. New grocery accounts only."
    },
    {
      id: "samsung-tradein-promo",
      storeSlug: "samsung",
      title: "Extra $150 Instant Trade-In Credit + Free Galaxy Buds FE",
      type: "deal",
      code: "",
      discount: "$150 BONUS",
      description: "Trade in any working phone or tablet toward a new Galaxy device and receive boosted trade-in valuation.",
      expires: "2026-11-30",
      verified: true,
      verifiedAt: "2026-11-01",
      markets: ["US", "UK", "CA", "EU"],
      status: "published",
      featured: false,
      terms: "Requires eligible device trade-in. Device must power on and have clean IMEI."
    },
    {
      id: "udemy-sitewide-sale",
      storeSlug: "udemy",
      title: "Top E-Learning Courses Starting from $11.99",
      type: "deal",
      code: "",
      discount: "FROM $11.99",
      description: "Learn Python, Web Development, Prompt Engineering, Graphic Design, and AWS cloud with lifetime access.",
      expires: "2026-11-18",
      verified: true,
      verifiedAt: "2026-11-01",
      markets: ["US", "UK", "CA", "EU", "AU"],
      status: "published",
      featured: false,
      terms: "Discount applied automatically to new students or active promotions."
    }
  ],
  posts: [
    {
      slug: "how-to-tell-if-a-promo-code-will-work",
      title: "How to Tell If a Promo Code Will Work Before You Reach Checkout",
      excerpt: "Five foolproof checks that save you from expired voucher codes, hidden exclusions, and unexpected renewal rates.",
      author: "Sarah Jenkins, Deals Lead",
      date: "2026-10-25",
      status: "published",
      image: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=1200&h=630&q=80",
      imageAlt: "Shopping cart with discount codes and smartphone",
      body: `A promo code that fails at checkout wastes your time and sometimes tricks you into paying full price. Here are the five quick checks we perform at CouponBuz every day:

## 1. Look for a verified test date
A discount code with no timestamp is just a guess. Favor listings that clearly display when the voucher was last physically tested in a checkout basket.

## 2. Check the minimum spend rule
Many retailers require a minimum subtotal (for example, $50 or £40) excluding shipping fees and sales tax before the coupon field validates.

## 3. Read brand and item exclusions
High-demand luxury lines, newly launched sneakers, and clearance items are frequently exempted from storewide percentage codes.

## 4. Confirm your country and currency match
If you are ordering from the UK or Canada, a US-exclusive coupon code will usually trigger an "Invalid country code" error.

## 5. Watch for introductory vs renewal prices
Especially on software and VPN subscriptions, a 70% voucher usually applies solely to the first billing cycle. Check future renewal rates before subscribing.`
    },
    {
      slug: "black-friday-savings-checklist",
      title: "Black Friday & Cyber Week 2026 Savings Blueprint",
      excerpt: "The battle-tested checklist for international shoppers: price tracking, early VIP drops, and cashback stacking.",
      author: "Marcus Vance, Retail Editor",
      date: "2026-10-20",
      status: "published",
      image: "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?auto=format&fit=crop&w=1200&h=630&q=80",
      imageAlt: "Black Friday shopping tags and gift boxes",
      body: `Black Friday is the largest retail sales event worldwide. To make sure you get genuine discounts rather than artificial markups, follow these guidelines:

## Create a strict 5-item wishlist
List the exact products you need now. Impulse buys account for 60% of overspending during holiday sales.

## Track prices before November
Retailers occasionally raise base prices in October so they can advertise larger percentage slashes in late November. Take a screenshot of current retail values.

## Sign up for free brand memberships
Nike, ASOS, Sephora, and Best Buy give members 24 to 48 hours early access to doorbuster items. By Friday morning, the best sizes and colors are often sold out.`
    },
    {
      slug: "stacking-coupons-cashback-and-sales",
      title: "Coupon Stacking: How to Combine Promo Codes, Sales and Loyalty Points",
      excerpt: "Learn which retailers allow multiple discount vouchers on top of clearance prices and cashback portals.",
      author: "Elena Rostova",
      date: "2026-10-14",
      status: "published",
      image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1200&h=630&q=80",
      imageAlt: "Wallet and calculator showing stacked savings",
      body: `Can you use a promo code, get free delivery, and earn rewards points simultaneously? In many cases, yes!

### 1. Promo Code + Clearance Item
Look for stores that advertise "Take an extra 20% off clearance prices". ASOS and Nike frequently run these double-dip promotions.

### 2. Loyalty Points Redemption
Most rewards schemes (such as Sephora Beauty Insider or IKEA Family) treat loyalty points like cash tender, meaning you can enter a promo code first, and then apply your rewards balance.

### 3. Cashback Portal Guidelines
Some affiliate networks void cashback tracking if an unauthorized third-party voucher is entered. Always use verified public vouchers to ensure cashback tracking remains intact.`
    }
  ],
  pages: [
    {
      slug: "about",
      title: "About CouponBuz",
      status: "published",
      seoDescription: "CouponBuz is an independent verified promo code platform helping shoppers across the US, UK, Canada, Australia and Europe save money.",
      body: `## Our Mission
At **CouponBuz**, we believe online shopping should be transparent, rewarding, and free of broken promo codes. 

Thousands of coupon websites scrape expired codes that waste shoppers' time. CouponBuz was built differently: our editors hand-test codes, record the exact date tested, and immediately archive expired promotions.

### What Makes Us Different
- **Daily Hand Verification:** We check deals by placing items into real checkout baskets.
- **Clear Terms & Conditions:** Minimum spends, excluded brands, and regional limits are stated clearly on every card.
- **Multi-Country Coverage:** Tailored vouchers for US, UK, Canada, Australia, and European markets.
- **Zero Spam:** No deceptive clicks or fake countdown timers.`
    },
    {
      slug: "how-we-verify",
      title: "How We Verify Promo Codes",
      status: "published",
      seoDescription: "Our strict quality process: how our editorial team tests, stamps, and retires discount vouchers.",
      body: `## Our 4-Stage Verification Process

Every coupon published on CouponBuz goes through a strict testing procedure:

1. **Source Direct from Brands & Affiliate Networks:** We receive official vouchers directly from authorized merchant affiliate programs and brand managers.
2. **Basket Testing:** A staff member pastes the promo code into a real cart on the official merchant website to verify that the discount applies.
3. **Condition Documentation:** We document exclusions (e.g. valid on full-price only, minimum spend required, or new customers only).
4. **Timestamp & Expiry Automation:** Every offer displays its "Last Checked" date. When a code hits its expiration date, our system removes it from public view.`
    },
    {
      slug: "how-we-make-money",
      title: "How CouponBuz Makes Money (Affiliate Disclosure)",
      status: "published",
      seoDescription: "Transparent affiliate disclosure explaining how CouponBuz generates revenue with zero cost to you.",
      body: `## Complete Transparency
CouponBuz is 100% free for visitors. We fund our team, servers, and ongoing testing through affiliate partnerships.

### How Affiliate Links Work
When you click on a store link or reveal a promo code on CouponBuz, a tracking cookie may be placed by the retailer's affiliate network. If you make a purchase, the merchant pays CouponBuz a small referral commission.

### Key Points for Shoppers
- **Zero Cost to You:** Using our link never increases the price you pay. In fact, our goal is to lower your price.
- **Editorial Independence:** Merchant commissions never dictate our ratings or whether a store is listed. If a code expires, we remove it regardless of partnership status.`
    },
    {
      slug: "contact",
      title: "Contact CouponBuz",
      status: "published",
      seoDescription: "Get in touch with the CouponBuz editorial team, report an expired code, or inquire about merchant partnerships.",
      body: `## We Are Here to Help

Have a question, feedback, or found a code that needs updating? We read every submission.

- **Editorial & Code Reports:** hello@couponbuz.com
- **Merchant Partnerships:** partners@couponbuz.com
- **Office Location:** San Francisco, CA & London, UK

You can also use our interactive contact form or submit a coupon directly through our Submit page.`
    },
    {
      slug: "privacy",
      title: "Privacy Policy",
      status: "published",
      seoDescription: "CouponBuz Privacy Policy outlining visitor data handling, cookies, and international data protection standards.",
      body: `## Privacy Policy
*Last updated: November 2026*

CouponBuz respects your personal privacy. We do not require visitors to register an account to browse deals or copy promo codes.

### Information We Collect
- **Analytical Data:** Standard server and analytics data (anonymized IP, browser type, referring pages).
- **Submissions:** If you submit a promo code or contact message, we store the details provided to process your request.
- **Cookies:** Third-party affiliate cookies may be set when clicking outbound retailer links to record referrals.`
    },
    {
      slug: "terms",
      title: "Terms of Use",
      status: "published",
      seoDescription: "CouponBuz Terms of Service and disclaimer of warranties regarding third-party coupons and merchant offers.",
      body: `## Terms of Service

By using CouponBuz, you agree to these Terms of Use.

### Offer Accuracy
While we strive to keep every listing accurate, merchants retain the right to modify or terminate promotions without notice. CouponBuz is not responsible for expired or altered retailer deals.

### Outbound Links
CouponBuz links to third-party merchant sites. Purchases made on third-party domains are subject to the respective retailer's terms and privacy policies.`
    }
  ],
  collections: [
    {
      slug: "black-friday",
      name: "Black Friday 2026",
      status: "published",
      stores: ["best-buy", "nike", "samsung", "asos", "sephora", "ikea", "nordvpn"],
      seoTitle: "Black Friday 2026 Promo Codes & Deals Hub",
      seoDescription: "Verified Black Friday 2026 early deals, discount vouchers, and doorbusters for US, UK, Canada, Australia and Europe.",
      intro: "Black Friday offers the deepest discounts of the shopping calendar. Browse verified promo codes and early deals from top electronics, fashion, and home brands.",
      body: `## What to Expect for Black Friday 2026
Tech retailers like **Best Buy** and **Samsung** launch doorbusters in early November. Fashion retailers such as **Nike** and **ASOS** typically release extra 20% to 30% discount codes closer to Thanksgiving weekend.

Bookmark this page for live updates as new voucher codes go live!`
    },
    {
      slug: "christmas",
      name: "Christmas Holiday Deals",
      status: "published",
      stores: ["asos", "sephora", "nike", "ikea", "expedia", "chewy"],
      seoTitle: "Christmas 2026 Gift Deals & Holiday Promo Codes",
      seoDescription: "Spread the joy with holiday gift sets, free shipping codes, and winter clearance vouchers.",
      intro: "Save on holiday gift shopping, festive home decor, and winter travel packages.",
      body: `## Holiday Delivery Cut-Offs
Always check the guaranteed Christmas delivery cut-off date before checking out. Many stores offer free expedited shipping vouchers during December.`
    }
  ],
  redirects: [
    { from: "/discount-codes/", to: "/stores/", code: "301", active: true, note: "Legacy directory redirect" },
    { from: "/vouchers/", to: "/stores/", code: "301", active: true, note: "UK voucher alias" }
  ],
  submissions: [
    {
      id: "sub-1",
      kind: "coupon",
      store: "Adidas",
      title: "25% Off Ultraboost Running Shoes",
      code: "BOOST25",
      url: "https://adidas.com",
      description: "Tested on Adidas US official site. Worked on Ultraboost Light line.",
      markets: ["US", "CA"],
      expires: "2026-11-25",
      email: "shopper99@gmail.com",
      type: "code",
      status: "pending",
      createdAt: "2026-11-01T14:22:00Z"
    },
    {
      id: "sub-2",
      kind: "contact",
      store: "Contact Form",
      title: "Partnership Inquiry from Gymshark",
      description: "Hi CouponBuz team, we would love to provide exclusive promo codes for your fitness audience.",
      email: "affiliates@gymshark.com",
      status: "message",
      createdAt: "2026-10-31T09:15:00Z"
    }
  ],
  media: [
    {
      id: "m-1",
      name: "Black Friday Hero Banner",
      url: "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?auto=format&fit=crop&w=1200&h=630&q=80",
      type: "image/jpeg",
      size: 142000,
      createdAt: "2026-11-01T10:00:00Z"
    },
    {
      id: "m-2",
      name: "Tech & Laptop Deals",
      url: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=1200&h=630&q=80",
      type: "image/jpeg",
      size: 185000,
      createdAt: "2026-11-01T11:00:00Z"
    }
  ]
};
