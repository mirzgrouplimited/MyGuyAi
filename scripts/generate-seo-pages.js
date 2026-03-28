/**
 * Static SEO Page Generator for MyGuyAI - Phase 7
 * 
 * Programmatic SEO Engine with:
 * - Single baseIndex for consistent variation
 * - "When to Use" content section
 * - Numerically sorted nearby links
 * - Open Graph & Twitter Card meta tags
 * - Lazy-loaded GA4 analytics
 * - Clean canonical URLs (no .html)
 * - PHASE 7: Blog generation & internal linking
 */

const fs = require('fs');
const path = require('path');

// Load content data
const CONTENT_DATA = require('../src/data/content-data.js');

// PHASE 7: Load blog and programmatic page data
let BLOG_POSTS = {};
let PROGRAMMATIC_PAGES = {};
try {
  BLOG_POSTS = require('../content/blog/blog-data.js').BLOG_POSTS;
  PROGRAMMATIC_PAGES = require('../content/blog/programmatic-pages.js').PROGRAMMATIC_PAGES;
} catch (e) {
  console.log('Note: Blog data not found, skipping blog generation');
}

// Configuration
const CONFIG = {
  dataFile: path.join(__dirname, '../src/data/seo-pages.json'),
  outputDir: path.join(__dirname, '../public'),
  blogOutputDir: path.join(__dirname, '../public/blog'),
  priorityPages: ['compress-image-to-20kb', 'compress-image-to-50kb', 'compress-image-to-100kb'],
  sitemapPath: path.join(__dirname, '../public/sitemap.xml'),
  robotsPath: path.join(__dirname, '../public/robots.txt'),
  // PRODUCTION: Analytics (GSC uses HTML file verification, not meta tag)
  ga4MeasurementId: 'G-3QR17P0V69',
  // Minimum word count for indexing
  minWordCount: 150
};

// ============================================
// DETERMINISTIC VARIATION ARRAYS
// ============================================

const TITLE_VARIANTS = [
  "Compress Image to {size} Online (Free, Fast & Secure)",
  "Reduce Photo to {size} Online – Free Image Compressor",
  "Shrink Picture to {size} Online (No Quality Loss)",
  "Image Compressor to {size} – Free Online Tool",
  "Compress Photo to {size} Free – Instant Results"
];

const META_VARIANTS = [
  "Compress any image to {size} instantly. Free, secure, no upload needed. Perfect for forms and web.",
  "Reduce photos to {size} online with no quality loss. Fast, private, works in your browser.",
  "Shrink images to {size} for free. Ideal for emails, social media, and document uploads.",
  "Free {size} image compressor. No signup, instant processing, 100% secure and private.",
  "Compress pictures to exactly {size} online. Maintain quality while reducing file size fast."
];

const H1_VARIANTS = [
  "Compress Image to {size} Online",
  "Reduce Photo to {size} Free",
  "Shrink Image to {size} Online",
  "Free {size} Image Compressor",
  "Compress Picture to {size} Instantly"
];

const H2_VARIANTS = [
  "Reduce Any Photo to {size} in Seconds",
  "Fast & Free {size} Image Compression",
  "Instantly Shrink Images to {size}",
  "Quick {size} Photo Size Reducer",
  "Online Tool to Compress to {size}"
];

const INTRO_VARIANTS = [
  "Compress your image to exactly {size} instantly without losing quality. Our free online tool processes everything in your browser for complete privacy.",
  "Need to reduce an image to {size}? Our fast, free compressor works directly in your browser. No uploads, no registration, no hassle.",
  "Shrink any photo to {size} in seconds. Perfect for forms, emails, and web uploads. Your files never leave your device.",
  "Looking for a {size} image compressor? Get instant results with our secure, browser-based tool. Free and unlimited.",
  "Reduce photos to {size} without quality loss. Our client-side compression ensures your images stay private and secure."
];

const BENEFIT_VARIANTS = [
  "Maintain exceptional visual quality while achieving your exact target file size.",
  "Optimize images for faster uploads, quicker page loads, and seamless sharing.",
  "Perfect for website optimization, email attachments, and form submissions.",
  "Process unlimited images without signup, fees, or watermarks.",
  "Works with all major formats including JPG, PNG, WebP, and HEIC."
];

const USECASE_INTRO_VARIANTS = [
  "Common scenarios where {size} compression is essential:",
  "When you need your images exactly at {size}:",
  "Popular use cases for {size} image files:",
  "Why people compress images to {size}:",
  "Situations requiring {size} image compression:"
];

// NEW: When to Use section variants
const WHEN_TO_USE_VARIANTS = [
  "Use {size} compression when submitting forms, job applications, or ID uploads where strict size limits apply.",
  "Ideal for reducing image size for email attachments, ensuring faster delivery and avoiding bounced messages.",
  "Best suited for websites and blogs where {size} images improve page load speed and user experience.",
  "Helpful for social media uploads where platforms impose file size restrictions on profile pictures and posts.",
  "Great for optimizing images for mobile users and low-bandwidth environments where smaller files load faster."
];

// ============================================
// UTILITY FUNCTIONS
// ============================================

function loadSeoData() {
  const rawData = fs.readFileSync(CONFIG.dataFile, 'utf8');
  return JSON.parse(rawData);
}

function normalizeUrl(url) {
  if (!url || url === '/') return url;
  return url.toLowerCase().replace(/\/$/, '');
}

function getISODate() {
  return new Date().toISOString().split('T')[0];
}

function stripHtml(text) {
  if (!text) return '';
  return text
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function formatSize(targetSize) {
  if (targetSize >= 1024) {
    return `${targetSize / 1024}MB`;
  }
  return `${targetSize}KB`;
}

// Generate SINGLE deterministic base index from slug
function getBaseIndex(slug) {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = ((hash << 5) - hash) + slug.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash);
}

// ============================================
// FAQ VARIANTS ARRAY (Expanded 8-10 questions)
// ============================================

const FAQ_VARIANTS = [
  // Core questions (always included)
  {
    q: "How do I compress an image to exactly {size}?",
    a: "Simply upload your image to our free online compressor. Our tool automatically reduces the file size to exactly {size} while maintaining optimal quality. No software installation required - works directly in your browser."
  },
  {
    q: "Will compressing to {size} reduce image quality?",
    a: "Our smart compression algorithm optimizes the balance between file size and visual quality. For most images, the quality loss is minimal and often imperceptible to the human eye."
  },
  {
    q: "Is this {size} compressor free to use?",
    a: "Yes, our image compressor is completely free with no registration required. You can compress unlimited images to {size} without any restrictions or hidden fees."
  },
  {
    q: "What image formats are supported?",
    a: "We support all major image formats including JPG, JPEG, PNG, WebP, HEIC, and HEIF. Apple device photos (HEIC/HEIF) are automatically converted during compression."
  },
  {
    q: "Is my image data secure?",
    a: "Absolutely. All image processing happens entirely in your browser using client-side technology. Your images are never uploaded to our servers, ensuring complete privacy and security."
  },
  // Long-tail intent questions
  {
    q: "How to compress image to {size} for SSC/UPSC/government forms?",
    a: "Upload your photo to our tool, and it will automatically compress to exactly {size}. Our compressor is perfect for government job applications, SSC, UPSC, and other competitive exam forms that require specific file sizes."
  },
  {
    q: "What is the best format for {size} compression?",
    a: "JPEG is typically the best format for {size} compression as it offers excellent compression ratios for photographs. PNG is better for graphics with transparency, and WebP provides modern compression efficiency."
  },
  {
    q: "Can I compress multiple images to {size} at once?",
    a: "Yes, you can process multiple images sequentially using our tool. Each image is compressed to exactly {size} while maintaining quality. For batch processing, simply upload images one after another."
  },
  {
    q: "How to compress passport photo to {size}?",
    a: "Upload your passport photo to our compressor, and it will reduce the size to exactly {size}. Our tool maintains facial clarity and meets official requirements for passport and visa applications."
  },
  {
    q: "Does {size} compression work on mobile devices?",
    a: "Yes, our {size} compressor works perfectly on all mobile devices including iPhone and Android. The tool is fully responsive and processes images directly in your mobile browser."
  },
  {
    q: "How long does it take to compress an image to {size}?",
    a: "Compression to {size} is nearly instant. Most images are processed within 1-3 seconds depending on the original file size. There's no waiting - download your compressed image immediately."
  },
  {
    q: "Can I use {size} compressed images for job applications?",
    a: "Absolutely. Our {size} compressor is ideal for job portal uploads, recruitment forms, and professional applications. The compressed images maintain clarity while meeting strict file size requirements."
  }
];

// ============================================
// USE CASE VARIANTS (Long-tail Intent)
// ============================================

