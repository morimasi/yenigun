
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { UniversalExportData } from '../../types';

export const UniversalPdfService = {
  /**
   * YENİ NESİL PDF MOTORU (v6.0 - GHOST CONTAINER PROTOCOL)
   * "Unable to find element in cloned iframe" hatasını kesin olarak çözer.
   * Yöntem:
   * 1. Hedef elementi klonla ve görünmez ama render edilmiş bir 'Ghost Container' içine taşı.
   * 2. ID çakışmalarını önlemek için statik ID'ler ata.
   * 3. html2canvas'i bu izole ortamda çalıştır.
   * 4. İşlem bitince hayalet konteyneri yok et.
   */
  async generateHighResPdf(sourceElementId: string, data: UniversalExportData): Promise<void> {
    // 1. KAYNAK KONTROLÜ
    const sourceElement = document.getElementById(sourceElementId);
    if (!sourceElement) {
        throw new Error(`Render kaynağı bulunamadı: #${sourceElementId}`);
    }

    // 2. GHOST CONTAINER OLUŞTURMA (Görünmez ama fiziksel DOM)
    const ghostContainer = document.createElement('div');
    ghostContainer.id = 'pdf-ghost-engine';
    ghostContainer.style.position = 'absolute';
    ghostContainer.style.top = '0';
    ghostContainer.style.left = '-9999px'; // Ekran dışı
    ghostContainer.style.width = '210mm'; // A4 Genişlik
    ghostContainer.style.zIndex = '-1000';
    ghostContainer.style.background = '#ffffff';
    
    // Kaynak içeriği derinlemesine klonla (Event'leri almadan, sadece yapıyı)
    const clonedContent = sourceElement.cloneNode(true) as HTMLElement;
    
    // Klonlanan içeriğe temiz bir ID ver (Çakışmayı önler)
    const renderId = `render-target-${Date.now()}`;
    clonedContent.id = renderId;
    
    // Klonu ghost container'a ekle
    ghostContainer.appendChild(clonedContent);
    document.body.appendChild(ghostContainer);

    // --- SENKRONİZASYON BEKLEMESİ ---
    // DOM'un boyanması (paint) için kısa bir nefes payı
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      // 3. SAYFA TESPİTİ (Ghost içindeki sayfalara bak)
      // .pdf-page sınıfı yoksa tüm içeriği tek sayfa varsay
      let pages = Array.from(ghostContainer.querySelectorAll('.pdf-page')) as HTMLElement[];
      if (pages.length === 0) {
          // Sayfa yapısı yoksa klonlanan içeriğin kendisini hedef al
          clonedContent.classList.add('pdf-page'); 
          pages = [clonedContent];
      }

      // PDF Hazırlığı (A4 Portrait, mm bazlı)
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });

      for (let i = 0; i < pages.length; i++) {
        const pageElement = pages[i];
        
        // İlk sayfa hariç her döngüde yeni sayfa ekle
        if (i > 0) pdf.addPage();

        // --- HTML2CANVAS MOTORU ---
        const canvas = await html2canvas(pageElement, {
          scale: 2, // 192 DPI (Yüksek Kalite)
          useCORS: true,
          logging: false,
          allowTaint: true,
          backgroundColor: '#ffffff',
          
          // KRİTİK AYARLAR (Hata Önleyici)
          foreignObjectRendering: false, // Bu özellik genelde crash sebebidir, kapalı tut.
          removeContainer: true,
          
          // Viewport ayarlarını sabitle
          windowWidth: 1200, 
          
          // onclone içinde DOM manipülasyonu yapmıyoruz çünkü zaten Ghost Container kullanıyoruz.
          // Bu, "Unable to find element" hatasını kökten çözer.
        });

        // --- PDF YERLEŞTİRME ---
        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        const pdfWidth = 210;
        const pdfHeight = 297;
        
        // Oran koruma (Sayfa dışına taşmayı önle)
        const imgProps = pdf.getImageProperties(imgData);
        const pdfImgHeight = (imgProps.height * pdfWidth) / imgProps.width;
        
        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, Math.min(pdfHeight, pdfImgHeight), undefined, 'FAST');
        
        // --- DİJİTAL MÜHÜR ---
        pdf.setFontSize(7);
        pdf.setTextColor(100, 116, 139);
        pdf.text(
            `CONFIDENTIAL DOCUMENT | REF: ${data.referenceId} | ${new Date().toLocaleDateString('tr-TR')} | ${i + 1}/${pages.length}`, 
            105, 
            294, 
            { align: 'center' }
        );
      }

      // Dosya isimlendirme ve İndirme
      const safeName = data.entityName.replace(/[^a-z0-9]/gi, '_').toUpperCase();
      const fileName = `YG_AKADEMI_${data.type}_${safeName}_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      
    } catch (error) {
      console.error("PDF Motoru Kritik Hata:", error);
      throw error;
    } finally {
      // 4. TEMİZLİK PROTOKOLÜ
      // Ghost container'ı DOM'dan sök
      if (document.body.contains(ghostContainer)) {
        document.body.removeChild(ghostContainer);
      }
    }
  }
};
