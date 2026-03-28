import { useState } from 'react';
import { X, ExternalLink } from 'lucide-react';

export const FlashMessage = ({ message, link, linkText }) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || !message) return null;

  return (
    <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-3 px-4" data-testid="flash-message">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <p className="text-sm font-medium flex-1 text-center">
          {message}
          {link && (
            <a 
              href={link} 
              className="ml-2 underline hover:no-underline inline-flex items-center gap-1"
              target="_blank"
              rel="noopener noreferrer"
            >
              {linkText || 'Learn more'} <ExternalLink size={14} />
            </a>
          )}
        </p>
        <button 
          onClick={() => setDismissed(true)}
          className="text-white/80 hover:text-white transition-colors"
          aria-label="Dismiss"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};