const USE_CASE_VARIANTS = [
  {
    category: "Government & Official",
    examples: [
      "SSC exam form photo upload",
      "UPSC application passport photos",
      "Government job portal submissions",
      "Visa and immigration applications",
      "Aadhaar card photo updates",
      "PAN card application photos"
    ]
  },
  {
    category: "Education & Examination",
    examples: [
      "University admission forms",
      "Scholarship application photos",
      "Examination hall ticket photos",
      "Student ID card images",
      "Online course profile pictures",
      "Academic certificate uploads"
    ]
  },
  {
    category: "Professional & Business",
    examples: [
      "LinkedIn profile optimization",
      "Job portal resume photos",
      "Corporate ID badge images",
      "Email signature pictures",
      "Business card photo preparation",
      "Professional portfolio thumbnails"
    ]
  },
  {
    category: "Web & Digital",
    examples: [
      "Website hero image optimization",
      "E-commerce product thumbnails",
      "Blog post featured images",
      "Social media profile pictures",
      "Email newsletter graphics",
      "Mobile app asset optimization"
    ]
  }
];

// ============================================
// ANCHOR TEXT VARIATIONS (Deterministic)
// ============================================

const ANCHOR_VARIANTS = [
  "Compress image to {size}",
  "Reduce image size to {size}",
  "Optimize image to {size}",
  "Shrink photo to {size}"
];

function getAnchorText(size, baseIndex, linkIndex) {
  // Use combined index for variation
  const variantIdx = (baseIndex + linkIndex) % ANCHOR_VARIANTS.length;
  return ANCHOR_VARIANTS[variantIdx].replace(/{size}/g, size);
}

// ============================================
// INLINE LINK GENERATORS (with anchor variation)
// ============================================

function getInlineLinks(currentSize, allPages, domain, baseIndex) {
  const sizes = Object.values(allPages)
    .map(p => p.targetSize)
    .sort((a, b) => a - b);
  
  const currentIdx = sizes.indexOf(currentSize);
  const links = [];
  
  // Get one smaller size (if available)
  if (currentIdx > 0) {
    const smallerSize = sizes[currentIdx - 1];
    const sizeLabel = formatSize(smallerSize);
    const slug = `compress-image-to-${sizeLabel.toLowerCase().replace(' ', '')}`;
    links.push({
      size: sizeLabel,
      url: `${domain.toLowerCase()}/${slug}`,
      anchor: getAnchorText(sizeLabel, baseIndex, 0)
    });
  }
  
  // Get one larger size (if available)
  if (currentIdx < sizes.length - 1) {
    const largerSize = sizes[currentIdx + 1];
    const sizeLabel = formatSize(largerSize);
    const slug = `compress-image-to-${sizeLabel.toLowerCase().replace(' ', '')}`;
    links.push({
      size: sizeLabel,
      url: `${domain.toLowerCase()}/${slug}`,
      anchor: getAnchorText(sizeLabel, baseIndex, 1)
    });
  }
  
  return links;
}

// ============================================
// DETERMINISTIC CONTENT GENERATOR (Single baseIndex)
// ============================================

function generateDynamicSeo(page) {
  const size = formatSize(page.targetSize);
  const slug = page.slug;
  
  // SINGLE base index for consistent variation across all fields
  const baseIndex = getBaseIndex(slug);
  
  // All variations derived from the SAME baseIndex
  const titleIdx = baseIndex % TITLE_VARIANTS.length;
  const metaIdx = baseIndex % META_VARIANTS.length;
  const h1Idx = baseIndex % H1_VARIANTS.length;
  const h2Idx = baseIndex % H2_VARIANTS.length;
  const introIdx = baseIndex % INTRO_VARIANTS.length;
  const benefitIdx = baseIndex % BENEFIT_VARIANTS.length;
  const usecaseIdx = baseIndex % USECASE_INTRO_VARIANTS.length;
  const whenToUseIdx = baseIndex % WHEN_TO_USE_VARIANTS.length;
  
  return {
    title: TITLE_VARIANTS[titleIdx].replace(/{size}/g, size),
    metaDescription: META_VARIANTS[metaIdx].replace(/{size}/g, size),
    h1: H1_VARIANTS[h1Idx].replace(/{size}/g, size),
    h2: H2_VARIANTS[h2Idx].replace(/{size}/g, size),
    intro: INTRO_VARIANTS[introIdx].replace(/{size}/g, size),
    benefit: BENEFIT_VARIANTS[benefitIdx].replace(/{size}/g, size),
    usecaseIntro: USECASE_INTRO_VARIANTS[usecaseIdx].replace(/{size}/g, size),
    whenToUse: WHEN_TO_USE_VARIANTS[whenToUseIdx].replace(/{size}/g, size),
    size: size,
    baseIndex: baseIndex
  };
}

// ============================================
// NEARBY LINKS GENERATOR (EXACTLY 4 Links: 2 smaller + 2 larger)
// ============================================

function getNearbyLinks(currentSlug, allPages, domain) {
  // Get all pages as array with numeric targetSize
  const pagesArray = Object.values(allPages).map(page => ({
    slug: page.slug,
    targetSize: page.targetSize,
    sizeDisplay: formatSize(page.targetSize)
  }));
  
  // Sort by targetSize numerically (KB basis: 2MB = 2048)
  pagesArray.sort((a, b) => a.targetSize - b.targetSize);
  
  // Find current page index
  const currentIndex = pagesArray.findIndex(p => p.slug === currentSlug);
  if (currentIndex === -1) return [];
  
  const neighbors = [];
  
  // Get 2 nearest SMALLER sizes
  const smallerStart = Math.max(0, currentIndex - 2);
  for (let i = smallerStart; i < currentIndex; i++) {
    neighbors.push(pagesArray[i]);
  }
  
  // Get 2 nearest LARGER sizes
  const largerEnd = Math.min(pagesArray.length, currentIndex + 3);
  for (let i = currentIndex + 1; i < largerEnd; i++) {
    neighbors.push(pagesArray[i]);
  }
  
  // Edge case: If at start, get more larger to fill up to 4
  while (neighbors.length < 4 && neighbors.length < pagesArray.length - 1) {
    const lastIdx = pagesArray.findIndex(p => p.slug === neighbors[neighbors.length - 1]?.slug);
    if (lastIdx >= 0 && lastIdx + 1 < pagesArray.length && pagesArray[lastIdx + 1].slug !== currentSlug) {
      neighbors.push(pagesArray[lastIdx + 1]);
    } else {
      break;
    }
  }
  
  // Edge case: If at end, get more smaller to fill up to 4
  while (neighbors.length < 4 && neighbors.length < pagesArray.length - 1) {
    const firstIdx = pagesArray.findIndex(p => p.slug === neighbors[0]?.slug);
    if (firstIdx > 0 && pagesArray[firstIdx - 1].slug !== currentSlug) {
      neighbors.unshift(pagesArray[firstIdx - 1]);
    } else {
      break;
    }
  }
  
  // Ensure sorted by targetSize and limit to EXACTLY 4
  neighbors.sort((a, b) => a.targetSize - b.targetSize);
  const finalNeighbors = neighbors.slice(0, 4);
  
  // Convert to link objects with absolute, lowercase, hyphenated URLs
  return finalNeighbors.map(n => ({
    url: `${domain.toLowerCase()}/${n.slug.toLowerCase()}`,
    anchor: `Compress Image to ${n.sizeDisplay}`,
    slug: n.slug
  }));
}

// ============================================
// CONTENT SYSTEM (Phase 5)
// ============================================

function getWhyCompressContent(targetSize) {
  const sizeKey = String(targetSize);
  return CONTENT_DATA.whyCompress[sizeKey] || {
    title: `Why Compress Images to ${formatSize(targetSize)}?`,
    content: `Compressing your images to ${formatSize(targetSize)} helps optimize file size while maintaining quality for your specific use case.`
  };
}

function getUseCaseCategory(targetSize) {
  if (targetSize <= 50) return 'small';
  if (targetSize <= 200) return 'medium';
  if (targetSize <= 500) return 'large';
  return 'premium';
}

function getUseCases(targetSize) {
  const category = getUseCaseCategory(targetSize);
  return CONTENT_DATA.useCases[category];
}

function getTips(baseIndex) {
  // Select 3 tips deterministically
  const tips = CONTENT_DATA.tips;
  const selected = [];
  for (let i = 0; i < 3; i++) {
    const idx = (baseIndex + i) % tips.length;
    selected.push(tips[idx]);
  }
  return selected;
}

function getDetailedUseCases(targetSize, baseIndex) {
  // Select 2 categories deterministically based on size and baseIndex
  const categoryIdx1 = baseIndex % USE_CASE_VARIANTS.length;
  const categoryIdx2 = (baseIndex + 1) % USE_CASE_VARIANTS.length;
  
  const categories = [
    USE_CASE_VARIANTS[categoryIdx1],
    USE_CASE_VARIANTS[categoryIdx2 !== categoryIdx1 ? categoryIdx2 : (categoryIdx2 + 1) % USE_CASE_VARIANTS.length]
  ];
  
  // Get 3 examples from each category
  return categories.map(cat => ({
    category: cat.category,
    examples: cat.examples.slice(0, 3 + (baseIndex % 2)) // 3 or 4 examples
  }));
}

