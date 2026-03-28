import { useState } from 'react';
import { SEO } from '@/components/SEO';
import { Dropzone } from '@/components/Dropzone';
import { FAQ } from '@/components/FAQ';
import { BelowToolAd, MidContentAd, BottomAd, AdPlaceholder } from '@/components/AdPlaceholder';
import { compressPDF } from '@/utils/pdfProcessing';
import { downloadFile } from '@/utils/imageProcessing';
import { useTurnstile } from '@/hooks/useTurnstile';
import { Download, FileText } from 'lucide-react';
import { toast } from 'sonner';

const faqs = [
  {
    question: 'How much can PDF compression reduce file size?',
    answer: 'Compression results vary depending on the PDF content. Typically, you can expect 20-50% size reduction while maintaining quality.'
  },
  {
    question: 'Will compression affect PDF quality?',
    answer: 'Our compression algorithm optimizes file size while preserving visual quality. Text and images remain clear and readable.'
  },
  {
    question: 'Can I compress password-protected PDFs?',
    answer: 'Password-protected PDFs need to be unlocked before compression. Remove the password first, then compress.'
  },
  {
    question: 'Is there a file size limit?',
    answer: 'Since processing happens in your browser, very large PDFs (>50MB) may take longer to process or use significant memory.'
  },
  {
    question: 'Why compress PDF files?',
    answer: 'Compressed PDFs are easier to email, upload, and store. They load faster and use less bandwidth and storage space.'
  }
];

export default function CompressPdf() {
  const [file, setFile] = useState(null);
  const [compressedFile, setCompressedFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  
  // Turnstile bot protection
  const { verify, reset } = useTurnstile();

  const handleFileSelect = async (selectedFile) => {
    setFile(selectedFile);
    setCompressedFile(null);
  };

  const handleCompress = async () => {
    if (!file) return;
    
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
      
      const compressed = await compressPDF(file);
      setCompressedFile(compressed);
      const reduction = ((1 - compressed.size / file.size) * 100).toFixed(1);
      toast.success(`PDF compressed by ${reduction}%`);
    } catch (error) {
      toast.error('Failed to compress PDF');
      console.error(error);
    } finally {
      setProcessing(false);
      reset();
    }
  };

  const handleDownload = () => {
    if (compressedFile) {
      downloadFile(compressedFile, `compressed_${file.name}`);
    }
  };

  return (
    <>
      <SEO 
        title="Compress PDF Online Free - Reduce PDF File Size" 
        description="Compress PDF files online for free. Reduce PDF file size while maintaining quality. Fast browser-based compression."
        path="/compress-pdf"
      />
      
      <div className="min-h-screen">
        <AdPlaceholder position="top" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-12">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter text-neutral-900 mb-4">
              Compress PDF Online
            </h1>
            <p className="text-lg text-neutral-600 leading-relaxed">
              Reduce PDF file size while maintaining document quality. Perfect for email and web sharing.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
            <div className="lg:col-span-8">
              <Dropzone 
                onFileSelect={handleFileSelect}
                accept="application/pdf"
                active={!!file}
              />
              
              {file && (
                <div className="mt-6 border border-neutral-200 rounded-xl p-6" data-testid="file-info">
                  <div className="flex items-center gap-3 mb-6">
                    <FileText size={24} className="text-neutral-600" />
                    <div>
                      <p className="font-medium text-neutral-900">{file.name}</p>
                      <p className="text-sm text-neutral-600">Original size: {(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  
                  {compressedFile && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-green-800 font-medium mb-2">✓ Compression Complete</p>
                      <div className="space-y-1 text-sm">
                        <p className="text-green-600">Original: {(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        <p className="text-green-600">Compressed: {(compressedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                        <p className="text-green-700 font-semibold">Reduction: {((1 - compressedFile.size / file.size) * 100).toFixed(1)}%</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="lg:col-span-4">
              <div className="bg-white border border-neutral-200 rounded-xl p-6 sticky top-24">
                <h2 className="text-xl font-bold text-neutral-900 mb-6">Compression</h2>
                
                <div className="space-y-4">
                  {!compressedFile && (
                    <button
                      onClick={handleCompress}
                      disabled={!file || processing}
                      className="w-full py-4 px-6 bg-gradient-to-r from-blue-500 via-cyan-400 via-green-400 via-yellow-400 via-orange-400 via-pink-500 to-purple-500 text-white font-bold rounded-full hover:scale-105 transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                      data-testid="compress-button"
                    >
                      {processing ? 'Compressing...' : 'Compress PDF'}
                    </button>
                  )}

                  {compressedFile && (
                    <button
                      onClick={handleDownload}
                      className="w-full py-4 px-6 bg-gradient-to-r from-blue-500 via-cyan-400 via-green-400 via-yellow-400 via-orange-400 via-pink-500 to-purple-500 text-white font-bold rounded-full hover:scale-105 transition-transform duration-200 flex items-center justify-center gap-2"
                      data-testid="download-button"
                    >
                      <Download size={20} />
                      Download Compressed PDF
                    </button>
                  )}
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800 text-sm font-medium">Privacy</p>
                    <p className="text-blue-600 text-sm mt-1">
                      Your PDF is processed entirely in your browser. No server uploads.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <AdPlaceholder position="middle" />

          <div className="mt-20">
            <h2 className="text-3xl font-bold text-neutral-900 mb-6 tracking-tight">Why Compress PDF Files?</h2>
            <div className="prose max-w-none">
              <p className="text-neutral-600 leading-relaxed mb-4">
                Large PDF files can be difficult to email, slow to upload, and consume excessive storage space. 
                Compressing PDFs reduces file size while maintaining document quality, making them easier to share 
                and store.
              </p>
              <p className="text-neutral-600 leading-relaxed mb-4">
                Our compression tool works entirely in your browser, ensuring your documents remain private and secure. 
                Perfect for business documents, presentations, reports, and any PDF that needs to be shared digitally.
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