
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

console.log("React bileşenleri yükleniyor...");

const startApp = () => {
  const rootElement = document.getElementById('root');
  if (!rootElement) return;

  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );

    // React render döngüsüne girdiği an loader'ı temizle
    const removeLoader = () => {
      const loader = document.getElementById('boot-loader');
      if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 300);
      }
    };

    // DOM'un render edilmesini bekle
    if (window.requestAnimationFrame) {
        window.requestAnimationFrame(removeLoader);
    } else {
        setTimeout(removeLoader, 100);
    }

  } catch (error) {
    console.error("Başlatma Hatası:", error);
    rootElement.innerHTML = `<div style="padding:50px; text-align:center;">
      <h2 style="color:red">Sistem Hatası</h2>
      <p>${error instanceof Error ? error.message : 'Bilinmeyen hata'}</p>
    </div>`;
  }
};

// Sayfa hazır olduğunda başlat
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  startApp();
} else {
  window.addEventListener('DOMContentLoaded', startApp);
}
