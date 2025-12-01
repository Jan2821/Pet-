import React, { useEffect, useState } from 'react';
import { Pet, FeedingPlan } from '../types';
import { StorageService } from '../services/storageService';

interface FeedingViewProps {
  pets: Pet[];
  notify: (msg: string, type: 'success' | 'error') => void;
}

const FeedingView: React.FC<FeedingViewProps> = ({ pets, notify }) => {
  const [plans, setPlans] = useState<FeedingPlan[]>([]);
  const [activePetId, setActivePetId] = useState<string>(pets[0]?.id || '');
  const [isAdding, setIsAdding] = useState(false);
  
  // New Plan State
  const [time, setTime] = useState('');
  const [amount, setAmount] = useState('');
  const [foodType, setFoodType] = useState('');

  useEffect(() => {
    if (pets.length > 0 && !activePetId) {
      setActivePetId(pets[0].id);
    }
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pets]);

  const loadData = async () => {
    const data = await StorageService.getFeedingPlans();
    data.sort((a, b) => a.time.localeCompare(b.time));
    setPlans(data);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!time || !amount || !foodType) {
      notify('Bitte alle Felder ausfüllen', 'error');
      return;
    }

    const newPlan: FeedingPlan = {
      id: Date.now().toString(),
      petId: activePetId,
      time,
      amount,
      foodType
    };

    await StorageService.saveFeedingPlan(newPlan);
    await loadData();
    setIsAdding(false);
    setTime('');
    setAmount('');
    setFoodType('');
    notify('Fütterungszeit hinzugefügt', 'success');
  };

  const filteredPlans = plans.filter(p => p.petId === activePetId);
  const activePet = pets.find(p => p.id === activePetId);

  if (pets.length === 0) {
    return <div className="p-8 text-center text-gray-500">Bitte fügen Sie erst ein Haustier hinzu.</div>;
  }

  return (
    <div className="pb-20">
      <div className="bg-teal-600 pt-6 pb-12 px-4 rounded-b-[2rem] shadow-md">
        <h2 className="text-white text-xl font-bold mb-4">Fütterungsplan</h2>
        <div className="flex overflow-x-auto space-x-3 pb-2 no-scrollbar">
          {pets.map(pet => (
            <button
              key={pet.id}
              onClick={() => setActivePetId(pet.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors whitespace-nowrap ${
                activePetId === pet.id 
                  ? 'bg-white text-teal-700 shadow-lg font-bold' 
                  : 'bg-teal-700/50 text-teal-100'
              }`}
            >
              <img src={pet.image} alt="" className="w-6 h-6 rounded-full object-cover" />
              <span>{pet.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 -mt-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 min-h-[300px]">
           <div className="flex justify-between items-center mb-6">
             <h3 className="font-bold text-gray-800">Tagesplan für {activePet?.name}</h3>
             <button onClick={() => setIsAdding(true)} className="text-teal-600 text-sm font-bold">
               <i className="fas fa-plus mr-1"></i> Zeit
             </button>
           </div>

           {filteredPlans.length === 0 ? (
             <div className="text-center text-gray-400 py-8">
               Noch keine Fütterungszeiten hinterlegt.
             </div>
           ) : (
             <div className="space-y-4">
               {filteredPlans.map(plan => (
                 <div key={plan.id} className="flex items-center group">
                   <div className="w-16 font-mono text-lg font-bold text-gray-700">{plan.time}</div>
                   <div className="flex-1 bg-gray-50 rounded-xl p-3 border border-gray-100 flex justify-between items-center">
                      <div>
                        <div className="font-medium text-gray-800">{plan.foodType}</div>
                        <div className="text-xs text-gray-500">Menge: {plan.amount}</div>
                      </div>
                      <i className="fas fa-utensils text-gray-300"></i>
                   </div>
                 </div>
               ))}
             </div>
           )}
        </div>

        {/* Feeding Tips Box */}
        <div className="mt-6 bg-orange-50 rounded-xl p-4 border border-orange-100 flex gap-3">
          <i className="fas fa-lightbulb text-orange-400 text-xl mt-1"></i>
          <div>
            <h4 className="font-bold text-orange-800 text-sm">Tipp</h4>
            <p className="text-xs text-orange-700 mt-1">
              Achten Sie auf frisches Wasser zu jeder Zeit. Die angegebenen Mengen sind Richtwerte.
            </p>
          </div>
        </div>
      </div>

      {isAdding && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-xl">
             <h3 className="text-lg font-bold mb-4">Mahlzeit hinzufügen</h3>
             <form onSubmit={handleSave} className="space-y-4">
               <div>
                 <label className="label-text">Uhrzeit</label>
                 <input type="time" value={time} onChange={e => setTime(e.target.value)} className="w-full border p-2 rounded-lg" />
               </div>
               <div>
                 <label className="label-text">Futtersorte</label>
                 <input type="text" placeholder="z.B. Trockenfutter" value={foodType} onChange={e => setFoodType(e.target.value)} className="w-full border p-2 rounded-lg" />
               </div>
               <div>
                 <label className="label-text">Menge</label>
                 <input type="text" placeholder="z.B. 150g" value={amount} onChange={e => setAmount(e.target.value)} className="w-full border p-2 rounded-lg" />
               </div>
               <div className="flex gap-2 pt-2">
                 <button type="button" onClick={() => setIsAdding(false)} className="flex-1 py-2 text-gray-500">Abbrechen</button>
                 <button type="submit" className="flex-1 bg-teal-600 text-white rounded-lg py-2">Speichern</button>
               </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedingView;