import { PDFDocument } from 'pdf-lib';

export const compressPDF = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  
  const pdfBytes = await pdfDoc.save({
    useObjectStreams: false,
  });
  
  return new File([pdfBytes], file.name, { type: 'application/pdf' });
};

export const mergePDFs = async (files) => {
  const mergedPdf = await PDFDocument.create();
  
  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }
  
  const pdfBytes = await mergedPdf.save();
  return new File([pdfBytes], 'merged.pdf', { type: 'application/pdf' });
};