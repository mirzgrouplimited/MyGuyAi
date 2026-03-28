import { Link } from 'react-router-dom';
import { Menu, X, ChevronDown, Minimize2, Maximize2, Crop, Camera, RefreshCw, FileText, Combine, FileImage } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

// High-resolution logo from user
const LOGO_URL = "https://customer-assets.emergentagent.com/job_utility-zone/artifacts/7jqs10df_4EDA5521-A42C-49AC-9353-168AA2691ABC.png";

// Menu data with subcategories
const MENU_CATEGORIES = [
  {
    id: 'image-tools',
    name: 'Image Tools',
    path: '/image-tools',
    subcategories: [
      { name: 'Compress Image', path: '/compress-image', icon: Minimize2, description: 'Reduce to 20KB, 50KB, 100KB' },
      { name: 'Resize Image', path: '/resize-image', icon: Maximize2, description: 'Custom dimensions' },
      { name: 'Crop Image', path: '/crop-image', icon: Crop, description: 'Crop to any shape' },
      { name: 'Passport Photo', path: '/passport-photo', icon: Camera, description: 'Official ID sizes' },
    ]
  },
  {
    id: 'pdf-tools',
    name: 'PDF Tools',
    path: '/pdf-tools',
    subcategories: [
      { name: 'Compress PDF', path: '/compress-pdf', icon: Minimize2, description: 'Reduce PDF size' },
      { name: 'Merge PDF', path: '/merge-pdf', icon: Combine, description: 'Combine multiple PDFs' },
      { name: 'Image to PDF', path: '/image-to-pdf', icon: FileImage, description: 'Convert images to PDF' },
    ]
  },
  {
    id: 'converters',
    name: 'Converters',
    path: '/file-conversion-tools',
    subcategories: [
      { name: 'JPG to PNG', path: '/jpg-to-png', icon: RefreshCw, description: 'Convert with transparency' },
      { name: 'PNG to JPG', path: '/png-to-jpg', icon: RefreshCw, description: 'Reduce file size' },
      { name: 'Image to PDF', path: '/image-to-pdf', icon: FileText, description: 'Create PDF from images' },
    ]
  }
];

const DropdownMenu = ({ category, isOpen, onMouseEnter, onMouseLeave }) => {
  return (
    <div 
      className="relative"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Link
        to={category.path}
        className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors py-2"
        data-testid={`menu-${category.id}`}
      >
        {category.name}
        <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Link>
      
      {isOpen && (
        <div 
          className="absolute top-full left-0 mt-1 w-64 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50"
          data-testid={`dropdown-${category.id}`}
        >
          {category.subcategories.map((sub) => (
            <Link
              key={sub.path}
              to={sub.path}
              className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition-colors"
              data-testid={`submenu-${sub.path.slice(1)}`}
            >
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                <sub.icon size={16} className="text-blue-600" />
              </div>
              <div>
                <span className="block text-sm font-medium text-slate-900">{sub.name}</span>
                <span className="block text-xs text-slate-500">{sub.description}</span>
              </div>
            </Link>
          ))}
          <div className="border-t border-slate-100 mt-2 pt-2 px-4">
            <Link 
              to={category.path}
              className="text-xs font-medium text-blue-600 hover:text-blue-700"
            >
              View all {category.name.toLowerCase()} →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [expandedMobileCategory, setExpandedMobileCategory] = useState(null);
  const timeoutRef = useRef(null);

  const handleMouseEnter = (categoryId) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setOpenDropdown(categoryId);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const toggleMobileCategory = (categoryId) => {
    setExpandedMobileCategory(expandedMobileCategory === categoryId ? null : categoryId);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center flex-shrink-0" data-testid="logo-link">
          <img 
            src={LOGO_URL}
            alt="MyGuyAI - Free Online Tools" 
            className="w-[180px] sm:w-[220px] md:w-[260px] lg:w-[300px] h-auto object-contain"
          />
        </Link>

        {/* Desktop Menu with Dropdowns */}
        <div className="hidden md:flex items-center gap-6">
          {MENU_CATEGORIES.map((category) => (
            <DropdownMenu
              key={category.id}
              category={category}
              isOpen={openDropdown === category.id}
              onMouseEnter={() => handleMouseEnter(category.id)}
              onMouseLeave={handleMouseLeave}
            />
          ))}
          <Link to="/blog" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Blog</Link>
          <Link to="/about" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">About</Link>
        </div>

        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-slate-600"
          data-testid="mobile-menu-toggle"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu with Expandable Categories */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white" data-testid="mobile-menu">
          <div className="px-4 py-4 space-y-1">
            {MENU_CATEGORIES.map((category) => (
              <div key={category.id}>
                <button
                  onClick={() => toggleMobileCategory(category.id)}
                  className="w-full flex items-center justify-between text-sm font-medium text-slate-700 py-3 border-b border-slate-100"
                  data-testid={`mobile-menu-${category.id}`}
                >
                  {category.name}
                  <ChevronDown 
                    size={16} 
                    className={`transition-transform ${expandedMobileCategory === category.id ? 'rotate-180' : ''}`}
                  />
                </button>
                
                {expandedMobileCategory === category.id && (
                  <div className="pl-4 py-2 space-y-1 bg-slate-50 rounded-lg mb-2">
                    {category.subcategories.map((sub) => (
                      <Link
                        key={sub.path}
                        to={sub.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 py-2 px-2 text-sm text-slate-600 hover:text-blue-600"
                      >
                        <sub.icon size={16} className="text-slate-400" />
                        {sub.name}
                      </Link>
                    ))}
                    <Link
                      to={category.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-2 px-2 text-xs font-medium text-blue-600"
                    >
                      View all →
                    </Link>
                  </div>
                )}
              </div>
            ))}
            
            <Link to="/blog" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium text-slate-700 py-3 border-b border-slate-100">Blog</Link>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium text-slate-700 py-3 border-b border-slate-100">About</Link>
            <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium text-slate-700 py-3">Contact</Link>
          </div>
        </div>
      )}
    </header>
  );
};
