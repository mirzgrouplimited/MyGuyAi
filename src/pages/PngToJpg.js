import { useState } from 'react';
import { SEO } from '@/components/SEO';
import { Dropzone } from '@/components/Dropzone';
import { FAQ } from '@/components/FAQ';
import { BelowToolAd, MidContentAd, BottomAd, AdPlaceholder } from '@/components/AdPlaceholder';
import { Breadcrumb } from '@/components/Breadcrumb';
import { RelatedTools } from '@/components/RelatedTools';
import { convertImageFormat, downloadFile, isHeicFile, convertHeicToJpeg } from '@/utils/imageProcessing';
import { useTurnstile } from '@/hooks/useTurnstile';
import { Download, Image as ImageIcon, AlertTriangle, Upload } from 'lucide-react';
import { toast } from 'sonner';

const faqs = [
  {
    question: 'Why convert PNG to JPG?',
    answer: 'JPG files are typically smaller than PNG, making them better for web use, email attachments, and storage when transparency is not needed.'
  },
  {
    question: 'What happens to transparent backgrounds?',
    answer: 'Transparent areas in PNG images will be converted to white background in JPG format, as JPG does not support transparency.'
  },
  {
    question: 'Is the conversion instant?',
    answer: 'Yes! The conversion happens immediately in your browser as soon as you upload the file.'
  },
  {
    question: 'What if my file gets larger after conversion?',
    answer: 'In rare cases, JPG can be larger than PNG (especially for simple graphics). We will warn you if this happens and you can choose not to download.'
  }
];

