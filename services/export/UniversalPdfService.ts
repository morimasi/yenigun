
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { UniversalExportData } from '../../types';

export const UniversalPdfService = {
  /**
   * Sayfa bazlı yakalama motoru. 
   * Belirtilen kapsayıcı içindeki her '.pdf-page' elementini ayrı bir PDF sayfası yapar.
   */
  async generateHighResPdf(elementId: string, data: UniversalExportData): Promise<void> {
    const rootElement = document.getElementById(elementId);
    if (!rootElement) throw new Error("Yayınlama alanı bulunamadı.");

    const pages = rootElement.querySelectorAll('.pdf-page');
    if (pages.length === 0) throw new Error("Sayfalandırma hatası: Sayfa öğesi saptanmadı.");

    // PDF Hazırlığı (A4 Landscape veya Portrait - Varsayılan Portrait)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    try {
      for (let i = 0; i < pages.length; i++) {
        const pageElement = pages[i] as HTMLElement;
        
        // Önceki sayfadan sonra yeni sayfa ekle (ilk sayfa hariç)
        if (i > 0) pdf.addPage();

        const canvas = await html2canvas(pageElement, {
          scale: 3, // 300 DPI kalitesi
          useCORS: true,
          backgroundColor: '#ffffff',
          logging: false,
          allowTaint: true,
          windowWidth: 794, // Standart A4 pixel genişliği (96dpi bazında)
          onclone: (clonedDoc) => {
            // Animasyonları veya görünmemesi gerekenleri temizle
            const el = clonedDoc.getElementById(pageElement.id);
            if (el) {
                el.style.transform = 'none';
                el.style.boxShadow = 'none';
            }
          }
        });

        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
        
        // Footer ekle (Opsiyonel - Alt tarafa sayfa numarası)
        pdf.setFontSize(7);
        pdf.setTextColor(150);
        pdf.text(`SAYFA ${i + 1} / ${pages.length} - ${data.entityName} [REF:${data.referenceId}]`, 105, 292, { align: 'center' });
      }

      const fileName = `${data.type}_${data.entityName.replace(/\s+/g, '_').toUpperCase()}_${Date.now()}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error("PDF Motoru Hatası:", error);
      throw error;
    }
  }
};