function getTechnicalSpecs() {
  return CONTENT_DATA.technicalSpecs;
}

// ============================================
// FAQ DATA GENERATOR (8-10 questions, deterministic with rotation)
// ============================================

function generateFaqData(page, seo) {
  const size = seo.size;
  const baseIndex = seo.baseIndex;
  
  // Rotate core questions using baseIndex offset (0 or 1)
  const coreOffset = baseIndex % 2;
  const corePool = FAQ_VARIANTS.slice(0, 5);
  const rotatedCore = [];
  for (let i = 0; i < 5; i++) {
    const idx = (i + coreOffset) % 5;
    rotatedCore.push(corePool[idx]);
  }
  
  // Deterministically select 3-5 additional questions from remaining pool
  const additionalPool = FAQ_VARIANTS.slice(5);
  const additionalCount = 3 + (baseIndex % 3); // 3, 4, or 5 additional
  const selectedAdditional = [];
  
  for (let i = 0; i < additionalCount && i < additionalPool.length; i++) {
    const idx = (baseIndex + i) % additionalPool.length;
    const candidate = additionalPool[idx];
    if (!selectedAdditional.some(q => q.q === candidate.q)) {
      selectedAdditional.push(candidate);
    }
  }
  
  // Combine rotated core + additional questions
  const allFaqs = [...rotatedCore, ...selectedAdditional];
  
  return allFaqs.map(faq => ({
    question: faq.q.replace(/{size}/g, size),
    answer: faq.a.replace(/{size}/g, size)
  }));
}

function generateFaqHtml(faqData) {
  return faqData.map(faq => `
        <dt>${faq.question}</dt>
        <dd>${faq.answer}</dd>`).join('');
}

function generateFaqPageSchema(faqData) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqData.map(faq => ({
      "@type": "Question",
      "name": stripHtml(faq.question),
      "acceptedAnswer": {
        "@type": "Answer",
        "text": stripHtml(faq.answer)
      }
    }))
  };
}

// ============================================
// JSON-LD SCHEMA GENERATORS
// ============================================

function generateWebApplicationSchema(page, site, seo) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": seo.h1,
    "description": seo.metaDescription,
    "url": normalizeUrl(page.canonical),
    "applicationCategory": "ImageOptimizationApplication",
    "applicationSubCategory": "Image Compressor",
    "operatingSystem": "All",
    "browserRequirements": "Requires JavaScript",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "provider": {
      "@type": "Organization",
      "name": site.name,
      "url": site.domain,
      "logo": site.logo,
      "email": site.email
    },
    "featureList": [
      `Compress images to exactly ${seo.size}`,
      "100% client-side processing",
      "No file uploads to server",
      "Free unlimited use",
      "Supports JPG, PNG, WebP, HEIC formats"
    ]
  };
}

function generateHowToSchema(page, site, seo) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": `How to Compress Image to ${seo.size}`,
    "description": `Step-by-step guide to compress any image to exactly ${seo.size} online for free.`,
    "image": `${site.domain}/images/tools/${page.slug}-preview.png`,
    "totalTime": "PT1M",
    "estimatedCost": {
      "@type": "MonetaryAmount",
      "currency": "USD",
      "value": "0"
    },
    "supply": [],
    "tool": [{
      "@type": "HowToTool",
      "name": "Web Browser"
    }],
    "step": [
      {
        "@type": "HowToStep",
        "name": "Upload Your Image",
        "text": "Drag and drop your image file onto the upload area, or click to browse your device. We support JPG, PNG, WebP, HEIC, and more formats.",
        "position": 1
      },
      {
        "@type": "HowToStep",
        "name": "Automatic Compression",
        "text": `Our tool automatically compresses your image to exactly ${seo.size}. All processing happens in your browser - no files are uploaded to any server.`,
        "position": 2
      },
      {
        "@type": "HowToStep",
        "name": "Download Result",
        "text": `Download your compressed ${seo.size} image instantly. The file is optimized and ready to use for your intended purpose.`,
        "position": 3
      }
    ]
  };
}

function generateBreadcrumbSchema(page, site) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": page.breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": crumb.url === '/' 
        ? site.domain 
        : crumb.url.startsWith('http') 
          ? normalizeUrl(crumb.url) 
          : `${site.domain}${normalizeUrl(crumb.url)}`
    }))
  };
}

// ============================================
// HTML TEMPLATE GENERATOR (Phase 6: Analytics + OG/Twitter)
// ============================================

