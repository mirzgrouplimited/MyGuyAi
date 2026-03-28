import { useEffect, useRef, useState } from 'react';
import { AD_CONFIG } from '@/config/adConfig';

const ADSENSE_CLIENT = `ca-${AD_CONFIG.PUBLISHER_ID}`;

// Hook: Detect mobile/desktop
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  return isMobile;
};

// Base Ad Component
const AdUnit = ({ placement, className = '', style = {} }) => {
  const adRef = useRef(null);
  const isAdLoaded = useRef(false);
  const isMobile = useIsMobile();
  
  const config = AD_CONFIG.PLACEMENTS?.[placement];
  
  // Check if this ad should show
  const canShow = AD_CONFIG.ENABLED && config?.enabled;
  const showOnThisDevice = isMobile ? config?.showOnMobile : config?.showOnDesktop;
  const shouldRender = canShow && showOnThisDevice;

  useEffect(() => {
    if (!shouldRender || isAdLoaded.current) return;
    
    const loadAd = () => {
      try {
        if (window.adsbygoogle && adRef.current) {
          const adElement = adRef.current.querySelector('.adsbygoogle');
          if (adElement && !adElement.getAttribute('data-ad-status')) {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
            isAdLoaded.current = true;
          }
        }
      } catch (err) {
        // Silently handle - ad blocker etc.
      }
    };

    const timer = setTimeout(loadAd, 150);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldRender]);

  if (!shouldRender || !config) return null;

  const adFormat = config.format === 'horizontal' ? 'auto' : 
                   config.format === 'vertical' ? 'vertical' :
                   config.format === 'fluid' ? 'fluid' : 'rectangle';

  return (
    <div 
      ref={adRef}
      className={`ad-container ${className}`}
      style={{ 
        minHeight: config.minHeight,
        ...style 
      }}
      data-testid={`ad-${placement}`}
      data-ad-placement={placement}
    >
      <ins
        className="adsbygoogle"
        style={{ 
          display: 'block',
          width: '100%',
          minHeight: config.minHeight,
          backgroundColor: 'transparent'
        }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot="auto"
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      />
    </div>
  );
};

// Strategic Ad Components
export const HeaderBannerAd = () => {
  return (
    <div className="w-full bg-slate-50 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4">
        <AdUnit 
          placement="header-banner"
          className="py-2"
          style={{ maxHeight: '100px' }}
        />
      </div>
    </div>
  );
};

export const BelowToolAd = () => {
  return (
    <div className="w-full mt-8 mb-4">
      <div className="border-t border-slate-200 pt-6 mb-4">
        <p className="text-xs text-slate-400 text-center mb-3">Advertisement</p>
      </div>
      <AdUnit 
        placement="below-tool"
        className="mx-auto max-w-3xl rounded-lg overflow-hidden"
      />
      <div className="h-8" />
    </div>
  );
};

export const MidContentAd = () => {
  return (
    <div className="my-8">
      <AdUnit 
        placement="mid-content"
        className="rounded-lg overflow-hidden"
      />
    </div>
  );
};

export const StickySidebarAd = () => {
  const isMobile = useIsMobile();
  
  if (isMobile) return null;
  
  return (
    <div 
      className="hidden lg:block sticky top-24"
      style={{ width: '300px' }}
    >
      <p className="text-xs text-slate-400 text-center mb-2">Sponsored</p>
      <AdUnit 
        placement="sticky-sidebar"
        className="rounded-lg overflow-hidden"
        style={{ width: '300px', minHeight: '600px' }}
      />
    </div>
  );
};

export const BottomAd = () => {
  return (
    <div className="hidden md:block w-full mt-12 mb-8">
      <div className="max-w-4xl mx-auto">
        <div className="border-t border-slate-200 pt-6">
          <p className="text-xs text-slate-400 text-center mb-3">Advertisement</p>
          <AdUnit 
            placement="bottom"
            className="rounded-lg overflow-hidden"
          />
        </div>
      </div>
    </div>
  );
};

// Legacy Support - AdPlaceholder
export const AdPlaceholder = ({ position = 'below-tool' }) => {
  const positionMap = {
    'header': 'header-banner',
    'mid-content': 'mid-content',
    'below-tool': 'below-tool',
    'bottom': 'bottom',
    'middle': 'mid-content'
  };
  
  const placement = positionMap[position] || position;
  
  return (
    <div className="my-4">
      <AdUnit placement={placement} />
    </div>
  );
};

export const InArticleAd = () => {
  return <MidContentAd />;
};

export default AdPlaceholder;
