// ===========================================
// CLOUDFLARE TURNSTILE CONFIGURATION
// ===========================================
// Invisible bot protection - triggers on tool submission

export const TURNSTILE_CONFIG = {
  // Site Key (public - used in frontend)
  SITE_KEY: '0x4AAAAAACwd5diz3y7vsfnF',
  
  // Enable/disable Turnstile globally
  ENABLED: true,
  
  // Appearance mode
  // 'invisible' - No widget shown, verification happens silently
  // 'managed' - Cloudflare decides when to show challenge
  // 'always' - Always show the widget
  APPEARANCE: 'managed',
  
  // Theme
  THEME: 'light',
  
  // Retry settings
  RETRY: 'auto',
  RETRY_INTERVAL: 8000,
  
  // Execution mode
  // 'render' - Execute immediately when rendered
  // 'execute' - Execute only when explicitly called
  EXECUTION: 'execute',
};

export default TURNSTILE_CONFIG;
