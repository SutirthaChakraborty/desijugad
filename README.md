# Desi Jugad

**Free, private file conversion for everyone.**
A 100% static website with **80+ browser-based tools** — converters, calculators, utilities, and a small AI Studio. No uploads, no sign-up, no backend, no cost to run.

Built in India, designed for the world. Hosted at [desijugad.co.in](https://desijugad.co.in).

**Deploys to GitHub Pages out of the box** (also works on Cloudflare Pages, Netlify, Vercel, or any static host).

---

## What you're getting

A production-ready static website you can deploy in about 5 minutes. Everything runs in the browser; there is no backend to host, no database to manage, and no ongoing infrastructure cost beyond a domain name (~$10/year) and an optional CDN (free on Cloudflare Pages, Netlify, or Vercel).

### Included converters

**Image & Graphics**

| Tool | What it does | Library used |
|------|--------------|--------------|
| HEIC to JPG | iPhone photos → JPG/PNG | heic2any |
| Image Converter | PNG, JPG, WebP, BMP interconversion | Canvas API |
| Images to PDF | Stitch images into a single PDF | jsPDF |
| PDF to Images | Extract pages as PNG/JPG | pdf.js |
| SVG to PNG | Rasterize vectors with custom size | Canvas API |
| Image Compress | Reduce image file size | Canvas API |
| Image Resize | Resize images to custom dimensions | Canvas API |
| Image Cropper | Crop and edit images | Canvas API |
| Image Metadata | Extract EXIF and other metadata | exifr.js |
| JPG to WebP | Convert JPG to modern WebP format | Canvas API |
| WebP to JPG | Convert WebP to JPG format | Canvas API |
| QR Code Generator | Generate QR codes from text/URLs/WiFi | qrcodejs |
| Barcode Generator | Create various barcode formats | JSBarcode |
| Favicon Generator | Create favicons from images | Canvas API |
| Meme Generator | Create memes from images | Canvas API |

**Audio & Video**

| Tool | What it does | Library used |
|------|--------------|--------------|
| Audio Converter | MP3, WAV, OGG, M4A, FLAC conversion | lame.js, Web Audio API |
| Video Converter | MP4, WebM, MOV, AVI, MKV conversion | FFmpeg.wasm |
| Video Compressor | Reduce video file size | FFmpeg.wasm |
| Video Trimmer | Trim and cut video clips | FFmpeg.wasm |
| Video to Audio | Extract audio from video files | FFmpeg.wasm |
| Video to GIF | Convert video to animated GIF | FFmpeg.wasm |
| GIF to Video | Convert GIF to video format | FFmpeg.wasm |
| Speech to Text | Convert audio to text transcription | Web Speech API |
| Text to Speech | Convert text to audio | Web Speech API |

**Data & Formatting**

| Tool | What it does | Library used |
|------|--------------|--------------|
| JSON ⇄ CSV | Flatten nested JSON or parse CSV | Pure JS |
| JSON ⇄ YAML | Convert between JSON and YAML | js-yaml |
| XML to JSON | Convert XML to JSON format | xml2js |
| CSV to Excel | Export CSV as a real .xlsx file | SheetJS |
| JSON Formatter | Format and validate JSON | Pure JS |
| Markdown to HTML | Render MD with live preview | marked.js |
| Base64 | Encode/decode text & files | Web APIs |
| SRT ⇄ VTT | Subtitle format conversion | Pure JS |
| Text Tools | Case convert, counter, slugify, trim | Pure JS |
| Diff Checker | Compare two text documents | difflib.js |
| Email Validator | Validate email addresses | Pure JS |
| Regex Tester | Test and debug regex patterns | Pure JS |
| Code Beautifier | Format and beautify code | prettier.js |
| Hash Generator | Generate MD5, SHA hashes | crypto-js |
| URL Tools | Encode, decode, parse URLs | Pure JS |
| OCR | Extract text from images | Tesseract.js |
| QR Scanner | Scan QR codes from images/camera | jsQR |

**PDF Tools**

| Tool | What it does | Library used |
|------|--------------|--------------|
| PDF Compressor | Reduce PDF file size | pdf.js, jsPDF |
| PDF Merge | Combine multiple PDFs | jsPDF |
| PDF Rotate | Rotate PDF pages | pdf.js, jsPDF |
| PDF Watermark | Add watermarks to PDFs | jsPDF |

**Calculators & Tools**

| Tool | What it does | Library used |
|------|--------------|--------------|
| Loan Calculator | Calculate EMI, interest, amortization | Pure JS |
| EMI Calculator | Compute monthly loan payments | Pure JS |
| BMI Calculator | Calculate body mass index | Pure JS |
| Age Calculator | Calculate exact age from birthdate | date-fns |
| Currency Converter | Live exchange rates (160+ currencies) | Exchange rate API |
| Unit Converter | Convert length, weight, temperature | Pure JS |
| Percentage Calculator | Calculate percentages and ratios | Pure JS |
| Compound Interest Calculator | Calculate investment growth | Pure JS |
| SIP Calculator | Calculate SIP returns | Pure JS |
| CAGR Calculator | Compound annual growth rate | Pure JS |
| Income Tax Calculator | Calculate tax for India | Pure JS |
| GST Calculator | Calculate GST for India | Pure JS |
| Debt Payoff Calculator | Plan debt repayment | Pure JS |
| Lead Value Calculator | Calculate marketing lead value | Pure JS |
| AdSense Calculator | Estimate AdSense earnings | Pure JS |
| Churn Rate Calculator | Analyze customer retention | Pure JS |
| Retirement Calculator | Plan retirement savings | Pure JS |
| Pomodoro Timer | Productivity timer | Pure JS |
| Word Counter | Count words, characters, readability | Pure JS |
| Timestamp Converter | Convert Unix timestamps | Pure JS |
| Readability Analyzer | Analyze text readability | readability-scores.js |
| Password Generator | Generate secure passwords | crypto-js |
| Translate | Translate text between languages | Translation API |

**Document Generators**

| Tool | What it does | Library used |
|------|--------------|--------------|
| Invoice Generator | Create professional invoices | jsPDF |
| Receipt Generator | Generate receipts | jsPDF |
| Resume Builder | Create formatted resumes | jsPDF |
| Serp Simulator | Preview search engine results | Pure JS |
| Secret Message | Hide text in images | Canvas API |
| Color Converter | Convert between color formats | Pure JS |
| Color Palette | Generate color palettes | Pure JS |
| Password Generator | Generate secure passwords | crypto-js |
| Photo Editor | Basic photo editing tools | Canvas API |

---

## AI Studio (browser-direct, no proxy)

Desi Jugad includes a small AI Studio that runs **entirely from the browser** — no backend, no proxy. We dropped Replicate, Suno, and OpenAI from the original lineup because none of those providers allow direct browser API calls (CORS blocks them, even with the user's own key). What remains works honestly on a static site.

### AI tools included

| Tool | What it does | Provider |
|------|--------------|---------|
| AI Image Studio | Generate images from a text prompt | Pollinations (free, no key) + Gemini Imagen 3 (BYOK) |
| AI Writer | Long-form articles, blog posts, scripts, social copy | Gemini 2.5 (BYOK) |
| AI Photo Studio | Edit any photo with a sentence (passport bg, cinematic, restore, etc.) | Gemini multimodal (BYOK) |
| AI Social Post Maker | Pre-sized graphics for IG, LinkedIn, X, Story, YouTube | Pollinations + Gemini |
| AI Background Remover | Cut out backgrounds with WebGPU/WASM | `@imgly/background-removal` (client-side ONNX, no API) |
| AI Settings | Manage keys, all stored in `localStorage` only | — |

### How to get a Gemini API key (free)

1. Visit [aistudio.google.com/apikey](https://aistudio.google.com/apikey) and sign in with any Google account
2. Click "Create API key" — no credit card needed for the free tier
3. Paste it at `/ai/settings.html`

The key never leaves your browser. Calls go straight from your browser to Google's API.

### Free, no-key option

Pollinations.ai is wired in as the default for the Image Studio and Social Post Maker. No key, no sign-up, no watermark.

### Why not Replicate / Suno / OpenAI?

All three reject browser-direct API calls — they explicitly require a backend. The previous version of Desi Jugad solved this with a Cloudflare Pages Function proxy (`functions/api/proxy.js`), but that contradicts the static-site promise and locks you into Cloudflare. We removed the proxy and the providers that needed it.

### Privacy

Keys are stored in browser `localStorage` under `dj_ai_keys_v1`. They are sent only to the relevant provider (Google, Hugging Face) — never to desijugad.co.in. Clear your browser data and they're gone.

The original converters keep working offline after first load. AI Studio tools need an internet connection because generations run against the provider's API.

### What else is in the box

- Homepage with a filterable grid of all tools
- Blog index and 3 sample SEO-optimised articles (~1,500 words each)
- About, Contact, Privacy, and Terms pages
- `sitemap.xml` and `robots.txt`
- Schema.org JSON-LD markup on every converter page
- Open Graph and Twitter card meta tags
- Fully mobile responsive
- Dark navigation, warm cream base palette, magazine-style typography
- Zero tracking, zero cookies, zero third-party scripts other than CDN-hosted conversion libraries

---

## Quick start — deploy in 5 minutes

You don't need a server. You don't need Node.js. You don't even need Git. The whole site is plain HTML, CSS, and JavaScript.

### Option 1 — GitHub Pages (recommended)

The repo ships with `.nojekyll` and a `CNAME` ready to go.

1. Push the repo to GitHub (public or private — Pages works on both for `Pages for free` accounts).
2. Open **Settings → Pages**.
3. Source: **Deploy from a branch**, branch: `main`, folder: `/ (root)`.
4. Save. First deploy takes 1–2 minutes.
5. Your site is live at `yourname.github.io/reponame`.
6. **Custom domain:** edit `CNAME` to your domain, point your DNS at GitHub Pages (`A` records to `185.199.108.153`/etc., or `CNAME` to `yourname.github.io`), and check **Enforce HTTPS** in the Pages settings.

That's it. No build step. No CI required (Pages auto-deploys when `main` updates).

### Option 2 — Cloudflare Pages

Also works fine. The Cloudflare-specific `functions/api/proxy.js` was removed, so there are no Cloudflare-only dependencies anymore. The site behaves identically on Cloudflare and GitHub Pages.

1. Go to [pages.cloudflare.com](https://pages.cloudflare.com).
2. Connect your GitHub repo, or drag the folder.
3. Build command: *(empty)*. Output dir: *(root)*.
4. Deploy.

### Option 3 — Netlify

1. Drag the folder onto [app.netlify.com/drop](https://app.netlify.com/drop). You'll get a free `*.netlify.app` subdomain instantly.

### Option 4 — Vercel

1. `npm i -g vercel` then `vercel` from inside the folder. Live in about 20 seconds.

### Option 5 — Any traditional web host

cPanel, FTP, S3 + CloudFront — anything that serves static files works. Upload the whole folder, point your domain at it, done.

---

## Before you go live — a 10-minute checklist

1. **Buy your domain.** `desijugad.co.in` is a suggestion; check availability and pick any name you like. Short, memorable, `.app`/`.io`/`.com` all work. A `.com` helps with trust in some markets.
2. **Find-and-replace the domain.** Search the project for `desijugad.co.in` and replace with your real domain. Especially in:
   - `sitemap.xml` (all `<loc>` URLs)
   - `robots.txt` (the Sitemap line)
   - Every HTML file's `<link rel="canonical">` tag
   - Open Graph `og:url` tags
3. **Find-and-replace the brand name** if you want to rename. Search for `Desi Jugad` and replace globally. The logo is a text mark with the letter `C` — change it to your initial in the CSS (`.brand-mark`) and all HTML files.
4. **Update contact email addresses.** Search for `@desijugad.co.in` and replace with your real email.
5. **Add a favicon.** Drop `favicon.ico`, `apple-touch-icon.png`, and `favicon.svg` into the project root. Then add these lines to every HTML `<head>`:
   ```html
   <link rel="icon" href="/favicon.svg" type="image/svg+xml">
   <link rel="apple-touch-icon" href="/apple-touch-icon.png">
   ```
6. **Submit your sitemap** to [Google Search Console](https://search.google.com/search-console) and [Bing Webmaster Tools](https://www.bing.com/webmasters). This is how Google finds you. Without this step, the site will not appear in search results for weeks or months.
7. **Test on mobile.** Open the live URL on your phone. Convert a few files. Make sure everything feels fast.

---

## Adding AdSense (realistic money timeline)

**Do not add AdSense until you have real content and real traffic.** Google will reject new, empty sites. Wait until:

- You have at least 15–20 pages of original content (the blog helps here — write 10 more articles)
- Your site has been live for at least 2–4 weeks
- You're getting at least some organic traffic from Google

### When you're ready

1. Apply at [adsense.google.com](https://adsense.google.com).
2. Once approved, Google gives you a snippet that looks like `<script async src="..."></script>`. Paste it inside the `<head>` of every HTML page.
3. Place ad units where they don't harm the user experience:
   - **Good spots:** Just above the footer on converter pages; between blog paragraphs after scroll; within the blog index between posts.
   - **Bad spots:** Directly above the drop zone (kills conversion), in the mobile nav, anywhere that pushes content below the fold.
4. Use AdSense Auto Ads to start, then optimise manually once you see what performs.

### Realistic earnings

| Monthly pageviews | Approx. monthly AdSense revenue |
|-------------------|--------------------------------|
| 10,000 | $10 – $50 |
| 100,000 | $100 – $500 |
| 1,000,000 | $1,500 – $8,000 |

These numbers vary enormously by geography. US, UK, Canada, and Australia visitors are worth 10–30× what visitors from most other regions are worth. A site with traffic split 50/50 between high-CPM and low-CPM countries will earn roughly 3–4× what a purely low-CPM-traffic site earns at the same pageview count.

### Affiliate links (better long term)

AdSense pays pennies. Affiliate links can pay $5–$50 per signup. Good options for a file-converter site:
- **Adobe Creative Cloud** — people converting images often need an image editor
- **Microsoft 365** — CSV-to-Excel visitors are literally the target audience
- **Canva Pro** — SVG-to-PNG and image-converter visitors
- **Web hosting** (Cloudflare / Namecheap / SiteGround) — only on your blog

Link naturally inside blog articles. Don't spam.

---

## SEO — the only thing that actually matters

Nobody will just "find" your site. Google will send you every visitor. That means:

### Technical checklist (already done for you)

- Semantic HTML with proper `<h1>`, `<h2>` hierarchy ✅
- `<meta description>` on every page ✅
- Canonical URLs ✅
- Open Graph tags ✅
- Schema.org JSON-LD for `WebApplication` on each converter ✅
- XML sitemap ✅
- Clean URLs (no query strings) ✅
- Fast page load (no frameworks, no build step) ✅
- Mobile responsive ✅
- HTTPS (comes free with all recommended hosts) ✅

### What you have to do yourself

1. **Write more blog content.** Three posts is not enough. Aim for 2 new posts per week for 3 months. Topics should be "how to X" where X is a format question your users would Google. Examples:
   - "How to convert HEIC photos on Windows 11"
   - "Why is my iPhone photo too big for email?"
   - "SVG vs PNG — when to use which"
   - "How to flatten a nested JSON file"
2. **Get backlinks.** Even 10 good ones matter. Places that work:
   - Reddit: r/techsupport, r/photography, r/webdev. Post genuinely — don't spam your own link.
   - Product Hunt — one-time launch boost
   - Indie Hackers — there's a community for this
   - Replying helpfully on Stack Overflow threads about format conversion, linking your tool only when it genuinely solves the problem
3. **Write for long-tail keywords.** Don't chase "file converter" — you will never rank. Chase "convert .cr3 to .jpg without Lightroom" where the competition is zero.

### Timeline reality check

- **Weeks 1–4:** Traffic near zero. Google is still deciding what your site is.
- **Months 2–4:** Slow trickle. You'll see 10–50 visitors a day.
- **Months 4–8:** Growth curves upward if you've kept writing and getting backlinks.
- **Months 8–12:** If you've done it right, you're at 10K+ monthly visits and your first meaningful AdSense check is possible.

Most people quit at month 3 and conclude "it doesn't work." It does work. You have to not quit.

---

## Customising the design

The whole design system lives in **`assets/css/style.css`**. Everything is controlled by CSS variables near the top of the file. Change these and the whole site changes.

```css
:root {
  --bg:          #FAF7F2;   /* page background (cream) */
  --bg-alt:      #F2EDE4;   /* section background */
  --ink:         #141413;   /* primary text */
  --muted:       #6B6963;   /* secondary text */
  --accent:      #4F3CC9;   /* indigo — links, CTAs */
  --accent-warm: #E87C3E;   /* saffron — highlights */
  --line:        #E4DDD0;   /* borders */
  /* ... */
}
```

### Changing colors

Pick a new palette in [Coolors](https://coolors.co) and swap the values. All converter pages, buttons, and hover states will update automatically.

### Changing fonts

The fonts are loaded from Google Fonts in every HTML `<head>`. Swap the `<link>` tags and update the CSS variables:

```css
--font-display: 'Fraunces', serif;   /* change to e.g. 'Playfair Display' */
--font-sans:    'Geist', sans-serif; /* change to e.g. 'Inter' */
--font-mono:    'Geist Mono', monospace;
```

### Removing the India references

If you don't want the "Made in India" positioning, do a find-and-replace on:
- `Made in India, built for the world`
- `flag-in` (the CSS class for the tricolor element)
- The India paragraphs in `about.html`

---

## Adding a new converter

Every converter page follows the same template. Copy an existing file in `convert/` as a starting point, then:

1. Change the `<title>`, `<meta description>`, and canonical URL.
2. Update the `<h1>` and breadcrumb.
3. Swap the JS library CDN import if needed.
4. Rewrite the `convert()` function for your format pair.
5. Update the SEO content and FAQ below the tool.
6. Add the page to `index.html` (in the converter grid), to `sitemap.xml`, and to any relevant footer menus.

All shared UI helpers (`showToast`, `downloadBlob`, `formatBytes`, `copyToClipboard`) live in `assets/js/main.js` and are already available on every page.

---

## Project structure

```
desijugad/
├── index.html                    Homepage (hero, tool grid, features, blog preview)
├── about.html                    Mission, team, tech stack
├── contact.html                  Email addresses and FAQ
├── privacy.html                  No-data-collected privacy policy
├── terms.html                    Plain-English terms of service
├── sitemap.xml                   For search engines
├── robots.txt                    Crawler rules
├── README.md                     This file
│
├── assets/
│   ├── css/style.css             Complete design system (~1000 lines)
│   ├── js/main.js                Shared UI helpers
│   └── img/                      Drop favicons and OG images here
│
├── convert/
│   ├── heic-to-jpg.html          iPhone HEIC photo converter
│   ├── image-converter.html      PNG/JPG/WebP/BMP universal
│   ├── image-to-pdf.html         Stitch images → PDF
│   ├── pdf-to-image.html         Extract PDF pages → images
│   ├── svg-to-png.html           SVG → raster with custom DPI
│   ├── json-to-csv.html          Bidirectional JSON ⇄ CSV
│   ├── json-to-yaml.html         Bidirectional JSON ⇄ YAML
│   ├── csv-to-excel.html         CSV → real .xlsx
│   ├── markdown-to-html.html     MD → HTML with live preview
│   ├── base64.html               Encode/decode text & files
│   ├── srt-to-vtt.html           Subtitle format converter
│   └── text-tools.html           Case convert, word count, slugify
│
└── blog/
    ├── index.html                Blog listing page
    ├── how-to-open-heic-files.html
    ├── png-jpg-webp-avif.html
    └── why-browser-conversion-is-safer.html
```

---

## The third-party libraries

All loaded from free public CDNs. No npm install, no bundler.

- [heic2any](https://github.com/alexcorvi/heic2any) — HEIC decoding
- [JSZip](https://stuk.github.io/jszip/) — bundle batch downloads
- [jsPDF](https://github.com/parallax/jsPDF) — PDF generation
- [pdf.js](https://mozilla.github.io/pdf.js/) — PDF rendering (by Mozilla)
- [SheetJS Community](https://sheetjs.com/) — Excel file writing
- [js-yaml](https://github.com/nodeca/js-yaml) — YAML parsing
- [marked](https://marked.js.org/) — Markdown to HTML

If you prefer self-hosting the libraries (for offline use or stricter CSP), download each one and replace the CDN `<script src>` lines with local paths.

---

## Security notes

Because the site is purely static and never touches a server, the attack surface is very small. That said:

- If you add any dynamic features later (contact form, analytics, etc.), make sure they don't introduce tracking.
- If you self-host the JS libraries, pin the version and use Subresource Integrity (`integrity="sha384-..."`) on the script tag.
- If your host supports it, serve these headers:
  ```
  Strict-Transport-Security: max-age=63072000
  X-Content-Type-Options: nosniff
  Referrer-Policy: no-referrer-when-downgrade
  Content-Security-Policy: default-src 'self'; script-src 'self' https://cdnjs.cloudflare.com https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data: blob:;
  ```
  On Cloudflare Pages, add these in `_headers` at the project root.

---

## Legal

The code in this project is yours to use, modify, and sell under an MIT-style grant. The third-party JS libraries have their own licenses, all permissive — see each library's repo. If you redistribute the site as a product, you do not need to credit Desi Jugad, but a backlink is always appreciated.

---

## A final honest note

This website is a good foundation. It is not a magic money machine. The people who succeed with sites like this share three habits:

1. **They keep shipping content** — one blog post a week, minimum, for a year.
2. **They listen to users** — every email suggesting a new converter is a gift, because it's a validated keyword.
3. **They don't quit at month three** when the traffic is 14 visitors a day.

If you can do those three things, the math works out. If you can't, no amount of design polish will save the project.

Good luck.

— Built in India 🇮🇳
