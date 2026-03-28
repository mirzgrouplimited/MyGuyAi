import imageCompression from 'browser-image-compression';
import { jsPDF } from 'jspdf';
import heic2any from 'heic2any';

/**
 * Check if file is HEIC/HEIF format
 */
export const isHeicFile = (file) => {
  const heicTypes = ['image/heic', 'image/heif', 'image/heic-sequence', 'image/heif-sequence'];
  const heicExtensions = ['.heic', '.heif'];
  
  // Check MIME type
  if (heicTypes.includes(file.type?.toLowerCase())) {
    return true;
  }
  
  // Check file extension (fallback for when MIME type is not set)
  const fileName = file.name?.toLowerCase() || '';
  return heicExtensions.some(ext => fileName.endsWith(ext));
};

/**
 * Convert HEIC/HEIF to JPEG
 * Returns a new File object in JPEG format
 */
export const convertHeicToJpeg = async (file, quality = 0.92) => {
  if (!isHeicFile(file)) {
    return file;
  }
  
  try {
    // Convert HEIC to JPEG blob
    const convertedBlob = await heic2any({
      blob: file,
      toType: 'image/jpeg',
      quality: quality
    });
    
    // Handle array result (for HEIC sequences)
    const blob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
    
    // Create new File with converted content
    const newFileName = file.name.replace(/\.(heic|heif)$/i, '.jpg');
    const convertedFile = new File([blob], newFileName, { type: 'image/jpeg' });
    
    return convertedFile;
  } catch (error) {
    console.error('HEIC conversion error:', error);
    throw new Error('Failed to convert HEIC/HEIF image. Please convert it to JPG or PNG first.');
  }
};

/**
 * Convert HEIC/HEIF to PNG (for transparency support)
 */
export const convertHeicToPng = async (file) => {
  if (!isHeicFile(file)) {
    return file;
  }
  
  try {
    const convertedBlob = await heic2any({
      blob: file,
      toType: 'image/png',
    });
    
    const blob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
    const newFileName = file.name.replace(/\.(heic|heif)$/i, '.png');
    const convertedFile = new File([blob], newFileName, { type: 'image/png' });
    
    return convertedFile;
  } catch (error) {
    console.error('HEIC to PNG conversion error:', error);
    throw new Error('Failed to convert HEIC/HEIF image to PNG.');
  }
};

/**
 * Auto-convert file if HEIC/HEIF, otherwise return as-is
 * Shows toast notification when converting
 */
export const autoConvertHeic = async (file, toFormat = 'jpeg', onProgress = null) => {
  if (!isHeicFile(file)) {
    return { file, wasConverted: false };
  }
  
  onProgress?.('Converting HEIC to ' + toFormat.toUpperCase() + '...');
  
  const convertedFile = toFormat === 'png' 
    ? await convertHeicToPng(file)
    : await convertHeicToJpeg(file);
  
  return { file: convertedFile, wasConverted: true };
};

export const compressImageToSize = async (file, targetSizeKB) => {
  // Auto-convert HEIC before compression
  let processFile = file;
  if (isHeicFile(file)) {
    processFile = await convertHeicToJpeg(file);
  }
  
  const originalSizeKB = processFile.size / 1024;
  
  // If file is already smaller than target, return original
  if (originalSizeKB <= targetSizeKB) {
    return {
      file: file,
      alreadyOptimal: true,
      originalSize: originalSizeKB,
      finalSize: originalSizeKB
    };
  }
  
  const targetSizeMB = targetSizeKB / 1024;
  let quality = 0.8;
  let bestResult = null;
  let bestSize = Infinity;
  
  // Progressive compression with multiple attempts
  for (let i = 0; i < 15; i++) {
    try {
      // Calculate max dimension based on target - smaller files need smaller images
      let maxDimension = 4096;
      if (targetSizeKB <= 20) maxDimension = 800;
      else if (targetSizeKB <= 50) maxDimension = 1200;
      else if (targetSizeKB <= 100) maxDimension = 1600;
      else if (targetSizeKB <= 500) maxDimension = 2400;
      else if (targetSizeKB <= 1024) maxDimension = 3200;
      
      const options = {
        maxSizeMB: targetSizeMB,
        maxWidthOrHeight: maxDimension,
        useWebWorker: true,
        initialQuality: quality,
        alwaysKeepResolution: false,
      };

      const compressedFile = await imageCompression(processFile, options);
      const compressedSizeKB = compressedFile.size / 1024;
      
      // Track best result (closest to but under target)
      if (compressedSizeKB <= targetSizeKB * 1.05 && compressedSizeKB < bestSize) {
        bestResult = compressedFile;
        bestSize = compressedSizeKB;
      }
      
      // If within acceptable range (5% tolerance), we're done
      if (compressedSizeKB <= targetSizeKB * 1.05) {
        return {
          file: compressedFile,
          alreadyOptimal: false,
          originalSize: originalSizeKB,
          finalSize: compressedSizeKB
        };
      }
      
      // Reduce quality more aggressively
      quality -= 0.08;
      if (quality < 0.05) {
        quality = 0.05;
        // Also reduce max dimension on later iterations
        maxDimension = Math.max(400, maxDimension - 200);
      }
      
    } catch (err) {
      console.warn('Compression iteration failed:', err);
    }
  }
  
  // If we have any result under target, use it
  if (bestResult) {
    return {
      file: bestResult,
      alreadyOptimal: false,
      originalSize: originalSizeKB,
      finalSize: bestSize
    };
  }
  
  // Final aggressive attempt with very low settings
  try {
    const finalOptions = {
      maxSizeMB: targetSizeMB * 0.8,
      maxWidthOrHeight: targetSizeKB <= 50 ? 600 : 1000,
      useWebWorker: true,
      initialQuality: 0.3,
    };
    
    const finalFile = await imageCompression(processFile, finalOptions);
    return {
      file: finalFile,
      alreadyOptimal: false,
      originalSize: originalSizeKB,
      finalSize: finalFile.size / 1024,
      warning: finalFile.size / 1024 > targetSizeKB * 1.05 ? 'Could not reach target size' : null
    };
  } catch (err) {
    throw new Error('Failed to compress image to target size');
  }
};

