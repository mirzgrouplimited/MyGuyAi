import { Link } from 'react-router-dom';

// High-resolution logo from user
const LOGO_URL = "https://customer-assets.emergentagent.com/job_utility-zone/artifacts/7jqs10df_4EDA5521-A42C-49AC-9353-168AA2691ABC.png";

export const Footer = () => {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <img 
              src={LOGO_URL}
              alt="MyGuyAI - Free Online Tools" 
              className="h-16 w-auto mb-4 object-contain"
            />
            <p className="text-sm text-slate-600 leading-relaxed mb-3">
              Free online tools for image and PDF processing. Fast, secure, and always free.
            </p>
            <a 
              href="mailto:admin@myguyai.com" 
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              admin@myguyai.com
            </a>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Image Tools</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link to="/compress-image" className="hover:text-blue-600 transition-colors">Compress Image</Link></li>
              <li><Link to="/resize-image" className="hover:text-blue-600 transition-colors">Resize Image</Link></li>
              <li><Link to="/crop-image" className="hover:text-blue-600 transition-colors">Crop Image</Link></li>
              <li><Link to="/passport-photo" className="hover:text-blue-600 transition-colors">Passport Photo Maker</Link></li>
              <li><Link to="/jpg-to-png" className="hover:text-blue-600 transition-colors">JPG to PNG</Link></li>
              <li><Link to="/png-to-jpg" className="hover:text-blue-600 transition-colors">PNG to JPG</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 mb-4">PDF Tools</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link to="/compress-pdf" className="hover:text-blue-600 transition-colors">Compress PDF</Link></li>
              <li><Link to="/merge-pdf" className="hover:text-blue-600 transition-colors">Merge PDF</Link></li>
              <li><Link to="/image-to-pdf" className="hover:text-blue-600 transition-colors">Image to PDF</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link to="/about" className="hover:text-blue-600 transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-blue-600 transition-colors">Contact</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-blue-600 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-blue-600 transition-colors">Terms & Conditions</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200 text-center text-sm text-slate-600">
          <p>&copy; {new Date().getFullYear()} MyGuyAI. All rights reserved. | myguyai.com</p>
          <p className="mt-2 text-xs text-slate-500">
            All file processing happens in your browser. Your files are never uploaded to our servers.
          </p>
          <p className="mt-2 text-xs text-slate-500">
            Contact: <a href="mailto:admin@myguyai.com" className="text-blue-600 hover:underline">admin@myguyai.com</a>
          </p>
        </div>
      </div>
    </footer>
  );
};