function generateHtmlTemplate(page, site, nearbyLinks) {
  // Generate dynamic SEO content with SINGLE baseIndex
  const seo = generateDynamicSeo(page);
  
  // Generate FAQ data from single source
  const faqData = generateFaqData(page, seo);
  const faqHtml = generateFaqHtml(faqData);
  const faqSchema = generateFaqPageSchema(faqData);
  
  // Generate schemas
  const webAppSchema = generateWebApplicationSchema(page, site, seo);
  const howToSchema = generateHowToSchema(page, site, seo);
  const breadcrumbSchema = generateBreadcrumbSchema(page, site);
  
  // Phase 5: Content System
  const whyCompressContent = getWhyCompressContent(page.targetSize);
  const useCases = getUseCases(page.targetSize);
  const detailedUseCases = getDetailedUseCases(page.targetSize, seo.baseIndex);
  const tips = getTips(seo.baseIndex);
  const specs = getTechnicalSpecs();
  
  // Inline contextual links (with anchor variation)
  const inlineLinks = getInlineLinks(page.targetSize, require('../src/data/seo-pages.json').pages, site.domain, seo.baseIndex);
  
  // PHASE 6: Clean canonical URL (no .html exposure)
  const canonicalUrl = `${site.domain.toLowerCase()}/${page.slug}`;
  const toolPreviewImage = `${site.domain}/images/tools/${page.slug}-preview.png`;
  const toolPreviewAlt = `Compress image to ${seo.size} online tool preview`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <!-- Primary SEO Meta Tags -->
  <title>${seo.title}</title>
  <meta name="description" content="${seo.metaDescription}">
  <meta name="keywords" content="${page.keywords.join(', ')}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${canonicalUrl}">
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:title" content="${seo.title}">
  <meta property="og:description" content="${seo.metaDescription}">
  <meta property="og:image" content="${toolPreviewImage}">
  <meta property="og:image:alt" content="${toolPreviewAlt}">
  <meta property="og:site_name" content="${site.name}">
  <meta property="og:locale" content="en_US">
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="${canonicalUrl}">
  <meta name="twitter:title" content="${seo.title}">
  <meta name="twitter:description" content="${seo.metaDescription}">
  <meta name="twitter:image" content="${toolPreviewImage}">
  <meta name="twitter:image:alt" content="${toolPreviewAlt}">
  
  <!-- Favicon -->
  <link rel="icon" type="image/png" href="${site.logo}">
  
  <!-- CLS-Safe Ad Styles (Loaded Early for Layout Stability) -->
  <link rel="stylesheet" href="/css/ads.css">
  
  <!-- Google AdSense (Auto Ads Compatible) -->
  <script async
    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9272525041915647"
    crossorigin="anonymous">
  </script>
  
  <!-- GA4 Lazy Loader (Production-Ready, Core Web Vitals Safe) -->
  <script>
  (function(){
    var GA4_ID = 'G-3QR17P0V69';
    
    // PRE-INIT dataLayer (BEFORE script load)
    window.dataLayer = window.dataLayer || [];
    window.gtag = function(){window.dataLayer.push(arguments);};
    
    // SINGLE TRIGGER HANDLER
    function triggerGA4() {
      if (window.__ga4Loaded) return;
      window.__ga4Loaded = true;
      removeListeners();
      loadGA4();
    }
    
    // EVENT LISTENERS
    function addListeners() {
      window.addEventListener('scroll', triggerGA4, { passive: true });
      window.addEventListener('mousemove', triggerGA4);
      window.addEventListener('touchstart', triggerGA4, { passive: true });
      window.addEventListener('keydown', triggerGA4);
      setTimeout(triggerGA4, 4000);
    }
    
    function removeListeners() {
      window.removeEventListener('scroll', triggerGA4);
      window.removeEventListener('mousemove', triggerGA4);
      window.removeEventListener('touchstart', triggerGA4);
      window.removeEventListener('keydown', triggerGA4);
    }
    
    // LOAD SCRIPT (with precise duplicate guard + retry)
    function loadGA4(retried) {
      if (document.querySelector('script[src="https://www.googletagmanager.com/gtag/js?id=' + GA4_ID + '"]')) {
        initGA4();
        return;
      }
      
      var script = document.createElement('script');
      script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA4_ID;
      script.async = true;
      
      script.onload = initGA4;
      
      script.onerror = function() {
        if (!retried) {
          setTimeout(function(){ loadGA4(true); }, 1000);
        }
      };
      
      document.head.appendChild(script);
    }
    
    // INIT
    function initGA4() {
      if (window.__ga4Initialized) return;
      
      gtag('js', new Date());
      gtag('config', GA4_ID, {
        anonymize_ip: true,
        send_page_view: true,
        transport_type: 'beacon',
        page_path: window.location.pathname
      });
      
      window.__ga4Initialized = true;
    }
    
    // INIT LISTENERS
    addListeners();
  })();
  </script>
  
  <!-- JSON-LD: WebApplication Schema -->
  <script type="application/ld+json">${JSON.stringify(webAppSchema)}</script>
  
  <!-- JSON-LD: HowTo Schema -->
  <script type="application/ld+json">${JSON.stringify(howToSchema)}</script>
  
  <!-- JSON-LD: BreadcrumbList Schema -->
  <script type="application/ld+json">${JSON.stringify(breadcrumbSchema)}</script>
  
  <!-- JSON-LD: FAQPage Schema -->
  <script type="application/ld+json">${JSON.stringify(faqSchema)}</script>
</head>
<body>
  <header role="banner">
    <nav aria-label="Main navigation">
      <a href="/" class="logo">${site.name}</a>
    </nav>
    <nav aria-label="Breadcrumb">
      <ol itemscope itemtype="https://schema.org/BreadcrumbList">${page.breadcrumbs.map((crumb, i) => `
        <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
          <a itemprop="item" href="${crumb.url === '/' ? '/' : normalizeUrl(crumb.url)}"><span itemprop="name">${crumb.name}</span></a>
          <meta itemprop="position" content="${i + 1}">
        </li>`).join('')}
      </ol>
    </nav>
  </header>

  <main role="main">
    <!-- AD SLOT 1: Above Tool (Responsive Banner, max 30% viewport) -->
    <section id="ad-slot-1" class="ad-slot ad-slot-header" aria-label="Advertisement">
      <ins class="adsbygoogle"
        style="display:block"
        data-ad-client="ca-pub-9272525041915647"
        data-ad-slot="1234567890"
        data-ad-format="horizontal"
        data-full-width-responsive="true"></ins>
    </section>

    <!-- HERO: Page Heading (Tool remains primary focus) -->
    <section id="hero" aria-labelledby="page-heading">
      <h1 id="page-heading">${seo.h1}</h1>
      <p class="hero-subtitle">${seo.h2}</p>
      <p class="intro-text">${seo.intro}</p>
    </section>

    <!-- TOOL INTERFACE: Primary Content (Always visible above fold) -->
    <section id="tool-interface" aria-label="Image Compression Tool">
      <figure class="tool-preview">
        <img 
          src="${toolPreviewImage}" 
          alt="${toolPreviewAlt}"
          width="800"
          height="450"
          loading="lazy"
        >
        <figcaption>Free online ${seo.size} image compressor - no upload required</figcaption>
      </figure>
      <div id="root">
        <noscript>
          <p>Please enable JavaScript to use the ${seo.size} image compressor tool.</p>
        </noscript>
      </div>
    </section>

    <!-- TRUST SIGNAL: Security & Privacy (Below Tool) -->
    <section id="trust-signal" class="trust-signal" aria-label="Security information">
      <span class="icon" aria-hidden="true">🔒</span>
      <span>100% Secure & Private — All processing happens locally in your browser. No files are uploaded to our servers.</span>
    </section>

    <!-- AD SLOT 2: Below Tool (High CTR Zone) -->
    <section id="ad-slot-2" class="ad-slot ad-slot-below-tool" aria-label="Advertisement">
      <ins class="adsbygoogle"
        style="display:block"
        data-ad-client="ca-pub-9272525041915647"
        data-ad-slot="2345678901"
        data-ad-format="auto"
        data-full-width-responsive="true"></ins>
    </section>

    <!-- WHY COMPRESS: In-depth content (800-1200 words) -->
    <section id="why-compress" aria-labelledby="why-compress-heading">
      <h2 id="why-compress-heading">${whyCompressContent.title}</h2>
      ${whyCompressContent.content.split('\n\n').map((para, idx) => {
        // Add inline link after second paragraph
        if (idx === 1 && inlineLinks.length > 0) {
          return `<p>${para.trim()} For different requirements, you might also consider our <a href="${inlineLinks[0].url}">${inlineLinks[0].anchor}</a> option.</p>`;
        }
        return `<p>${para.trim()}</p>`;
      }).join('\n      ')}
    </section>

    <!-- HOW TO USE: Step-by-step guide -->
    <section id="how-to-use" aria-labelledby="how-to-heading">
      <h2 id="how-to-heading">How to Compress Images to ${seo.size}</h2>
      
      <article>
        <h3>Step-by-Step Guide</h3>
        <ol>
          <li>
            <h4>Upload Your Image</h4>
            <p>Drag and drop your image file onto the upload area, or click to browse your device. We support ${specs.supportedFormats.slice(0, 4).join(', ')}, and more formats including Apple's HEIC/HEIF.</p>
          </li>
          <li>
            <h4>Automatic Compression</h4>
            <p>Our intelligent compression algorithm processes your image entirely in your browser. ${specs.privacyGuarantee} — your privacy is guaranteed.</p>
          </li>
          <li>
            <h4>Download Your Result</h4>
            <p>Once compression is complete, download your optimized ${seo.size} image instantly. The file is ready to use for your intended purpose.</p>
          </li>
        </ol>
      </article>
    </section>

    <!-- USE CASES: Specific applications -->
    <section id="use-cases" aria-labelledby="use-cases-heading">
      <h2 id="use-cases-heading">Common Use Cases for ${seo.size} Image Compression</h2>
      <p>${seo.whenToUse}${inlineLinks.length > 0 ? ` If you need a different size, try our <a href="${inlineLinks[0].url}">${inlineLinks[0].anchor}</a> tool.` : ''}</p>
      
      ${detailedUseCases.map(cat => `
      <article>
        <h3>${cat.category}</h3>
        <ul>
          ${cat.examples.map(ex => `<li>${ex}</li>`).join('\n          ')}
        </ul>
      </article>`).join('')}
      
      <p>Looking for more options? ${inlineLinks.length > 1 ? `Our <a href="${inlineLinks[1].url}">${inlineLinks[1].anchor}</a> tool might also be helpful.` : 'Explore our related tools below.'}</p>
    </section>

    <!-- BENEFITS -->
    <section id="benefits" aria-labelledby="benefits-heading">
      <h2 id="benefits-heading">Benefits of Our ${seo.size} Compressor</h2>
      <ul>
        <li>
          <h3>Exact Size Targeting</h3>
          <p>${seo.benefit}</p>
        </li>
        <li>
          <h3>Privacy First</h3>
          <p>All processing happens in your browser using ${specs.processingLocation.toLowerCase()}. Your images never leave your device, ensuring complete privacy and security.</p>
        </li>
        <li>
          <h3>Free & Unlimited</h3>
          <p>No registration, no limits, no watermarks. Compress as many images as you need, whenever you need them.</p>
        </li>
        <li>
          <h3>All Formats Supported</h3>
          <p>Works with ${specs.supportedFormats.join(', ')}. Apple device photos are automatically converted for compatibility.</p>
        </li>
      </ul>
    </section>

    <!-- TIPS: Best practices -->
    <section id="tips" aria-labelledby="tips-heading">
      <h2 id="tips-heading">Tips for Best Results</h2>
      <ul>
        ${tips.map(tip => `
        <li>
          <h3>${tip.title}</h3>
          <p>${tip.content}</p>
        </li>`).join('')}
      </ul>
    </section>

    <!-- TECHNICAL SPECS -->
    <section id="specifications" aria-labelledby="specs-heading">
      <h2 id="specs-heading">Technical Specifications</h2>
      <dl>
        <dt>Supported Input Formats</dt>
        <dd>${specs.supportedFormats.join(', ')}</dd>
        
        <dt>Maximum Input File Size</dt>
        <dd>${specs.maxInputSize}</dd>
        
        <dt>Output Formats</dt>
        <dd>${specs.outputFormats.join(', ')}</dd>
        
        <dt>Processing Method</dt>
        <dd>${specs.processingLocation}</dd>
        
        <dt>Privacy</dt>
        <dd>${specs.privacyGuarantee}</dd>
      </dl>
    </section>

    <!-- FAQ -->
    <section id="faq" aria-labelledby="faq-heading">
      <h2 id="faq-heading">Frequently Asked Questions</h2>
      <dl>${faqHtml}
      </dl>
    </section>

    <!-- AD SLOT 3: In-Content (Between FAQ & Related Tools) -->
    <section id="ad-slot-3" class="ad-slot ad-slot-in-content" aria-label="Advertisement">
      <ins class="adsbygoogle"
        style="display:block"
        data-ad-client="ca-pub-9272525041915647"
        data-ad-slot="3456789012"
        data-ad-format="auto"
        data-full-width-responsive="true"></ins>
    </section>

    <!-- RELATED TOOLS -->
    <section id="related-tools" aria-labelledby="related-heading">
      <h2 id="related-heading">Related Image Compression Tools</h2>
      <p>Need a different file size? Try these nearby compression options:</p>
      <nav aria-label="Related compression tools">
        <ul>${nearbyLinks.map(link => `
          <li><a href="${link.url}">${link.anchor}</a></li>`).join('')}
        </ul>
      </nav>
      <p>Or explore our other tools:</p>
      <nav aria-label="Other tools">
        <ul>
          <li><a href="${site.domain}/resize-image">Resize Image Online</a></li>
          <li><a href="${site.domain}/crop-image">Crop Image Online</a></li>
          <li><a href="${site.domain}/jpg-to-png">Convert JPG to PNG</a></li>
        </ul>
      </nav>
    </section>
  </main>

  <!-- AD SLOT 4: Mobile Sticky Anchor -->
  <aside id="ad-slot-4" class="ad-slot ad-slot-anchor" aria-label="Advertisement">
    <ins class="adsbygoogle"
      style="display:block"
      data-ad-client="ca-pub-9272525041915647"
      data-ad-slot="4567890123"
      data-ad-format="auto"></ins>
  </aside>

  <footer role="contentinfo">
    <nav aria-label="Footer navigation">
      <ul>
        <li><a href="/about">About Us</a></li>
        <li><a href="/contact">Contact</a></li>
        <li><a href="/privacy-policy">Privacy Policy</a></li>
        <li><a href="/terms">Terms of Service</a></li>
      </ul>
    </nav>
    <p>&copy; ${new Date().getFullYear()} ${site.name}. All rights reserved.</p>
    <p>Contact: <a href="mailto:${site.email}">${site.email}</a></p>
  </footer>

  <!-- AdSense Lazy Loader (Deferred) -->
  
</body>
</html>`;
}

// ============================================
// SITEMAP GENERATOR (Phase 7: Blogs + Programmatic)
// ============================================

function generateSitemap(data) {
  const today = getISODate();
  const domain = data.site.domain.toLowerCase();
  
  // Static pages with CLEAN URLs (no .html exposure)
  const staticPages = [
    { url: '/', changefreq: 'daily', priority: '1.0' },
    { url: '/image-tools', changefreq: 'weekly', priority: '0.8' },
    { url: '/pdf-tools', changefreq: 'weekly', priority: '0.8' },
    { url: '/file-conversion-tools', changefreq: 'weekly', priority: '0.8' },
    { url: '/compress-image', changefreq: 'weekly', priority: '0.7' },
    { url: '/resize-image', changefreq: 'weekly', priority: '0.7' },
    { url: '/crop-image', changefreq: 'weekly', priority: '0.7' },
    { url: '/passport-photo', changefreq: 'weekly', priority: '0.7' },
    { url: '/jpg-to-png', changefreq: 'weekly', priority: '0.6' },
    { url: '/png-to-jpg', changefreq: 'weekly', priority: '0.6' },
    { url: '/image-to-pdf', changefreq: 'weekly', priority: '0.6' },
    { url: '/compress-pdf', changefreq: 'weekly', priority: '0.6' },
    { url: '/merge-pdf', changefreq: 'weekly', priority: '0.6' },
    // Directory pages (Authority Foundation)
    { url: '/blog', changefreq: 'daily', priority: '0.7' },
    { url: '/guides', changefreq: 'weekly', priority: '0.7' },
    // Trust pages - CLEAN URLs (no .html)
    { url: '/about', changefreq: 'monthly', priority: '0.4' },
    { url: '/contact', changefreq: 'monthly', priority: '0.4' },
    { url: '/privacy-policy', changefreq: 'monthly', priority: '0.3' },
    { url: '/terms', changefreq: 'monthly', priority: '0.3' }
  ];

  // Compression pages with CLEAN URLs (no .html)
  const compressionPages = Object.values(data.pages).map(page => ({
    url: `/${page.slug}`,
    changefreq: 'weekly',
    priority: page.priority || '0.7'
  }));
  
  // PHASE 7: Blog pages
  const blogPages = Object.values(BLOG_POSTS).map(post => ({
    url: `/blog/${post.slug}`,
    changefreq: 'weekly',
    priority: '0.6'
  }));
  
  // PHASE 7: New programmatic pages
  const programmaticPages = Object.values(PROGRAMMATIC_PAGES).map(page => ({
    url: `/${page.slug}`,
    changefreq: 'weekly',
    priority: '0.7'
  }));

  const allPages = [...staticPages, ...compressionPages, ...blogPages, ...programmaticPages];

  const urlEntries = allPages.map(page => {
    const absoluteUrl = page.url === '/' 
      ? domain 
      : `${domain}${page.url.toLowerCase().replace(/\/$/, '')}`;
    return `  <url>
    <loc>${absoluteUrl}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
  }).join('\n');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;

  fs.writeFileSync(CONFIG.sitemapPath, sitemap, 'utf8');
  console.log(`Generated: sitemap.xml (${allPages.length} URLs with clean routes)`);
  
  return sitemap;
}

