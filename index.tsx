
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

console.log("System Initializing...");

const renderApp = () => {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.error("Critical: Root element not found");
    return;
  }

  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("App mounted successfully");
  } catch (error) {
    console.error("Mounting Error:", error);
    rootElement.innerHTML = `
      <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; font-family:sans-serif; text-align:center; padding: 20px;">
        <h1 style="color:#ea580c">Sistem Başlatılamadı</h1>
        <p style="color:#64748b">Tarayıcı uyumluluğu veya bağlantı hatası oluştu.</p>
        <button onclick="window.location.reload()" style="background:#0f172a; color:white; border:none; padding:12px 24px; border-radius:12px; cursor:pointer; font-weight:bold; margin-top:20px;">Yeniden Dene</button>
      </div>
    `;
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderApp);
} else {
  renderApp();
}
