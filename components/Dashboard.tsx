import React, { useState } from 'react';
import { Pet } from '../types';
import { StorageService } from '../services/storageService';

interface DashboardProps {
  pets: Pet[];
  onPetsChange: () => void;
  notify: (msg: string, type: 'success' | 'error') => void;
}

const Dashboard: React.FC<DashboardProps> = ({ pets, onPetsChange, notify }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newPet, setNewPet] = useState<Partial<Pet>>({ type: 'Hund' });
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPet({ ...newPet, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPet.name || !newPet.age) {
      notify('Bitte Namen und Alter angeben', 'error');
      return;
    }
    setLoading(true);
    try {
      const pet: Pet = {
        id: Date.now().toString(),
        name: newPet.name,
        type: newPet.type || 'Hund',
        age: Number(newPet.age),
        image: newPet.image || `https://picsum.photos/200?random=${Date.now()}`
      };
      await StorageService.savePet(pet);
      onPetsChange();
      setIsAdding(false);
      setNewPet({ type: 'Hund' });
      notify('Haustier erfolgreich angelegt!', 'success');
    } catch (err) {
      notify('Fehler beim Speichern', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-20">
      <div className="bg-teal-600 p-6 rounded-b-[2rem] shadow-lg mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Meine Lieblinge</h1>
        <p className="text-teal-100">Verwalten Sie hier die Profile Ihrer Tiere.</p>
      </div>

      <div className="px-4">
        {pets.length === 0 && !isAdding ? (
          <div className="text-center py-10 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-paw text-2xl text-teal-600"></i>
            </div>
            <p className="text-gray-500 mb-4">Noch keine Haustiere angelegt.</p>
            <button
              onClick={() => setIsAdding(true)}
              className="bg-teal-600 text-white px-6 py-2 rounded-full font-medium hover:bg-teal-700 transition"
            >
              Erstes Tier hinzufügen
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {pets.map(pet => (
              <div key={pet.id} className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-4 border border-gray-100">
                <img 
                  src={pet.image} 
                  alt={pet.name} 
                  className="w-20 h-20 rounded-full object-cover border-2 border-teal-100"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800">{pet.name}</h3>
                  <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                    <span className="bg-teal-50 text-teal-700 px-2 py-0.5 rounded-md text-xs font-semibold uppercase">{pet.type}</span>
                    <span>• {pet.age} Jahre alt</span>
                  </div>
                </div>
                <button 
                   onClick={async () => {
                     if(window.confirm(`${pet.name} wirklich löschen?`)) {
                       await StorageService.deletePet(pet.id);
                       onPetsChange();
                     }
                   }}
                   className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500"
                >
                  <i className="fas fa-trash-alt"></i>
                </button>
              </div>
            ))}
          </div>
        )}

        {!isAdding && pets.length > 0 && (
          <button
            onClick={() => setIsAdding(true)}
            className="w-full mt-6 bg-teal-50 text-teal-700 py-3 rounded-xl border border-teal-200 font-medium hover:bg-teal-100 flex items-center justify-center gap-2"
          >
            <i className="fas fa-plus"></i> Weiteres Tier hinzufügen
          </button>
        )}

        {isAdding && (
          <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl animate-[slideUp_0.3s_ease-out]">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Neues Profil</h2>
                <button onClick={() => setIsAdding(false)} className="text-gray-400 hover:text-gray-600">
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Foto</label>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"/>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input 
                      type="text" 
                      value={newPet.name || ''} 
                      onChange={e => setNewPet({...newPet, name: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                      placeholder="z.B. Bello"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Alter</label>
                    <input 
                      type="number" 
                      value={newPet.age || ''} 
                      onChange={e => setNewPet({...newPet, age: Number(e.target.value)})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                      placeholder="Jahre"
                    />
                  </div>
                </div>

                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Tierart</label>
                   <select 
                      value={newPet.type} 
                      onChange={e => setNewPet({...newPet, type: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                   >
                     <option value="Hund">Hund</option>
                     <option value="Katze">Katze</option>
                     <option value="Vogel">Vogel</option>
                     <option value="Nager">Kleintier / Nager</option>
                     <option value="Pferd">Pferd</option>
                     <option value="Sonstiges">Sonstiges</option>
                   </select>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-teal-600 text-white py-3 rounded-xl font-bold hover:bg-teal-700 transition mt-4 disabled:opacity-50"
                >
                  {loading ? 'Speichere...' : 'Profil erstellen'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;