// ============================================
// ROBOTS.TXT GENERATOR
// ============================================

function generateRobotsTxt(data) {
  const domain = data.site.domain.toLowerCase();
  
  const robotsTxt = `# robots.txt for ${data.site.name}
# Generated: ${getISODate()}

User-agent: *
Allow: /

Disallow: /admin
Disallow: /cms
Disallow: /api/

Sitemap: ${domain}/sitemap.xml
`;

  fs.writeFileSync(CONFIG.robotsPath, robotsTxt, 'utf8');
  console.log(`Generated: robots.txt`);
  
  return robotsTxt;
}

// ============================================
// PAGE GENERATOR
// ============================================

function generatePage(slug, data) {
  const page = data.pages[slug];
  if (!page) {
    console.error(`Page not found: ${slug}`);
    return null;
  }

  // Get numerically sorted nearby links
  const nearbyLinks = getNearbyLinks(slug, data.pages, data.site.domain);
  const html = generateHtmlTemplate(page, data.site, nearbyLinks);
  const outputPath = path.join(CONFIG.outputDir, `${slug}.html`);
  
  fs.writeFileSync(outputPath, html, 'utf8');
  
  const stats = fs.statSync(outputPath);
  const sizeKB = (stats.size / 1024).toFixed(2);
  
  return { slug, outputPath, html, sizeKB };
}

// ============================================
// MAIN EXECUTION
// ============================================

