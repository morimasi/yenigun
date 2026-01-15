
import JSZip from 'jszip';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Candidate } from '../types';
import React from 'react';
import ReactDOM from 'react-dom/client';
import CandidateReport from '../components/CandidateReport';

/**
 * Yeni Gün Akademi - Toplu Arşivleme ve Dışa Aktarma Servisi
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
    exportRoot.style.left = '-9999px';
    exportRoot.style.top = '0';
    exportRoot.style.width = '210mm'; // A4 width
    document.body.appendChild(exportRoot);

    const reactRoot = ReactDOM.createRoot(exportRoot);

    try {
      for (let i = 0; i < candidates.length; i++) {
        const candidate = candidates[i];
        if (onProgress) onProgress(Math.round(((i + 1) / candidates.length) * 100));

        // Use React.createElement instead of JSX to avoid errors in .ts file
        // Raporu geçici olarak render et
        reactRoot.render(React.createElement(CandidateReport, { candidate: candidate, report: candidate.report }));
        
        // Render ve fontların yüklenmesi için bekle
        await new Promise(resolve => setTimeout(resolve, 500));

        const canvas = await html2canvas(exportRoot, {
          scale: 2, // Yüksek çözünürlük
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff'
        });

        const imgData = canvas.toDataURL('image/jpeg', 0.85);
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
        
        const fileName = `${candidate.name.replace(/\s+/g, '_')}_Analiz_Raporu.pdf`;
        const pdfBlob = pdf.output('blob');
        rootFolder.file(fileName, pdfBlob);
      }

      // ZIP oluştur ve indir
      const content = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = `${folderName}.zip`;
      link.click();
      URL.revokeObjectURL(link.href);

    } finally {
      // Temizlik
      reactRoot.unmount();
      if (document.body.contains(exportRoot)) {
        document.body.removeChild(exportRoot);
      }
    }
  }
};