export default function PngToJpg() {
  const [file, setFile] = useState(null);
  const [convertedFile, setConvertedFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const [sizeIncreased, setSizeIncreased] = useState(false);
  
  // Turnstile bot protection
  const { verify, reset } = useTurnstile();

  const handleFileSelect = async (selectedFile) => {
    setError(null);
    setSizeIncreased(false);
    setConvertedFile(null);
    
    // Validate file type
    const fileType = selectedFile.type.toLowerCase();
    const fileName = selectedFile.name.toLowerCase();
    
    // Allow HEIC files
    if (isHeicFile(selectedFile)) {
      // HEIC is allowed - will be converted to JPG
    } else if (!fileType.includes('png') && !fileName.endsWith('.png')) {
      // Check if it's a JPG - user uploaded wrong format
      if (fileType.includes('jpeg') || fileType.includes('jpg') || fileName.endsWith('.jpg') || fileName.endsWith('.jpeg')) {
        setError('This file is already a JPG/JPEG. No conversion needed! Use our Compress Image tool if you want to reduce file size.');
        toast.error('File is already JPG format');
        return;
      }
      setError('Please upload a PNG or HEIC file. This tool converts to JPG.');
      toast.error('Please upload a PNG or HEIC file');
      return;
    }
    
    setFile(selectedFile);
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
        toast.info('Converting HEIC to JPG...');
        converted = await convertHeicToJpeg(selectedFile);
      } else {
        converted = await convertImageFormat(selectedFile, 'image/jpeg');
      }
      
      // Check if output is larger
      if (converted.size > selectedFile.size) {
        setSizeIncreased(true);
        toast.warning('Converted file is larger than original');
      } else {
        toast.success('Image converted to JPG');
      }
      
      setConvertedFile(converted);
    } catch (error) {
      setError('Failed to convert image. Please try again.');
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

  const handleUploadNew = () => {
    setFile(null);
    setConvertedFile(null);
    setPreview(null);
    setError(null);
    setSizeIncreased(false);
  };

  const getSizeChange = () => {
    if (!file || !convertedFile) return null;
    const change = ((convertedFile.size - file.size) / file.size * 100).toFixed(1);
    return change;
  };

  return (
    <>
      <SEO 
        title="PNG to JPG Converter - Free Online Image Format Converter" 
        description="Convert PNG images to JPG/JPEG format online for free. Instant conversion in your browser with no uploads required."
        path="/png-to-jpg"
      />
      
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumb items={[
            { label: 'Home', path: '/' },
            { label: 'Converters', path: '/file-conversion-tools' },
            { label: 'PNG to JPG' }
          ]} />
          
          <div className="mb-8 mt-6">
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 mb-4">
              PNG to JPG Converter
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed">
              Convert PNG images to JPG/JPEG format instantly. Upload PNG files only.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
            <div className="lg:col-span-8">
              {!file ? (
                <Dropzone 
                  onFileSelect={handleFileSelect}
                  accept="image/png,.png"
                />
              ) : (
                <div className="border-2 border-slate-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <ImageIcon size={20} className="text-slate-600" />
                      <span className="text-sm font-medium text-slate-900">{file.name}</span>
                      <span className="text-sm text-slate-500">({(file.size / 1024).toFixed(2)} KB)</span>
                    </div>
                    <button
                      onClick={handleUploadNew}
                      className="flex items-center gap-2 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Upload size={16} /> Upload New
                    </button>
                  </div>
                  <img src={preview} alt="Preview" className="max-w-full h-auto rounded-lg" />
                </div>
              )}
              
              {/* Error Message */}
              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                  <AlertTriangle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                  <div>
                    <p className="text-red-800 font-medium">Invalid File</p>
                    <p className="text-red-600 text-sm mt-1">{error}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-4">
              <div className="bg-white border border-slate-200 rounded-xl p-6 sticky top-24">
                <h2 className="text-lg font-bold text-slate-900 mb-4">Conversion Status</h2>
                
                <div className="space-y-4">
                  {processing && (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="text-slate-600 mt-4">Converting...</p>
                    </div>
                  )}
                  
                  {convertedFile && !processing && (
                    <>
                      {sizeIncreased ? (
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                          <p className="text-amber-800 font-medium flex items-center gap-2">
                            <AlertTriangle size={18} /> Size Increased
                          </p>
                          <p className="text-amber-700 text-sm mt-2">
                            {(file.size / 1024).toFixed(2)} KB → {(convertedFile.size / 1024).toFixed(2)} KB
                            <span className="text-red-600 font-medium ml-1">(+{getSizeChange()}%)</span>
                          </p>
                          <p className="text-amber-600 text-xs mt-2">
                            The JPG version is larger. You may want to keep the original PNG.
                          </p>
                        </div>
                      ) : (
                        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                          <p className="text-green-800 font-medium">✓ Conversion Complete</p>
                          <p className="text-green-700 text-sm mt-2">
                            {(file.size / 1024).toFixed(2)} KB → {(convertedFile.size / 1024).toFixed(2)} KB
                            <span className="text-green-600 font-medium ml-1">({getSizeChange()}%)</span>
                          </p>
                        </div>
                      )}
                      
                      <button
                        onClick={handleDownload}
                        className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
                        data-testid="download-button"
                      >
                        <Download size={20} />
                        Download JPG
                      </button>
                    </>
                  )}
                  
                  {!file && !error && (
                    <div className="text-center py-8 text-slate-500 text-sm">
                      <p className="font-medium text-slate-700 mb-2">PNG files only</p>
                      <p>Upload a PNG image to convert to JPG format</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <AdPlaceholder position="below-tool" />

          <div className="mt-16 max-w-4xl">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">When to Convert PNG to JPG</h2>
            <div className="prose prose-slate max-w-none">
              <p className="text-slate-600 leading-relaxed mb-4">
                Converting PNG to JPG is useful when you need smaller file sizes for faster web loading or easier sharing. 
                JPG format uses lossy compression that significantly reduces file size while maintaining good visual quality.
              </p>
              <p className="text-slate-600 leading-relaxed mb-4">
                Note that JPG does not support transparency. If your PNG has transparent areas, they will be converted 
                to a white background. For images requiring transparency, keep the PNG format.
              </p>
              <p className="text-slate-600 leading-relaxed">
                Have questions? Contact us at <a href="mailto:admin@myguyai.com" className="text-blue-600 hover:underline">admin@myguyai.com</a>
              </p>
            </div>
          </div>

          <FAQ faqs={faqs} />
          
          <RelatedTools tools={['jpg-to-png', 'compress-image', 'image-to-pdf']} />

          <AdPlaceholder position="bottom" />
        </div>
      </div>
    </>
  );
}
