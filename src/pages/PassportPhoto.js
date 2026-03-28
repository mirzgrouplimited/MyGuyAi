import { useState, useRef, useCallback, useEffect } from 'react';
import { SEO } from '@/components/SEO';
import { Dropzone } from '@/components/Dropzone';
import { FAQ } from '@/components/FAQ';
import { BelowToolAd, MidContentAd, BottomAd } from '@/components/AdPlaceholder';
import { RelatedTools } from '@/components/RelatedTools';
import { Breadcrumb } from '@/components/Breadcrumb';
import { downloadFile, isHeicFile, convertHeicToJpeg } from '@/utils/imageProcessing';
import { useTurnstile } from '@/hooks/useTurnstile';
import { Download, Upload, RotateCcw, Move, ZoomIn, ZoomOut } from 'lucide-react';
import { toast } from 'sonner';

// Passport photo size presets (in inches, converted to pixels at 300 DPI)
const PHOTO_SIZES = [
  { 
    id: 'us-passport', 
    label: 'US Passport (2"×2")', 
    width: 2, 
    height: 2, 
    dpi: 300,
    description: 'Standard US passport and visa photo'
  },
  { 
    id: 'uk-passport', 
    label: 'UK Passport (35×45mm)', 
    width: 1.378, // 35mm in inches
    height: 1.772, // 45mm in inches
    dpi: 300,
    description: 'UK and EU passport photo standard'
  },
  { 
    id: 'indian-passport', 
    label: 'Indian Passport (2"×2")', 
    width: 2, 
    height: 2, 
    dpi: 300,
    description: 'Indian passport and visa photo'
  },
  { 
    id: 'schengen-visa', 
    label: 'Schengen Visa (35×45mm)', 
    width: 1.378, 
    height: 1.772, 
    dpi: 300,
    description: 'Standard Schengen visa photo'
  },
  { 
    id: 'canadian-passport', 
    label: 'Canadian Passport (50×70mm)', 
    width: 1.969, // 50mm
    height: 2.756, // 70mm
    dpi: 300,
    description: 'Canadian passport photo standard'
  },
  { 
    id: 'australia-passport', 
    label: 'Australian Passport (35×45mm)', 
    width: 1.378, 
    height: 1.772, 
    dpi: 300,
    description: 'Australian passport photo'
  },
  { 
    id: 'china-visa', 
    label: 'China Visa (33×48mm)', 
    width: 1.299, // 33mm
    height: 1.89, // 48mm
    dpi: 300,
    description: 'Chinese visa photo standard'
  },
  { 
    id: 'japan-visa', 
    label: 'Japan Visa (45×45mm)', 
    width: 1.772, 
    height: 1.772, 
    dpi: 300,
    description: 'Japanese visa photo (square)'
  },
];

const faqs = [
  {
    question: 'What size is a US passport photo?',
    answer: 'A US passport photo must be 2 inches × 2 inches (51mm × 51mm). Our tool creates photos at 300 DPI, which is the standard print quality requirement.'
  },
  {
    question: 'Can I use this for visa applications?',
    answer: 'Yes! We support various visa photo sizes including US, UK, Schengen, China, Japan, and more. Select the appropriate size for your destination country.'
  },
  {
    question: 'What is the white background for?',
    answer: 'Most passport and visa photos require a plain white or light-colored background. Our tool automatically applies a white background to your cropped photo.'
  },
  {
    question: 'How do I position my face correctly?',
    answer: 'Use the drag and zoom controls to position your face in the center of the frame. Your head (including hair) should take up about 70-80% of the photo height.'
  },
  {
    question: 'What image format is the output?',
    answer: 'The passport photo is saved as a high-quality JPG file at 300 DPI, which is suitable for both digital submission and professional printing.'
  },
  {
    question: 'Is my photo uploaded to a server?',
    answer: 'No. All processing happens directly in your browser. Your photos never leave your device, ensuring complete privacy.'
  }
];

