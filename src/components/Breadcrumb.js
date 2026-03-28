import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export const Breadcrumb = ({ items }) => {
  return (
    <nav className="flex items-center gap-2 text-sm" aria-label="Breadcrumb" data-testid="breadcrumb">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {index > 0 && <ChevronRight size={14} className="text-slate-400" />}
          {item.path ? (
            <Link 
              to={item.path}
              className="text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1"
            >
              {index === 0 && <Home size={14} />}
              {item.label}
            </Link>
          ) : (
            <span className="text-slate-900 font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
};
