import { HeaderBannerAd, BelowToolAd, MidContentAd, StickySidebarAd, BottomAd } from './AdPlaceholder';

/**
 * ToolPageLayout - Strategic ad placement wrapper for tool pages
 * 
 * PLACEMENT STRATEGY:
 * 1. Header banner (optional, below nav)
 * 2. Tool UI - NO ADS HERE (above the fold)
 * 3. Below tool results - HIGH CONVERSION
 * 4. SEO content with mid-content ad
 * 5. Sticky sidebar on desktop
 * 6. Bottom ad before footer
 */
export const ToolPageLayout = ({ 
  children,
  seoContent,
  faqContent,
  relatedTools,
  showHeaderAd = false,  // LOW priority, off by default
  showBelowToolAd = true,  // HIGH priority
  showMidContentAd = true,
  showSidebarAd = true,
  showBottomAd = true
}) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Optional Header Banner - LOW PRIORITY */}
      {showHeaderAd && <HeaderBannerAd />}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            {/* TOOL UI - NO ADS IN THIS ZONE */}
            <div className="tool-interface-zone">
              {children}
            </div>
            
            {/* HIGH CONVERSION ZONE - Below tool results */}
            {showBelowToolAd && <BelowToolAd />}
            
            {/* SEO Content Section */}
            {seoContent && (
              <section className="mt-12">
                {/* First part of SEO content */}
                <div className="seo-content-part-1">
                  {typeof seoContent === 'function' ? seoContent(1) : seoContent}
                </div>
                
                {/* Mid-content ad - blends with content */}
                {showMidContentAd && <MidContentAd />}
                
                {/* Second part of SEO content (if any) */}
                {typeof seoContent === 'function' && (
                  <div className="seo-content-part-2">
                    {seoContent(2)}
                  </div>
                )}
              </section>
            )}
            
            {/* FAQ Section */}
            {faqContent && (
              <section className="mt-12">
                {faqContent}
              </section>
            )}
            
            {/* Related Tools */}
            {relatedTools && (
              <section className="mt-12">
                {relatedTools}
              </section>
            )}
            
            {/* Bottom Ad - Before footer area */}
            {showBottomAd && <BottomAd />}
          </div>
          
          {/* Sticky Sidebar - DESKTOP ONLY */}
          {showSidebarAd && (
            <div className="hidden lg:block flex-shrink-0">
              <StickySidebarAd />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * HomepageLayout - Strategic ad placement for homepage
 */
export const HomepageLayout = ({
  heroSection,
  toolFinder,
  categorySections,
  faqSection,
  showHeaderAd = false,
  showMidAd = true,
  showBottomAd = true
}) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Optional Header Banner */}
      {showHeaderAd && <HeaderBannerAd />}
      
      {/* Hero - NO ADS */}
      {heroSection}
      
      {/* Tool Finder - NO ADS */}
      {toolFinder}
      
      {/* Category Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {categorySections && (
          <>
            {/* First category section */}
            {categorySections[0]}
            
            {/* Mid-page ad */}
            {showMidAd && categorySections.length > 1 && (
              <div className="my-8">
                <MidContentAd />
              </div>
            )}
            
            {/* Remaining category sections */}
            {categorySections.slice(1)}
          </>
        )}
        
        {/* FAQ Section */}
        {faqSection}
        
        {/* Bottom Ad */}
        {showBottomAd && <BottomAd />}
      </div>
    </div>
  );
};

export default ToolPageLayout;
