
import React from 'react';
import { Candidate } from '../../types';

interface CalendarViewProps {
  candidates: Candidate[];
  onUpdateCandidate: (c: Candidate) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ candidates, onUpdateCandidate }) => {
  const interviewees = candidates.filter(c => c.status === 'interview_scheduled');

  return (
    <div className="bg-white rounded-[4rem] shadow-xl border border-slate-100 p-16 animate-fade-in">
      <h3 className="text-3xl font-black text-slate-900 mb-10 tracking-tighter uppercase">Mülakat Planlayıcı</h3>
      <div className="space-y-4">
        {interviewees.length > 0 ? interviewees.map(c => (
          <div key={c.id} className="p-8 bg-slate-50 rounded-[2.5rem] flex items-center justify-between">
            <div>
              <p className="font-black text-slate-900 text-lg">{c.name}</p>
              <p className="text-[10px] font-bold text-emerald-600 uppercase">{c.interviewSchedule?.date} @ {c.interviewSchedule?.time}</p>
            </div>
            <button className="px-6 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase">Detay</button>
          </div>
        )) : (
          <div className="py-20 text-center border-4 border-dashed border-slate-50 rounded-[3rem] text-slate-300 font-black">PLANLANMIŞ MÜLAKAT YOK</div>
        )}
      </div>
    </div>
  );
};

export default CalendarView;
