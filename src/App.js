import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Analytics } from '@vercel/analytics/react';
import { Toaster } from '@/components/ui/sonner';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ScrollToTop } from '@/components/ScrollToTop';
import Home from '@/pages/Home';
import CompressImage from '@/pages/CompressImage';
import ResizeImage from '@/pages/ResizeImage';
import CropImage from '@/pages/CropImage';
import JpgToPng from '@/pages/JpgToPng';
import PngToJpg from '@/pages/PngToJpg';
import ImageToPdf from '@/pages/ImageToPdf';
import CompressPdf from '@/pages/CompressPdf';
import MergePdf from '@/pages/MergePdf';
import PassportPhoto from '@/pages/PassportPhoto';
import CategoryPage from '@/pages/CategoryPage';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import Terms from '@/pages/Terms';
import Admin from '@/pages/Admin';
import CMSLogin from '@/pages/CMSLogin';
import CMSDashboard from '@/pages/CMSDashboard';
import '@/App.css';

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <div className="App">
          <Routes>
            {/* Admin route without header/footer */}
            <Route path="/admin" element={<Admin />} />
            
            {/* CMS routes without header/footer */}
            <Route path="/cms/login" element={<CMSLogin />} />
            <Route path="/cms/dashboard" element={<CMSDashboard />} />
            
            {/* Main routes with header/footer */}
            <Route path="*" element={
              <>
                <ScrollToTop />
                <Header />
                <main>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    
                    {/* Tool Pages */}
                    <Route path="/compress-image" element={<CompressImage />} />
                    <Route path="/resize-image" element={<ResizeImage />} />
                    <Route path="/crop-image" element={<CropImage />} />
                    <Route path="/jpg-to-png" element={<JpgToPng />} />
                    <Route path="/png-to-jpg" element={<PngToJpg />} />
                    <Route path="/image-to-pdf" element={<ImageToPdf />} />
                    <Route path="/compress-pdf" element={<CompressPdf />} />
                    <Route path="/merge-pdf" element={<MergePdf />} />
                    <Route path="/passport-photo" element={<PassportPhoto />} />
                    
                    {/* Category Pages */}
                    <Route path="/image-tools" element={<CategoryPage categoryId="image-tools" />} />
                    <Route path="/pdf-tools" element={<CategoryPage categoryId="pdf-tools" />} />
                    <Route path="/file-conversion-tools" element={<CategoryPage categoryId="file-conversion-tools" />} />
                    
                    {/* Legal Pages */}
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/terms" element={<Terms />} />
                    
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </main>
                <Footer />
              </>
            } />
          </Routes>
          <Toaster position="top-center" />
        </div>
        <Analytics />
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
