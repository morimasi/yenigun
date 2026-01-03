
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

console.log("System initializing...");

const startApplication = () => {
  const rootElement = document.getElementById('root');
  if (!rootElement) return;

  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("React render cycle started.");
    
    // Boot loader'ı React render olduktan kısa bir süre sonra kaldır
    setTimeout(() => {
        const loader = document.getElementById('boot-loader');
        if (loader) loader.style.display = 'none';
    }, 500);

  } catch (error) {
    console.error("React Mounting Error:", error);
    rootElement.innerHTML = `<div style="padding:40px; text-align:center; font-family:sans-serif;">
        <h2 style="color:#ea580c">Yükleme Hatası</h2>
        <p>Sistem bileşenleri başlatılamadı.</p>
        <button onclick="location.reload()" style="margin-top:20px; padding:10px; cursor:pointer;">Yeniden Başlat</button>
    </div>`;
  }
};

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  startApplication();
} else {
  window.addEventListener('load', startApplication);
}
