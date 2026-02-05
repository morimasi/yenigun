
import React, { useState, useEffect, useRef } from 'react';
import { SystemNotification } from '../../types';

const NotificationCenter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/admin-notifications?action=list');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
        setUnreadCount(data.filter((n: any) => !n.isRead).length);
      }
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await fetch('/api/admin-notifications?action=mark_read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      fetchNotifications();
    } catch (e) { console.error(e); }
  };

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'bg-rose-500 text-white';
      case 'WARNING': return 'bg-orange-500 text-white';
      case 'SUCCESS': return 'bg-emerald-500 text-white';
      default: return 'bg-blue-500 text-white';
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-10 h-10 rounded-xl flex items-center justify-center bg-white border border-slate-200 text-slate-400 hover:text-orange-600 transition-all shadow-sm group"
      >
        <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-600 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white animate-bounce">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-12 right-0 w-[380px] bg-white rounded-[2rem] shadow-3xl border border-slate-100 z-[1000] overflow-hidden animate-scale-in origin-top-right">
          <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
            <div>
              <h4 className="text-sm font-black uppercase tracking-widest">Sinyal Merkezi</h4>
              <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">MIA Real-Time Monitoring</p>
            </div>
            <button onClick={() => markAsRead('ALL')} className="text-[9px] font-black uppercase tracking-widest text-orange-500 hover:text-white transition-colors">TÜMÜNÜ OKU</button>
          </div>

          <div className="max-h-[450px] overflow-y-auto custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="p-20 text-center opacity-20 grayscale">
                <svg className="w-12 h-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                <p className="text-[10px] font-black uppercase tracking-widest">Bildirim Yok</p>
              </div>
            ) : (
              notifications.map(n => (
                <div 
                  key={n.id} 
                  onClick={() => markAsRead(n.id)}
                  className={`p-5 border-b border-slate-50 flex gap-4 hover:bg-slate-50 transition-colors cursor-pointer relative ${!n.isRead ? 'bg-orange-50/30' : ''}`}
                >
                  {!n.isRead && <div className="absolute left-0 top-0 w-1 h-full bg-orange-600"></div>}
                  <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center shadow-sm ${getSeverityStyles(n.severity)}`}>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      {n.type === 'NEW_CANDIDATE' ? <path d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0z" /> : <path d="M13 10V3L4 14h7v7l9-11h-7z" />}
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-[11px] font-black text-slate-900 uppercase truncate pr-2">{n.title}</p>
                      <span className="text-[8px] font-bold text-slate-400 whitespace-nowrap">{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-[10px] font-medium text-slate-500 leading-snug line-clamp-2">{n.message}</p>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="p-4 bg-slate-50 text-center border-t border-slate-100">
            <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">Hücresel Güvenlik Katmanı v1.2</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
