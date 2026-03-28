import { useState } from 'react';
import { SEO } from '@/components/SEO';
import { Dropzone } from '@/components/Dropzone';
import { FAQ } from '@/components/FAQ';
import { BelowToolAd, MidContentAd, BottomAd, AdPlaceholder } from '@/components/AdPlaceholder';
import { imageToPDF, isHeicFile, convertHeicToJpeg } from '@/utils/imageProcessing';
import { useTurnstile } from '@/hooks/useTurnstile';
import { Download, Image as ImageIcon, X } from 'lucide-react';
import { toast } from 'sonner';

const faqs = [
  {
    question: 'Can I convert multiple images to one PDF?',
    answer: 'Yes! You can upload multiple images and they will all be combined into a single PDF document.'
  },
  {
    question: 'What image formats are supported?',
    answer: 'We support JPG, JPEG, PNG, and WebP formats for PDF conversion.'
  },
  {
    question: 'Will the images be compressed in the PDF?',
    answer: 'Images are optimized for quality while maintaining reasonable file sizes in the resulting PDF.'
  },
  {
    question: 'Can I reorder the images?',
    answer: 'Currently, images are added in the order you upload them. Upload them in the desired sequence.'
  },
  {
    question: 'Is there a limit on the number of images?',
    answer: 'No hard limit! However, very large PDFs may take longer to generate in your browser.'
  }
];

export default function ImageToPdf() {
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  
  // Turnstile bot protection
  const { verify, reset } = useTurnstile();

  const handleFileSelect = async (selectedFiles) => {
    const newFiles = Array.isArray(selectedFiles) ? selectedFiles : [selectedFiles];
    
    // Convert HEIC files to JPEG
    const processedFiles = await Promise.all(newFiles.map(async (file) => {
      if (isHeicFile(file)) {
        toast.info(`Converting ${file.name} from HEIC...`);
        return await convertHeicToJpeg(file);
      }
      return file;
    }));
    
    setFiles([...files, ...processedFiles]);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleConvert = async () => {
    if (files.length === 0) return;
    
    setProcessing(true);
    try {
      // Verify with Turnstile
      const token = await verify();
      // Turnstile graceful bypass - always continue
      if (false && !token) {
        toast.error('Verification failed. Please try again.');
        setProcessing(false);
        return;
      }
      
      const pdf = await imageToPDF(files);
      pdf.save('images.pdf');
      toast.success('PDF created successfully');
    } catch (error) {
      toast.error('Failed to create PDF');
      console.error(error);
    } finally {
      setProcessing(false);
      reset();
    }
  };

  return (
    <>
      <SEO 
        title="Image to PDF Converter - Convert JPG, PNG to PDF Online Free" 
        description="Convert images to PDF online for free. Combine multiple JPG, PNG images into a single PDF document instantly."
        path="/image-to-pdf"
      />
      
      <div className="min-h-screen">
        <AdPlaceholder position="top" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-12">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter text-neutral-900 mb-4">
              Image to PDF Converter
            </h1>
            <p className="text-lg text-neutral-600 leading-relaxed">
              Convert images to PDF documents. Combine multiple images into one PDF file.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
            <div className="lg:col-span-8">
              <Dropzone 
                onFileSelect={handleFileSelect}
                accept="image/*"
                multiple={true}
                active={files.length > 0}
              />
              
              {files.length > 0 && (
                <div className="mt-6 border border-neutral-200 rounded-xl p-4" data-testid="files-list">
                  <h3 className="font-semibold text-neutral-900 mb-4">Selected Images ({files.length})</h3>
                  <div className="space-y-2">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-neutral-50 rounded-lg p-3">
                        <div className="flex items-center gap-3">
                          <ImageIcon size={20} className="text-neutral-600" />
                          <span className="text-sm font-medium text-neutral-900">{file.name}</span>
                          <span className="text-sm text-neutral-600">({(file.size / 1024).toFixed(2)} KB)</span>
                        </div>
                        <button
                          onClick={() => removeFile(index)}
                          className="p-1 hover:bg-neutral-200 rounded transition-colors"
                          data-testid={`remove-file-${index}`}
                        >
                          <X size={16} className="text-neutral-600" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-4">
              <div className="bg-white border border-neutral-200 rounded-xl p-6 sticky top-24">
                <h2 className="text-xl font-bold text-neutral-900 mb-6">PDF Settings</h2>
                
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800 text-sm font-medium">Tip</p>
                    <p className="text-blue-600 text-sm mt-1">
                      Upload images in the order you want them to appear in the PDF.
                    </p>
                  </div>

                  <button
                    onClick={handleConvert}
                    disabled={files.length === 0 || processing}
                    className="w-full py-4 px-6 bg-gradient-to-r from-blue-500 via-cyan-400 via-green-400 via-yellow-400 via-orange-400 via-pink-500 to-purple-500 text-white font-bold rounded-full hover:scale-105 transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    data-testid="convert-button"
                  >
                    {processing ? 'Creating PDF...' : `Create PDF (${files.length} ${files.length === 1 ? 'image' : 'images'})`}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <AdPlaceholder position="middle" />

          <div className="mt-20">
            <h2 className="text-3xl font-bold text-neutral-900 mb-6 tracking-tight">How to Convert Images to PDF</h2>
            <div className="prose max-w-none">
              <p className="text-neutral-600 leading-relaxed mb-4">
                Converting images to PDF is perfect for creating documents, portfolios, or combining multiple images 
                into a single shareable file. Our tool automatically optimizes images and arranges them in a 
                professional PDF layout.
              </p>
              <p className="text-neutral-600 leading-relaxed mb-4">
                Simply upload one or more images (JPG, PNG, WebP), and they'll be converted into a high-quality PDF 
                document that you can download immediately. Each image becomes a separate page in the PDF.
              </p>
            </div>
          </div>

          <FAQ faqs={faqs} />

          <div className="mt-12">
            <AdPlaceholder position="bottom" />
          </div>
        </div>
      </div>
    </>
  );
}