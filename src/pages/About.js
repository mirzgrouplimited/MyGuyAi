import { SEO } from '@/components/SEO';
import { Shield, Zap, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

// High-resolution logo from user
const LOGO_URL = "https://customer-assets.emergentagent.com/job_utility-zone/artifacts/7jqs10df_4EDA5521-A42C-49AC-9353-168AA2691ABC.png";

export default function About() {
  return (
    <>
      <SEO 
        title="About MyGuyAI - Free Online Tools" 
        description="Learn about MyGuyAI - free online tools for image compression, resizing, format conversion, and PDF management. Fast, secure, browser-based processing."
        path="/about"
      />
      
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-16">
            <img 
              src={LOGO_URL}
              alt="MyGuyAI - Free Online Tools" 
              className="h-28 sm:h-32 w-auto mx-auto mb-6 object-contain"
            />
            <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-4">
              About MyGuyAI
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed mb-4">
              Free online tools for everyone
            </p>
            <a 
              href="mailto:admin@myguyai.com" 
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              admin@myguyai.com
            </a>
          </div>

          <div className="prose prose-lg prose-slate max-w-none mb-16">
            <p className="lead text-slate-600">
              MyGuyAI provides free, fast, and secure online tools for image and PDF processing. 
              Our mission is simple: make essential file editing tools accessible to everyone, 
              without expensive software or complicated workflows.
            </p>
            
            <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">Why Choose MyGuyAI?</h2>
            
            <p className="text-slate-600">
              Unlike traditional software or other online tools that upload your files to remote servers, 
              MyGuyAI processes everything directly in your web browser. This means your files never leave 
              your device – ensuring complete privacy and instant results.
            </p>
            
            <p className="text-slate-600">
              Whether you need to compress images for email, resize photos for social media, convert 
              between formats, or manage PDF documents, our tools deliver professional results in seconds. 
              No sign-up required, no usage limits, and completely free.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center p-6 bg-slate-50 rounded-xl">
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-blue-100 flex items-center justify-center">
                <Shield className="text-blue-600" size={28} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">100% Private</h3>
              <p className="text-slate-600 text-sm">
                Files are processed locally in your browser. Nothing is uploaded to our servers.
              </p>
            </div>
            
            <div className="text-center p-6 bg-slate-50 rounded-xl">
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-green-100 flex items-center justify-center">
                <Zap className="text-green-600" size={28} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Lightning Fast</h3>
              <p className="text-slate-600 text-sm">
                No uploads or downloads from servers. Processing happens instantly.
              </p>
            </div>
            
            <div className="text-center p-6 bg-slate-50 rounded-xl">
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-orange-100 flex items-center justify-center">
                <DollarSign className="text-orange-600" size={28} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Always Free</h3>
              <p className="text-slate-600 text-sm">
                No sign-up, no limits, no hidden fees. Supported by minimal, non-intrusive ads.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Start Using Free Tools</h2>
            <p className="text-blue-100 mb-6">
              Explore our complete suite of image and PDF tools.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                to="/image-tools"
                className="px-6 py-2 bg-white text-blue-600 font-semibold rounded-full hover:bg-blue-50 transition-colors"
              >
                Image Tools
              </Link>
              <Link 
                to="/pdf-tools"
                className="px-6 py-2 bg-blue-700 text-white font-semibold rounded-full hover:bg-blue-800 transition-colors"
              >
                PDF Tools
              </Link>
            </div>
            <p className="text-blue-100 mt-6 text-sm">
              Questions? Contact us: <a href="mailto:admin@myguyai.com" className="text-white underline hover:no-underline">admin@myguyai.com</a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
