
import JSZip from 'jszip';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Candidate } from '../types';
import React from 'react';
import ReactDOM from 'react-dom/client';
import CandidateReport from '../components/CandidateReport';

/**
 * Yeni Gün Akademi - Toplu Arşivleme ve Dışa Aktarma Servisi v2.1
 */
export const exportService = {
  async exportAllCandidatesAsZip(candidates: Candidate[], onProgress?: (p: number) => void): Promise<void> {
    const zip = new JSZip();
    const folderName = `YeniGun_Akademi_Arsiv_${new Date().toISOString().split('T')[0]}`;
    const rootFolder = zip.folder(folderName);

    if (!rootFolder) throw new Error("ZIP klasörü oluşturulamadı.");

    // PDF üretimi için geçici bir DOM konteyneri oluştur
    const exportRoot = document.createElement('div');
    exportRoot.id = 'temp-pdf-export-root';
    exportRoot.style.position = 'fixed';
    exportRoot.style.left = '-10000px';
    exportRoot.style.top = '0';
    exportRoot.style.width = '794px'; // 210mm approx at 96dpi
    exportRoot.style.backgroundColor = '#ffffff';
    document.body.appendChild(exportRoot);

    const reactRoot = ReactDOM.createRoot(exportRoot);

    try {
      for (let i = 0; i < candidates.length; i++) {
        const candidate = candidates[i];
        if (onProgress) onProgress(Math.round(((i + 1) / candidates.length) * 100));

        // Raporu geçici olarak render et
        reactRoot.render(React.createElement(CandidateReport, { 
          candidate: candidate, 
          report: candidate.report 
        }));
        
        // Render ve CSS reflow için bekleme süresini artır
        await new Promise(resolve => setTimeout(resolve, 800));

        const canvas = await html2canvas(exportRoot, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          logging: false,
          width: 794
        });

        // Boyut kontrolü (Sıfır veya geçersiz boyutları engelle)
        if (canvas.width === 0 || canvas.height === 0) {
          console.warn(`Aday ${candidate.name} için canvas boyutu geçersiz, atlanıyor.`);
          continue;
        }

        const imgData = canvas.toDataURL('image/jpeg', 0.90);
        const pdf = new jsPDF('p', 'mm', 'a4');
        
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        
        // Orantılı yükseklik hesapla
        const imgWidth = pageWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // Koordinatların ve boyutların sayı olduğundan emin ol
        if (!isNaN(imgWidth) && !isNaN(imgHeight) && isFinite(imgWidth) && isFinite(imgHeight)) {
          pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
          
          const fileName = `${candidate.name.replace(/[<>:"/\\|?*]/g, '').replace(/\s+/g, '_')}_Analiz.pdf`;
          const pdfBlob = pdf.output('blob');
          rootFolder.file(fileName, pdfBlob);
        } else {
          console.error(`Boyut hesaplama hatası: ${candidate.name}`);
        }
      }

      const content = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = `${folderName}.zip`;
      link.click();
      URL.revokeObjectURL(link.href);

    } finally {
      reactRoot.unmount();
      if (document.body.contains(exportRoot)) {
        document.body.removeChild(exportRoot);
      }
    }
  }
};
