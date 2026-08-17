# أكاديمية المهن الذكية — Intelligent Career Academy (ICA)

موقع شركة ICA — موقع بورتفوليو ثابت بالعربية مبنيّ بـ HTML/CSS/JS فقط، جاهز للنشر مباشرة على GitHub Pages.

---

## 📂 Project Structure

```
ica-website/
├── index.html                      ← الصفحة الرئيسية
├── 404.html                        ← GitHub Pages auto-uses this
├── README.md
│
├── pages/                          ← كل الصفحات الفرعية
│   ├── services.html               ← خدماتنا
│   ├── courses.html                ← الدورات
│   ├── conferences.html            ← المؤتمرات
│   ├── designs.html                ← التصاميم
│   ├── labs.html                   ← المختبرات
│   ├── consultation.html           ← طلب استشارة
│   ├── coming-soon.html            ← قريباً (مُعاد استخدامها)
│   ├── afaq.html                   ← Landing — آفاق (gold)
│   └── azar.html                   ← Landing — آزار (teal)
│
├── partials/                       ← مكوّنات قابلة لإعادة الاستخدام
│   ├── navbar.html                 ← شريط التنقّل
│   └── footer.html                 ← التذييل
│
└── assets/
    ├── css/
    │   ├── theme.css               ← ⭐ المصدر الوحيد للألوان/الخطوط/المسافات
    │   ├── base.css                ← reset + typography + RTL utilities
    │   ├── components.css          ← navbar, footer, buttons, cards, forms
    │   ├── animations.css          ← keyframes + scroll-reveal
    │   ├── pages.css               ← تخطيطات خاصّة بكل صفحة
    │   └── landing.css             ← Premium landing pages (آفاق + آزار)
    │
    ├── js/
    │   ├── main.js                 ← partial injection, mobile menu, smooth scroll
    │   ├── animations.js           ← scroll reveal + animated counters
    │   └── carousel.js             ← Courses page carousel
    │
    ├── images/                     ← (placeholders — replace with real images)
    └── icons/                      ← (inline SVG sprite — most icons are inline)
```

---

## 🚀 Deployment to GitHub Pages

1. Create a new GitHub repository (any name works).
2. Push the entire `ica-website/` folder contents to the repo's root.
3. In the repo go to **Settings → Pages**.
4. Source: **Deploy from a branch** → `main` (or `master`) → `/ (root)`.
5. Save. Your site will be live at `https://<username>.github.io/<repo>/` within ~1 minute.

The site uses **relative paths everywhere**, so it works whether deployed to a subdomain (`username.github.io/repo/`) or a custom domain.

---

## 🎨 Design System

### Theme tokens — `assets/css/theme.css`
**Every** color, font, spacing, radius, and shadow is a CSS custom property. To rebrand the entire site, edit only this file.

```css
--gold:            #C9A84C;   /* primary brand */
--cream:           #FAF7F0;   /* page background */
--ink:             #1A1610;   /* text */
--teal:            #0F6E56;   /* secondary, used on آزار */
```

### Theme variants
The آزار landing page uses `<body data-theme="teal">` to repaint the entire page in teal without changing component CSS.

To make a new themed variant later: add `[data-theme="purple"] { --gold: #...; ... }` to `theme.css` and use `<body data-theme="purple">` on whichever page should use it.

### Fonts
- **Cairo** — display headlines (h1–h3, brand wordmark)
- **Tajawal** — body text, paragraphs, UI labels

Both load from Google Fonts via `<link>` in each page's `<head>`.

---

## 🧩 Reusable Components

### Navbar & Footer
Both are loaded from `partials/` via `main.js` using `fetch()`. In any new page, just include:

```html
<div data-include="navbar"></div>
<!-- ... page content ... -->
<div data-include="footer"></div>
```

Then `<script src="../assets/js/main.js"></script>` does the rest.

> **Note on local development:** `fetch()` doesn't work over the `file://` protocol. For local preview, run a tiny static server. From the project folder:
> - Python:  `python3 -m http.server 8000`
> - Node.js: `npx serve`
> - VS Code: install the **Live Server** extension and click "Go Live".