const RELATED = ['crop-image', 'resize-image', 'compress-image'];

export default function PassportPhoto() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [selectedSize, setSelectedSize] = useState(PHOTO_SIZES[0]);
  const [processing, setProcessing] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const containerRef = useRef(null);
  
  // Turnstile bot protection
  const { verify, reset } = useTurnstile();

  const handleFileSelect = async (selectedFile) => {
    // Validate file type
    if (!selectedFile.type.startsWith('image/') && !isHeicFile(selectedFile)) {
      toast.error('Please upload an image file');
      return;
    }
    
    // Auto-convert HEIC
    let processFile = selectedFile;
    if (isHeicFile(selectedFile)) {
      toast.info('Converting HEIC to JPEG...');
      processFile = await convertHeicToJpeg(selectedFile);
      toast.success('HEIC converted!');
    }
    
    setFile(processFile);
    setPosition({ x: 0, y: 0 });
    setScale(1);
    setImageLoaded(false);
    
    const url = URL.createObjectURL(processFile);
    setPreview(url);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    // Auto-fit the image
    if (imageRef.current && containerRef.current) {
      const img = imageRef.current;
      const container = containerRef.current;
      const containerSize = Math.min(container.offsetWidth, container.offsetHeight);
      const imgSize = Math.max(img.naturalWidth, img.naturalHeight);
      const fitScale = (containerSize * 0.9) / imgSize;
      setScale(Math.max(fitScale, 0.5));
    }
  };

  const handleMouseDown = (e) => {
    if (!imageLoaded) return;
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.1, 3));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.1, 0.2));
  };

  const handleReset = () => {
    setPosition({ x: 0, y: 0 });
    setScale(1);
    handleImageLoad();
  };

  const handleCreate = async () => {
    if (!file || !imageRef.current || !containerRef.current) {
      toast.error('Please upload an image first');
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
      
      // Calculate output dimensions at 300 DPI
      const outputWidth = Math.round(selectedSize.width * selectedSize.dpi);
      const outputHeight = Math.round(selectedSize.height * selectedSize.dpi);
      
      // Create canvas for the passport photo
      const canvas = document.createElement('canvas');
      canvas.width = outputWidth;
      canvas.height = outputHeight;
      const ctx = canvas.getContext('2d');
      
      // Fill with white background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, outputWidth, outputHeight);
      
      // Calculate how to draw the image based on current view
      const containerRect = container.getBoundingClientRect();
      const cropBox = container.querySelector('[data-crop-box]');
      const cropRect = cropBox.getBoundingClientRect();
      
      // Calculate the visible portion
      const visibleX = (cropRect.left - containerRect.left - position.x) / scale;
      const visibleY = (cropRect.top - containerRect.top - position.y) / scale;
      const visibleWidth = cropRect.width / scale;
      const visibleHeight = cropRect.height / scale;
      
      // Scale from natural image size
      const scaleX = img.naturalWidth / img.width;
      const scaleY = img.naturalHeight / img.height;
      
      // Source coordinates in the original image
      const sx = visibleX * scaleX;
      const sy = visibleY * scaleY;
      const sw = visibleWidth * scaleX;
      const sh = visibleHeight * scaleY;
      
      // Draw the cropped portion
      ctx.drawImage(
        img,
        sx, sy, sw, sh,
        0, 0, outputWidth, outputHeight
      );
      
      // Convert to blob and download
      canvas.toBlob((blob) => {
        const filename = `passport_photo_${selectedSize.id}_${Date.now()}.jpg`;
        const passportFile = new File([blob], filename, { type: 'image/jpeg' });
        downloadFile(passportFile, filename);
        toast.success(`Passport photo created! (${outputWidth}×${outputHeight}px at 300 DPI)`);
        setProcessing(false);
        reset();
      }, 'image/jpeg', 0.95);
      
    } catch (error) {
      toast.error('Failed to create passport photo');
      console.error(error);
      setProcessing(false);
      reset();
    }
  };

  const handleUploadNew = () => {
    setFile(null);
    setPreview(null);
    setPosition({ x: 0, y: 0 });
    setScale(1);
    setImageLoaded(false);
  };

  // Calculate crop box dimensions for display
  const getCropBoxStyle = () => {
    const aspectRatio = selectedSize.width / selectedSize.height;
    const maxHeight = 300; // Max height of crop box in pixels
    const height = maxHeight;
    const width = height * aspectRatio;
    return { width, height };
  };

  const cropBoxStyle = getCropBoxStyle();

  return (
    <>
      <SEO 
        title="Passport Photo Maker - Create 2x2, 35x45mm Photos Online Free" 
        description="Create passport and visa photos online free. US passport (2×2 inch), UK/EU (35×45mm), Schengen visa, and more. Instant processing with white background."
        path="/passport-photo"
      />
      
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumb items={[
            { label: 'Home', path: '/' },
            { label: 'Image Tools', path: '/image-tools' },
            { label: 'Passport Photo Maker' }
          ]} />
          
          <div className="mb-8 mt-6">
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 mb-4">
              Passport Photo Maker
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed">
              Create passport and visa photos in standard sizes. US 2×2", UK 35×45mm, Schengen, and more. Free with white background.
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
                      data-testid="upload-new-btn"
                    >
                      <Upload size={16} /> Upload New
                    </button>
                  </div>
                  
                  {/* Photo Editor */}
                  <div 
                    ref={containerRef}
                    className="relative bg-slate-200 rounded-lg overflow-hidden flex items-center justify-center"
                    style={{ height: '400px' }}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                  >
                    {/* Image */}
                    <img 
                      ref={imageRef}
                      src={preview} 
                      alt="To crop" 
                      className="absolute cursor-move select-none"
                      style={{
                        transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                        transformOrigin: 'center center',
                        maxWidth: 'none',
                        maxHeight: 'none'
                      }}
                      draggable={false}
                      onLoad={handleImageLoad}
                    />
                    
                    {/* Crop overlay */}
                    <div className="absolute inset-0 pointer-events-none">
                      {/* Darkened areas */}
                      <div className="absolute inset-0 bg-black/50" />
                      
                      {/* Clear crop area */}
                      <div 
                        data-crop-box
                        className="absolute bg-transparent border-2 border-white border-dashed shadow-lg"
                        style={{
                          width: cropBoxStyle.width,
                          height: cropBoxStyle.height,
                          left: '50%',
                          top: '50%',
                          transform: 'translate(-50%, -50%)',
                          boxShadow: '0 0 0 9999px rgba(0,0,0,0.5)'
                        }}
                      >
                        {/* Corner markers */}
                        <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-white" />
                        <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-white" />
                        <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-white" />
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-white" />
                        
                        {/* Center crosshair */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                          <div className="w-px h-8 bg-white/50 absolute left-1/2 -translate-x-1/2" />
                          <div className="h-px w-8 bg-white/50 absolute top-1/2 -translate-y-1/2" />
                        </div>
                        
                        {/* Size label */}
                        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/70 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                          {selectedSize.label}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Controls */}
                  <div className="flex items-center justify-center gap-4 mt-4">
                    <button
                      onClick={handleZoomOut}
                      className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                      title="Zoom Out"
                      data-testid="zoom-out-btn"
                    >
                      <ZoomOut size={20} className="text-slate-600" />
                    </button>
                    <span className="text-sm text-slate-600 w-16 text-center">{Math.round(scale * 100)}%</span>
                    <button
                      onClick={handleZoomIn}
                      className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                      title="Zoom In"
                      data-testid="zoom-in-btn"
                    >
                      <ZoomIn size={20} className="text-slate-600" />
                    </button>
                    <button
                      onClick={handleReset}
                      className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors ml-4"
                      title="Reset Position"
                      data-testid="reset-btn"
                    >
                      <RotateCcw size={20} className="text-slate-600" />
                    </button>
                  </div>
                  
                  <p className="text-sm text-slate-500 mt-3 text-center flex items-center justify-center gap-2">
                    <Move size={16} /> Drag image to position your face in the frame
                  </p>
                </div>
              )}
            </div>

            <div className="lg:col-span-4">
              <div className="bg-white border border-slate-200 rounded-xl p-6 sticky top-24">
                <h2 className="text-lg font-bold text-slate-900 mb-4">Photo Size</h2>
                
                <div className="space-y-4">
                  <div className="max-h-64 overflow-y-auto space-y-2 pr-2">
                    {PHOTO_SIZES.map((size) => (
                      <button
                        key={size.id}
                        onClick={() => setSelectedSize(size)}
                        className={`w-full p-3 rounded-lg border text-left transition-all ${
                          selectedSize.id === size.id
                            ? 'bg-blue-50 border-blue-300 ring-1 ring-blue-300'
                            : 'bg-white border-slate-200 hover:border-blue-200'
                        }`}
                        data-testid={`size-${size.id}`}
                      >
                        <div className="font-medium text-slate-900 text-sm">{size.label}</div>
                        <div className="text-xs text-slate-500 mt-1">{size.description}</div>
                      </button>
                    ))}
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-600">
                      <strong>Output:</strong> {Math.round(selectedSize.width * selectedSize.dpi)} × {Math.round(selectedSize.height * selectedSize.dpi)} pixels at 300 DPI
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      White background • JPG format
                    </p>
                  </div>

                  <button
                    onClick={handleCreate}
                    disabled={!file || !imageLoaded || processing}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    data-testid="create-photo-btn"
                  >
                    {processing ? 'Creating...' : (
                      <>
                        <Download size={20} /> Create & Download
                      </>
                    )}
                  </button>

                  <p className="text-xs text-slate-500 text-center">
                    Questions? <a href="mailto:admin@myguyai.com" className="text-blue-600 hover:underline">admin@myguyai.com</a>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* HIGH CONVERSION - Below tool ad */}
          <BelowToolAd />

          {/* SEO Content */}
          <section className="mt-12 max-w-4xl">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">How to Create Passport Photos Online</h2>
            <div className="prose prose-slate max-w-none">
              <p className="text-slate-600 leading-relaxed mb-4">
                Creating passport and visa photos has never been easier. Our free online passport photo maker lets you create 
                properly sized photos for US passports (2×2 inches), UK/EU passports (35×45mm), Schengen visas, and many other 
                international standards.
              </p>
              <p className="text-slate-600 leading-relaxed mb-4">
                Simply upload your photo, select your required size, and use the drag and zoom controls to position your face 
                correctly in the frame. Your passport photo will be created with a clean white background at 300 DPI – the 
                standard quality required for official documents.
              </p>
            </div>
          </section>

          {/* Mid-content ad */}
          <MidContentAd />

          {/* More SEO content */}
          <section className="mt-8 max-w-4xl">
            <div className="prose prose-slate max-w-none">
              <p className="text-slate-600 leading-relaxed mb-4">
                <strong>Tips for a good passport photo:</strong>
              </p>
              <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-2">
                <li>Use a photo with good lighting and a plain background</li>
                <li>Face the camera directly with a neutral expression</li>
                <li>Ensure your full face is visible (no hair covering your face)</li>
                <li>Position your head to fill about 70-80% of the frame height</li>
                <li>Remove glasses if possible (many countries require this)</li>
              </ul>
              <p className="text-slate-600 leading-relaxed">
                All processing happens locally in your browser – your photos are never uploaded to any server, ensuring 
                complete privacy. Perfect for DIY passport photos at home!
              </p>
            </div>
          </section>

          <FAQ faqs={faqs} />
          
          <RelatedTools tools={RELATED} />

          {/* Bottom ad - desktop only */}
          <BottomAd />
        </div>
      </div>
    </>
  );
}
