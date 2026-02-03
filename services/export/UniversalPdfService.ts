
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { UniversalExportData, ExportConfig } from '../../types';

export const UniversalPdfService = {
  async generateHighResPdf(elementId: string, data: UniversalExportData): Promise<void> {
    const element = document.getElementById(elementId);
    if (!element) throw new Error("Export target not found");

    // UI'daki buton ve etkileşimli alanları geçici olarak gizle
    const noPrint = element.querySelectorAll('.no-print');
    noPrint.forEach(el => (el as HTMLElement).style.display = 'none');

    try {
      const scale = 2.0; // Retina/High-Res scaling
      const canvas = await html2canvas(element, {
        scale: scale,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        allowTaint: true,
        imageTimeout: 15000,
      });

      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });

      const imgWidth = 210; // A4 Width in mm
      const pageHeight = 297; // A4 Height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // Page 1
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;

      // Subsequent Pages
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
        
        // Add confidential footer
        pdf.setFontSize(7);
        pdf.setTextColor(180);
        pdf.text(`YENİ GÜN AKADEMİ - RESMİ ANALİZ DOSYASI [REF:${data.referenceId}]`, 105, 290, { align: 'center' });
        
        heightLeft -= pageHeight;
      }

      const fileName = `${data.type}_${data.entityName.replace(/\s+/g, '_').toUpperCase()}_${Date.now()}.pdf`;
      pdf.save(fileName);
    } finally {
      // UI'ı eski haline getir
      noPrint.forEach(el => (el as HTMLElement).style.display = '');
    }
  }
};
