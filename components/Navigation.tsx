import React from 'react';
import { ViewState } from '../types';

interface NavigationProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, setView }) => {
  const navItems: { view: ViewState; icon: string; label: string }[] = [
    { view: 'dashboard', icon: 'fa-paw', label: 'Tiere' },
    { view: 'calendar', icon: 'fa-calendar-alt', label: 'Kalender' },
    { view: 'feeding', icon: 'fa-drumstick-bite', label: 'Futter' },
    { view: 'gallery', icon: 'fa-images', label: 'Galerie' },
    { view: 'ai-chat', icon: 'fa-robot', label: 'KI Ratgeber' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe pt-2 px-4 shadow-lg z-50">
      <div className="flex justify-between items-center max-w-md mx-auto">
        {navItems.map((item) => (
          <button
            key={item.view}
            onClick={() => setView(item.view)}
            className={`flex flex-col items-center justify-center w-14 h-14 rounded-xl transition-all duration-200 ${
              currentView === item.view
                ? 'text-teal-600 bg-teal-50 transform -translate-y-2 shadow-sm'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <i className={`fas ${item.icon} text-xl mb-1`}></i>
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Navigation;