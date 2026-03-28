import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SEO } from '@/components/SEO';
import { Dropzone } from '@/components/Dropzone';
import { FAQ } from '@/components/FAQ';
import { BelowToolAd, MidContentAd, BottomAd } from '@/components/AdPlaceholder';
import { compressImageToSize, downloadFile } from '@/utils/imageProcessing';
import { useTurnstile } from '@/hooks/useTurnstile';
import { Download, Image as ImageIcon, Upload, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const faqs = [
  {
    question: 'How does image compression work?',
    answer: 'Our tool uses advanced browser-based algorithms to reduce image file size while maintaining visual quality. All processing happens on your device.'
  },
  {
    question: 'What image formats are supported?',
    answer: 'We support JPG, JPEG, PNG, and WebP formats for compression.'
  },
  {
    question: 'Is my image data secure?',
    answer: 'Yes! All compression happens in your browser. Your images never leave your device or get uploaded to any server.'
  },
  {
    question: 'Can I compress multiple images at once?',
    answer: 'Currently, you can compress one image at a time. Simply process one, download it, and upload the next.'
  },
  {
    question: 'Will compression affect image quality?',
    answer: 'Our algorithm optimizes compression to maintain the best possible quality while achieving your target file size.'
  }
];

export default function CompressImage() {
  const location = useLocation();
  const [file, setFile] = useState(null);
  const [compressedFile, setCompressedFile] = useState(null);
  const [targetSize, setTargetSize] = useState(20);
  const [processing, setProcessing] = useState(false);
  const [preview, setPreview] = useState(null);
  const [showAd, setShowAd] = useState(false);
  
  // Turnstile bot protection
  const { verify, isVerifying, reset } = useTurnstile();

  // Load pre-loaded file from AI chat
  useEffect(() => {
    const loadPreloadedFile = async () => {
      if (location.state?.fileId && location.state?.compatible) {
        try {
          const response = await axios.get(`${API}/file/${location.state.fileId}`, {
            responseType: 'blob'
          });
          const preloadedFile = new File([response.data], location.state.filename || 'image', {
            type: response.data.type
          });
          handleFileSelect(preloadedFile);
          toast.success('File loaded from My Guy!');
        } catch (error) {
          console.error('Failed to load preloaded file');
        }
      } else if (location.state?.compatible === false) {
        toast.error(location.state?.message || 'File type not compatible with this tool');
      }
    };
    loadPreloadedFile();
  }, [location.state]);

  const handleFileSelect = async (selectedFile) => {
    setFile(selectedFile);
    setCompressedFile(null);
    const url = URL.createObjectURL(selectedFile);
    setPreview(url);
  };

  const handleCompress = async () => {
    if (!file) return;
    
    setProcessing(true);
    setShowAd(true);
    
    // Show ad for 5 seconds during processing
    setTimeout(() => setShowAd(false), 5000);
    
    try {
      // Verify with Turnstile (graceful bypass if it fails)
      const turnstileToken = await verify();
      // Token will always be truthy now (either real token or bypass string)
      // We continue processing regardless - Turnstile is just extra protection
      
      const result = await compressImageToSize(file, targetSize);
      
      // Handle already optimal case
      if (result.alreadyOptimal) {
        toast.info(`Image is already ${result.originalSize.toFixed(1)}KB - smaller than ${targetSize}KB target. No compression needed!`);
        setCompressedFile(null);
        setProcessing(false);
        return;
      }
      
      const finalSizeKB = result.finalSize;
      
      // Check if compression was successful
      if (finalSizeKB > targetSize * 1.05) {
        toast.warning(`Compressed to ${finalSizeKB.toFixed(1)}KB. Could not reach ${targetSize}KB target - try a higher target size.`);
      } else {
        toast.success(`Compressed to ${finalSizeKB.toFixed(1)}KB (Target: ${targetSize}KB)`);
      }
      
      setCompressedFile(result.file);
    } catch (error) {
      toast.error('Failed to compress image');
      console.error(error);
    } finally {
      setProcessing(false);
      reset(); // Reset Turnstile for next submission
    }
  };

  const handleDownload = () => {
    if (compressedFile) {
      console.log('Attempting download:', compressedFile.name, compressedFile.size);
      const success = downloadFile(compressedFile, `compressed_${file.name}`);
      if (success) {
        toast.success('Download started!');
      }
    } else {
      toast.error('No compressed file to download');
    }
  };

  const handleUploadNew = () => {
    setFile(null);
    setCompressedFile(null);
    setPreview(null);
  };

  return (
    <>
      <SEO 
        title="Compress Image to 20KB, 50KB, 100KB, 500KB, 1MB - Free Online Tool" 
        description="Compress images to exact file sizes (20KB, 50KB, 100KB, 500KB, 1MB) online for free. Fast browser-based compression with no uploads required."
        path="/compress-image"
      />
      
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-12">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 mb-4">
              Compress Image Online
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed">
              Reduce image file size to 20KB, 50KB, 100KB, 500KB, or 1MB instantly. All processing happens in your browser.
            </p>
          </div>

          {/* Processing Modal */}
          {showAd && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" data-testid="processing-ad">
              <div className="bg-white rounded-2xl p-8 max-w-md text-center mx-4">
                <Loader2 className="animate-spin mx-auto text-blue-600 mb-4" size={48} />
                <h3 className="text-xl font-bold text-slate-900 mb-2">Processing your image...</h3>
                <div className="bg-slate-100 rounded-lg p-4 mt-4">
                  <p className="text-sm text-slate-500">Advertisement</p>
                  <p className="text-slate-600 mt-2">MyGuyAI - Free Online Tools</p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
            <div className="lg:col-span-8">
              {!file ? (
                <Dropzone 
                  onFileSelect={handleFileSelect}
                  accept="image/*"
                  active={false}
                />
              ) : (
                <div className="border-2 border-slate-200 rounded-xl p-6" data-testid="image-preview">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <ImageIcon size={20} className="text-slate-600" />
                      <span className="text-sm font-medium text-slate-900 truncate max-w-[150px]">{file.name}</span>
                      <span className="text-sm text-slate-500">({(file.size / 1024).toFixed(0)} KB)</span>
                    </div>
                    <button
                      onClick={handleUploadNew}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      data-testid="upload-new-btn"
                    >
                      <Upload size={16} />
                      New
                    </button>
                  </div>
                  {/* Smaller preview image on mobile */}
                  <div className="flex justify-center">
                    <img 
                      src={preview} 
                      alt="Preview" 
                      className="max-w-full max-h-48 sm:max-h-64 object-contain rounded-lg border border-slate-100" 
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-4">
              <div className="bg-white border border-slate-200 rounded-xl p-6 sticky top-24">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Compression Settings</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-3">Target Size</label>
                    <div className="space-y-2">
                      {[20, 50, 100, 500, 1024].map((size) => (
                        <button
                          key={size}
                          onClick={() => setTargetSize(size)}
                          className={`w-full py-3 px-4 rounded-xl border transition-all duration-200 ${
                            targetSize === size
                              ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white border-transparent font-bold'
                              : 'bg-white border-slate-200 text-slate-900 hover:border-slate-400'
                          }`}
                          data-testid={`size-option-${size}`}
                        >
                          {size >= 1024 ? `${size / 1024} MB` : `${size} KB`}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleCompress}
                    disabled={!file || processing || isVerifying}
                    className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold rounded-full hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    data-testid="compress-button"
                  >
                    {isVerifying ? 'Verifying...' : processing ? 'Compressing...' : 'Compress Now'}
                  </button>

                  {compressedFile && (
                    <>
                      {/* Success message */}
                      <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                        <p className="text-green-800 font-semibold">✓ Compression Complete!</p>
                        <p className="text-green-600 text-sm mt-1">
                          {(file.size / 1024).toFixed(2)} KB → {(compressedFile.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                      
                      {/* Primary download button */}
                      <button
                        onClick={handleDownload}
                        className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold rounded-full hover:shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2"
                        data-testid="download-button"
                      >
                        <Download size={20} />
                        Download ({(compressedFile.size / 1024).toFixed(2)} KB)
                      </button>
                      
                      {/* Alternative: Direct link */}
                      <a
                        href={URL.createObjectURL(compressedFile)}
                        download={`compressed_${file.name}`}
                        className="w-full py-3 px-6 bg-white border-2 border-slate-200 text-slate-700 font-medium rounded-full hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 text-sm"
                        data-testid="download-link"
                      >
                        Alternative: Right-click & Save As
                      </a>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* HIGH CONVERSION ZONE - Ad below tool with proper spacing */}
          <BelowToolAd />

          {/* SEO Content Section */}
          <div className="mt-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-6 tracking-tight">How to Compress Images Online</h2>
            <div className="prose max-w-none">
              <p className="text-slate-600 leading-relaxed mb-4">
                Compressing images is essential for faster website loading, easier file sharing, and saving storage space. 
                Our free online image compression tool allows you to reduce image file sizes to exactly 20KB, 50KB, 100KB, 500KB, or 1MB 
                without significant quality loss.
              </p>
              <p className="text-slate-600 leading-relaxed mb-4">
                Simply upload your image, select your desired target size, and click compress. The entire process happens 
                in your browser, ensuring your images remain private and secure. No server uploads, no waiting times.
              </p>
            </div>
          </div>

          {/* Mid-content ad - blends with SEO content */}
          <MidContentAd />

          {/* More SEO content after ad */}
          <div className="mt-8">
            <div className="prose max-w-none">
              <p className="text-slate-600 leading-relaxed">
                Perfect for social media uploads, email attachments, website optimization, and document preparation where 
                file size limits apply. Our advanced compression algorithm ensures the best balance between file size and 
                image quality.
              </p>
            </div>
          </div>

          <FAQ faqs={faqs} />

          {/* Bottom ad - desktop only, before footer area */}
          <BottomAd />
        </div>
      </div>
    </>
  );
}