function main() {
  const args = process.argv.slice(2);
  const data = loadSeoData();
  
  const pageArg = args.find(arg => arg.startsWith('--page='));
  const generateAll = args.includes('--all');
  const priorityOnly = args.includes('--priority');
  const showHtml = args.includes('--show');
  const genSitemap = args.includes('--sitemap');
  const genRobots = args.includes('--robots');
  const genFull = args.includes('--full');
  const showVariation = args.includes('--show-variation');
  const showLinks = args.includes('--show-links');
  
  if (genFull || genSitemap) {
    console.log('\n--- Generating Sitemap ---');
    generateSitemap(data);
  }
  
  if (genFull || genRobots) {
    console.log('\n--- Generating robots.txt ---');
    generateRobotsTxt(data);
  }
  
  if (showVariation) {
    console.log('\n--- Deterministic Variation Demo (Single baseIndex) ---\n');
    const sampleSlugs = ['compress-image-to-20kb', 'compress-image-to-50kb', 'compress-image-to-100kb'];
    for (const slug of sampleSlugs) {
      const page = data.pages[slug];
      if (page) {
        const seo = generateDynamicSeo(page);
        console.log(`📄 ${slug} (baseIndex: ${seo.baseIndex}):`);
        console.log(`   Title: ${seo.title}`);
        console.log(`   Meta: ${seo.metaDescription}`);
        console.log(`   H1: ${seo.h1}`);
        console.log(`   Intro: ${seo.intro.substring(0, 50)}...`);
        console.log(`   WhenToUse: ${seo.whenToUse.substring(0, 50)}...`);
        console.log('');
      }
    }
    return;
  }
  
  if (showLinks) {
    console.log('\n--- Nearby Links Demo (Numerically Sorted) ---\n');
    const testSlug = 'compress-image-to-50kb';
    const links = getNearbyLinks(testSlug, data.pages, data.site.domain);
    console.log(`Nearby links for ${testSlug}:`);
    links.forEach(l => console.log(`  - ${l.anchor} → ${l.url}`));
    return;
  }
  
  if (pageArg) {
    const slug = pageArg.replace('--page=', '');
    const result = generatePage(slug, data);
    if (result) {
      console.log(`Generated: ${result.slug}.html (${result.sizeKB} KB)`);
      if (showHtml) {
        console.log('\n--- Generated HTML ---\n');
        console.log(result.html);
      }
    }
  } else if (generateAll || genFull) {
    console.log('\n--- Generating All SEO Pages ---\n');
    let totalSize = 0;
    let count = 0;
    for (const slug of Object.keys(data.pages)) {
      const result = generatePage(slug, data);
      if (result) {
        console.log(`Generated: ${result.slug}.html (${result.sizeKB} KB)`);
        totalSize += parseFloat(result.sizeKB);
        count++;
      }
    }
    console.log(`\n✅ Generated ${count} compression pages! Total size: ${totalSize.toFixed(2)} KB`);
    console.log(`   Average page size: ${(totalSize / count).toFixed(2)} KB`);
    
    // PHASE 7: Generate blog posts
    if (Object.keys(BLOG_POSTS).length > 0) {
      console.log('\n--- Generating Blog Posts ---\n');
      let blogSize = 0;
      let blogCount = 0;
      for (const slug of Object.keys(BLOG_POSTS)) {
        const result = generateBlogPost(slug, data.site);
        if (result) {
          console.log(`Generated: blog/${result.slug}.html (${result.sizeKB} KB, ${result.wordCount} words)`);
          blogSize += parseFloat(result.sizeKB);
          blogCount++;
        }
      }
      console.log(`\n✅ Generated ${blogCount} blog posts! Total size: ${blogSize.toFixed(2)} KB`);
    }
    
    // PHASE 7: Generate programmatic pages
    if (Object.keys(PROGRAMMATIC_PAGES).length > 0) {
      console.log('\n--- Generating Programmatic Pages ---\n');
      let progSize = 0;
      let progCount = 0;
      for (const slug of Object.keys(PROGRAMMATIC_PAGES)) {
        const result = generateProgrammaticPage(slug, data.site);
        if (result) {
          console.log(`Generated: ${result.slug}.html (${result.sizeKB} KB)`);
          progSize += parseFloat(result.sizeKB);
          progCount++;
        }
      }
      console.log(`\n✅ Generated ${progCount} programmatic pages! Total size: ${progSize.toFixed(2)} KB`);
    }
    
    // Update blog index
    generateBlogIndex(data.site);
    
  } else if (priorityOnly) {
    console.log('\n--- Generating Priority Pages ---\n');
    let totalSize = 0;
    for (const slug of CONFIG.priorityPages) {
      const result = generatePage(slug, data);
      if (result) {
        console.log(`Generated: ${result.slug}.html (${result.sizeKB} KB)`);
        totalSize += parseFloat(result.sizeKB);
      }
    }
    console.log(`\n✅ Priority pages generated! Total size: ${totalSize.toFixed(2)} KB`);
  } else {
    console.log(`
Static SEO Page Generator - MyGuyAI (Phase 7)
==============================================

Usage:
  node generate-seo-pages.js --page=<slug>         Generate single page
  node generate-seo-pages.js --page=<slug> --show  Generate and display HTML
  node generate-seo-pages.js --priority            Generate priority pages
  node generate-seo-pages.js --all                 Generate all compression pages
  node generate-seo-pages.js --sitemap             Generate sitemap.xml
  node generate-seo-pages.js --robots              Generate robots.txt
  node generate-seo-pages.js --full                Generate everything (compression + blogs + programmatic)
  node generate-seo-pages.js --blogs               Generate blog posts only
  node generate-seo-pages.js --show-variation      Demo deterministic variation
  node generate-seo-pages.js --show-links          Demo nearby links logic

Available compression pages (${Object.keys(data.pages).length} total):
${Object.keys(data.pages).map(slug => `  - ${slug}`).join('\n')}

Available blog posts (${Object.keys(BLOG_POSTS).length} total):
${Object.keys(BLOG_POSTS).map(slug => `  - ${slug}`).join('\n')}

Available programmatic pages (${Object.keys(PROGRAMMATIC_PAGES).length} total):
${Object.keys(PROGRAMMATIC_PAGES).map(slug => `  - ${slug}`).join('\n')}
    `);
  }
}

// ============================================
// PHASE 7: BLOG POST GENERATOR
// ============================================

function generateBlogPost(slug, site) {
  const post = BLOG_POSTS[slug];
  if (!post) {
    console.error(`Blog post not found: ${slug}`);
    return null;
  }
  
  // Ensure blog directory exists
  if (!fs.existsSync(CONFIG.blogOutputDir)) {
    fs.mkdirSync(CONFIG.blogOutputDir, { recursive: true });
  }
  
  const canonicalUrl = `${site.domain.toLowerCase()}/blog/${post.slug}`;
  const html = generateBlogHtml(post, site, canonicalUrl);
  const outputPath = path.join(CONFIG.blogOutputDir, `${slug}.html`);
  
  // Count words for quality check
  const textContent = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
  const wordCount = textContent.split(' ').filter(w => w.length > 0).length;
  
  fs.writeFileSync(outputPath, html, 'utf8');
  
  const stats = fs.statSync(outputPath);
  const sizeKB = (stats.size / 1024).toFixed(2);
  
  return { slug, outputPath, html, sizeKB, wordCount };
}

