import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '@/components/SEO';
import { ToolCard } from '@/components/ToolCard';
import { FlashMessage } from '@/components/FlashMessage';
import { ToolFinder } from '@/components/ToolFinder';
import { FAQ } from '@/components/FAQ';
import { MidContentAd, BottomAd, AdPlaceholder } from '@/components/AdPlaceholder';
import { Minimize2, Maximize2, RefreshCw, FileImage, Combine, Crop, Image, FileText, ArrowRight } from 'lucide-react';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const HOMEPAGE_FAQS = [
  {
    question: "Are these tools really free?",
    answer: "Yes! All our tools are 100% free to use with no hidden fees, no sign-up required, and no usage limits. We're supported by ads to keep everything free."
  },
  {
    question: "Is my data safe?",
    answer: "Absolutely. All file processing happens directly in your browser. Your files are never uploaded to our servers, ensuring complete privacy and security."
  },
  {
    question: "What file formats are supported?",
    answer: "Our image tools support JPG, JPEG, PNG, WebP, HEIC, and HEIF formats. PDF tools support standard PDF files. Each tool page lists specific supported formats."
  },
  {
    question: "Do I need to create an account?",
    answer: "No account needed! Simply visit any tool, upload your file, and get instant results. No registration, no email required."
  },
  {
    question: "Can I use these tools on mobile?",
    answer: "Yes! Our tools are fully mobile-responsive and work on all devices including phones, tablets, and desktops. You can even capture photos directly from your camera."
  },
  {
    question: "What's the maximum file size?",
    answer: "Image files can be up to 10MB, and PDF files can be up to 25MB. These limits ensure fast processing in your browser."
  }
];

const POPULAR_TOOLS = [
  { id: 'compress-image', name: 'Compress Image', icon: Minimize2, color: 'blue' },
  { id: 'jpg-to-png', name: 'JPG to PNG', icon: RefreshCw, color: 'green' },
  { id: 'merge-pdf', name: 'Merge PDF', icon: Combine, color: 'orange' },
  { id: 'resize-image', name: 'Resize Image', icon: Maximize2, color: 'purple' },
];

export default function Home() {
  const [settings, setSettings] = useState({});
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [settingsRes, toolsRes] = await Promise.all([
        axios.get(`${API}/settings`),
        axios.get(`${API}/tools`)
      ]);
      setSettings(settingsRes.data);
      setCategories(toolsRes.data.categories || []);
    } catch (error) {
      console.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO 
        title="Free Online Tools – Compress Images, Convert JPG to PNG, Merge PDF & More" 
        description="MyGuyAI offers free online tools for image compression, resizing, format conversion, and PDF management. All processing happens in your browser - fast, secure, and private."
        path="/"
      />
      
      {/* Flash Message */}
      {settings.flash_message?.enabled && (
        <FlashMessage 
          message={settings.flash_message.message}
          link={settings.flash_message.link}
          linkText={settings.flash_message.link_text}
        />
      )}
      
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-slate-50 to-white py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 mb-6">
                Free Online Tools
              </h1>
              <p className="text-xl text-slate-600 leading-relaxed mb-8">
                Compress images, convert formats, merge PDFs & more. All processing happens in your browser – fast, secure, and completely free.
              </p>
              
              {/* Tool Finder */}
              <ToolFinder />
            </div>
          </div>
        </section>

        {/* Ad - Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <AdPlaceholder position="header" />
        </div>

        {/* Popular Tools */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">Popular Tools</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {POPULAR_TOOLS.map((tool) => (
              <Link 
                key={tool.id} 
                to={`/${tool.id}`}
                className="group bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg hover:border-blue-300 transition-all text-center"
                data-testid={`popular-tool-${tool.id}`}
              >
                <div className={`w-14 h-14 mx-auto mb-4 rounded-xl bg-${tool.color}-100 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <tool.icon className={`text-${tool.color}-600`} size={28} />
                </div>
                <h3 className="font-semibold text-slate-900">{tool.name}</h3>
              </Link>
            ))}
          </div>
        </section>

        {/* All Categories */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">All Tools by Category</h2>
          
          {categories.map((category) => (
            <div key={category.id} className="mb-12" data-testid={`category-${category.id}`}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  {category.id === 'image-tools' && <Image className="text-blue-600" size={24} />}
                  {category.id === 'pdf-tools' && <FileText className="text-orange-600" size={24} />}
                  {category.id === 'file-conversion-tools' && <RefreshCw className="text-green-600" size={24} />}
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{category.name}</h3>
                    <p className="text-sm text-slate-600">{category.description}</p>
                  </div>
                </div>
                <Link 
                  to={`/${category.slug}`}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
                >
                  View All <ArrowRight size={16} />
                </Link>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {category.tools?.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} compact />
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* Ad - Mid Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <AdPlaceholder position="mid-content" />
        </div>

        {/* SEO Content */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-slate-50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Why Choose MyGuyAI Free Online Tools?</h2>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-lg text-slate-600 leading-relaxed mb-6">
                MyGuyAI provides a comprehensive suite of free online tools designed to handle all your image and PDF processing needs. Whether you need to compress images for faster website loading, convert file formats for compatibility, or merge multiple PDFs into a single document, our tools deliver professional results instantly.
              </p>
              
              <h3 className="text-xl font-semibold text-slate-900 mt-8 mb-4">100% Browser-Based Processing</h3>
              <p className="text-slate-600 leading-relaxed mb-6">
                Unlike other online tools that upload your files to remote servers, MyGuyAI processes everything directly in your web browser. This means your sensitive documents and personal photos never leave your device, ensuring complete privacy and security. There's no waiting for uploads or downloads – processing happens instantly.
              </p>
              
              <h3 className="text-xl font-semibold text-slate-900 mt-8 mb-4">Professional Quality, Zero Cost</h3>
              <p className="text-slate-600 leading-relaxed mb-6">
                Our tools use advanced algorithms to deliver professional-quality results. Compress images to exact file sizes (20KB, 50KB, 100KB, 500KB, 1MB) for email attachments or web uploads. Resize photos to standard passport dimensions for official documents. Convert between formats while preserving quality. All completely free, with no watermarks or limitations.
              </p>
            </div>
            
            {/* Mid-content ad - natural content break */}
            <MidContentAd />
            
            <div className="prose max-w-none mt-8">
              <h3 className="text-xl font-semibold text-slate-900 mt-8 mb-4">Works on Any Device</h3>
              <p className="text-slate-600 leading-relaxed">
                MyGuyAI tools work seamlessly on desktops, laptops, tablets, and smartphones. Our mobile-optimized interface even allows you to capture photos directly from your camera and process them instantly. No app downloads required – just open your browser and get started.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <FAQ faqs={HOMEPAGE_FAQS} />
        </section>

        {/* Bottom Ad - Desktop only */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BottomAd />
        </div>

        {/* Final CTA */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl p-8 md:p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Start Using Free Tools Now</h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              No sign-up required. No downloads needed. Just select a tool and get started instantly.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                to="/compress-image"
                className="px-8 py-3 bg-white text-blue-600 font-bold rounded-full hover:bg-blue-50 transition-colors"
              >
                Compress Image
              </Link>
              <Link 
                to="/merge-pdf"
                className="px-8 py-3 bg-blue-700 text-white font-bold rounded-full hover:bg-blue-800 transition-colors"
              >
                Merge PDF
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
