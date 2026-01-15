
import JSZip from 'jszip';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Candidate } from '../types';
import React from 'react';
import ReactDOM from 'react-dom/client';
import CandidateReport, { ReportCustomizationOptions } from '../components/CandidateReport';

/**
 * Yeni Gün Akademi - Gelişmiş Arşivleme ve Multi-Page PDF Üretim Servisi v4.0
 * Uzun içerikleri otomatik sayfalandırma yeteneğine sahiptir.
 */
export const exportService = {
  /**
   * Dom elementini yakalayıp sayfalandırarak PDF'e dönüştürür.
   */
  async _generateMultiPagePDF(element: HTMLElement, fileName: string): Promise<Blob | void> {
    const canvas = await html2canvas(element, {
      scale: 2, // 300 DPI netliği
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
      width: 794 // A4 96dpi standart genişlik
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const imgWidth = 210; // A4 Genişliği (mm)
    const pageHeight = 297; // A4 Yüksekliği (mm)
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    let heightLeft = imgHeight;
    let position = 0;

    // İlk Sayfa
    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Eğer içerik bir sayfadan uzunsa, yeni sayfalar ekle ve görseli kaydır (offset)
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    if (fileName.endsWith('.pdf')) {
      pdf.save(fileName);
    } else {
      return pdf.output('blob');
    }
  },

  /**
   * Tek bir aday için mevcut konfigürasyona göre çok sayfalı PDF indirir.
   */
  async exportSingleCandidatePDF(candidate: Candidate, options: ReportCustomizationOptions): Promise<void> {
    const exportRoot = this._createTempContainer();
    const reactRoot = ReactDOM.createRoot(exportRoot);

    try {
      reactRoot.render(React.createElement(CandidateReport, { 
        candidate: candidate, 
        report: candidate.report,
        options: options
      }));
      
      // Render ve grafik stabilizasyonu için bekleme
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      const safeName = `${candidate.name.replace(/[<>:"/\\|?*]/g, '').replace(/\s+/g, '_')}_Analiz_Raporu.pdf`;
      await this._generateMultiPagePDF(exportRoot, safeName);

    } finally {
      reactRoot.unmount();
      this._removeTempContainer(exportRoot);
    }
  },

  /**
   * Tüm adayları 'Tam Kapsamlı' (Full) konfigürasyona göre ZIP içinde çok sayfalı PDF olarak aktarır.
   */
  async exportAllCandidatesAsZip(candidates: Candidate[], onProgress?: (p: number) => void): Promise<void> {
    const zip = new JSZip();
    const folderName = `YeniGun_Akademi_Arsiv_${new Date().toISOString().split('T')[0]}`;
    const rootFolder = zip.folder(folderName);

    if (!rootFolder) throw new Error("ZIP katmanı başlatılamadı.");

    const exportRoot = this._createTempContainer();
    const reactRoot = ReactDOM.createRoot(exportRoot);

    const fullOptions: ReportCustomizationOptions = {
      showPersonalDetails: true,
      showAcademicBackground: true,
      showAIAnalysis: true,
      showSWOT: true,
      showCompetencyMap: true,
      showInterviewNotes: true,
      headerTitle: 'Kurumsal Arşiv: Tam Liyakat Dosyası'
    };

    try {
      for (let i = 0; i < candidates.length; i++) {
        const candidate = candidates[i];
        if (onProgress) onProgress(Math.round(((i + 1) / candidates.length) * 100));

        if (!candidate.report) continue;

        reactRoot.render(React.createElement(CandidateReport, { 
          candidate: candidate, 
          report: candidate.report,
          options: fullOptions
        }));
        
        await new Promise(resolve => setTimeout(resolve, 1000));

        const pdfBlob = await this._generateMultiPagePDF(exportRoot, 'temp.blob');
        if (pdfBlob instanceof Blob) {
          const fileName = `${candidate.name.replace(/[<>:"/\\|?*]/g, '').replace(/\s+/g, '_')}_Full_Rapor.pdf`;
          rootFolder.file(fileName, pdfBlob);
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
      this._removeTempContainer(exportRoot);
    }
  },

  _createTempContainer() {
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.style.width = '794px'; // 210mm @ 96dpi
    container.style.backgroundColor = '#ffffff';
    document.body.appendChild(container);
    return container;
  },

  _removeTempContainer(container: HTMLElement) {
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }
};
