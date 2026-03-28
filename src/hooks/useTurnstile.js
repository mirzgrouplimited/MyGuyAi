import { useCallback, useRef, useState, useEffect } from 'react';
import { TURNSTILE_CONFIG } from '@/config/turnstileConfig';

/**
 * useTurnstile - Hook for Cloudflare Turnstile invisible verification
 * 
 * Features:
 * - Triggers ONLY when verify() is called (not on page load)
 * - Gracefully bypasses if Turnstile fails to load (don't block users)
 * - 5 second timeout to prevent blocking
 */
export const useTurnstile = () => {
  const widgetId = useRef(null);
  const containerRef = useRef(null);
  const resolveRef = useRef(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [token, setToken] = useState(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (widgetId.current !== null && window.turnstile) {
        try {
          window.turnstile.remove(widgetId.current);
        } catch (e) {}
        widgetId.current = null;
      }
      if (containerRef.current && containerRef.current.parentNode) {
        try {
          containerRef.current.parentNode.removeChild(containerRef.current);
        } catch (e) {}
        containerRef.current = null;
      }
    };
  }, []);

  /**
   * Initialize Turnstile widget
   */
  const initWidget = useCallback(() => {
    return new Promise((resolve) => {
      if (!TURNSTILE_CONFIG.ENABLED) {
        resolve(true);
        return;
      }

      let attempts = 0;
      const maxAttempts = 30; // 3 seconds max wait

      const waitForTurnstile = () => {
        attempts++;
        
        if (window.turnstile) {
          if (!containerRef.current) {
            containerRef.current = document.createElement('div');
            containerRef.current.id = 'turnstile-' + Date.now();
            containerRef.current.style.cssText = 'position:fixed;bottom:10px;right:10px;z-index:9999;';
            document.body.appendChild(containerRef.current);
          }

          if (widgetId.current === null) {
            try {
              widgetId.current = window.turnstile.render(containerRef.current, {
                sitekey: TURNSTILE_CONFIG.SITE_KEY,
                appearance: 'managed',
                theme: 'light',
                execution: 'execute',
                callback: (newToken) => {
                  setToken(newToken);
                  setIsVerifying(false);
                  if (resolveRef.current) {
                    resolveRef.current(newToken);
                    resolveRef.current = null;
                  }
                },
                'error-callback': () => {
                  setIsVerifying(false);
                  // On error, resolve with bypass token to not block user
                  if (resolveRef.current) {
                    resolveRef.current('bypass-error');
                    resolveRef.current = null;
                  }
                },
                'expired-callback': () => {
                  setToken(null);
                },
              });
              resolve(true);
            } catch (e) {
              resolve(false);
            }
          } else {
            resolve(true);
          }
        } else if (attempts < maxAttempts) {
          setTimeout(waitForTurnstile, 100);
        } else {
          // Turnstile didn't load - don't block the user
          resolve(false);
        }
      };
      
      waitForTurnstile();
    });
  }, []);

  /**
   * Verify - Triggers verification with graceful fallback
   */
  const verify = useCallback(async () => {
    // If disabled, bypass immediately
    if (!TURNSTILE_CONFIG.ENABLED) {
      return 'turnstile-disabled';
    }

    // If we have a valid token, return it
    if (token) {
      return token;
    }

    setIsVerifying(true);

    // Try to initialize widget
    const widgetReady = await initWidget();
    
    // If widget didn't load, bypass gracefully
    if (!widgetReady) {
      setIsVerifying(false);
      return 'bypass-not-loaded';
    }

    return new Promise((resolve) => {
      resolveRef.current = resolve;

      // Execute the challenge
      if (widgetId.current !== null && window.turnstile) {
        try {
          window.turnstile.execute(widgetId.current);
        } catch (e) {
          setIsVerifying(false);
          resolve('bypass-execute-error');
          return;
        }
      } else {
        setIsVerifying(false);
        resolve('bypass-no-widget');
        return;
      }

      // Short timeout (5 seconds) - don't make users wait too long
      setTimeout(() => {
        if (resolveRef.current === resolve) {
          setIsVerifying(false);
          resolveRef.current = null;
          // Timeout = bypass, don't block the user
          resolve('bypass-timeout');
        }
      }, 5000);
    });
  }, [initWidget, token]);

  /**
   * Reset for next verification
   */
  const reset = useCallback(() => {
    if (widgetId.current !== null && window.turnstile) {
      try {
        window.turnstile.reset(widgetId.current);
      } catch (e) {}
    }
    setToken(null);
  }, []);

  return {
    verify,
    reset,
    isVerifying,
    token,
  };
};

export default useTurnstile;
