
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

console.log("Yeni Gün Sistemi Başlatılıyor: React Çekirdeği Yükleniyor...");

const mountApp = () => {
  const rootElement = document.getElementById('root');
  if (!rootElement) return;

  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );

    // React'in ilk pikselleri ekrana basmasını bekle
    requestAnimationFrame(() => {
      setTimeout(() => {
        const loader = document.getElementById('boot-loader');
        if (loader) {
          loader.style.opacity = '0';
          setTimeout(() => {
            loader.style.display = 'none';
          }, 500);
        }
      }, 300);
    });

  } catch (error) {
    console.error("Mounting Error:", error);
    // index.html'deki window.onerror devreye girecek
  }
};

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  mountApp();
} else {
  window.addEventListener('load', mountApp);
}
