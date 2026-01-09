
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    // Kullanıcının talebi üzerine chunk size uyarısı 1000kb (1MB) olarak güncellendi.
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-charts': ['recharts'],
          'vendor-pdf': ['jspdf', 'html2canvas']
        }
      }
    }
  },
  define: {
    // Ortam değişkeninin tarayıcı tarafında erişilebilir olmasını sağlar (Gerekirse)
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  }
});