function generateBlogHtml(post, site, canonicalUrl) {
  // Generate Table of Contents
  const toc = post.sections.map(s => 
    `<li><a href="#${s.id}">${s.title}</a></li>`
  ).join('\n          ');
  
  // Generate sections with internal links
  const sectionsHtml = post.sections.map(section => {
    let content = section.content;
    
    // Add internal links within content
    if (post.internalLinks && post.internalLinks.tools) {
      post.internalLinks.tools.forEach(link => {
        const regex = new RegExp(`(${link.anchor})`, 'gi');
        if (content.match(regex) && !content.includes(`href="${link.url}"`)) {
          content = content.replace(regex, `<a href="${link.url}">$1</a>`);
        }
      });
    }
    
    return `
    <section id="${section.id}">
      <h2>${section.title}</h2>
      ${content.split('\n\n').map(p => {
        if (p.startsWith('**') && p.endsWith('**')) {
          return `<h3>${p.replace(/\*\*/g, '')}</h3>`;
        }
        if (p.startsWith('|')) {
          // Table handling
          return `<div class="table-wrapper">${markdownTableToHtml(p)}</div>`;
        }
        if (p.startsWith('- ') || p.startsWith('* ')) {
          const items = p.split('\n').map(i => `<li>${i.replace(/^[-*]\s*/, '')}</li>`).join('');
          return `<ul>${items}</ul>`;
        }
        if (p.match(/^\d+\.\s/)) {
          const items = p.split('\n').map(i => `<li>${i.replace(/^\d+\.\s*/, '')}</li>`).join('');
          return `<ol>${items}</ol>`;
        }
        if (p.startsWith('```')) {
          const code = p.replace(/```\w*\n?/g, '');
          return `<pre><code>${escapeHtml(code)}</code></pre>`;
        }
        return `<p>${p}</p>`;
      }).join('\n      ')}
    </section>`;
  }).join('\n');
  
  // Generate FAQ HTML and Schema
  const faqHtml = post.faqs.map(faq => `
        <dt>${faq.question}</dt>
        <dd>${faq.answer}</dd>`).join('');
  
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": post.faqs.map(faq => ({
      "@type": "Question",
      "name": stripHtml(faq.question),
      "acceptedAnswer": {
        "@type": "Answer",
        "text": stripHtml(faq.answer)
      }
    }))
  };
  
  // Article schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.metaDescription,
    "author": {
      "@type": "Organization",
      "name": post.author
    },
    "publisher": {
      "@type": "Organization",
      "name": site.name,
      "logo": {
        "@type": "ImageObject",
        "url": site.logo
      }
    },
    "datePublished": post.publishDate,
    "dateModified": post.publishDate,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": canonicalUrl
    }
  };
  
  // Related blog link
  const relatedBlogLink = post.internalLinks.blogs && post.internalLinks.blogs[0] 
    ? `<p>Related reading: <a href="${post.internalLinks.blogs[0].url}">${post.internalLinks.blogs[0].anchor}</a></p>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <!-- Primary SEO Meta Tags -->
  <title>${post.title}</title>
  <meta name="description" content="${post.metaDescription}">
  <meta name="keywords" content="${post.keywords.join(', ')}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${canonicalUrl}">
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="article">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:title" content="${post.title}">
  <meta property="og:description" content="${post.metaDescription}">
  <meta property="og:image" content="${site.domain}${post.featuredImage}">
  <meta property="og:site_name" content="${site.name}">
  <meta property="article:published_time" content="${post.publishDate}">
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="${canonicalUrl}">
  <meta name="twitter:title" content="${post.title}">
  <meta name="twitter:description" content="${post.metaDescription}">
  <meta name="twitter:image" content="${site.domain}${post.featuredImage}">
  
  <!-- Favicon -->
  <link rel="icon" type="image/png" href="${site.logo}">
  
  <!-- CLS-Safe Ad Styles -->
  <link rel="stylesheet" href="/css/ads.css">
  
  <!-- Google AdSense (Auto Ads Compatible) -->
  <script async
    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9272525041915647"
    crossorigin="anonymous">
  </script>
  
  <!-- GA4 Lazy Loader -->
  <script>
  (function(){
    var GA4_ID = '${CONFIG.ga4MeasurementId}';
    window.dataLayer = window.dataLayer || [];
    window.gtag = function(){window.dataLayer.push(arguments);};
    
    function triggerGA4() {
      if (window.__ga4Loaded) return;
      window.__ga4Loaded = true;
      removeListeners();
      loadGA4();
    }
    
    function addListeners() {
      window.addEventListener('scroll', triggerGA4, { passive: true });
      window.addEventListener('mousemove', triggerGA4);
      window.addEventListener('touchstart', triggerGA4, { passive: true });
      window.addEventListener('keydown', triggerGA4);
      setTimeout(triggerGA4, 4000);
    }
    
    function removeListeners() {
      window.removeEventListener('scroll', triggerGA4);
      window.removeEventListener('mousemove', triggerGA4);
      window.removeEventListener('touchstart', triggerGA4);
      window.removeEventListener('keydown', triggerGA4);
    }
    
    function loadGA4(retried) {
      if (document.querySelector('script[src="https://www.googletagmanager.com/gtag/js?id=' + GA4_ID + '"]')) {
        initGA4();
        return;
      }
      var script = document.createElement('script');
      script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA4_ID;
      script.async = true;
      script.onload = initGA4;
      script.onerror = function() {
        if (!retried) setTimeout(function(){ loadGA4(true); }, 1000);
      };
      document.head.appendChild(script);
    }
    
    function initGA4() {
      if (window.__ga4Initialized) return;
      gtag('js', new Date());
      gtag('config', GA4_ID, {
        anonymize_ip: true,
        send_page_view: true,
        transport_type: 'beacon',
        page_path: window.location.pathname
      });
      window.__ga4Initialized = true;
    }
    
    addListeners();
  })();
  </script>
  
  <!-- JSON-LD: Article Schema -->
  <script type="application/ld+json">${JSON.stringify(articleSchema)}</script>
  
  <!-- JSON-LD: FAQPage Schema -->
  <script type="application/ld+json">${JSON.stringify(faqSchema)}</script>
  
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.7; color: #1e293b; max-width: 800px; margin: 0 auto; padding: 20px; }
    header { border-bottom: 1px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 30px; }
    .logo { font-size: 1.5rem; font-weight: 700; color: #3b82f6; text-decoration: none; }
    .breadcrumb { font-size: 0.875rem; color: #64748b; margin-top: 10px; }
    .breadcrumb a { color: #3b82f6; text-decoration: none; }
    article { margin-bottom: 40px; }
    h1 { font-size: 2.25rem; margin-bottom: 15px; color: #0f172a; }
    .meta { color: #64748b; font-size: 0.875rem; margin-bottom: 25px; }
    h2 { font-size: 1.5rem; margin-top: 40px; margin-bottom: 15px; color: #1e293b; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; }
    h3 { font-size: 1.125rem; margin-top: 25px; margin-bottom: 10px; color: #334155; }
    p { margin-bottom: 15px; }
    a { color: #3b82f6; }
    ul, ol { margin-bottom: 15px; padding-left: 25px; }
    li { margin-bottom: 8px; }
    .toc { background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
    .toc h3 { margin-top: 0; }
    .toc ul { list-style: none; padding-left: 0; margin-bottom: 0; }
    .toc li { margin-bottom: 5px; }
    .cta-box { background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; padding: 30px; border-radius: 12px; text-align: center; margin: 40px 0; }
    .cta-box h3 { color: white; margin-top: 0; }
    .cta-box a { display: inline-block; background: white; color: #3b82f6; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 15px; }
    .faq dt { font-weight: 600; margin-top: 20px; }
    .faq dd { margin-left: 0; margin-top: 8px; color: #475569; }
    .table-wrapper { overflow-x: auto; margin: 20px 0; }
    table { width: 100%; border-collapse: collapse; }
    th, td { border: 1px solid #e2e8f0; padding: 10px; text-align: left; }
    th { background: #f8fafc; }
    pre { background: #1e293b; color: #e2e8f0; padding: 15px; border-radius: 8px; overflow-x: auto; }
    code { font-family: 'Fira Code', monospace; }
    footer { border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 40px; text-align: center; color: #64748b; font-size: 0.875rem; }
    footer a { color: #3b82f6; text-decoration: none; margin: 0 10px; }
  </style>
</head>
<body>
  <header>
    <a href="/" class="logo">${site.name}</a>
    <nav class="breadcrumb">
      <a href="/">Home</a> / <a href="/blog">Blog</a> / ${post.title.substring(0, 40)}...
    </nav>
  </header>
  
  <!-- AD SLOT 1: Above Content -->
  <section class="ad-slot ad-slot-header" aria-label="Advertisement">
    <ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-9272525041915647" data-ad-slot="1234567890" data-ad-format="horizontal" data-full-width-responsive="true"></ins>
  </section>
  
  <article>
    <h1>${post.title}</h1>
    <p class="meta">By ${post.author} • ${post.publishDate} • ${post.category}</p>
    
    <p class="intro">${post.intro}</p>
    
    <nav class="toc">
      <h3>Table of Contents</h3>
      <ul>
        ${toc}
        <li><a href="#faq">Frequently Asked Questions</a></li>
      </ul>
    </nav>
    
    ${sectionsHtml}
    
    <!-- CTA Box -->
    <div class="cta-box">
      <h3>${post.cta.text}</h3>
      <p>${post.cta.description}</p>
      <a href="${post.cta.link}">${post.cta.text}</a>
    </div>
    
    <!-- AD SLOT 2: Mid Content -->
    <section class="ad-slot ad-slot-below-tool" aria-label="Advertisement">
      <ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-9272525041915647" data-ad-slot="2345678901" data-ad-format="auto" data-full-width-responsive="true"></ins>
    </section>
    
    <section id="faq">
      <h2>Frequently Asked Questions</h2>
      <dl class="faq">${faqHtml}
      </dl>
    </section>
    
    ${relatedBlogLink}
    
    <section id="related-tools">
      <h2>Related Tools</h2>
      <ul>
        ${post.relatedTools.map(tool => `<li><a href="/${tool}">${tool.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</a></li>`).join('\n        ')}
      </ul>
    </section>
  </article>
  
  <footer>
    <nav>
      <a href="/">Home</a>
      <a href="/blog">Blog</a>
      <a href="/about">About</a>
      <a href="/contact">Contact</a>
      <a href="/privacy-policy">Privacy</a>
    </nav>
    <p>&copy; ${new Date().getFullYear()} ${site.name}. All rights reserved.</p>
  </footer>
  
  
</body>
</html>`;
}

// ============================================
// PHASE 7: PROGRAMMATIC PAGE GENERATOR
// ============================================

function generateProgrammaticPage(slug, site) {
  const page = PROGRAMMATIC_PAGES[slug];
  if (!page) {
    console.error(`Programmatic page not found: ${slug}`);
    return null;
  }
  
  const canonicalUrl = page.canonical;
  const html = generateProgrammaticHtml(page, site);
  const outputPath = path.join(CONFIG.outputDir, `${slug}.html`);
  
  fs.writeFileSync(outputPath, html, 'utf8');
  
  const stats = fs.statSync(outputPath);
  const sizeKB = (stats.size / 1024).toFixed(2);
  
  return { slug, outputPath, html, sizeKB };
}

