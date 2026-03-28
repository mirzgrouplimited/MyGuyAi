import { useState, useEffect } from 'react';
import { SEO } from '@/components/SEO';
import { ToolCard } from '@/components/ToolCard';
import { Breadcrumb } from '@/components/Breadcrumb';
import { FAQ } from '@/components/FAQ';
import { AdPlaceholder } from '@/components/AdPlaceholder';
import { Image, FileText, RefreshCw } from 'lucide-react';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const CATEGORY_ICONS = {
  'image-tools': Image,
  'pdf-tools': FileText,
  'file-conversion-tools': RefreshCw
};

const CATEGORY_FAQS = {
  'image-tools': [
    { question: 'Are these image tools free?', answer: 'Yes! All image tools are completely free with no usage limits or sign-up required.' },
    { question: 'What image formats are supported?', answer: 'We support JPG, JPEG, PNG, WebP, HEIC, and HEIF formats.' },
    { question: 'Is my data private?', answer: 'Absolutely. All processing happens in your browser - images never leave your device.' }
  ],
  'pdf-tools': [
    { question: 'Are PDF tools free to use?', answer: 'Yes, all PDF tools are 100% free with no limits or registration required.' },
    { question: 'What\'s the maximum PDF size?', answer: 'PDF files up to 25MB are supported for optimal browser performance.' },
    { question: 'Are my PDFs kept private?', answer: 'Yes. PDFs are processed locally in your browser and never uploaded to any server.' }
  ],
  'file-conversion-tools': [
    { question: 'What formats can I convert between?', answer: 'Convert JPG to PNG, PNG to JPG, and images to PDF with our free tools.' },
    { question: 'Does conversion affect quality?', answer: 'Our tools use high-quality algorithms to preserve image quality during conversion.' },
    { question: 'Is there a file size limit?', answer: 'Image files up to 10MB and PDF files up to 25MB are supported.' }
  ]
};

export default function CategoryPage({ categoryId }) {
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategory();
  }, [categoryId]);

  const fetchCategory = async () => {
    try {
      const response = await axios.get(`${API}/category/${categoryId}`);
      setCategory(response.data);
    } catch (error) {
      console.error('Failed to fetch category');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!category) {
    return <div className="min-h-screen flex items-center justify-center">Category not found</div>;
  }

  const Icon = CATEGORY_ICONS[categoryId] || Image;
  const faqs = CATEGORY_FAQS[categoryId] || [];

  return (
    <>
      <SEO 
        title={category.seo_title || category.name}
        description={category.seo_description || category.description}
        path={`/${categoryId}`}
      />
      
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumb items={[
            { label: 'Home', path: '/' },
            { label: category.name }
          ]} />
          
          {/* Header */}
          <div className="mt-8 mb-12">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-xl bg-blue-100">
                <Icon className="text-blue-600" size={32} />
              </div>
              <h1 className="text-4xl font-black tracking-tight text-slate-900">
                {category.name}
              </h1>
            </div>
            <p className="text-lg text-slate-600 max-w-3xl">
              {category.description}
            </p>
          </div>

          <AdPlaceholder position="header" />

          {/* Tools Grid */}
          <section className="my-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Available Tools</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.tools?.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </section>

          <AdPlaceholder position="mid-content" />

          {/* SEO Content */}
          <section className="my-16 max-w-4xl">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">About {category.name}</h2>
            <div className="prose prose-slate max-w-none">
              {category.seo_content ? (
                <p className="text-slate-600 leading-relaxed">{category.seo_content}</p>
              ) : (
                <>
                  <p className="text-slate-600 leading-relaxed mb-4">
                    Our {category.name.toLowerCase()} are designed to help you work with files quickly and efficiently. 
                    All tools run entirely in your browser, meaning your files never leave your device. This ensures 
                    complete privacy and instant processing without any server uploads.
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    Whether you're optimizing files for web, preparing documents for sharing, or converting between 
                    formats, our free tools have you covered. No sign-up required, no usage limits, and no watermarks.
                  </p>
                </>
              )}
            </div>
          </section>

          <FAQ faqs={faqs} />

          <AdPlaceholder position="bottom" />
        </div>
      </div>
    </>
  );
}
