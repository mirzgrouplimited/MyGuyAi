// ===========================================
// AD CONFIGURATION - Strategic Placement System
// ===========================================

export const AD_CONFIG = {
  // Google AdSense Publisher ID (without ca- prefix)
  PUBLISHER_ID: 'pub-9272525041915647',
  
  // Global enable/disable
  ENABLED: true,
  
  // Ad network
  NETWORK: 'adsense',
  
  // ===========================================
  // STRATEGIC AD PLACEMENTS
  // ===========================================
  PLACEMENTS: {
    // LOW PRIORITY - Below header, not above
    'header-banner': {
      enabled: true,
      format: 'horizontal',
      minHeight: '90px',
      maxHeight: '100px',
      showOnMobile: true,
      showOnDesktop: true,
      priority: 'low',
      description: 'Banner below header navigation'
    },
    
    // HIGH CONVERSION - Below tool results
    'below-tool': {
      enabled: true,
      format: 'rectangle',
      minHeight: '250px',
      showOnMobile: true,
      showOnDesktop: true,
      priority: 'high',
      description: 'High engagement zone after tool output'
    },
    
    // MID-CONTENT - Between SEO paragraphs
    'mid-content': {
      enabled: true,
      format: 'fluid',
      minHeight: '200px',
      showOnMobile: true,
      showOnDesktop: true,
      priority: 'medium',
      description: 'Blends with content flow'
    },
    
    // STICKY SIDEBAR - Desktop only
    'sticky-sidebar': {
      enabled: true,
      format: 'vertical',
      minHeight: '600px',
      width: '300px',
      showOnMobile: false,  // CRITICAL: No sticky on mobile
      showOnDesktop: true,
      priority: 'medium',
      description: 'Sticky sidebar for desktop engagement'
    },
    
    // BOTTOM - Before footer
    'bottom': {
      enabled: true,
      format: 'horizontal',
      minHeight: '90px',
      showOnMobile: false,  // Less ads on mobile
      showOnDesktop: true,
      priority: 'low',
      description: 'Footer area banner'
    }
  },
  
  // ===========================================
  // MOBILE OPTIMIZATION
  // ===========================================
  MOBILE: {
    maxAdsPerPage: 2,  // Fewer ads on mobile
    disableStickyAds: true,
    reducedAdHeight: true
  },
  
  // ===========================================
  // UX SAFETY RULES
  // ===========================================
  SAFETY: {
    minDistanceFromButtons: 40,  // px from action buttons
    minDistanceFromToolUI: 30,   // px from tool interface
    reserveSpaceBeforeLoad: true, // Prevent CLS
    clearVisualSeparation: true
  },
  
  // ===========================================
  // A/B TESTING
  // ===========================================
  AB_TEST: {
    enabled: false,
    variant: 'A',  // 'A' = default, 'B' = alternative placement
    variants: {
      A: ['header-banner', 'below-tool', 'mid-content'],
      B: ['below-tool', 'mid-content', 'sticky-sidebar']
    }
  },
  
  // ads.txt content
  ADS_TXT: 'google.com, pub-9272525041915647, DIRECT, f08c47fec0942fa0',
};

export default AD_CONFIG;
