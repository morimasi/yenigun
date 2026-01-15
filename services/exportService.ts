
import JSZip from 'jszip';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Candidate } from '../types';
import React from 'react';
import ReactDOM from 'react-dom/client';
import CandidateReport, { ReportCustomizationOptions } from '../components/CandidateReport';

/**
 * Yeni Gün Akademi - Gelişmiş Arşivleme ve PDF Üretim Servisi v3.0
 */
export const exportService = {
  /**
   * Tek bir aday için konfigürasyona göre PDF indirir.
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
      
      // Render ve Recharts grafiklerinin yüklenmesi için bekle
      await new Promise(resolve => setTimeout(resolve, 800));

      const canvas = await html2canvas(exportRoot, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: 794 // A4 96dpi approx
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = (canvas.height * pageWidth) / canvas.width;

      pdf.addImage(imgData, 'JPEG', 0, 0, pageWidth, imgHeight);
      pdf.save(`${candidate.name.replace(/\s+/g, '_')}_Akademik_Rapor.pdf`);

    } finally {
      reactRoot.unmount();
      this._removeTempContainer(exportRoot);
    }
  },

  /**
   * Tüm adayları mevcut veya standart konfigürasyona göre ZIP içinde PDF olarak aktarır.
   */
  async exportAllCandidatesAsZip(candidates: Candidate[], onProgress?: (p: number) => void): Promise<void> {
    const zip = new JSZip();
    const folderName = `YeniGun_Akademi_Arsiv_${new Date().toISOString().split('T')[0]}`;
    const rootFolder = zip.folder(folderName);

    if (!rootFolder) throw new Error("ZIP klasörü oluşturulamadı.");

    const exportRoot = this._createTempContainer();
    const reactRoot = ReactDOM.createRoot(exportRoot);

    try {
      for (let i = 0; i < candidates.length; i++) {
        const candidate = candidates[i];
        if (onProgress) onProgress(Math.round(((i + 1) / candidates.length) * 100));

        reactRoot.render(React.createElement(CandidateReport, { 
          candidate: candidate, 
          report: candidate.report 
          // Toplu aktarımda varsayılan olarak "Tam Rapor" (Full) kullanılır
        }));
        
        await new Promise(resolve => setTimeout(resolve, 600));

        const canvas = await html2canvas(exportRoot, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff',
          logging: false,
          width: 794
        });

        if (canvas.width === 0 || canvas.height === 0) continue;

        const imgData = canvas.toDataURL('image/jpeg', 0.90);
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const imgHeight = (canvas.height * pageWidth) / canvas.width;

        pdf.addImage(imgData, 'JPEG', 0, 0, pageWidth, imgHeight);
        
        const fileName = `${candidate.name.replace(/[<>:"/\\|?*]/g, '').replace(/\s+/g, '_')}_Analiz.pdf`;
        const pdfBlob = pdf.output('blob');
        rootFolder.file(fileName, pdfBlob);
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
    container.style.position = 'fixed';
    container.style.left = '-10000px';
    container.style.top = '0';
    container.style.width = '794px';
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