export const resizeImage = async (file, width, height) => {
  // Auto-convert HEIC before resizing
  let processFile = file;
  if (isHeicFile(file)) {
    processFile = await convertHeicToJpeg(file);
  }
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => {
          resolve(new File([blob], processFile.name, { type: processFile.type || 'image/jpeg' }));
        }, processFile.type || 'image/jpeg');
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(processFile);
  });
};

export const convertImageFormat = async (file, targetFormat) => {
  // Auto-convert HEIC first
  let processFile = file;
  if (isHeicFile(file)) {
    processFile = targetFormat === 'image/png' 
      ? await convertHeicToPng(file)
      : await convertHeicToJpeg(file);
  }
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        
        if (targetFormat === 'image/jpeg') {
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          const extension = targetFormat === 'image/jpeg' ? '.jpg' : '.png';
          const newName = processFile.name.replace(/\.[^/.]+$/, extension);
          resolve(new File([blob], newName, { type: targetFormat }));
        }, targetFormat, 0.95);
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const imageToPDF = async (files) => {
  const pdf = new jsPDF();
  let isFirstPage = true;

  for (const file of files) {
    const img = await loadImage(file);
    const canvas = document.createElement('canvas');
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgRatio = img.width / img.height;
    const pdfRatio = pdfWidth / pdfHeight;
    
    let finalWidth, finalHeight;
    if (imgRatio > pdfRatio) {
      finalWidth = pdfWidth;
      finalHeight = pdfWidth / imgRatio;
    } else {
      finalHeight = pdfHeight;
      finalWidth = pdfHeight * imgRatio;
    }
    
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    
    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    
    if (!isFirstPage) {
      pdf.addPage();
    }
    isFirstPage = false;
    
    const x = (pdfWidth - finalWidth) / 2;
    const y = (pdfHeight - finalHeight) / 2;
    pdf.addImage(imgData, 'JPEG', x, y, finalWidth, finalHeight);
  }

  return pdf;
};

const loadImage = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const downloadFile = (file, filename) => {
  try {
    // Ensure we have a proper blob
    const blob = file instanceof Blob ? file : new Blob([file], { type: file.type || 'application/octet-stream' });
    
    // Use the modern approach with createObjectURL
    const url = window.URL.createObjectURL(blob);
    
    // Create link element
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || file.name || 'download';
    link.style.cssText = 'position:fixed;left:0;top:0;opacity:0;pointer-events:none;';
    
    // Add to DOM
    document.body.appendChild(link);
    
    // Use a small timeout to ensure the link is in the DOM
    setTimeout(() => {
      // Trigger download with a direct click
      link.dispatchEvent(new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
      }));
      
      // Cleanup after download starts
      setTimeout(() => {
        if (link.parentNode) {
          document.body.removeChild(link);
        }
        window.URL.revokeObjectURL(url);
      }, 500);
    }, 100);
    
    return true;
  } catch (error) {
    console.error('Download failed:', error);
    
    // Fallback: Create a visible download link
    try {
      const blob = file instanceof Blob ? file : new Blob([file]);
      const url = window.URL.createObjectURL(blob);
      
      // Alert user to use manual download
      alert(`If download doesn't start automatically, right-click the image and select "Save image as..." or use the alternative download link below.`);
      
      // Try window.open as last resort
      window.open(url, '_blank');
    } catch (fallbackError) {
      console.error('Fallback download also failed:', fallbackError);
    }
    
    return false;
  }
};