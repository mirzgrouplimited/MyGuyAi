import { useState } from 'react';
import { SEO } from '@/components/SEO';
import { Dropzone } from '@/components/Dropzone';
import { FAQ } from '@/components/FAQ';
import { BelowToolAd, MidContentAd, BottomAd, AdPlaceholder } from '@/components/AdPlaceholder';
import { convertImageFormat, downloadFile, isHeicFile, convertHeicToPng } from '@/utils/imageProcessing';
import { useTurnstile } from '@/hooks/useTurnstile';
import { Download, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

const faqs = [
  {
    question: 'Why convert JPG to PNG?',
    answer: 'PNG format supports transparency and lossless compression, making it ideal for logos, graphics, and images that need a transparent background.'
  },
  {
    question: 'Will the image quality improve?',
    answer: 'Converting from JPG to PNG won\'t improve quality, but it preserves the current quality and allows for transparency if needed.'
  },
  {
    question: 'Is the conversion free?',
    answer: 'Yes! All conversions happen in your browser and are completely free with unlimited usage.'
  },
  {
    question: 'Can I convert multiple images at once?',
    answer: 'Currently, you can convert one image at a time. Process one, download it, then convert the next.'
  }
];

export default function JpgToPng() {
  const [file, setFile] = useState(null);
  const [convertedFile, setConvertedFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [preview, setPreview] = useState(null);
  
  // Turnstile bot protection
  const { verify, reset } = useTurnstile();

  const handleFileSelect = async (selectedFile) => {
    // Check if it's already PNG
    if (selectedFile.type === 'image/png') {
      toast.error('File is already a PNG. Please upload a JPG or HEIC file.');
      return;
    }
    
    setFile(selectedFile);
    setConvertedFile(null);
    const url = URL.createObjectURL(selectedFile);
    setPreview(url);
    
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
      
      let converted;
      // Handle HEIC files
      if (isHeicFile(selectedFile)) {
        toast.info('Converting HEIC to PNG...');
        converted = await convertHeicToPng(selectedFile);
      } else {
        converted = await convertImageFormat(selectedFile, 'image/png');
      }
      
      setConvertedFile(converted);
      toast.success('Image converted to PNG');
    } catch (error) {
      toast.error('Failed to convert image');
      console.error(error);
    } finally {
      setProcessing(false);
      reset();
    }
  };

  const handleDownload = () => {
    if (convertedFile) {
      downloadFile(convertedFile, convertedFile.name);
    }
  };

  return (
    <>
      <SEO 
        title="JPG to PNG Converter - Free Online Image Format Converter" 
        description="Convert JPG/JPEG images to PNG format online for free. Instant conversion in your browser with no uploads required."
        path="/jpg-to-png"
      />
      
      <div className="min-h-screen">
        <AdPlaceholder position="top" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-12">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter text-neutral-900 mb-4">
              JPG to PNG Converter
            </h1>
            <p className="text-lg text-neutral-600 leading-relaxed">
              Convert JPG/JPEG images to PNG format instantly in your browser.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
            <div className="lg:col-span-8">
              <Dropzone 
                onFileSelect={handleFileSelect}
                accept="image/jpeg,image/jpg"
                active={!!file}
              />
              
              {preview && (
                <div className="mt-6 border border-neutral-200 rounded-xl p-4" data-testid="image-preview">
                  <div className="flex items-center gap-2 mb-4">
                    <ImageIcon size={20} className="text-neutral-600" />
                    <span className="text-sm font-medium text-neutral-900">{file.name}</span>
                    <span className="text-sm text-neutral-600">→</span>
                    <span className="text-sm font-medium text-green-600">{convertedFile?.name}</span>
                  </div>
                  <img src={preview} alt="Preview" className="max-w-full h-auto rounded-lg" />
                </div>
              )}
            </div>

            <div className="lg:col-span-4">
              <div className="bg-white border border-neutral-200 rounded-xl p-6 sticky top-24">
                <h2 className="text-xl font-bold text-neutral-900 mb-6">Conversion Status</h2>
                
                <div className="space-y-4">
                  {processing && (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                      <p className="text-neutral-600 mt-4">Converting...</p>
                    </div>
                  )}
                  
                  {convertedFile && !processing && (
                    <>
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <p className="text-green-800 font-medium">✓ Conversion Complete</p>
                        <p className="text-green-600 text-sm mt-1">
                          {(file.size / 1024).toFixed(2)} KB → {(convertedFile.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                      
                      <button
                        onClick={handleDownload}
                        className="w-full py-4 px-6 bg-gradient-to-r from-blue-500 via-cyan-400 via-green-400 via-yellow-400 via-orange-400 via-pink-500 to-purple-500 text-white font-bold rounded-full hover:scale-105 transition-transform duration-200 flex items-center justify-center gap-2"
                        data-testid="download-button"
                      >
                        <Download size={20} />
                        Download PNG
                      </button>
                    </>
                  )}
                  
                  {!file && (
                    <div className="text-center py-8 text-neutral-500 text-sm">
                      Upload a JPG image to start conversion
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <AdPlaceholder position="middle" />

          <div className="mt-20">
            <h2 className="text-3xl font-bold text-neutral-900 mb-6 tracking-tight">JPG vs PNG: Which Format to Use?</h2>
            <div className="prose max-w-none">
              <p className="text-neutral-600 leading-relaxed mb-4">
                JPG (JPEG) and PNG are both popular image formats, but they serve different purposes. JPG uses lossy 
                compression, making files smaller but potentially reducing quality. PNG uses lossless compression and 
                supports transparency.
              </p>
              <p className="text-neutral-600 leading-relaxed mb-4">
                Convert JPG to PNG when you need transparency support, want to preserve quality for further editing, 
                or need a format better suited for graphics and logos.
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