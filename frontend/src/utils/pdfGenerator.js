import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const generatePDF = async (elementRef, fileName = 'document.pdf') => {
    if (!elementRef.current) return false;

    try {
        const element = elementRef.current;
        const canvas = await html2canvas(element, {
            scale: 2, // Improve quality
            useCORS: true, // Allow loading images from other domains if needed
            logging: false,
            backgroundColor: '#ffffff'
        });

        const imgData = canvas.toDataURL('image/png');

        // A4 size in mm: 210 x 297
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        const imgWidth = canvas.width;
        const imgHeight = canvas.height;

        // Calculate scale to fit width
        const ratio = Math.min(pdfWidth / imgWidth * 1.0, pdfHeight / imgHeight * 1.0);

        const imgX = (pdfWidth - imgWidth * ratio) / 2;
        const imgY = 10; // Top margin

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(fileName);
        return true;
    } catch (error) {
        console.error('Error generating PDF:', error);
        return false;
    }
};
