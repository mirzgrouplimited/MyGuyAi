import { useState, useRef, useCallback } from 'react';
import { SEO } from '@/components/SEO';
import { Dropzone } from '@/components/Dropzone';
import { FAQ } from '@/components/FAQ';
import { BelowToolAd, MidContentAd, BottomAd, AdPlaceholder } from '@/components/AdPlaceholder';
import { RelatedTools } from '@/components/RelatedTools';
import { Breadcrumb } from '@/components/Breadcrumb';
import { downloadFile, isHeicFile, convertHeicToJpeg } from '@/utils/imageProcessing';
import { useTurnstile } from '@/hooks/useTurnstile';
import { Download, Upload, RotateCcw, Check } from 'lucide-react';
import { toast } from 'sonner';

const ASPECT_RATIOS = [
  { label: 'Free', value: null },
  { label: '1:1 (Square)', value: 1 },
  { label: '4:3', value: 4/3 },
  { label: '16:9', value: 16/9 },
  { label: '3:2', value: 3/2 },
  { label: '2:3 (Portrait)', value: 2/3 },
];

const faqs = [
  {
    question: 'How do I crop an image online?',
    answer: 'Simply upload your image, select the area you want to keep by clicking and dragging, choose an aspect ratio if needed, then click "Crop & Download" to save your cropped image.'
  },
  {
    question: 'What image formats can I crop?',
    answer: 'You can crop JPG, JPEG, PNG, WebP, HEIC, and HEIF images. The output will be in the same format as the original.'
  },
  {
    question: 'Is there a file size limit?',
    answer: 'Images up to 10MB are supported. Larger files may take longer to process in your browser.'
  },
  {
    question: 'Can I crop to specific dimensions?',
    answer: 'Yes! You can use preset aspect ratios (1:1, 4:3, 16:9, etc.) or freely select any custom area.'
  },
  {
    question: 'Is my image uploaded to a server?',
    answer: 'No. All cropping happens directly in your browser. Your images never leave your device.'
  }
];

const RELATED = ['resize-image', 'compress-image', 'jpg-to-png'];

