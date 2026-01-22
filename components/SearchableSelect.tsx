
import React, { useState, useRef, useEffect } from 'react';

interface SearchableSelectProps {
  label: string;
  options: string[];
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({ label, options, value, onChange, placeholder }) => {
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
  ).slice(0, 100); // Performans için kısıtla

  return (
    <div className="relative group" ref={wrapperRef}>
      <label className="block text-[11px] font-black text-orange-600 uppercase tracking-[0.2em] mb-3 ml-1">
        {label}
      </label>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full rounded-[2rem] border-2 border-orange-100 p-5 focus:border-orange-500 focus:ring-4 focus:ring-orange-50 outline-none font-bold text-slate-800 transition-all bg-white cursor-pointer flex justify-between items-center"
      >
        <span className={value ? 'text-slate-800' : 'text-slate-400'}>
          {value || placeholder || 'Seçiniz...'}
        </span>
        <svg className={`w-4 h-4 text-orange-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-[2rem] shadow-2xl border border-orange-100 z-[100] overflow-hidden animate-slide-down">
          <div className="p-4 border-b border-orange-50">
            <input 
              autoFocus
              type="text"
              placeholder="Hızlı Ara..."
              className="w-full bg-orange-50 rounded-xl p-3 text-[12px] font-bold outline-none border-2 border-transparent focus:border-orange-600 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="max-h-60 overflow-y-auto custom-scrollbar">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <div 
                  key={opt}
                  onClick={() => { onChange(opt); setIsOpen(false); setSearchTerm(''); }}
                  className="px-6 py-4 hover:bg-orange-50 text-[11px] font-bold text-slate-700 cursor-pointer transition-colors border-b border-orange-50 last:border-0"
                >
                  {opt}
                </div>
              ))
            ) : (
              <div 
                onClick={() => { onChange(searchTerm); setIsOpen(false); }}
                className="px-6 py-8 text-center text-[10px] font-black text-orange-600 uppercase tracking-widest cursor-pointer hover:bg-orange-50"
              >
                "{searchTerm}" Listede Yok, Yine de Ekle?
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;
