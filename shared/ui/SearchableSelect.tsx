
import React, { useState, useRef, useEffect } from 'react';

interface SearchableSelectProps {
  label: string;
  options: string[];
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({ label, options, value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter(opt => 
    opt.toLocaleLowerCase('tr-TR').includes(searchTerm.toLocaleLowerCase('tr-TR'))
  ).slice(0, 50);

  return (
    <div className="relative group" ref={wrapperRef}>
      <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
        {label}
      </label>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full rounded-xl border p-3 focus:border-orange-500 outline-none font-bold text-[13px] transition-all cursor-pointer flex justify-between items-center ${
          value ? 'bg-slate-50/50 border-slate-100 text-slate-900' : 'bg-slate-50/50 border-slate-100 text-slate-400'
        }`}
      >
        <span className="truncate">
          {value || placeholder || 'Seçiniz...'}
        </span>
        <svg className={`w-3 h-3 text-orange-500 transition-transform shrink-0 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 z-[100] overflow-hidden animate-scale-in origin-top">
          <div className="p-2 border-b border-slate-50 bg-slate-50/30">
            <input 
              autoFocus
              type="text"
              placeholder="Hızlı Ara..."
              className="w-full bg-white rounded-lg p-2 text-[12px] font-bold outline-none border border-slate-100 focus:border-orange-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="max-h-48 overflow-y-auto custom-scrollbar">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <div 
                  key={opt}
                  onClick={() => { onChange(opt); setIsOpen(false); setSearchTerm(''); }}
                  className="px-4 py-2.5 hover:bg-orange-50 text-[11px] font-bold text-slate-700 cursor-pointer transition-colors border-b border-slate-50 last:border-0"
                >
                  {opt}
                </div>
              ))
            ) : (
              <div 
                onClick={() => { onChange(searchTerm); setIsOpen(false); }}
                className="px-4 py-4 text-center text-[9px] font-black text-orange-600 uppercase tracking-widest cursor-pointer hover:bg-orange-50"
              >
                "{searchTerm}" Listeye Ekle
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
