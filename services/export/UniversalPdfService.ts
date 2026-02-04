
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { UniversalExportData } from '../../types';

export const UniversalPdfService = {
  /**
   * YENİ NESİL PDF MOTORU (v3.1 - STABILIZED)
   * HTML elementlerini A4 kağıt standartlarına (210mm x 297mm) göre izole eder.
   * "Unable to find element in cloned iframe" hatasını önlemek için ID kontrolü ve scroll sıfırlama eklendi.
   */
  async generateHighResPdf(elementId: string, data: UniversalExportData): Promise<void> {
    const rootElement = document.getElementById(elementId);
    if (!rootElement) throw new Error("Yayınlama alanı (Render Stage) bulunamadı.");

    // Sadece '.pdf-page' sınıfına sahip, A4 boyutundaki konteynerleri seç.
    const pages = Array.from(rootElement.querySelectorAll('.pdf-page'));
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
        
        // KRİTİK DÜZELTME: html2canvas'in klonlanmış dökümanda elementi bulabilmesi için benzersiz ID şarttır.
        // Eğer ID yoksa geçici bir ID ata.
        const originalId = pageElement.id;
        if (!originalId) {
            pageElement.id = `pdf-page-gen-${Date.now()}-${i}`;
        }

        // İlk sayfa hariç her döngüde yeni sayfa ekle
        if (i > 0) pdf.addPage();

        // HTML2CANVAS OPTİMİZASYONU
        const canvas = await html2canvas(pageElement, {
          scale: 2, // 192 DPI (Print Quality)
          useCORS: true,
          backgroundColor: '#ffffff',
          logging: false,
          allowTaint: true,
          // Scroll fix: Elementin görünür viewport dışında olması durumunda boş çıkmasını engeller
          scrollY: 0, 
          scrollX: 0,
          // Window dimensions: Full DOM context
          windowWidth: document.documentElement.offsetWidth,
          windowHeight: document.documentElement.offsetHeight,
          onclone: (clonedDoc) => {
            // Klonlanan dökümanda hedef elementi bul
            const clonedEl = clonedDoc.getElementById(pageElement.id);
            if (clonedEl) {
                // Render sırasında görünmemesi gereken UI elementlerini temizle ve stili sabitle
                clonedEl.style.transform = 'none';
                clonedEl.style.boxShadow = 'none';
                clonedEl.style.margin = '0';
                clonedEl.style.overflow = 'hidden'; 
                // Flex container sorunlarını önlemek için
                clonedEl.style.display = 'block'; 
            }
          }
        });

        // İşlem bitince geçici ID'yi temizle (orijinalinde yoksa)
        if (!originalId) {
            pageElement.removeAttribute('id');
        }

        // Görüntüyü PDF boyutlarına tam oturt
        const imgData = canvas.toDataURL('image/jpeg', 0.90); // Optimizasyon: Kalite 0.90
        const pdfWidth = 210;
        const pdfHeight = 297;
        
        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
        
        // DİJİTAL FİLİGRAN (PDF KATMANI - Vektörel)
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
      alert("PDF oluşturulurken bir hata oluştu. Lütfen tekrar deneyiniz.");
    }
  }
};
