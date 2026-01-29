
import JSZip from 'jszip';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Candidate } from '../types';
import React from 'react';
import ReactDOM from 'react-dom/client';
import CandidateReport, { ReportCustomizationOptions } from '../components/CandidateReport';

export const exportService = {
  async _generateMultiPagePDF(element: HTMLElement, fileName: string): Promise<Blob | void> {
    const scale = 2.5;
    const canvas = await html2canvas(element, {
      scale: scale,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
      width: 794,
      onclone: (clonedDoc) => {
        const el = clonedDoc.getElementById('report-export-area');
        if (el) el.style.boxShadow = 'none';
      }
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.98);
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });
    const imgWidth = 210; 
    const pageHeight = 297; 
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      pdf.setFontSize(8);
      pdf.setTextColor(200);
      pdf.text('YENI GUN AKADEMI - GIZLI VE KISISEL', 105, 290, { align: 'center' });
      heightLeft -= pageHeight;
    }

    if (fileName.endsWith('.pdf')) { pdf.save(fileName); } else { return pdf.output('blob'); }
  },

  async exportSingleCandidatePDF(candidate: Candidate, options: ReportCustomizationOptions): Promise<void> {
    const exportRoot = this._createTempContainer();
    const reactRoot = ReactDOM.createRoot(exportRoot);
    try {
      reactRoot.render(React.createElement(CandidateReport, { candidate, report: candidate.report, options }));
      await new Promise(resolve => setTimeout(resolve, 1500));
      const safeName = `${candidate.name.replace(/[^a-z0-9]/gi, '_').toUpperCase()}_LIYAKAT_RAPORU.pdf`;
      await this._generateMultiPagePDF(exportRoot, safeName);
    } finally {
      reactRoot.unmount();
      this._removeTempContainer(exportRoot);
    }
  },

  async exportAllCandidatesAsZip(candidates: Candidate[], onProgress?: (p: number) => void): Promise<void> {
    const zip = new JSZip();
    const timestamp = new Date().toISOString().split('T')[0];
    const folderName = `YG_ARCHIVE_${timestamp}`;
    const rootFolder = zip.folder(folderName);
    if (!rootFolder) throw new Error("ZIP_ENGINE_FAILURE");

    const exportRoot = this._createTempContainer();
    const reactRoot = ReactDOM.createRoot(exportRoot);
    const fullOptions: ReportCustomizationOptions = {
      showPersonalDetails: true, showAcademicBackground: true, showAIAnalysis: true,
      showSWOT: true, showCompetencyMap: true, showInterviewNotes: true,
      headerTitle: 'AKADEMIK KURUL: RESMI LIYAKAT DOSYASI'
    };

    try {
      for (let i = 0; i < candidates.length; i++) {
        const candidate = candidates[i];
        if (onProgress) onProgress(Math.round(((i + 1) / candidates.length) * 100));
        if (!candidate.report) continue;
        reactRoot.render(React.createElement(CandidateReport, { candidate, report: candidate.report, options: fullOptions }));
        await new Promise(resolve => setTimeout(resolve, 1200));
        const pdfBlob = await this._generateMultiPagePDF(exportRoot, 'temp.blob');
        if (pdfBlob instanceof Blob) {
          const fileName = `${candidate.name.replace(/[^a-z0-9]/gi, '_').toUpperCase()}_DOSYA.pdf`;
          rootFolder.file(fileName, pdfBlob);
        }
      }
      const content = await zip.generateAsync({ type: 'blob', compression: "DEFLATE", compressionOptions: { level: 9 } });
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

  /**
   * ADAY VERİLERİNİ CSV FORMATINDA DIŞA AKTARIR (UTF-8 Karakter Desteğiyle)
   */
  exportCandidatesToCSV(candidates: Candidate[]) {
    const headers = ["İsim", "Branş", "Deneyim (Yıl)", "Üniversite", "Bölüm", "Liyakat Skoru", "Dürüstlük Endeksi", "E-Posta", "Telefon", "Durum"];
    const rows = candidates.map(c => [
      c.name,
      c.branch,
      c.experienceYears,
      c.university,
      c.department,
      c.report?.score || '?',
      c.report?.integrityIndex || '?',
      c.email,
      c.phone,
      c.status
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    ].join("\n");

    // Excel'in Türkçe karakterleri tanıması için BOM ekliyoruz
    const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `YG_ADAY_LISTESI_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  _createTempContainer() {
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '-10000px';
    container.style.top = '0';
    container.style.width = '794px'; 
    container.style.background = '#ffffff';
    container.style.zIndex = '-1';
    document.body.appendChild(container);
    return container;
  },

  _removeTempContainer(container: HTMLElement) {
    if (document.body.contains(container)) { document.body.removeChild(container); }
  }
};
