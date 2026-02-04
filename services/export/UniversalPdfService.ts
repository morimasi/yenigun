
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { UniversalExportData } from '../../types';

export const UniversalPdfService = {
  /**
   * YENİ NESİL PDF MOTORU (v5.0 - CRASH PROOF)
   * HTML elementlerini A4 kağıt standartlarına (210mm x 297mm) göre izole eder.
   * "Unable to find element in cloned iframe" hatasını önlemek için 
   * Deterministik ID, Scroll Reset ve Safe-Query yöntemlerini kullanır.
   */
  async generateHighResPdf(elementId: string, data: UniversalExportData): Promise<void> {
    // 1. KÖK ELEMENT KONTROLÜ
    const rootElement = document.getElementById(elementId);
    if (!rootElement) {
        console.error(`PDF Motoru Hatası: '${elementId}' ID'li kapsayıcı bulunamadı.`);
        throw new Error("Yayınlama alanı (Render Stage) başlatılamadı.");
    }

    // 2. SAYFA TESPİTİ VE FİLTRELEME
    // Sadece '.pdf-page' sınıfına sahip ve görünür olan elementleri al
    const pages = Array.from(rootElement.querySelectorAll('.pdf-page')) as HTMLElement[];
    if (pages.length === 0) throw new Error("Sayfalandırma hatası: Yazdırılacak sayfa bulunamadı.");

    // PDF Hazırlığı (A4 Portrait, mm bazlı)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    // UX & SAFETY: İşlem sırasında kullanıcının scroll yapmasını ve layout kaymalarını engelle
    const originalOverflow = document.body.style.overflow;
    const originalScrollY = window.scrollY;
    document.body.style.overflow = 'hidden';
    
    // Scroll'u en tepeye al (Kritik Hata Önleyici)
    window.scrollTo(0, 0);

    try {
      for (let i = 0; i < pages.length; i++) {
        const pageElement = pages[i];
        
        // --- KRİTİK DÜZELTME: STATİK ID ENJEKSİYONU ---
        // html2canvas'in klonlanmış dökümanda elementi kesinlikle bulabilmesi için
        // anlık, benzersiz ve basit (special char içermeyen) bir ID atıyoruz.
        const originalId = pageElement.id;
        const tempId = `pdf_safe_render_page_${i}`;
        pageElement.id = tempId;

        // İlk sayfa hariç her döngüde yeni sayfa ekle
        if (i > 0) pdf.addPage();

        // --- HTML2CANVAS KONFİGÜRASYONU ---
        const canvas = await html2canvas(pageElement, {
          scale: 2, // 192 DPI (Yüksek Kalite)
          useCORS: true, // Görseller için CORS izni
          backgroundColor: '#ffffff', // Şeffaf arka plan riskini önle
          logging: false, // Konsol kirliliğini önle
          allowTaint: true,
          
          // SCROLL VE POZİSYON DÜZELTMELERİ (HATA ENGELLEYİCİ)
          scrollY: 0, 
          scrollX: 0,
          windowWidth: document.documentElement.offsetWidth,
          windowHeight: document.documentElement.offsetHeight,
          
          // GÜVENLİ KLONLAMA (ONCLONE)
          onclone: (clonedDoc) => {
            // HATA NOKTASI BURASIYDI: Artık try-catch ve null check var.
            try {
                const clonedEl = clonedDoc.getElementById(tempId);
                
                if (clonedEl) {
                    // Render sırasında bozulabilecek stilleri sabitle
                    clonedEl.style.transform = 'none';
                    clonedEl.style.boxShadow = 'none';
                    clonedEl.style.margin = '0';
                    clonedEl.style.border = 'none'; // Kenar çizgilerini temizle
                    
                    // Flex/Grid taşmalarını önle
                    clonedEl.style.width = '210mm';
                    clonedEl.style.height = '297mm';
                    clonedEl.style.overflow = 'hidden';
                    
                    // Varsa içindeki scrollbarları gizle
                    const scrollables = clonedEl.querySelectorAll('.custom-scrollbar');
                    scrollables.forEach((el: any) => {
                        el.style.overflow = 'visible'; 
                        el.style.height = 'auto';
                    });
                } else {
                    console.warn(`PDF Uyarısı: Sayfa ${i+1} klonlanırken hedef element (${tempId}) bulunamadı. Render devam ediyor...`);
                }
            } catch (cloneError) {
                console.warn("Clone manipülasyon hatası (yoksayıldı):", cloneError);
            }
          }
        });

        // --- ID TEMİZLİĞİ ---
        // İşlem bitince orijinal ID'yi geri yükle
        if (originalId) {
            pageElement.id = originalId;
        } else {
            pageElement.removeAttribute('id');
        }

        // --- PDF YERLEŞTİRME ---
        const imgData = canvas.toDataURL('image/jpeg', 0.92); // Kalite/Boyut dengesi (0.92 optimum)
        const pdfWidth = 210;
        const pdfHeight = 297;
        
        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
        
        // --- DİJİTAL MÜHÜR (VEKTÖREL) ---
        // Resim üzerine vektörel yazı ekleyerek netliği artırır
        pdf.setFontSize(7);
        pdf.setTextColor(100, 116, 139); // Slate-500
        pdf.text(
            `CONFIDENTIAL DOCUMENT | REF: ${data.referenceId} | ${new Date().toLocaleDateString('tr-TR')} | ${i + 1}/${pages.length}`, 
            105, 
            294, 
            { align: 'center' }
        );
      }

      // Dosya isimlendirme
      const safeName = data.entityName.replace(/[^a-z0-9]/gi, '_').toUpperCase();
      const fileName = `YG_AKADEMI_${data.type}_${safeName}_${new Date().toISOString().split('T')[0]}.pdf`;
      
      pdf.save(fileName);
      
    } catch (error) {
      console.error("PDF Motoru Kritik Hata:", error);
      throw error; // Hatayı yukarı fırlat ki UI yakalasın
    } finally {
      // Temizlik: Scroll ve Overflow'u eski haline getir
      document.body.style.overflow = originalOverflow;
      window.scrollTo(0, originalScrollY);
    }
  }
};