function generateProgrammaticHtml(page, site) {
  const faqHtml = page.faqs.map(faq => `
        <dt>${faq.question}</dt>
        <dd>${faq.answer}</dd>`).join('');
  
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": page.faqs.map(faq => ({
      "@type": "Question",
      "name": stripHtml(faq.question),
      "acceptedAnswer": {
        "@type": "Answer",
        "text": stripHtml(faq.answer)
      }
    }))
  };
  
  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": page.h1,
    "description": page.metaDescription,
    "url": page.canonical,
    "applicationCategory": "ImageOptimizationApplication",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "provider": { "@type": "Organization", "name": site.name, "url": site.domain }
  };
  
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": page.breadcrumbs.map((crumb, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "name": crumb.name,
      "item": crumb.url === '/' ? site.domain : `${site.domain}${crumb.url}`
    }))
  };
  
  // Blog link for internal linking
  const blogLink = page.relatedBlogs && page.relatedBlogs[0] 
    ? `<p>Learn more: <a href="/blog/${page.relatedBlogs[0]}">${page.relatedBlogs[0].replace(/-/g, ' ')}</a></p>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <title>${page.title}</title>
  <meta name="description" content="${page.metaDescription}">
  <meta name="keywords" content="${page.keywords.join(', ')}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${page.canonical}">
  
  <meta property="og:type" content="website">
  <meta property="og:url" content="${page.canonical}">
  <meta property="og:title" content="${page.title}">
  <meta property="og:description" content="${page.metaDescription}">
  <meta property="og:site_name" content="${site.name}">
  
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${page.title}">
  <meta name="twitter:description" content="${page.metaDescription}">
  
  <link rel="icon" type="image/png" href="${site.logo}">
  <link rel="stylesheet" href="/css/ads.css">
  
  <!-- Google AdSense (Auto Ads Compatible) -->
  <script async
    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9272525041915647"
    crossorigin="anonymous">
  </script>
  
  <!-- GA4 Lazy Loader -->
  <script>
  (function(){
    var GA4_ID = '${CONFIG.ga4MeasurementId}';
    window.dataLayer = window.dataLayer || [];
    window.gtag = function(){window.dataLayer.push(arguments);};
    function triggerGA4() {
      if (window.__ga4Loaded) return;
      window.__ga4Loaded = true;
      removeListeners();
      loadGA4();
    }
    function addListeners() {
      window.addEventListener('scroll', triggerGA4, { passive: true });
      window.addEventListener('mousemove', triggerGA4);
      window.addEventListener('touchstart', triggerGA4, { passive: true });
      window.addEventListener('keydown', triggerGA4);
      setTimeout(triggerGA4, 4000);
    }
    function removeListeners() {
      window.removeEventListener('scroll', triggerGA4);
      window.removeEventListener('mousemove', triggerGA4);
      window.removeEventListener('touchstart', triggerGA4);
      window.removeEventListener('keydown', triggerGA4);
    }
    function loadGA4(retried) {
      if (document.querySelector('script[src="https://www.googletagmanager.com/gtag/js?id=' + GA4_ID + '"]')) { initGA4(); return; }
      var script = document.createElement('script');
      script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA4_ID;
      script.async = true;
      script.onload = initGA4;
      script.onerror = function() { if (!retried) setTimeout(function(){ loadGA4(true); }, 1000); };
      document.head.appendChild(script);
    }
    function initGA4() {
      if (window.__ga4Initialized) return;
      gtag('js', new Date());
      gtag('config', GA4_ID, { anonymize_ip: true, send_page_view: true, transport_type: 'beacon', page_path: window.location.pathname });
      window.__ga4Initialized = true;
    }
    addListeners();
  })();
  </script>
  
  <script type="application/ld+json">${JSON.stringify(webAppSchema)}</script>
  <script type="application/ld+json">${JSON.stringify(breadcrumbSchema)}</script>
  <script type="application/ld+json">${JSON.stringify(faqSchema)}</script>
</head>
<body>
  <header role="banner">
    <nav aria-label="Main navigation">
      <a href="/" class="logo">${site.name}</a>
    </nav>
    <nav aria-label="Breadcrumb">
      <ol itemscope itemtype="https://schema.org/BreadcrumbList">
        ${page.breadcrumbs.map((crumb, i) => `
        <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
          <a itemprop="item" href="${crumb.url}"><span itemprop="name">${crumb.name}</span></a>
          <meta itemprop="position" content="${i + 1}">
        </li>`).join('')}
      </ol>
    </nav>
  </header>
  
  <main role="main">
    <section class="ad-slot ad-slot-header" aria-label="Advertisement">
      <ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-9272525041915647" data-ad-slot="1234567890" data-ad-format="horizontal" data-full-width-responsive="true"></ins>
    </section>
    
    <section id="hero">
      <h1>${page.h1}</h1>
      <p class="subtitle">${page.h2}</p>
      <p class="intro">${page.intro}</p>
    </section>
    
    <section id="tool-interface">
      <div id="root">
        <noscript><p>Please enable JavaScript to use this tool.</p></noscript>
      </div>
    </section>
    
    <section class="trust-signal">
      <span>🔒 100% Secure & Private — All processing happens locally in your browser.</span>
    </section>
    
    <section class="ad-slot ad-slot-below-tool" aria-label="Advertisement">
      <ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-9272525041915647" data-ad-slot="2345678901" data-ad-format="auto" data-full-width-responsive="true"></ins>
    </section>
    
    <section id="use-cases">
      <h2>Common Use Cases</h2>
      <ul>
        ${page.useCases.map(uc => `<li>${uc}</li>`).join('\n        ')}
      </ul>
      ${blogLink}
    </section>
    
    <section id="faq">
      <h2>Frequently Asked Questions</h2>
      <dl>${faqHtml}
      </dl>
    </section>
    
    <section class="ad-slot ad-slot-in-content" aria-label="Advertisement">
      <ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-9272525041915647" data-ad-slot="3456789012" data-ad-format="auto" data-full-width-responsive="true"></ins>
    </section>
    
    <section id="related-tools">
      <h2>Related Tools</h2>
      <nav>
        <ul>
          ${page.relatedTools.map(tool => `<li><a href="/${tool}">${tool.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</a></li>`).join('\n          ')}
        </ul>
      </nav>
    </section>
  </main>
  
  <footer role="contentinfo">
    <nav>
      <ul>
        <li><a href="/about">About Us</a></li>
        <li><a href="/contact">Contact</a></li>
        <li><a href="/privacy-policy">Privacy Policy</a></li>
        <li><a href="/terms">Terms of Service</a></li>
      </ul>
    </nav>
    <p>&copy; ${new Date().getFullYear()} ${site.name}. All rights reserved.</p>
  </footer>
  
  
</body>
</html>`;
}

// ============================================
// PHASE 7: BLOG INDEX GENERATOR
// ============================================

function generateBlogIndex(site) {
  const posts = Object.values(BLOG_POSTS).sort((a, b) => 
    new Date(b.publishDate) - new Date(a.publishDate)
  );
  
  const postsHtml = posts.map(post => `
    <article class="post-card">
      <h2><a href="/blog/${post.slug}">${post.title}</a></h2>
      <p class="meta">${post.publishDate} • ${post.category}</p>
      <p>${post.metaDescription}</p>
      <a href="/blog/${post.slug}" class="read-more">Read More →</a>
    </article>
  `).join('\n');
  
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Blog - Image Compression & Optimization Guides | ${site.name}</title>
  <meta name="description" content="Expert guides on image compression, format conversion, and photo optimization for web, government forms, and social media.">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${site.domain}/blog">
  
  <meta property="og:type" content="website">
  <meta property="og:url" content="${site.domain}/blog">
  <meta property="og:title" content="Blog - Image Compression Guides | ${site.name}">
  <meta property="og:description" content="Expert guides on image compression and optimization.">
  <meta property="og:site_name" content="${site.name}">
  
  <meta name="twitter:card" content="summary_large_image">
  
  <link rel="icon" type="image/png" href="${site.logo}">
  
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1e293b; max-width: 900px; margin: 0 auto; padding: 20px; }
    header { border-bottom: 1px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 30px; }
    .logo { font-size: 1.5rem; font-weight: 700; color: #3b82f6; text-decoration: none; }
    h1 { font-size: 2rem; margin-bottom: 10px; }
    .subtitle { color: #64748b; margin-bottom: 30px; }
    .post-card { border: 1px solid #e2e8f0; padding: 25px; border-radius: 12px; margin-bottom: 20px; }
    .post-card h2 { margin-top: 0; font-size: 1.25rem; }
    .post-card h2 a { color: #1e293b; text-decoration: none; }
    .post-card h2 a:hover { color: #3b82f6; }
    .meta { color: #64748b; font-size: 0.875rem; margin: 10px 0; }
    .read-more { color: #3b82f6; text-decoration: none; font-weight: 500; }
    footer { border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 40px; text-align: center; color: #64748b; }
    footer a { color: #3b82f6; text-decoration: none; margin: 0 10px; }
  </style>
</head>
<body>
  <header>
    <a href="/" class="logo">${site.name}</a>
  </header>
  
  <main>
    <h1>Blog</h1>
    <p class="subtitle">Expert guides on image compression, format conversion, and photo optimization.</p>
    
    ${postsHtml}
  </main>
  
  <footer>
    <nav>
      <a href="/">Home</a>
      <a href="/about">About</a>
      <a href="/contact">Contact</a>
      <a href="/privacy-policy">Privacy</a>
    </nav>
    <p>&copy; ${new Date().getFullYear()} ${site.name}. All rights reserved.</p>
  </footer>
</body>
</html>`;
  
  const outputPath = path.join(CONFIG.blogOutputDir, 'index.html');
  fs.writeFileSync(outputPath, html, 'utf8');
  console.log('Generated: blog/index.html');
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function markdownTableToHtml(markdown) {
  const lines = markdown.trim().split('\n');
  if (lines.length < 2) return '';
  
  const headers = lines[0].split('|').filter(c => c.trim()).map(c => `<th>${c.trim()}</th>`).join('');
  const rows = lines.slice(2).map(line => {
    const cells = line.split('|').filter(c => c.trim()).map(c => `<td>${c.trim()}</td>`).join('');
    return `<tr>${cells}</tr>`;
  }).join('');
  
  return `<table><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table>`;
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

main();
