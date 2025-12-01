import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import CalendarView from './components/CalendarView';
import FeedingView from './components/FeedingView';
import GalleryView from './components/GalleryView';
import AIChat from './components/AIChat';
import { ViewState, Pet, ToastMessage } from './types';
import { StorageService } from './services/storageService';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [pets, setPets] = useState<Pet[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    loadPets();
  }, []);

  const loadPets = async () => {
    const data = await StorageService.getPets();
    setPets(data);
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const renderView = () => {
    switch(currentView) {
      case 'dashboard':
        return <Dashboard pets={pets} onPetsChange={loadPets} notify={showToast} />;
      case 'calendar':
        return <CalendarView pets={pets} notify={showToast} />;
      case 'feeding':
        return <FeedingView pets={pets} notify={showToast} />;
      case 'gallery':
        return <GalleryView pets={pets} notify={showToast} />;
      case 'ai-chat':
        return <AIChat pets={pets} />;
      default:
        return <Dashboard pets={pets} onPetsChange={loadPets} notify={showToast} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <main className="mx-auto max-w-md bg-white min-h-screen shadow-2xl relative">
        {renderView()}
        <Navigation currentView={currentView} setView={setCurrentView} />
        
        {/* Toast Container */}
        <div className="fixed top-4 left-0 right-0 z-[60] flex flex-col items-center pointer-events-none space-y-2">
          {toasts.map(toast => (
            <div 
              key={toast.id} 
              className={`px-4 py-2 rounded-full shadow-lg text-sm font-bold text-white animate-[bounce_0.5s] ${
                toast.type === 'success' ? 'bg-green-500' : 
                toast.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
              }`}
            >
               {toast.type === 'success' && <i className="fas fa-check-circle mr-2"></i>}
               {toast.type === 'error' && <i className="fas fa-exclamation-circle mr-2"></i>}
               {toast.message}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default App;