### Buttons (`.btn`)
- `.btn-primary` — gold filled (primary CTA)
- `.btn-secondary` — outlined neutral
- `.btn-dark` — dark filled (used on light backgrounds)
- `.btn-ghost` — gold outlined (subtle CTAs)

### Cards
- `.card` — base card
- `.card.card-hover` — adds lift + shadow on hover
- `.value-card` — used on "Vision/Mission/Values"
- `.testimonial-card` — used on testimonials grid
- `.course-card` — used in courses list
- `.lab-card`, `.conference-card`, `.design-card` — page-specific

### Section heading
```html
<div class="section-head reveal">
  <span class="section-label">عنوان فرعي</span>
  <h2>العنوان الرئيسي <span>المميّز</span></h2>
  <p>وصف اختياري</p>
</div>
```

### Scroll reveal
Add `class="reveal"` to any element (variants: `reveal-right`, `reveal-left`, `reveal-scale`). For staggered animations on grid items, add `reveal-stagger-1` … `reveal-stagger-6`.

### Animated counters
```html
<div class="stat-number" data-count="2400">0<span class="stat-suffix">+</span></div>
```
The number animates from 0 → 2400 once it scrolls into view. The suffix span is preserved.

---

## ✏️ Replacing Content

Every editable area is marked in the HTML with a comment like:

```html
<!-- REPLACE: company "About Us" copy. -->
```

Or for images:

```html
<!-- REPLACE: real images for each course -->
```

Image placeholders are decorative SVG icons or gradient blocks. To swap an image:

```html
<!-- BEFORE -->
<div class="course-card-img">📚</div>

<!-- AFTER -->
<div class="course-card-img">
  <img src="../assets/images/your-image.jpg" alt="وصف الصورة" loading="lazy">
</div>
```

The card CSS already handles `<img>` correctly inside `.course-card-img`.

---

## ♿ Accessibility

- ✅ Skip-to-content link on every page
- ✅ Semantic HTML5 landmarks (`<nav>`, `<main>`, `<footer>`, `<article>`)
- ✅ ARIA labels on interactive elements
- ✅ Visible focus styles (`:focus-visible` outline)
- ✅ Mobile menu closeable via Escape key
- ✅ `prefers-reduced-motion` respected — all animations disable for users who request it
- ✅ Touch targets ≥ 44×44px
- ✅ RTL layout correctly applied

---

## 🔮 When the brand `.md` files arrive

You said additional brand documents will come later. Here's the integration plan:

1. **Color palette** → update CSS variables in `assets/css/theme.css` (rows 14-46).
2. **Typography** → update `--font-body`, `--font-display`, font sizes in `theme.css`.
3. **Component behavior rules** → adjust component CSS in `assets/css/components.css`.
4. **No HTML changes needed** — every component already references tokens.

For آفاق & آزار specifically: their differentiation lives entirely in `[data-theme="teal"]` in `theme.css`. Add additional brand variants there.

---

## 🛠️ Adding a New Page

1. Copy any existing inner page (e.g. `pages/labs.html`) to `pages/your-page.html`.
2. Update `<title>`, `<meta name="description">`, and the page content.
3. Add a link to it in `partials/navbar.html` (and `partials/footer.html` if needed).
4. Done — `main.js` auto-injects nav/footer and handles active states.

---

## 📋 To-Do for Production

- [ ] Replace all logos and text marked `<!-- REPLACE -->`
- [ ] Replace placeholder images with real photography
- [ ] Update social media URLs in `partials/footer.html`
- [ ] Update phone, email, address in `partials/footer.html` and `pages/consultation.html`
- [ ] Connect the consultation/sample forms to a real backend (Formspree, Netlify Forms, or your own endpoint)
- [ ] Add real testimonial avatars (currently text-based fallback)
- [ ] Add Open Graph image (`assets/images/og-image.jpg`) and reference it in each page's `<head>`
- [ ] Set up a custom domain in GitHub Pages settings if applicable

---

## 🎯 Browser Support

Modern evergreen browsers (Chrome, Firefox, Safari, Edge — last 2 versions). The site uses:
- CSS custom properties
- IntersectionObserver
- `fetch()` for partials
- `backdrop-filter` (graceful fallback)

For IE11 — not supported (it's been EOL since 2022).

---

**License:** © Intelligent Career Academy. All rights reserved.
