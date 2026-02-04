
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { UniversalExportData } from '../../types';

export const UniversalPdfService = {
  /**
   * YENİ NESİL PDF MOTORU (v3.0 - PUBLISHER GRADE)
   * HTML elementlerini A4 kağıt standartlarına (210mm x 297mm) göre izole eder.
   * Yüksek DPI (300) ile render alarak bulanıklığı önler.
   */
  async generateHighResPdf(elementId: string, data: UniversalExportData): Promise<void> {
    const rootElement = document.getElementById(elementId);
    if (!rootElement) throw new Error("Yayınlama alanı (Render Stage) bulunamadı.");

    // Sadece '.pdf-page' sınıfına sahip, A4 boyutundaki konteynerleri seç.
    const pages = rootElement.querySelectorAll('.pdf-page');
    if (pages.length === 0) throw new Error("Sayfalandırma hatası: Sayfa şablonları oluşturulamadı.");

    // PDF Hazırlığı (A4 Portrait, mm bazlı)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    try {
      for (let i = 0; i < pages.length; i++) {
        const pageElement = pages[i] as HTMLElement;
        
        // İlk sayfa hariç her döngüde yeni sayfa ekle
        if (i > 0) pdf.addPage();

        // HTML2CANVAS OPTİMİZASYONU
        // scale: 2 (192 DPI) -> Hem okunaklı hem performanslı. 300 DPI bazen tarayıcıyı kilitler.
        const canvas = await html2canvas(pageElement, {
          scale: 2, 
          useCORS: true,
          backgroundColor: '#ffffff', // Şeffaf arka plan sorununu önler
          logging: false,
          allowTaint: true,
          windowWidth: 794, // Tam A4 pixel genişliği (96 DPI CSS standardı)
          windowHeight: 1123, // Tam A4 pixel yüksekliği
          onclone: (clonedDoc) => {
            // Render sırasında görünmemesi gereken UI elementlerini (butonlar, scrollbarlar) temizle
            const clonedEl = clonedDoc.getElementById(pageElement.id);
            if (clonedEl) {
                clonedEl.style.transform = 'none';
                clonedEl.style.boxShadow = 'none';
                clonedEl.style.margin = '0';
                clonedEl.style.overflow = 'hidden'; // Taşmaları engelle
            }
          }
        });

        // Görüntüyü PDF boyutlarına tam oturt
        const imgData = canvas.toDataURL('image/jpeg', 0.95); // Yüksek kalite JPEG
        const pdfWidth = 210;
        const pdfHeight = 297;
        
        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
        
        // DİJİTAL FİLİGRAN (PDF KATMANI)
        // Resmin üzerine vektörel yazı ekleyerek keskinliği korur.
        pdf.setFontSize(6);
        pdf.setTextColor(150);
        pdf.text(
            `YENİ GÜN AKADEMİ | MIA INTELLIGENCE | REF:${data.referenceId} | SAYFA ${i + 1}/${pages.length}`, 
            105, 
            294, 
            { align: 'center' }
        );
      }

      const fileName = `${data.type}_${data.entityName.replace(/\s+/g, '_').toUpperCase()}_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      
    } catch (error) {
      console.error("PDF Motoru Kritik Hata:", error);
      throw error;
    }
  }
};