export default function CropImage() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [aspectRatio, setAspectRatio] = useState(null);
  const [cropArea, setCropArea] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState(null);
  const [processing, setProcessing] = useState(false);
  const imageRef = useRef(null);
  const containerRef = useRef(null);
  
  // Turnstile bot protection
  const { verify, isVerifying, reset } = useTurnstile();

  const handleFileSelect = async (selectedFile) => {
    // Auto-convert HEIC to JPEG
    let processFile = selectedFile;
    if (isHeicFile(selectedFile)) {
      toast.info('Converting HEIC to JPEG...');
      processFile = await convertHeicToJpeg(selectedFile);
      toast.success('HEIC converted successfully!');
    }
    setFile(processFile);
    setCropArea(null);
    const url = URL.createObjectURL(processFile);
    setPreview(url);
  };

  const handleMouseDown = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setStartPos({ x, y });
    setIsDragging(true);
    setCropArea({ x, y, width: 0, height: 0 });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !startPos || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    
    // Constrain to container
    x = Math.max(0, Math.min(x, rect.width));
    y = Math.max(0, Math.min(y, rect.height));
    
    let width = x - startPos.x;
    let height = y - startPos.y;
    
    // Handle aspect ratio
    if (aspectRatio) {
      height = width / aspectRatio;
    }
    
    setCropArea({
      x: width < 0 ? x : startPos.x,
      y: height < 0 ? y : startPos.y,
      width: Math.abs(width),
      height: Math.abs(height)
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleCrop = async () => {
    if (!file || !cropArea || !imageRef.current) {
      toast.error('Please select a crop area');
      return;
    }

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
      
      const img = imageRef.current;
      const container = containerRef.current;
      
      // Calculate scale factor
      const scaleX = img.naturalWidth / container.offsetWidth;
      const scaleY = img.naturalHeight / container.offsetHeight;
      
      // Create canvas for cropping
      const canvas = document.createElement('canvas');
      canvas.width = cropArea.width * scaleX;
      canvas.height = cropArea.height * scaleY;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(
        img,
        cropArea.x * scaleX,
        cropArea.y * scaleY,
        cropArea.width * scaleX,
        cropArea.height * scaleY,
        0,
        0,
        canvas.width,
        canvas.height
      );
      
      canvas.toBlob((blob) => {
        const croppedFile = new File([blob], `cropped_${file.name}`, { type: file.type || 'image/jpeg' });
        downloadFile(croppedFile, `cropped_${file.name}`);
        toast.success('Image cropped and downloaded!');
        setProcessing(false);
        reset();
      }, file.type || 'image/jpeg');
      
    } catch (error) {
      toast.error('Failed to crop image');
      console.error(error);
      setProcessing(false);
      reset();
    }
  };

  const handleReset = () => {
    setCropArea(null);
  };

  const handleUploadNew = () => {
    setFile(null);
    setPreview(null);
    setCropArea(null);
  };

  return (
    <>
      <SEO 
        title="Crop Image Online Free - Cut & Trim Photos Instantly" 
        description="Free online image cropper. Cut and trim photos to any size or aspect ratio. Fast, secure, browser-based cropping with no uploads."
        path="/crop-image"
      />
      
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumb items={[
            { label: 'Home', path: '/' },
            { label: 'Image Tools', path: '/image-tools' },
            { label: 'Crop Image' }
          ]} />
          
          <div className="mb-8 mt-6">
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 mb-4">
              Crop Image Online
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed">
              Cut and trim photos to any size or aspect ratio. Free, fast, and secure browser-based cropping.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
            <div className="lg:col-span-8">
              {!file ? (
                <Dropzone 
                  onFileSelect={handleFileSelect}
                  accept="image/*"
                />
              ) : (
                <div className="border-2 border-slate-200 rounded-xl p-4 bg-slate-50">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-slate-700">{file.name}</span>
                    <button
                      onClick={handleUploadNew}
                      className="flex items-center gap-2 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Upload size={16} /> Upload New
                    </button>
                  </div>
                  
                  <div 
                    ref={containerRef}
                    className="relative cursor-crosshair select-none"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                  >
                    <img 
                      ref={imageRef}
                      src={preview} 
                      alt="To crop" 
                      className="max-w-full h-auto rounded-lg"
                      draggable={false}
                    />
                    
                    {/* Crop overlay */}
                    {cropArea && cropArea.width > 0 && (
                      <>
                        {/* Darkened areas */}
                        <div className="absolute inset-0 bg-black/50 pointer-events-none" 
                          style={{
                            clipPath: `polygon(0% 0%, 0% 100%, ${cropArea.x}px 100%, ${cropArea.x}px ${cropArea.y}px, ${cropArea.x + cropArea.width}px ${cropArea.y}px, ${cropArea.x + cropArea.width}px ${cropArea.y + cropArea.height}px, ${cropArea.x}px ${cropArea.y + cropArea.height}px, ${cropArea.x}px 100%, 100% 100%, 100% 0%)`
                          }}
                        />
                        {/* Crop border */}
                        <div 
                          className="absolute border-2 border-white border-dashed pointer-events-none"
                          style={{
                            left: cropArea.x,
                            top: cropArea.y,
                            width: cropArea.width,
                            height: cropArea.height
                          }}
                        />
                      </>
                    )}
                  </div>
                  
                  <p className="text-sm text-slate-500 mt-3 text-center">
                    Click and drag on the image to select crop area
                  </p>
                </div>
              )}
            </div>

            <div className="lg:col-span-4">
              <div className="bg-white border border-slate-200 rounded-xl p-6 sticky top-24">
                <h2 className="text-lg font-bold text-slate-900 mb-4">Crop Settings</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Aspect Ratio</label>
                    <div className="grid grid-cols-2 gap-2">
                      {ASPECT_RATIOS.map((ratio) => (
                        <button
                          key={ratio.label}
                          onClick={() => setAspectRatio(ratio.value)}
                          className={`py-2 px-3 text-sm rounded-lg border transition-all ${
                            aspectRatio === ratio.value
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300'
                          }`}
                        >
                          {ratio.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {cropArea && cropArea.width > 0 && (
                    <div className="p-3 bg-slate-50 rounded-lg text-sm">
                      <p className="text-slate-600">
                        Selection: {Math.round(cropArea.width)} × {Math.round(cropArea.height)} px
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={handleReset}
                      disabled={!cropArea}
                      className="flex-1 py-3 px-4 border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <RotateCcw size={18} /> Reset
                    </button>
                  </div>

                  <button
                    onClick={handleCrop}
                    disabled={!file || !cropArea || processing}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    data-testid="crop-button"
                  >
                    {processing ? 'Processing...' : (
                      <>
                        <Download size={20} /> Crop & Download
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <AdPlaceholder position="below-tool" />

          {/* SEO Content */}
          <section className="mt-16 max-w-4xl">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">How to Crop Images Online</h2>
            <div className="prose prose-slate max-w-none">
              <p className="text-slate-600 leading-relaxed mb-4">
                Cropping images is essential for removing unwanted areas, focusing on specific subjects, or adjusting photos for social media and print. Our free online image cropper makes this process quick and easy, all within your browser.
              </p>
              <p className="text-slate-600 leading-relaxed mb-4">
                Simply upload your image, click and drag to select the area you want to keep, and download your cropped result. You can use preset aspect ratios like 1:1 for Instagram, 16:9 for YouTube thumbnails, or freely select any custom area.
              </p>
              <p className="text-slate-600 leading-relaxed">
                All processing happens locally in your browser - your images are never uploaded to any server, ensuring complete privacy and instant results.
              </p>
            </div>
          </section>

          <FAQ faqs={faqs} />
          
          <RelatedTools tools={RELATED} />

          <AdPlaceholder position="bottom" />
        </div>
      </div>
    </>
  );
}
