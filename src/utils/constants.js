// API base (set VITE_API_URL in your .env to override)
// If your backend runs on port 4000, set VITE_API_URL=http://localhost:4000/api
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Base origin for static files (uploads). You can also set VITE_ASSET_URL, e.g. http://localhost:4000
export const ASSET_BASE_URL =
    import.meta.env.VITE_ASSET_URL || API_BASE_URL.replace(/\/api$/, '');

// Static image URLs are served by the backend at /uploads/images/<filename>
export const IMAGES = {
    BASE: `${ASSET_BASE_URL}/uploads/images`,
    url: (value) => {
        if (!value) return '';
        // Absolute URL? Return as-is
        if (/^https?:\/\//i.test(value)) return value;

        // If the value already starts with "/uploads" → prefix with origin
        if (value.startsWith('/uploads/')) return `${ASSET_BASE_URL}${value}`;

        // If the value starts with "uploads/..." → add a leading slash and prefix with origin
        if (value.startsWith('uploads/')) return `${ASSET_BASE_URL}/${value}`;

        // Otherwise treat as a bare filename (e.g., "image.png" or "folder/image.png")
        return `${ASSET_BASE_URL}/uploads/images/${value}`;
    },
};

/*
  QUICK REFERENCE:
  - Public GETs (content)
  - Admin-only POST/PUT/DELETE (CMS)
  - Upload fields are commented where applicable
*/

// Backward-compatible shortcuts
export const ENDPOINTS = {
    // Auth
    LOGIN: '/auth/login',              // POST
    LOGOUT: '/auth/logout',            // POST
    REFRESH_TOKEN: '/auth/refresh',    // (not implemented – placeholder)
    // Generic module roots (compat)
    HOME: '/home',
    ABOUT: '/about',                   // (About items under HOME.ABOUT_ROUTES)
    CONTACT: '/inquiries',             // public POST contact form, admin GET/DELETE
    OUR_WORK: '/our-work',
    VISION_MISSION: '/vm',
    SETTINGS: '/settings',
    PROFILE: '/profile',               // Profile singleton route
    RECEIPT: '/receipt',               // (not implemented here)

    // Detailed, organized routes
    AUTH_ROUTES: {
        SIGNUP: '/auth/signup',                              // POST
        LOGIN: '/auth/login',                                // POST
        LOGOUT: '/auth/logout',                              // POST
        CHANGE_PASSWORD: '/auth/change-password',            // PUT (auth)
        FORGOT_PASSWORD: '/auth/forgot-password',            // POST
        RESET_PASSWORD: (token) => `/auth/reset-password/${token}`, // POST
    },

    // Home page modules
    HOME_ROUTES: {
        // Hero slider (multiple slides)
        HERO: {
            LIST: '/home/hero',                                // GET (public)
            DETAIL: (id) => `/home/hero/${id}`,                // GET (public)
            CREATE: '/home/hero',                              // POST (admin) form-data: image (File), useUpload=1 OR JSON with imageUrl
            UPDATE: (id) => `/home/hero/${id}`,                // PUT (admin)
            DELETE: (id) => `/home/hero/${id}`,                // DELETE (admin)
            RESET: '/home/hero',                               // DELETE (admin, bulk)
        },
        // Stats (CRUD single stat items)
        STATS: {
            LIST: '/home/stats',                               // GET (public)
            DETAIL: (id) => `/home/stats/${id}`,               // GET (public)
            CREATE: '/home/stats',                             // POST (admin) JSON: icon, color, number, label
            UPDATE: (id) => `/home/stats/${id}`,               // PUT (admin)
            DELETE: (id) => `/home/stats/${id}`,               // DELETE (admin)
            RESET: '/home/stats',                              // DELETE (admin, bulk)
        },
        // About cards (multiple)
        ABOUT: {
            LIST: '/home/about',                               // GET (public)
            DETAIL: (id) => `/home/about/${id}`,               // GET (public)
            CREATE: '/home/about',                             // POST (admin) form-data: mainImage (File) OR JSON: mainImage (URL), useUpload
            UPDATE: (id) => `/home/about/${id}`,               // PUT (admin)
            DELETE: (id) => `/home/about/${id}`,               // DELETE (admin)
            RESET: '/home/about',                              // DELETE (admin, bulk)
        },
        // About videos (multiple)
        VIDEO: {
            LIST: '/home/video',                               // GET (public)
            DETAIL: (id) => `/home/video/${id}`,               // GET (public)
            CREATE: '/home/video',                             // POST (admin) JSON: videoTitle, videoUrl, videoDescription
            UPDATE: (id) => `/home/video/${id}`,               // PUT (admin)
            DELETE: (id) => `/home/video/${id}`,               // DELETE (admin)
            RESET: '/home/video',                              // DELETE (admin, bulk)
        },
    },

    // About Us page
    ABOUT_US_ROUTES: {
        // Hero images (multiple)
        HERO: {
            LIST: '/about-us/hero',                            // GET (public)
            DETAIL: (id) => `/about-us/hero/${id}`,            // GET (public)
            CREATE: '/about-us/hero',                          // POST (admin) form-data: image (File) or JSON imageUrl with useUpload
            UPDATE: (id) => `/about-us/hero/${id}`,            // PUT (admin)
            DELETE: (id) => `/about-us/hero/${id}`,            // DELETE (admin)
            RESET: '/about-us/hero',                           // DELETE (admin, bulk)
        },
        // About section (singleton)
        ABOUT: {
            GET: '/about-us/about',                            // GET (public)
            UPSERT: '/about-us/about',                         // POST/PUT (admin) form-data: image (File) or JSON imageUrl with useUpload
            RESET: '/about-us/about',                          // DELETE (admin)
        },
        // Areas we work (multiple)
        AREAS: {
            LIST: '/about-us/areas',                           // GET (public)
            DETAIL: (id) => `/about-us/areas/${id}`,           // GET (public)
            CREATE: '/about-us/areas',                         // POST (admin) form-data: image (File) or JSON imageUrl with useUpload
            UPDATE: (id) => `/about-us/areas/${id}`,           // PUT (admin)
            DELETE: (id) => `/about-us/areas/${id}`,           // DELETE (admin)
            RESET: '/about-us/areas',                          // DELETE (admin, bulk)
        },
    },

    // Vision & Mission page
    VISION_MISSION_ROUTES: {
        HERO: {
            GET: '/vm/hero',                                   // GET (public)
            UPSERT: '/vm/hero',                                // POST/PUT (admin) form-data: image (File) or JSON imageUrl with useUpload
            RESET: '/vm/hero',                                 // DELETE (admin)
        },
        ITEMS: {
            LIST: '/vm/items',                                 // GET (public)
            BY_TYPE: (type) => `/vm/items?type=${encodeURIComponent(type)}`, // GET (public)
            DETAIL: (id) => `/vm/items/${id}`,                 // GET (public)
            CREATE: '/vm/items',                               // POST (admin) form-data: image (File) or JSON imageUrl with useUpload, type, title
            UPDATE: (id) => `/vm/items/${id}`,                 // PUT (admin)
            DELETE: (id) => `/vm/items/${id}`,                 // DELETE (admin)
            RESET: '/vm/items',                                // DELETE (admin, bulk)
        },
    },

    // Our Work (cards + full details)
    OUR_WORK_ROUTES: {
        SUMMARY: '/our-work/summary',                        // GET (public) -> [{ id, title, coverImageUrl }]
        LIST: '/our-work',                                   // GET (public) full list
        DETAIL: (id) => `/our-work/${id}`,                   // GET (public) full single
        CREATE: '/our-work',                                 // POST (admin) form-data: title, coverUseUpload + coverImage (File) or coverImageUrl
        UPDATE: (id) => `/our-work/${id}`,                   // PUT (admin) multipart: multiple image fields (see docs)
        DELETE: (id) => `/our-work/${id}`,                   // DELETE (admin)
        RESET: '/our-work',                                  // DELETE (admin, bulk)
        // File fields:
        // - coverImage, heroImage, whatImage (single, toggle URL/upload)
        // - solutionsImages (1..4 files)
        // - galleryImages (3..6 files)
    },

    // Invoices
    INVOICES_ROUTES: {
        LIST: '/invoices',                                   // GET (auth)
        DETAIL: (id) => `/invoices/${id}`,                   // GET (auth)
        CREATE: '/invoices',                                 // POST (auth) JSON (auto invoiceNo)
        UPDATE: (id) => `/invoices/${id}`,                   // PUT (auth)
        DELETE: (id) => `/invoices/${id}`,                   // DELETE (auth)
    },

    // Contact / Inquiries
    INQUIRIES_ROUTES: {
        CREATE: '/inquiries',                                // POST (public) JSON: name, email, phone, city, organization, subject, message
        LIST: '/inquiries',                                  // GET (admin)
        DETAIL: (id) => `/inquiries/${id}`,                  // GET (admin) marks Read
        DELETE: (id) => `/inquiries/${id}`,                  // DELETE (admin)
    },

    // Settings (singleton)
    SETTINGS_ROUTES: {
        GET: '/settings',                                    // GET (public)
        UPDATE: '/settings',                                 // PUT (admin)
    },

    // Profile (singleton) - NGO Organization Details
    // Fields: profilePicture, ngoName*, description, mobileNo*, email, website, address, socialLinks
    PROFILE_ROUTES: {
        GET: '/profile',                                     // GET (public) - Get profile for website display
        GET_ADMIN: '/profile/admin',                         // GET (admin) - Get profile for admin panel
        UPSERT: '/profile',                                  // POST/PUT (admin) - Create/Update profile
        // form-data: profilePicture (File), useUpload=1
        // OR JSON: { profilePicture: "URL", useUpload: false, ... }
        // Fields: ngoName*, description, mobileNo*, email, website, address
        // Social: facebook, twitter, instagram, linkedin, youtube
        // OR socialLinks: { facebook, twitter, instagram, linkedin, youtube }
        UPDATE_PICTURE: '/profile/picture',                  // PUT/POST (admin) - Update profile picture only
        // form-data: profilePicture (File), useUpload=1
        // OR JSON: { profilePicture: "URL", useUpload: false }
        DELETE_PICTURE: '/profile/picture',                  // DELETE (admin) - Remove profile picture
        RESET: '/profile/reset',                             // DELETE (admin) - Reset profile to defaults
    },

    DASHBOARD_ROUTES: {
        // Main overview stats
        STATS: '/dashboard/stats',                           // GET (admin) - Full dashboard statistics

        // Quick counts (lightweight)
        COUNTS: '/dashboard/counts',                         // GET (admin) - Simple counts only

        // Recent activity feed
        ACTIVITY: '/dashboard/activity',                     // GET (admin) ?limit=10 - Recent activity

        // Detailed analytics
        INQUIRY_ANALYTICS: '/dashboard/inquiries/analytics', // GET (admin) ?period=7days|30days|12months|year
        INVOICE_ANALYTICS: '/dashboard/invoices/analytics',  // GET (admin) ?period=30days|12months|year|all
        CONTENT_ANALYTICS: '/dashboard/content/analytics',   // GET (admin) - Content module stats
    },
};

// Optional: where images are accessible (examples)
// - Full path example: IMAGES.url('hero-1736929230.png')
// - Base folder in browser: `${ASSET_BASE_URL}/uploads/images`
// - If your DB stores full URLs already (e.g. https://cdn...), just render those directly.
export const TOKEN_KEY = 'auth_token';
export const USER_KEY = 'auth_user';