import React, { useEffect, useState } from 'react';
import { Pet, Appointment } from '../types';
import { StorageService } from '../services/storageService';

interface CalendarViewProps {
  pets: Pet[];
  notify: (msg: string, type: 'success' | 'error') => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ pets, notify }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newAppt, setNewAppt] = useState<Partial<Appointment>>({ type: 'vet' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await StorageService.getAppointments();
    // Sort by date ascending
    data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    setAppointments(data);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAppt.title || !newAppt.date || !newAppt.petId) {
      notify('Bitte alle Pflichtfelder ausfüllen', 'error');
      return;
    }

    const appt: Appointment = {
      id: Date.now().toString(),
      petId: newAppt.petId,
      title: newAppt.title,
      date: newAppt.date,
      type: newAppt.type as any,
      notes: newAppt.notes
    };

    await StorageService.saveAppointment(appt);
    await loadData();
    setIsAdding(false);
    setNewAppt({ type: 'vet' });
    notify('Termin gespeichert', 'success');
  };

  const getPetName = (id: string) => pets.find(p => p.id === id)?.name || 'Unbekannt';

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'vet': return 'fa-user-md';
      case 'vaccine': return 'fa-syringe';
      case 'grooming': return 'fa-cut';
      default: return 'fa-calendar-check';
    }
  };

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'vet': return 'bg-red-100 text-red-600';
      case 'vaccine': return 'bg-blue-100 text-blue-600';
      case 'grooming': return 'bg-purple-100 text-purple-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="pb-20">
      <div className="bg-white sticky top-0 z-10 p-4 shadow-sm">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Terminkalender</h2>
          <button 
            onClick={() => setIsAdding(true)}
            className="w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center shadow-lg"
          >
            <i className="fas fa-plus"></i>
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {appointments.length === 0 ? (
           <div className="text-center py-10">
             <i className="fas fa-calendar-times text-4xl text-gray-300 mb-3"></i>
             <p className="text-gray-500">Keine anstehenden Termine.</p>
           </div>
        ) : (
          appointments.map(appt => (
            <div key={appt.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4">
               <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${getTypeColor(appt.type)}`}>
                 <i className={`fas ${getTypeIcon(appt.type)}`}></i>
               </div>
               <div className="flex-1">
                 <div className="flex justify-between items-start">
                    <h3 className="font-bold text-gray-800">{appt.title}</h3>
                    <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-600">
                      {new Date(appt.date).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })}
                    </span>
                 </div>
                 <p className="text-sm text-teal-600 font-medium mb-1">
                   <i className="fas fa-paw text-xs mr-1"></i> {getPetName(appt.petId)}
                 </p>
                 <p className="text-xs text-gray-500">
                   <i className="far fa-clock mr-1"></i>
                   {new Date(appt.date).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} Uhr
                 </p>
                 {appt.notes && <p className="text-xs text-gray-500 mt-2 italic border-l-2 border-gray-200 pl-2">{appt.notes}</p>}
               </div>
            </div>
          ))
        )}
      </div>

      {isAdding && (
         <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
           <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl animate-[slideUp_0.3s_ease-out]">
             <h3 className="text-lg font-bold mb-4">Neuer Termin</h3>
             <form onSubmit={handleSave} className="space-y-4">
               <div>
                 <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Für welches Tier?</label>
                 <select 
                   className="w-full border p-2 rounded-lg"
                   value={newAppt.petId || ''}
                   onChange={e => setNewAppt({...newAppt, petId: e.target.value})}
                 >
                   <option value="">Bitte wählen...</option>
                   {pets.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                 </select>
               </div>

               <div>
                 <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Titel</label>
                 <input 
                   type="text" 
                   className="w-full border p-2 rounded-lg"
                   placeholder="z.B. Impfung Tollwut"
                   value={newAppt.title || ''}
                   onChange={e => setNewAppt({...newAppt, title: e.target.value})}
                 />
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Datum & Zeit</label>
                    <input 
                      type="datetime-local" 
                      className="w-full border p-2 rounded-lg text-sm"
                      value={newAppt.date || ''}
                      onChange={e => setNewAppt({...newAppt, date: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Art</label>
                    <select
                      className="w-full border p-2 rounded-lg"
                      value={newAppt.type}
                      onChange={e => setNewAppt({...newAppt, type: e.target.value as any})}
                    >
                      <option value="vet">Tierarzt</option>
                      <option value="vaccine">Impfung</option>
                      <option value="grooming">Pflege/Friseur</option>
                      <option value="other">Sonstiges</option>
                    </select>
                  </div>
               </div>

               <div>
                 <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Notiz</label>
                 <textarea 
                    className="w-full border p-2 rounded-lg h-20"
                    placeholder="Mitbringen: Impfpass..."
                    value={newAppt.notes || ''}
                    onChange={e => setNewAppt({...newAppt, notes: e.target.value})}
                 />
               </div>

               <div className="flex gap-3 mt-4">
                 <button type="button" onClick={() => setIsAdding(false)} className="flex-1 py-3 text-gray-600 font-medium">Abbrechen</button>
                 <button type="submit" className="flex-1 bg-teal-600 text-white py-3 rounded-xl font-bold">Speichern</button>
               </div>
             </form>
           </div>
         </div>
      )}
    </div>
  );
};

export default CalendarView;